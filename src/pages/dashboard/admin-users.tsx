import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/loading-success-pages'
import { useDebounce } from '@/hooks/use-debounce'
import {
  useAdminUsers,
  useUpdateUserRole,
  useInviteUser,
  useBulkUpdateUserRoles,
} from '@/hooks/use-admin-users'
import { AdminUserManagement } from '@/components/admin-user-management'
import { AdminUsersSkeleton } from '@/components/admin-user-management/AdminUsersSkeleton'

export function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 300)
  const pageSize = 10

  const { data, isLoading, isError, refetch } = useAdminUsers({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  })
  const updateRoleMutation = useUpdateUserRole()
  const inviteMutation = useInviteUser()
  const bulkUpdateMutation = useBulkUpdateUserRoles()

  const handleInvite = async (email: string, role: 'Admin' | 'Member' | 'Viewer') => {
    await inviteMutation.mutateAsync({ email, role })
  }

  const handleRoleChange = (userId: string, role: 'Admin' | 'Member' | 'Viewer') => {
    updateRoleMutation.mutate({ userId, role })
  }

  const handleBulkRoleChange = (
    userIds: string[],
    role: 'Admin' | 'Member' | 'Viewer'
  ) => {
    bulkUpdateMutation.mutate({ userIds, role })
  }

  if (isLoading) {
    return <AdminUsersPageSkeleton />
  }

  if (isError) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <nav
          className="flex items-center gap-2 text-caption text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link to="/dashboard/overview" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <Link to="/dashboard/admin" className="hover:text-foreground transition-colors">
            Admin
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span className="text-foreground font-medium">Users</span>
        </nav>
        <ErrorState
          heading="Failed to load users"
          description="You may not have permission to access user management, or there was a connection error."
          retryLabel="Try again"
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-caption text-muted-foreground">
        <Link to="/dashboard/overview" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/dashboard/admin" className="hover:text-foreground transition-colors">
          Admin
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Users</span>
      </nav>

      <AdminUserManagement
        users={data?.users ?? []}
        total={data?.total ?? 0}
        search={search}
        onSearchChange={setSearch}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRoleChange={(user, role) => handleRoleChange(user.id, role)}
        onBulkRoleChange={handleBulkRoleChange}
        onInvite={handleInvite}
        isUpdatingRole={updateRoleMutation.isPending}
        isInviting={inviteMutation.isPending}
        isBulkUpdating={bulkUpdateMutation.isPending}
      />

      <div className="flex flex-wrap gap-4">
        <Button asChild variant="outline">
          <Link to="/dashboard/admin">
            <Shield className="h-5 w-5" />
            Admin Dashboard
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard/orders">View Transactions</Link>
        </Button>
      </div>
    </div>
  )
}

function AdminUsersPageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <AdminUsersSkeleton />
    </div>
  )
}
