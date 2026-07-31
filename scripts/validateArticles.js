#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DATA_DIR = process.env.VEIL_INDEX_DIR
  ? path.resolve(process.env.VEIL_INDEX_DIR)
  : path.join(REPO_ROOT, 'data');
const ARTICLES_DIR = path.join(REPO_ROOT, 'content', 'articles');
const INDEX_PATH = path.join(DATA_DIR, 'site-index.json');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error('validateArticles: site-index.json not found');
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
}

function main() {
  const index = loadIndex();
  const entityIds = new Set(index.entities.map(e => e.id));
  const claimIds = new Set(index.claims.map(c => c.id));
  const manualReviewRequired = [];
  const slugs = new Map();

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('validateArticles: no content/articles directory — skipping');
    process.exit(0);
  }

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  let articleCount = 0;

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    let fm;
    try {
      fm = matter(raw);
    } catch (err) {
      manualReviewRequired.push(`${file}: invalid frontmatter — ${err.message}`);
      continue;
    }

    const data = fm.data || {};
    articleCount++;

    if (data.slug && data.status !== 'draft') {
      const existing = slugs.get(data.slug);
      if (existing) {
        manualReviewRequired.push(`${file}: slug "${data.slug}" conflicts with ${existing}`);
      } else {
        slugs.set(data.slug, file);
      }
    }

    for (const eid of data.entityIds || []) {
      if (!entityIds.has(eid)) {
        manualReviewRequired.push(`${file}: unknown entity "${eid}"`);
      }
    }

    for (const cid of data.claimIds || []) {
      if (!claimIds.has(cid)) {
        manualReviewRequired.push(`${file}: unknown claim "${cid}"`);
      }
    }

    if (data.image && typeof data.image === 'string') {
      const imgPath = path.join(PUBLIC_DIR, data.image.replace(/^\//, ''));
      if (!fs.existsSync(imgPath)) {
        manualReviewRequired.push(`${file}: image path "${data.image}" not found at ${imgPath}`);
      }
    }
  }

  console.log(`validateArticles: ${articleCount} article(s) scanned, ${slugs.size} unique published slugs`);

  if (manualReviewRequired.length > 0) {
    console.log(`  manual review required (${manualReviewRequired.length}):`);
    for (const m of manualReviewRequired) console.log(`    - ${m}`);
    process.exit(1);
  }

  console.log('  all checks passed');
}

main();
