import { FileDown, FileSpreadsheet, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ExportsProps {
  onExportPDF?: () => void
  onExportCSV?: () => void
  onPrint?: () => void
  isExportingPDF?: boolean
  isExportingCSV?: boolean
  className?: string
}

export function Exports({
  onExportPDF,
  onExportCSV,
  onPrint,
  isExportingPDF = false,
  isExportingCSV = false,
  className,
}: ExportsProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-popover', className)}>
      <CardHeader>
        <CardTitle>Exports</CardTitle>
        <CardDescription>Download PDF, CSV, or print</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {onExportPDF && (
            <Button
              variant="outline"
              onClick={onExportPDF}
              disabled={isExportingPDF}
            >
              <FileDown className="h-4 w-4" />
              {isExportingPDF ? 'Exporting...' : 'PDF'}
            </Button>
          )}
          {onExportCSV && (
            <Button
              variant="outline"
              onClick={onExportCSV}
              disabled={isExportingCSV}
            >
              <FileSpreadsheet className="h-4 w-4" />
              {isExportingCSV ? 'Exporting...' : 'CSV'}
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
