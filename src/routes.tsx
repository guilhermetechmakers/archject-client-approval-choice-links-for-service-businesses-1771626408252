import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { EmailVerificationPage } from '@/pages/email-verification'
import { HelpPage } from '@/pages/help'
import { PrivacyPage } from '@/pages/privacy'
import { TermsPage } from '@/pages/terms'
import { CookiesPage } from '@/pages/cookies'
import { PricingPage } from '@/pages/pricing'
import { NotFoundPage } from '@/pages/not-found'
import { ErrorPage } from '@/pages/error'
import { ClientReviewPage } from '@/pages/client-review'
import { CheckoutPage } from '@/pages/checkout'
import { OrdersPage } from '@/pages/orders'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardOverview } from '@/pages/dashboard/dashboard-overview'
import { DashboardProjects } from '@/pages/dashboard/dashboard-projects'
import { DashboardApprovals } from '@/pages/dashboard/dashboard-approvals'
import { DashboardSettings } from '@/pages/dashboard/dashboard-settings'
import { DashboardExports } from '@/pages/dashboard/dashboard-exports'
import { CreateApprovalPage } from '@/pages/dashboard/create-approval'
import { ProjectDetailPage } from '@/pages/dashboard/project-detail'
import { ApprovalDetailPage } from '@/pages/dashboard/approval-detail'
import ApprovalRequestDetailPage from '@/pages/ApprovalRequestDetail'
import { ProfilePage } from '@/pages/dashboard/profile'
import { AdminOverviewPage } from '@/pages/dashboard/admin-overview'
import { AdminUsersPage } from '@/pages/dashboard/admin-users'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/landing-page', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-email', element: <EmailVerificationPage /> },
  { path: '/help', element: <HelpPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/cookies', element: <CookiesPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/review/:token', element: <ClientReviewPage /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard/overview" replace /> },
      { path: 'overview', element: <DashboardOverview /> },
      { path: 'projects', element: <DashboardProjects /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'approvals', element: <DashboardApprovals /> },
      { path: 'approvals/new', element: <CreateApprovalPage /> },
      { path: 'approvals/:id', element: <ApprovalDetailPage /> },
      { path: 'approval-request-detail/:id', element: <ApprovalRequestDetailPage /> },
      { path: 'exports', element: <DashboardExports /> },
      { path: 'settings', element: <DashboardSettings /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'admin', element: <AdminOverviewPage /> },
      { path: 'admin/users', element: <AdminUsersPage /> },
    ],
  },
  { path: '/demo', element: <LandingPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '/500', element: <ErrorPage /> },
  { path: '*', element: <NotFoundPage /> },
])
