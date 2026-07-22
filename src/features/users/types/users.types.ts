import type { UserRole } from '@/types';

export interface DonationStatsByStatus {
  status: string;
  count: number;
}

export interface DonationStats {
  totalDonations: number;
  totalQuantity: number;
  deliveredQuantity: number;
  cancelledDonations: number;
  byStatus: DonationStatsByStatus[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  department: string | null;
  bio: string | null;
  avatarUrl: string | null;
  donationStats?: DonationStats | null;
}

export interface UpdateUserProfilePayload {
  fullName?: string;
  phone?: string | null;
  city?: string | null;
  department?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}
