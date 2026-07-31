// theveil-index v1 — shared schema
// Single source of truth for the website, Bezalel's scoring tools, and the
// scan pipeline. Human-curated fields are preserved across rescans forever;
// machine fields may be refreshed only by explicit, reviewable steps.

export type EntityType =
  | "institution"
  | "person"
  | "mechanism"
  | "jurisdiction"
  | "document"
  | "concept"
  | "event"
  | "policy"
  | "legal-framework";

export interface ManuscriptAnchor {
  part: number;
  section?: string;
  context?: string;
}

export interface ForcedRelationship {
  targetEntityId: string;
  label: string;
  source: "human-manual";
}

export interface Entity {
  id: string;
  canonicalName: string;
  type: EntityType;
  aliases: string[];
  manuscriptAnchors: ManuscriptAnchor[];
  companionAnchors: string[];
  editorialNotes: string[];
  forcedRelationships: ForcedRelationship[];
  /** Machine fields can be refreshed. Human fields below are preserved. */
  createdBy: "scan" | "human" | "seed";
  humanModified: string | null; // ISO timestamp when a human last edited
}

export type ObservationSourceType =
  | "manuscript"
  | "article"
  | "scored-news"
  | "manual";

export interface Observation {
  id: string;
  entityId: string;
  source: string;
  sourceType: ObservationSourceType;
  timestamp: string;
  scores: {
    veil?: number;
    cathedral?: number;
    archive?: number;
    squareMile?: number;
    nciTechnique?: number;
  };
  signalStrength: number;
  context: string;
}

export type EvidentiaryWeight = "strong" | "moderate" | "weak" | "contested";
export type ClaimStatus = "asserted" | "contested" | "reinforced" | "refined";

export interface Citation {
  sourceId: string;
  relevance: "primary" | "corroborating" | "contextual";
}

export interface Claim {
  id: string;
  statement: string;
  manuscriptParts: number[];
  evidentiaryWeight: EvidentiaryWeight;
  status: ClaimStatus;
  relatedEntities: string[];
  supportingSources: Citation[];
  contradictedBy: string[];
  editorialNote: string | null;
  createdBy: "scan" | "human" | "seed";
}

export type BookStatus = "published" | "presale" | "draft" | "announced";
export type BookChannel = "gumroad" | "amazon" | "ingram" | "direct";

export interface BookFormat {
  name: string;
  price: number;
  url: string;
  channel: BookChannel;
}

export interface Book {
  id: string;
  title: string;
  volume: number | null;
  status: BookStatus;
  formats: BookFormat[];
  companionIds: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  author: string;
  created: string;
  modified: string;
  tags: string[];
  series: string[];
  entityIds: string[];
  claimIds: string[];
  description: string | null;
}

export interface ScanReport {
  scanTimestamp: string;
  entitiesAdded: number;
  entitiesModified: number;
  entitiesPreserved: number;
  claimsAdded: number;
  claimsPreserved: number;
  observationsAdded: number;
  observationsPreserved: number;
  conflicts: string[];
  manualReviewRequired: string[];
}

export interface SiteIndex {
  $schema: "theveil-index/v1";
  version: 1;
  lastScanned: string;
  entities: Entity[];
  observations: Observation[];
  claims: Claim[];
  books: Book[];
  articles: Article[];
  _meta: {
    scanReport: ScanReport;
  };
}
