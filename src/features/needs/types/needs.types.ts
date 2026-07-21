export type NeedPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Need {
  id: string;
  campaignId: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  priority: NeedPriority;
  fulfilledQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNeedsData {
  items: Need[];
}

export interface ListNeedsParams {
  campaignId: string;
  page?: number;
  limit?: number;
}

export interface CreateNeedPayload {
  campaignId: string;
  name: string;
  description?: string | null;
  quantity: number;
  unit: string;
  priority?: NeedPriority;
}

export type UpdateNeedPayload = Partial<Omit<CreateNeedPayload, 'campaignId'>>;
