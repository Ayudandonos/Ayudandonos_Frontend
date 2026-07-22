export type AdminNeedPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AdminDashboardKpis {
  activeCampaigns: number;
  pendingNeeds: number;
  deliveredAids: number;
  verifiedFoundations: number;
  activeCampaignsTrendPercent?: number | null;
  pendingNeedsCritical?: boolean;
}

export interface AdminLatestNeedItem {
  id: string;
  name: string;
  foundationName: string;
  priority: AdminNeedPriority;
  publishedAt: string;
}

export interface AdminFeaturedCampaignItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  progressPercent: number;
  daysRemaining: number | null;
  isPrimary?: boolean;
}

export interface AdminDashboardData {
  kpis: AdminDashboardKpis;
  latestNeeds: AdminLatestNeedItem[];
  featuredCampaigns?: AdminFeaturedCampaignItem[];
}

export interface AdminReportSeriesItem {
  key: string;
  label: string;
  value: number;
}

export interface AdminReportMonthlyItem {
  monthKey: string;
  label: string;
  users: number;
  foundations: number;
  donations: number;
  campaigns: number;
}

export interface AdminReportsSummary {
  totalUsers: number;
  totalFoundations: number;
  totalDonations: number;
  totalCampaigns: number;
  totalNeeds: number;
  activeUsers: number;
  verifiedFoundations: number;
  deliveredDonations: number;
}

export interface AdminReportsData {
  summary: AdminReportsSummary;
  usersByRole: AdminReportSeriesItem[];
  foundationsByStatus: AdminReportSeriesItem[];
  donationsByStatus: AdminReportSeriesItem[];
  campaignsByStatus: AdminReportSeriesItem[];
  monthlyActivity: AdminReportMonthlyItem[];
}

export type AdminCampaignStatus = 'DRAFT' | 'PUBLISHED' | 'FINISHED' | 'CANCELLED';

export interface AdminCampaignListItem {
  id: string;
  title: string;
  status: AdminCampaignStatus;
  imageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  donationsCount: number;
  needsCount: number;
  foundation: {
    id: string;
    name: string;
    city: string | null;
    department: string | null;
  };
  createdBy: {
    fullName: string;
    email: string;
  };
}

export interface ListAdminCampaignsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminCampaignStatus;
}

export interface PaginatedAdminCampaigns {
  items: AdminCampaignListItem[];
}
