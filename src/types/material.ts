/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CPSEId = 'DEMO-IOCL' | 'DEMO-NTPC' | 'DEMO-SAIL' | 'DEMO-BHEL' | 'DEMO-ONGC' | 'DEMO-GAIL' | 'DEMO-HPCL' | 'DEMO-CPCL';

export type RelationshipType = 'IDENTICAL' | 'NEAR_DUPLICATE' | 'FUNCTIONALLY_EQUIVALENT' | 'NOT_A_MATCH';

export type ReviewStatus = 'PENDING_REVIEW' | 'APPROVED' | 'HARMONIZED' | 'SPLIT' | 'REJECTED' | 'MODIFIED';

export type ParameterAuditStatus = 'MATCH' | 'EQUIVALENT' | 'MISMATCH';

export interface AttributeComparison {
  name: string;
  cpseAValue: string;
  cpseBValue: string;
  status: ParameterAuditStatus;
  note?: string;
}

export interface MatchEvidence {
  descriptionSimilarity: number;
  semanticEmbeddings: number;
  extractedAttributeCompatibility: number;
  taxonomyConcordance: number;
  uomCompatibility: number;
  manufacturerPartReference: number;
  overallScore: number;
}

export interface ConflictDetail {
  isCritical: boolean;
  attribute: string;
  valueA: string;
  valueB: string;
  hazardDescription: string;
  recommendation: string;
}

export interface ReviewCandidatePair {
  id: string;
  cpseA: {
    node: CPSEId;
    code: string;
    description: string;
    facility: string;
    category: string;
    uom: string;
    mfr?: string;
    specimenLabel: string;
  };
  cpseB: {
    node: CPSEId;
    code: string;
    description: string;
    facility: string;
    category: string;
    uom: string;
    mfr?: string;
    specimenLabel: string;
  };
  attributes: AttributeComparison[];
  conflict?: ConflictDetail;
  evidence: MatchEvidence;
  initialRelationship: RelationshipType;
  proposedNmc: string;
  reviewStatus: ReviewStatus;
  stewardDecision?: {
    action: 'APPROVE' | 'MODIFY' | 'SPLIT' | 'REJECT';
    reason: string;
    stewardId: string;
    timestamp: string;
    sessionHash: string;
  };
}

export interface MaterialItem {
  id: string;
  cpse: CPSEId;
  code: string;
  rawErpFeed: string;
  normalizedDescription: string;
  category: string;
  uom: string;
  mfr: string;
  status: 'PENDING_REVIEW' | 'HIGH_CONFIDENCE' | 'HARMONIZED';
  mappedNmc?: string;
  matchScore: number;
  specifications: {
    nominalBore?: string;
    schedule?: string;
    endForm?: string;
    outerDiameter?: string;
    wallThickness?: string;
    standardSpec?: string;
    materialGrade?: string;
    pressureRating?: string;
  };
  provenance: {
    sourceSystem: string;
    ingestionDate: string;
    syncHash: string;
  };
  candidates: {
    cpse: CPSEId;
    code: string;
    description: string;
    score: number;
  }[];
}

export interface NationalMaterialRecord {
  nmcId: string;
  version: string;
  status: 'APPROVED & HARMONIZED' | 'APPROVED' | 'PENDING REVIEW' | 'DRAFT';
  canonicalDescription: string;
  category: string;
  tags: string[];
  attributes: {
    standardGrade: string;
    nominalBore: string;
    scheduleWall: string;
    pressureRating: string;
    materialBase: string;
  };
  mappedEntities: {
    cpse: CPSEId;
    localItemCode: string;
    matchState: 'Identical' | 'Harmonized' | 'Equivalent';
  }[];
  provenanceTrace: {
    seed: string;
    date: string;
    note: string;
  }[];
  conflictsPending?: string;
  consolidatedDemand: string;
  estValueCr: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  entity: string;
  action: 'Approve' | 'Modify' | 'Split' | 'Reject' | 'Ingest' | 'Override' | 'Export';
  reason: string;
  sessionHash: string;
  diffBefore?: string;
  diffAfter?: string;
}

export interface OfficerProfile {
  name: string;
  roleTitle: string;
  organization: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  roleDescription: string;
  notificationsEnabled: boolean;
}
