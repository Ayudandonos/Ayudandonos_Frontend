export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  linkPath: string | null;
  createdAt: string;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface PaginatedNotificationsData {
  items: NotificationItem[];
}

export interface UnreadCountData {
  count: number;
}
