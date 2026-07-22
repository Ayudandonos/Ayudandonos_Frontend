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
