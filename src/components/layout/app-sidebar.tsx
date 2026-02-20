import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  FileCheck,
  Settings,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Receipt,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const mainNav = [
  { title: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
  { title: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { title: 'Approvals', href: '/dashboard/approvals', icon: FileCheck },
]

const secondaryNav = [
  { title: 'Exports', href: '/dashboard/exports', icon: Download },
  { title: 'Orders', href: '/dashboard/orders', icon: Receipt },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const adminNav = [
  { title: 'Analytics', href: '/dashboard/admin', icon: BarChart3 },
  { title: 'Users', href: '/dashboard/admin/users', icon: Users },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
          <Link to="/dashboard/overview" className="flex items-center gap-2">
            <span className="text-h2 font-bold text-primary">Archject</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="space-y-4 px-3">
          {!collapsed && (
            <div className="px-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/dashboard/approvals/new">
                  <Plus className="h-5 w-5" />
                  New Approval
                </Link>
              </Button>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <Button asChild size="icon">
                <Link to="/dashboard/approvals/new">
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}

          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-body font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          <Separator />

          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-body font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          <Separator />

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-body font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-border p-4">
          <Link
            to="/about/help-center"
            className="flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Link>
        </div>
      )}
    </aside>
  )
}
