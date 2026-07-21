export type CampaignStatus = 'DRAFT' | 'PUBLISHED' | 'FINISHED' | 'CANCELLED';

export interface CampaignFoundationSummary {
  id: string;
  name: string;
  acronym: string | null;
  slug: string | null;
  logoUrl: string | null;
  city: string | null;
  department: string | null;
}

export interface Campaign {
  id: string;
  foundationId: string;
  title: string;
  description: string;
  imageUrl: string | null;
  status: CampaignStatus;
  startDate: string | null;
  endDate: string | null;
  deliveryAddress: string | null;
  deliveryLatitude: number | null;
  deliveryLongitude: number | null;
  createdAt: string;
  updatedAt: string;
  foundation: CampaignFoundationSummary;
}

export interface PaginatedCampaignsData {
  items: Campaign[];
}

export interface ListCampaignsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignStatus;
}

export interface CreateCampaignPayload {
  title: string;
  description: string;
  imageUrl?: string | null;
  status?: CampaignStatus;
  startDate?: string | null;
  endDate?: string | null;
  deliveryAddress?: string | null;
  deliveryLatitude?: number | null;
  deliveryLongitude?: number | null;
}

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

export interface CampaignDashboardSummary {
  total: number;
  published: number;
  finished: number;
  drafts: number;
  cancelled: number;
}

export type CampaignNeedPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CampaignNeed {
  id: string;
  campaignId: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  priority: CampaignNeedPriority;
  fulfilledQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCampaignNeedsData {
  items: CampaignNeed[];
}

export interface CreateCampaignNeedPayload {
  campaignId: string;
  name: string;
  description?: string | null;
  quantity: number;
  unit: string;
  priority?: CampaignNeedPriority;
}

export type UpdateCampaignNeedPayload = Partial<Omit<CreateCampaignNeedPayload, 'campaignId'>>;
