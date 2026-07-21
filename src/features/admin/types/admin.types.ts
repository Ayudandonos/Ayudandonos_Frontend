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
