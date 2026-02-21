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
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-popover hover:-translate-y-0.5',
        'border-l-4 border-l-primary/30',
        className
      )}
    >
      <CardHeader>
        <CardTitle>Exports</CardTitle>
        <CardDescription>Buttons to download PDF, CSV, or print</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {onExportPDF && (
            <Button
              variant="outline"
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
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
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {isExportingCSV ? 'Exporting...' : 'CSV'}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handlePrint}
            className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
