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

export interface AdminUserListItem {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  department: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserListItem {
  updatedAt?: string;
  donationStats?: DonationStats | null;
  foundationName?: string | null;
}

export interface ListAdminUsersParams {
  page?: number;
  limit?: number;
  role?: Extract<UserRole, 'USER' | 'FOUNDATION'>;
  isActive?: boolean;
  search?: string;
}

export interface PaginatedAdminUsers {
  items: AdminUserListItem[];
}
