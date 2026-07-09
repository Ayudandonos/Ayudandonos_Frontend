import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout, AuthLayout, DashboardLayout } from '@/layouts';
import { HomePage, NotFoundPage } from '@/pages';
import { LoginPage, RegisterPage } from '@/features/auth';
import { CampaignsExplorerPage, CampaignDetailPage, CreateCampaignPage } from '@/features/campaigns';
import { ContributePage, MyDonationsPage, DonationDetailPage } from '@/features/donations';
import { PublishNeedPage } from '@/features/needs';
import {
  HelpRequestsPage,
  ReviewRequestPage,
  ScheduleDeliveryPage,
  ConfirmDeliveryPage,
} from '@/features/foundations';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleRoute } from '@/routes/RoleRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'campaigns', element: <CampaignsExplorerPage /> },
      { path: 'campaigns/:id', element: <CampaignDetailPage /> },
      {
        path: 'campaigns/:id/contribute',
        element: (
          <RoleRoute allowedRoles={['USER']}>
            <ContributePage />
          </RoleRoute>
        ),
      },
      {
        path: 'my-donations',
        element: (
          <RoleRoute allowedRoles={['USER']}>
            <MyDonationsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'my-donations/:id',
        element: (
          <RoleRoute allowedRoles={['USER']}>
            <DonationDetailPage />
          </RoleRoute>
        ),
      },
      {
        path: 'foundation/campaigns/new',
        element: (
          <RoleRoute allowedRoles={['FOUNDATION']}>
            <CreateCampaignPage />
          </RoleRoute>
        ),
      },
      {
        path: 'foundation/needs/new',
        element: (
          <RoleRoute allowedRoles={['FOUNDATION']}>
            <PublishNeedPage />
          </RoleRoute>
        ),
      },
      {
        path: 'foundation/requests',
        element: (
          <RoleRoute allowedRoles={['FOUNDATION']}>
            <HelpRequestsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'foundation/requests/:id',
        element: (
          <RoleRoute allowedRoles={['FOUNDATION']}>
            <ReviewRequestPage />
          </RoleRoute>
        ),
      },
      {
        path: 'foundation/deliveries/schedule',
        element: (
          <RoleRoute allowedRoles={['FOUNDATION']}>
            <ScheduleDeliveryPage />
          </RoleRoute>
        ),
      },
      {
        path: 'foundation/deliveries/confirm',
        element: (
          <RoleRoute allowedRoles={['FOUNDATION']}>
            <ConfirmDeliveryPage />
          </RoleRoute>
        ),
      },
      { path: 'dashboard', element: <Navigate to="/campaigns" replace /> },
    ],
  },
]);
