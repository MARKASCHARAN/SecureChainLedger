// client/src/types/index.ts

export type UserRole = 'MANUFACTURER' | 'DISTRIBUTOR' | 'HOSPITAL' | 'PHARMACY' | 'REGULATOR' | 'ADMIN';
export type OrgType = UserRole;

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  status: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  organization?: Organization;
}

export interface Product {
  id: string;
  genericName: string;
  brandName: string;
  formulation: string;
  strength: string;
  scheduledDrug: boolean;
  manufacturerId?: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  productId: string;
  manufacturerId: string;
  currentOwnerId: string;
  quantity: number;
  unitPrice?: number;
  status: 'DRAFT' | 'PENDING_QA' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED' | 'RECALLED' | 'QUARANTINED';
  manufacturedAt: string;
  expiresAt?: string;
  qaDocumentHash?: string;
  qaApprovedAt?: string;
  storageConditions?: string;
  createdAt?: string;
  product?: Product;
  manufacturer?: Organization;
}

export interface Transfer {
  id: string;
  batchId: string;
  senderId: string;
  receiverId: string;
  quantity: number;
  status: 'INITIATED' | 'IN_TRANSIT' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  receivedAt?: string;
  batch?: { id: string; batchNumber: string; product?: { genericName: string } };
  sender?: { id: string; name: string };
  receiver?: { id: string; name: string };
}

export interface InventoryItem {
  id: string;
  organizationId: string;
  batchId: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  batch: {
    id: string;
    batchNumber: string;
    status: string;
    expiresAt?: string;
    storageConditions?: string;
    product: {
      id: string;
      genericName: string;
      brandName: string;
      formulation: string;
      strength: string;
    };
  };
}

export interface ProvenanceStep {
  step: number;
  actor: string;
  role: string;
  event: string;
  transferredFrom?: string;
  quantity?: number;
  timestamp?: string;
}

export interface VerificationResult {
  batchNumber: string;
  verificationStatus: 'AUTHENTIC' | 'RECALLED' | 'EXPIRED' | 'UNAPPROVED' | 'NOT_FOUND';
  message: string;
  product: Product;
  manufacturer: Organization;
  manufacturedAt: string;
  expiresAt: string;
  qaApprovedAt?: string;
  storageConditions?: string;
  hasQaDocument: boolean;
  currentStatus: string;
  provenanceTrail: ProvenanceStep[];
  verifiedAt: string;
}

export interface Recall {
  id: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
  initiator: { id: string; name: string; type: string };
  affectedBatches: {
    batchId: string;
    acknowledgedAt?: string;
    acknowledgedBy?: string;
    batch: { id: string; batchNumber: string; product?: { genericName: string } };
  }[];
}
