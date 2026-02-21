import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { AdminAnalytics } from '@/components/admin-analytics'
import { useAdminAnalytics, useExportAdminAnalytics } from '@/hooks/use-admin-analytics'

export function AdminOverviewPage() {
  const [showExportSuccess, setShowExportSuccess] = useState(false)
  const { data, isLoading, isError, refetch } = useAdminAnalytics()
  const exportMutation = useExportAdminAnalytics()

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

  return (
    <div className="space-y-6">
      <nav
        className="flex items-center gap-2 text-caption text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link to="/dashboard/overview" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <span className="text-foreground font-medium">Admin</span>
      </nav>

      <AdminAnalytics
        data={data ?? null}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
        showExportSuccess={showExportSuccess}
        onExportSuccessDismiss={() => setShowExportSuccess(false)}
      />
    </div>
  )
}
