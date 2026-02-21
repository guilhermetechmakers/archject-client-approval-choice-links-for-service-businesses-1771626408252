/**
 * Admin & Analytics - Main Feature Component
 *
 * Unified admin interface for organization analytics, user management,
 * usage metrics, and audit tools. Provides tabbed navigation between
 * Analytics dashboard and User Management.
 */

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Users, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminAnalytics } from '@/components/admin-analytics'
import { AdminUserManagement } from '@/components/admin-user-management'
import { ErrorState } from '@/components/loading-success-pages'
import { useAdminAnalytics, useExportAdminAnalytics } from '@/hooks/use-admin-analytics'
import {
  useAdminUsers,
  useUpdateUserRole,
  useInviteUser,
  useBulkUpdateUserRoles,
} from '@/hooks/use-admin-users'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import type { AdminUser } from '@/types/admin-users'

export interface AdminAndAnalyticsProps {
  /** Initial active tab when path doesn't indicate one (e.g. /dashboard/admin) */
  defaultTab?: 'analytics' | 'users'
  /** Controlled tab (overrides URL-derived tab when set) */
  activeTab?: 'analytics' | 'users'
  /** Callback when tab changes */
  onTabChange?: (tab: 'analytics' | 'users') => void
}

export function AdminAndAnalytics({
  defaultTab = 'analytics',
  activeTab: controlledTab,
  onTabChange,
}: AdminAndAnalyticsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const tabFromPath = location.pathname.endsWith('/users') ? 'users' : 'analytics'
  const [showExportSuccess, setShowExportSuccess] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const tab = controlledTab ?? tabFromPath ?? defaultTab
  const setTab = (value: string) => {
    const next = value as 'analytics' | 'users'
    onTabChange?.(next)
    if (next === 'users') {
      navigate('/dashboard/admin/users', { replace: true })
    } else {
      navigate('/dashboard/admin', { replace: true })
    }
  }

  const debouncedSearch = useDebounce(search, 300)
  const pageSize = 10

  const { data: analyticsData, isLoading: analyticsLoading, isError: analyticsError, refetch: refetchAnalytics } = useAdminAnalytics()
  const exportMutation = useExportAdminAnalytics()

  const { data: usersData, isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useAdminUsers({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  })
  const updateRoleMutation = useUpdateUserRole()
  const inviteMutation = useInviteUser()
  const bulkUpdateMutation = useBulkUpdateUserRoles()

  const handleExport = (format: 'csv' | 'json') => {
    exportMutation.mutate(
      { format },
      {
        onSuccess: () => {
          setShowExportSuccess(true)
        },
      }
    )
  }

  useEffect(() => {
    if (!showExportSuccess) return
    const timer = setTimeout(() => setShowExportSuccess(false), 5000)
    return () => clearTimeout(timer)
  }, [showExportSuccess])

  const handleInvite = async (email: string, role: 'Admin' | 'Member' | 'Viewer') => {
    await inviteMutation.mutateAsync({ email, role })
  }

  const handleRoleChange = (user: AdminUser, role: 'Admin' | 'Member' | 'Viewer') => {
    updateRoleMutation.mutate({ userId: user.id, role })
  }

  const handleBulkRoleChange = (userIds: string[], role: 'Admin' | 'Member' | 'Viewer') => {
    bulkUpdateMutation.mutate({ userIds, role })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav
        className="flex items-center gap-2 text-caption text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link to="/dashboard/overview" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span className="text-muted-foreground" aria-hidden>/</span>
        <span className="text-foreground font-medium">Admin</span>
      </nav>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-lg bg-muted/50 p-1">
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 rounded-md py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 hover:scale-[1.02]"
          >
            <BarChart3 className="h-4 w-4" aria-hidden />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="flex items-center gap-2 rounded-md py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 hover:scale-[1.02]"
          >
            <Users className="h-4 w-4" aria-hidden />
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-0 space-y-6">
          <AdminAnalytics
            data={analyticsData ?? null}
            isLoading={analyticsLoading}
            isError={analyticsError}
            onRetry={() => refetchAnalytics()}
            onExport={handleExport}
            isExporting={exportMutation.isPending}
            showExportSuccess={showExportSuccess}
            onExportSuccessDismiss={() => setShowExportSuccess(false)}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-0 space-y-6">
          {usersError ? (
            <ErrorState
              heading="Failed to load users"
              description="You may not have permission to access user management, or there was a connection error."
              retryLabel="Try again"
              onRetry={() => refetchUsers()}
            />
          ) : (
          <AdminUserManagement
            users={usersData?.users ?? []}
            total={usersData?.total ?? 0}
            search={search}
            onSearchChange={setSearch}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onRoleChange={handleRoleChange}
            onBulkRoleChange={handleBulkRoleChange}
            onInvite={handleInvite}
            isUpdatingRole={updateRoleMutation.isPending}
            isInviting={inviteMutation.isPending}
            isBulkUpdating={bulkUpdateMutation.isPending}
            isLoading={usersLoading}
          />
          )}
          {tab === 'users' && !usersError && (
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild variant="outline" className="transition-transform hover:scale-[1.02]">
                <Link to="/dashboard/admin">
                  <Shield className="h-5 w-5" aria-hidden />
                  Admin Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="transition-transform hover:scale-[1.02]">
                <Link to="/dashboard/orders">View Transactions</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
