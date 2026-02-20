import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@company.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'Member' },
]

export function AdminUsersPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage organization users and roles
          </p>
        </div>
        <Button>Invite User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Organization members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search users..." className="max-w-sm" />
          </div>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-caption text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-caption text-primary">
                    {user.role}
                  </span>
                  <Button variant="outline" size="sm">
                    Edit role
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
