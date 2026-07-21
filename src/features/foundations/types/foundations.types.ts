export type FoundationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type FoundationDocumentType =
  | 'RUT'
  | 'LEGAL_EXISTENCE_CERTIFICATE'
  | 'LEGAL_REPRESENTATIVE_ID'
  | 'BANK_CERTIFICATION';

export type SocialNetworkType =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'X'
  | 'LINKEDIN'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'OTHER';

export interface FoundationRepresentative {
  id: string;
  fullName: string;
  email: string;
}

export interface FoundationAdminObservation {
  id: string;
  content: string;
  authorName: string | null;
  createdAt: string;
}

export interface FoundationSocialLink {
  network: SocialNetworkType;
  url: string;
}

export interface FoundationDocument {
  id: string;
  type: FoundationDocumentType;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface FoundationListItem {
  id: string;
  name: string;
  acronym: string | null;
  nit: string | null;
  category: string | null;
  city: string | null;
  department: string | null;
  description: string | null;
  logoUrl: string | null;
  status: FoundationStatus;
  createdAt: string;
  representative: FoundationRepresentative;
}

export interface FoundationDetail extends FoundationListItem {
  mission: string | null;
  vision: string | null;
  address: string | null;
  institutionalEmail: string | null;
  phone: string | null;
  website: string | null;
  legalRepresentativeName: string | null;
  legalRepresentativeDocument: string | null;
  verifiedAt: string | null;
  rejectedAt: string | null;
  suspendedAt: string | null;
  rejectionReason: string | null;
  adminNotes: string | null;
  updatedAt: string;
  userIsActive: boolean;
  socialLinks: FoundationSocialLink[];
  documents: FoundationDocument[];
  observations: FoundationAdminObservation[];
  isProfileComplete: boolean;
  hasRequiredDocuments: boolean;
}

export interface FoundationStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  suspended: number;
}

export interface PaginatedFoundationsData {
  items: FoundationListItem[];
  stats?: FoundationStats;
}

export interface ListFoundationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: FoundationStatus;
  category?: string;
  city?: string;
  department?: string;
}

export interface UpdateFoundationPayload {
  name?: string;
  acronym?: string | null;
  nit?: string;
  category?: string;
  mission?: string | null;
  vision?: string | null;
  description?: string | null;
  city?: string;
  department?: string;
  address?: string;
  institutionalEmail?: string;
  phone?: string;
  website?: string | null;
  legalRepresentativeName?: string;
  legalRepresentativeDocument?: string;
  socialLinks?: FoundationSocialLink[];
}

export interface UpdateFoundationStatusPayload {
  status: FoundationStatus;
  rejectionReason?: string | null;
  adminNotes?: string | null;
}
