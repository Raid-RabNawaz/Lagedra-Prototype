
export enum VerificationClass {
  LOW_RISK = 'Low Risk',
  MEDIUM_RISK = 'Medium Risk',
  HIGH_RISK = 'High Risk',
  UNVERIFIED = 'Unverified'
}

export enum InsuranceStatus {
  ACTIVE = 'Active',
  INSTITUTION_BACKED = 'Institution-Backed',
  NOT_ACTIVE = 'Not Active',
  UNKNOWN = 'Unknown', // First-class state per PDF
  MANUAL_VERIFICATION_PENDING = 'ManualVerificationPending'
}

export enum ConfidenceLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum DealStatus {
  INQUIRY = 'Inquiry',
  TRUTH_SURFACE_PENDING = 'Truth Surface Pending',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  DISPUTE = 'Dispute',
  ARBITRATION_REVIEW = 'Arbitration Review',
  SEALED = 'Sealed'
}

export enum ListingStatus {
  DRAFT = 'Draft',
  PENDING_VERIFICATION = 'Pending Verification',
  ACTIVE = 'Active',
  OCCUPIED = 'Occupied',
  SUSPENDED = 'Suspended',
  ARCHIVED = 'Archived'
}

export type UserRole = 'tenant' | 'landlord' | 'arbitrator' | 'admin';

export interface HostVerificationStatus {
  govtId: boolean;
  liveness: boolean; // Selfie/Biometric
  businessKyc: boolean; // Beneficial owners, registration
  homeAddress: boolean; // Traceability
}

export interface TenantVerificationStatus {
  identity: boolean; // Govt ID + Selfie
  income: boolean; // Plaid/Stripe Link
  background: boolean; // Criminal/Eviction check
  rentalHistory: boolean; // Ledger check
}

export interface PropertyVerificationStatus {
  photoMatch: boolean; // AI comparison
  videoTour: boolean; // Structured path + code
  documents: boolean; // OCR utility/deed
  mailCode: boolean; // Physical letter
  gpsMatch: boolean; // Geolocation check
}

export interface Inquiry {
  id: string;
  listingId: string;
  tenantId: string;
  tenantName: string;
  topic: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  timestamp: string;
}

export interface TrustLedgerEntry {
  id: string;
  date: string;
  type: 'Deal Completed' | 'Compliance Violation' | 'Arbitration Won' | 'Arbitration Lost' | 'Active Month' | 'Admin Intervention';
  description: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  verificationClass?: VerificationClass;
  insuranceStatus?: InsuranceStatus;
  confidence?: ConfidenceLevel;
  trustLedger: TrustLedgerEntry[];
  avatarUrl: string;
  verifiedAffiliation?: string;
  hostVerification?: HostVerificationStatus; 
  tenantVerification?: TenantVerificationStatus; // Added for Tenant
  bio?: string;
  savedListingIds?: string[]; // Added for Save Flow
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  status: ListingStatus;
  location: {
    city: string;
    state: string;
    zip: string;
    approximate: boolean; 
  };
  priceDisplay: number;
  depositGuidance: {
    min: number;
    max: number;
    recommended: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    furnished: boolean;
    utilitiesIncluded: boolean;
  };
  amenities: string[];
  accessibility?: string[];
  requirements: {
    minCreditScore: number;
    incomeMultiplier: number; // e.g., 2.5x rent
    smokingAllowed: boolean;
    petsAllowed: boolean;
  };
  imageUrl: string;
  hostId: string;
  verificationStatus?: PropertyVerificationStatus; // Added for Property Verification
}

export interface TruthSurfaceItem {
  category: string;
  key: string;
  value: string;
  confirmed: boolean;
}

export interface Deal {
  id: string;
  listingId: string;
  tenantId: string;
  landlordId: string;
  status: DealStatus;
  startDate: string;
  endDate: string;
  truthSurface: TruthSurfaceItem[];
  protocolFeeStatus: 'Current' | 'Overdue' | 'Inactive';
  // MVP: Cryptographic proofs
  truthSnapshotHash?: string;
  truthSignature?: string;
}

// Admin / Ops specific types
export interface OpsQueueItem {
  id: string;
  type: 'Insurance Unknown' | 'Fraud Flag' | 'Jurisdiction Compliance' | 'Tenant Verification' | 'Host Verification' | 'Property Verification';
  severity: 'High' | 'Medium' | 'Low';
  created: string;
  deadline: string; // SLA deadline
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  metadata?: any; // Flexible payload for review data
}

// Arbitration Specific Types
export interface ArbitrationEvidence {
  id: string;
  submittedBy: 'tenant' | 'landlord';
  type: 'Image' | 'Video' | 'Document' | 'Log';
  filename: string;
  description: string;
  timestamp: string;
  hash: string;
  verifiedMetadata: boolean;
}

export interface ArbitrationCase {
  id: string;
  dealId: string;
  disputeType: string; // e.g., "Habitability", "Damages", "Cancellation"
  status: 'Open' | 'Reviewing' | 'Resolved';
  createdDate: string;
  deadline: string;
  claimantId: string;
  respondentId: string;
  claimSummary: string;
  relevantTruthKey: string; // Key from TruthSurface e.g., "Condition.HVAC"
  escrowAmount: number;
  evidence: ArbitrationEvidence[];
}

export interface Ruling {
  caseId: string;
  verdict: 'Claimant Wins' | 'Respondent Wins' | 'Split Decision';
  payoutToTenant: number;
  payoutToLandlord: number;
  rationale: string;
  ledgerImpact: string; // e.g., "Strike on Landlord"
  timestamp: string;
}
