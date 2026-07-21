export type DonationStatus =
  | 'COMMITTED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'CANCELLED';

export interface DonationNeedSummary {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  fulfilledQuantity: number;
}

export interface DonationCampaignSummary {
  id: string;
  title: string;
  status: string;
}

export interface DonationDonorSummary {
  id: string;
  fullName: string;
}

export interface DonationStatusHistory {
  id: string;
  fromStatus: DonationStatus | null;
  toStatus: DonationStatus;
  changedById: string | null;
  changedByFullName: string | null;
  note: string | null;
  createdAt: string;
}

export interface Donation {
  id: string;
  needId: string;
  donorUserId: string;
  status: DonationStatus;
  quantity: number;
  notes: string | null;
  estimatedDeliveryAt: string | null;
  deliveryAddress: string | null;
  deliveryLatitude: number | null;
  deliveryLongitude: number | null;
  createdAt: string;
  updatedAt: string;
  conversationId: string | null;
  need: DonationNeedSummary;
  campaign: DonationCampaignSummary;
  donor: DonationDonorSummary;
  statusHistory: DonationStatusHistory[];
}

export interface PaginatedDonationsData {
  items: Donation[];
}

export interface ListDonationsParams {
  page?: number;
  limit?: number;
  status?: DonationStatus;
}

export interface CreateDonationPayload {
  needId: string;
  quantity: number;
  notes?: string;
  estimatedDeliveryAt?: string;
}

export interface UpdateDonationDeliveryPayload {
  deliveryAddress?: string | null;
  deliveryLatitude?: number | null;
  deliveryLongitude?: number | null;
  estimatedDeliveryAt?: string | null;
}

export interface DonationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderFullName: string;
  body: string;
  createdAt: string;
}
