/**
 * Admin & Analytics Service
 *
 * Unified service layer for organization analytics, user management,
 * usage metrics, and audit tools. Orchestrates admin-analytics and
 * admin-users services.
 */

import {
  fetchAdminAnalytics,
  exportAnalyticsReport,
} from '@/services/admin-analyticsService'
import {
  fetchAdminUsers,
  updateUserRole,
  inviteUser,
  bulkUpdateUserRoles,
} from '@/services/admin-usersService'
import type {
  AdminAnalyticsResponse,
  ExportReportRequest,
} from '@/types/admin-analytics'
import type {
  AdminUsersResponse,
  ListUsersParams,
  UpdateRoleRequest,
  InviteUserRequest,
  BulkUpdateRoleRequest,
} from '@/types/admin-users'

/** Fetch admin dashboard analytics (metrics, usage, audit logs) */
export async function getAdminAnalytics(): Promise<AdminAnalyticsResponse> {
  return fetchAdminAnalytics()
}

/** Export analytics report in CSV or JSON format */
export async function exportAdminReport(
  request: ExportReportRequest
): Promise<Blob | { data: AdminAnalyticsResponse }> {
  return exportAnalyticsReport(request)
}

/** List organization users with pagination and search */
export async function listAdminUsers(
  params: ListUsersParams = {}
): Promise<AdminUsersResponse> {
  return fetchAdminUsers(params)
}

/** Update a user's role */
export async function updateAdminUserRole(
  request: UpdateRoleRequest
): Promise<void> {
  return updateUserRole(request)
}

/** Invite a new user to the organization */
export async function inviteAdminUser(
  request: InviteUserRequest
): Promise<void> {
  return inviteUser(request)
}

/** Bulk update roles for multiple users */
export async function bulkUpdateAdminUserRoles(
  request: BulkUpdateRoleRequest
): Promise<void> {
  return bulkUpdateUserRoles(request)
}
