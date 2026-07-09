import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts';
import { NotFoundPage } from '@/pages';
import { LoginPage, RegisterPage } from '@/features/auth';
import {
  HelpPage,
  PrivacyPolicyPage,
  SecurePlatformPage,
  TermsOfServicePage,
} from '@/features/legal';
import { HomePage, ImpactPage, OrganizationsPage } from '@/features/marketing';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'organizaciones', element: <OrganizationsPage /> },
      { path: 'impacto', element: <ImpactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'legal/secure-platform', element: <SecurePlatformPage /> },
      { path: 'legal/terms', element: <TermsOfServicePage /> },
      { path: 'legal/privacy', element: <PrivacyPolicyPage /> },
      { path: 'legal/help', element: <HelpPage /> },
      { path: 'terminos-y-condiciones', element: <TermsOfServicePage /> },
      { path: 'politica-de-privacidad', element: <PrivacyPolicyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
