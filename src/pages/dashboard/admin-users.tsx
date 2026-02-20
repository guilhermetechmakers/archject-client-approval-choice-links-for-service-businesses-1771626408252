import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDebounce } from '@/hooks/use-debounce'
import {
  ChevronRight,
  Users,
  Search,
  UserPlus,
  ChevronDown,
  AlertCircle,
  Shield,
  ShieldCheck,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAdminUsers, useUpdateUserRole, useInviteUser } from '@/hooks/use-admin-users'
import type { AdminUser } from '@/types/admin-users'

const ROLES = ['Admin', 'Member', 'Viewer'] as const
const ROLE_ICONS = {
  Admin: ShieldCheck,
  Member: Shield,
  Viewer: Eye,
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function RoleBadge({ role }: { role: string }) {
  const Icon = ROLE_ICONS[role as keyof typeof ROLE_ICONS] ?? Shield
  const variant =
    role === 'Admin'
      ? 'default'
      : role === 'Member'
        ? 'secondary'
        : 'outline'
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {role}
    </Badge>
  )
}

export function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member')

  const debouncedSearch = useDebounce(search, 300)
  const pageSize = 10
  const { data, isLoading, isError, refetch } = useAdminUsers({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  })
  const updateRoleMutation = useUpdateUserRole()
  const inviteMutation = useInviteUser()

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    inviteMutation.mutate(
      { email: inviteEmail.trim(), role: inviteRole },
      {
        onSuccess: () => {
          setInviteEmail('')
          setInviteRole('Member')
          setInviteOpen(false)
        },
      }
    )
  }

  const handleRoleChange = (user: AdminUser, newRole: 'Admin' | 'Member' | 'Viewer') => {
    updateRoleMutation.mutate({ userId: user.id, role: newRole })
  }

  if (isLoading) {
    return <AdminUsersSkeleton />
  }

  if (isError) {
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-h3 font-semibold mt-4">Failed to load users</h3>
          <p className="text-body text-muted-foreground mt-2 max-w-md">
            You may not have permission to access user management, or there was a connection error.
          </p>
          <Button onClick={() => refetch()} className="mt-6" variant="outline">
            Try again
          </Button>
        </div>
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage organization users, roles, and access
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <UserPlus className="h-5 w-5" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new user to your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="invite-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="invite-role" className="text-sm font-medium">
                  Role
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {inviteRole}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {ROLES.map((r) => (
                      <DropdownMenuItem key={r} onClick={() => setInviteRole(r)}>
                        {r}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || inviteMutation.isPending}
              >
                {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="transition-shadow duration-300 hover:shadow-modal">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Organization Members
          </CardTitle>
          <CardDescription>
            Search and manage user roles. Changes take effect immediately.
          </CardDescription>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!data?.users.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-h3 font-semibold mt-4">No users found</h3>
              <p className="text-body text-muted-foreground mt-2 max-w-sm">
                {search
                  ? 'Try adjusting your search to find what you\'re looking for.'
                  : 'Invite team members to get started.'}
              </p>
              {!search && (
                <Button onClick={() => setInviteOpen(true)} className="mt-6">
                  <UserPlus className="h-5 w-5" />
                  Invite User
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Joined</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="transition-colors hover:bg-accent/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.full_name || user.email || 'Unknown'}
                            </p>
                            <p className="text-caption text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={updateRoleMutation.isPending}
                                className="transition-transform hover:scale-[1.02]"
                              >
                                Edit role
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {ROLES.filter((r) => r !== user.role).map((role) => (
                                <DropdownMenuItem
                                  key={role}
                                  onClick={() =>
                                    handleRoleChange(user, role)
                                  }
                                >
                                  {role}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-caption text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.total)} of{' '}
                    {data.total} users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!hasPrevPage}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={!hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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

function AdminUsersSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <Skeleton className="h-5 w-64" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 mt-1" />
          <Skeleton className="h-10 w-full max-w-sm mt-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
