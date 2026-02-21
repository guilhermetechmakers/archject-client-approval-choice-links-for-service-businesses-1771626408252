import { useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronUp,
  Users,
  Search,
  UserPlus,
  Shield,
  ShieldCheck,
  Eye,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
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
    role === 'Admin' ? 'default' : role === 'Member' ? 'secondary' : 'outline'
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {role}
    </Badge>
  )
}

export interface AdminUserManagementProps {
  users: AdminUser[]
  total: number
  search: string
  onSearchChange: (value: string) => void
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onRoleChange: (user: AdminUser, role: (typeof ROLES)[number]) => void
  onBulkRoleChange: (userIds: string[], role: (typeof ROLES)[number]) => void
  onInvite: (email: string, role: (typeof ROLES)[number]) => void | Promise<void>
  isUpdatingRole?: boolean
  isInviting?: boolean
  isBulkUpdating?: boolean
  isLoading?: boolean
}

export function AdminUserManagement({
  users,
  total,
  search,
  onSearchChange,
  page,
  pageSize,
  onPageChange,
  onRoleChange,
  onBulkRoleChange,
  onInvite,
  isUpdatingRole,
  isInviting,
  isBulkUpdating,
  isLoading = false,
}: AdminUserManagementProps) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<(typeof ROLES)[number]>('Member')
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ])

  const selectedIds = Object.entries(rowSelection)
    .filter(([, v]) => v)
    .map(([k]) => k)
  const hasSelection = selectedIds.length > 0

  const columns: ColumnDef<AdminUser>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select ${row.original.email}`}
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'full_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label={`Sort by user name ${column.getIsSorted() === 'asc' ? '(ascending)' : column.getIsSorted() === 'desc' ? '(descending)' : ''}`}
        >
          User
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.full_name || row.original.email || 'Unknown'}
          </p>
          <p className="text-caption text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label={`Sort by role ${column.getIsSorted() === 'asc' ? '(ascending)' : column.getIsSorted() === 'desc' ? '(descending)' : ''}`}
        >
          Role
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label={`Sort by join date ${column.getIsSorted() === 'asc' ? '(ascending)' : column.getIsSorted() === 'desc' ? '(descending)' : ''}`}
        >
          Joined
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="text-right font-semibold">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdatingRole}
                className="transition-transform hover:scale-[1.02]"
                aria-label={`Edit role for ${row.original.email}`}
              >
                Edit role
                <ChevronDown className="ml-1 h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {ROLES.filter((r) => r !== row.original.role).map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => onRoleChange(row.original, role)}
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const totalPages = Math.ceil(total / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    try {
      await onInvite(inviteEmail.trim(), inviteRole)
      setInviteEmail('')
      setInviteRole('Member')
      setInviteOpen(false)
    } catch {
      // Error handled by parent mutation
    }
  }

  const handleBulkRole = (role: (typeof ROLES)[number]) => {
    onBulkRoleChange(selectedIds, role)
    setRowSelection({})
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage organization users, roles, and access
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button
              className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Invite new user to organization"
            >
              <UserPlus className="h-5 w-5" aria-hidden />
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
                <Select
                  value={inviteRole}
                  onValueChange={(v) => setInviteRole(v as (typeof ROLES)[number])}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || isInviting}
              >
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-2xl border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-modal">
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  onSearchChange(e.target.value)
                  onPageChange(1)
                }}
                className="pl-9"
                aria-label="Search users by name or email"
              />
            </div>
            {hasSelection && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isBulkUpdating}
                    aria-label={`Change role for ${selectedIds.length} selected user${selectedIds.length > 1 ? 's' : ''}`}
                  >
                    Change role ({selectedIds.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {ROLES.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleBulkRole(role)}
                    >
                      Set to {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4" role="status" aria-label="Loading users">
              <div className="hidden md:block rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table aria-hidden>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b bg-muted/30">
                        <TableHead className="w-12">
                          <Skeleton className="h-4 w-4 rounded-sm" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-24" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-16" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-20" />
                        </TableHead>
                        <TableHead className="w-24" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i} className="hover:bg-transparent">
                          <TableCell>
                            <Skeleton className="h-4 w-4 rounded-sm" />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-20" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="md:hidden space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-4 space-y-3"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !users.length ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border-2 border-dashed border-border bg-muted/30"
              role="status"
              aria-label="No users found"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Users className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="text-h3 font-semibold mt-4 text-foreground">
                No users found
              </h3>
              <p className="text-body text-muted-foreground mt-2 max-w-sm">
                {search
                  ? "Try adjusting your search to find what you're looking for."
                  : 'Invite team members to get started.'}
              </p>
              {!search && (
                <Button
                  onClick={() => setInviteOpen(true)}
                  className="mt-6 min-h-[44px] min-w-[44px]"
                  aria-label="Invite your first user"
                >
                  <UserPlus className="h-5 w-5" aria-hidden />
                  Invite User
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden md:block rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table aria-label="Users table with columns for selection, name, email, role, and actions">
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                          key={headerGroup.id}
                          className="hover:bg-transparent border-b bg-muted/30 sticky top-0 z-10"
                        >
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className={cn(
                                'font-semibold',
                                header.id === 'actions' && 'text-right'
                              )}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="transition-colors hover:bg-accent/50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                cell.column.id === 'actions' && 'text-right'
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="md:hidden space-y-4">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="rounded-2xl border-border transition-all duration-300 hover:shadow-modal hover:border-primary/20"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {user.full_name || user.email || 'Unknown'}
                          </p>
                          <p className="text-caption text-muted-foreground truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <RoleBadge role={user.role} />
                            <span className="text-caption text-muted-foreground">
                              {formatDate(user.created_at)}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdatingRole}
                              className="shrink-0 min-h-[44px] min-w-[44px]"
                              aria-label={`Edit role for ${user.email}`}
                            >
                              Edit
                              <ChevronDown className="ml-1 h-4 w-4" aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {ROLES.filter((r) => r !== user.role).map((role) => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => onRoleChange(user, role)}
                              >
                                {role}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-caption text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, total)} of {total} users
                  </p>
                  <nav className="flex gap-2" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(Math.max(1, page - 1))}
                      disabled={!hasPrevPage}
                      aria-label="Go to previous page"
                      className="min-h-[44px] min-w-[44px]"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                      disabled={!hasNextPage}
                      aria-label="Go to next page"
                      className="min-h-[44px] min-w-[44px]"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
