#!/usr/bin/env node
/**
 * scanIndex.js — theveil-index v1 (conservative)
 *
 * What it does:
 *   1. Loads data/site-index.json.
 *   2. Ingests Bezalel score observations from data/scored-news/*.json
 *      (single object or array per file). Append-only, deduped by id.
 *   3. Checks referential integrity: claims, observations, and articles must
 *      reference existing entities; articles must reference existing claims.
 *   4. Writes the index back with an updated scan report + data/scan-log.json.
 *
 * What it never does:
 *   - Delete or modify entities, claims, books, or articles.
 *   - Create entities automatically. Unknown entity references are flagged
 *     for human review, not promoted into the index.
 *   - Extract entities from manuscript text (a separate candidate-extraction
 *     tool, built later, proposes new entities for review instead).
 *
 * Override the data directory with VEIL_INDEX_DIR (used for tests and for
 * Bezalel-side tooling).
 *
 * Exit 0 = clean. Exit 1 = items flagged for manual review (index still written).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const DATA_DIR = process.env.VEIL_INDEX_DIR
  ? path.resolve(process.env.VEIL_INDEX_DIR)
  : path.join(REPO_ROOT, "data");
const INDEX_PATH = path.join(DATA_DIR, "site-index.json");
const REPORT_PATH = path.join(DATA_DIR, "scan-log.json");
const SCORED_NEWS_DIR = path.join(DATA_DIR, "scored-news");

const VALID_SOURCE_TYPES = new Set([
  "manuscript",
  "article",
  "scored-news",
  "manual",
]);

/** Deterministic stringify (sorted keys) so identical objects compare equal. */
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value))
    return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`)
    .join(",")}}`;
}

function fail(message) {
  console.error(`scan: error: ${message}`);
  process.exit(2);
}

function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) {
    fail(`site-index.json not found at ${INDEX_PATH}`);
  }
  let index;
  try {
    index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
  } catch (err) {
    fail(`site-index.json is not valid JSON: ${err.message}`);
  }
  for (const key of ["entities", "observations", "claims", "books", "articles"]) {
    if (!Array.isArray(index[key])) {
      fail(`site-index.json is missing array field "${key}"`);
    }
  }
  return index;
}

function loadScoredNews() {
  if (!fs.existsSync(SCORED_NEWS_DIR)) return [];
  const files = fs
    .readdirSync(SCORED_NEWS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const out = [];
  for (const file of files) {
    const full = path.join(SCORED_NEWS_DIR, file);
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(full, "utf-8"));
    } catch (err) {
      fail(`scored-news file ${file} is not valid JSON: ${err.message}`);
    }
    const items = Array.isArray(parsed) ? parsed : [parsed];
    for (const item of items) out.push({ item, file });
  }
  return out;
}

function isObservationShape(o) {
  return (
    o &&
    typeof o === "object" &&
    typeof o.id === "string" &&
    o.id.length > 0 &&
    typeof o.entityId === "string" &&
    o.entityId.length > 0 &&
    typeof o.sourceType === "string" &&
    VALID_SOURCE_TYPES.has(o.sourceType) &&
    typeof o.timestamp === "string" &&
    o.timestamp.length > 0 &&
    o.scores &&
    typeof o.scores === "object" &&
    typeof o.signalStrength === "number" &&
    typeof o.context === "string"
  );
}

function main() {
  const index = loadIndex();
  const entityIds = new Set(index.entities.map((e) => e.id));
  const claimIds = new Set(index.claims.map((c) => c.id));
  const observationsById = new Map(index.observations.map((o) => [o.id, o]));

  const report = {
    scanTimestamp: new Date().toISOString(),
    entitiesAdded: 0,
    entitiesModified: 0,
    entitiesPreserved: index.entities.length,
    claimsAdded: 0,
    claimsPreserved: index.claims.length,
    observationsAdded: 0,
    observationsPreserved: 0,
    conflicts: [],
    manualReviewRequired: [],
  };

  // 1. Ingest scored-news observations (append-only, deduped by id).
  for (const { item, file } of loadScoredNews()) {
    if (!isObservationShape(item)) {
      report.manualReviewRequired.push(
        `scored-news/${file}: entry does not match Observation shape (id: ${
          item && typeof item.id === "string" ? item.id : "unknown"
        })`
      );
      continue;
    }
    if (!entityIds.has(item.entityId)) {
      report.manualReviewRequired.push(
        `scored-news/${file}: observation "${item.id}" references unknown entity "${item.entityId}" — not auto-created`
      );
      continue;
    }
    const existing = observationsById.get(item.id);
    if (existing) {
      if (stableStringify(existing) !== stableStringify(item)) {
        report.conflicts.push(
          `scored-news/${file}: observation "${item.id}" already exists with different content — existing kept`
        );
      } else {
        report.observationsPreserved += 1;
      }
      continue;
    }
    observationsById.set(item.id, item);
    report.observationsAdded += 1;
  }

  // 2. Referential integrity across the index.
  for (const claim of index.claims) {
    for (const eid of claim.relatedEntities || []) {
      if (!entityIds.has(eid)) {
        report.manualReviewRequired.push(
          `claim "${claim.id}" references unknown entity "${eid}"`
        );
      }
    }
  }
  for (const article of index.articles) {
    for (const eid of article.entityIds || []) {
      if (!entityIds.has(eid)) {
        report.manualReviewRequired.push(
          `article "${article.id}" references unknown entity "${eid}"`
        );
      }
    }
    for (const cid of article.claimIds || []) {
      if (!claimIds.has(cid)) {
        report.manualReviewRequired.push(
          `article "${article.id}" references unknown claim "${cid}"`
        );
      }
    }
  }
  for (const obs of index.observations) {
    if (!entityIds.has(obs.entityId)) {
      report.manualReviewRequired.push(
        `observation "${obs.id}" references unknown entity "${obs.entityId}"`
      );
    }
  }

  // 3. Write index + report. Human/seed content untouched by construction.
  index.lastScanned = report.scanTimestamp;
  index.observations = Array.from(observationsById.values());
  index._meta = { scanReport: report };

  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + "\n", "utf-8");
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n", "utf-8");

  console.log(`scan complete: ${report.scanTimestamp}`);
  console.log(
    `  entities: ${report.entitiesPreserved} preserved (no additions or modifications)`
  );
  console.log(`  claims: ${report.claimsPreserved} preserved`);
  console.log(
    `  observations: +${report.observationsAdded} added, ${report.observationsPreserved} already present`
  );
  console.log(`  report: ${REPORT_PATH}`);
  if (report.conflicts.length > 0) {
    console.log(`  conflicts (${report.conflicts.length}):`);
    for (const c of report.conflicts) console.log(`    - ${c}`);
  }
  if (report.manualReviewRequired.length > 0) {
    console.log(
      `  manual review required (${report.manualReviewRequired.length}):`
    );
    for (const m of report.manualReviewRequired) console.log(`    - ${m}`);
    process.exit(1);
  }
}

main();
