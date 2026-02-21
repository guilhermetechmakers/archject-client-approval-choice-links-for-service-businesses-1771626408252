import * as React from 'react'
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

/* -----------------------------------------------------------------------------
 * Table - Root table element with accessibility support
 * ----------------------------------------------------------------------------- */

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Accessible label describing the table content for screen readers */
  'aria-label'?: string
  /** ID of element that labels this table (e.g. TableCaption id) */
  'aria-labelledby'?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

/* -----------------------------------------------------------------------------
 * TableHeader - Semantic thead with design tokens
 * ----------------------------------------------------------------------------- */

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('border-b border-border', '[&_tr]:border-b', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

/* -----------------------------------------------------------------------------
 * TableBody - Semantic tbody with design tokens
 * ----------------------------------------------------------------------------- */

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

/* -----------------------------------------------------------------------------
 * TableFooter - Semantic tfoot with design tokens
 * ----------------------------------------------------------------------------- */

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

/* -----------------------------------------------------------------------------
 * TableRow - Row with hover and selected states using design tokens
 * ----------------------------------------------------------------------------- */

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border transition-colors duration-200 hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

/* -----------------------------------------------------------------------------
 * TableHead - Column header with scope for accessibility
 * ----------------------------------------------------------------------------- */

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Scope for accessibility - defaults to "col" for column headers */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup'
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, scope = 'col', ...props }, ref) => (
    <th
      ref={ref}
      scope={scope}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

/* -----------------------------------------------------------------------------
 * TableCell - Cell with design tokens
 * ----------------------------------------------------------------------------- */

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

/* -----------------------------------------------------------------------------
 * TableCaption - Caption with id for aria-labelledby
 * ----------------------------------------------------------------------------- */

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, id, ...props }, ref) => {
  const captionId = id ?? React.useId()
  return (
    <caption
      ref={ref}
      id={captionId}
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
TableCaption.displayName = 'TableCaption'

/* -----------------------------------------------------------------------------
 * TableEmptyState - Empty state with icon, heading, description, CTA
 * ----------------------------------------------------------------------------- */

export interface TableEmptyStateProps {
  /** Icon to display (default: Inbox) */
  icon?: React.ReactNode
  /** Heading text */
  heading?: string
  /** Description text */
  description?: string
  /** Optional CTA button */
  action?: React.ReactNode
  /** Number of columns for proper colspan */
  colSpan?: number
  className?: string
}

function TableEmptyState({
  icon,
  heading = 'No data yet',
  description = 'Get started by adding your first item.',
  action,
  colSpan = 1,
  className,
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={cn('h-48 text-center', className)}
      >
        <div
          className="flex flex-col items-center justify-center gap-4 py-8"
          role="status"
          aria-live="polite"
          aria-label={`${heading}. ${description}`}
        >
          <div className="rounded-full bg-muted p-4">
            {icon ?? <Inbox className="h-8 w-8 text-muted-foreground" />}
          </div>
          <div className="space-y-1 text-center">
            <p className="text-base font-medium text-foreground">{heading}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </TableCell>
    </TableRow>
  )
}

/* -----------------------------------------------------------------------------
 * TableLoadingState - Skeleton loading rows
 * ----------------------------------------------------------------------------- */

export interface TableLoadingStateProps {
  /** Number of skeleton rows */
  rows?: number
  /** Number of columns */
  columns?: number
  colSpan?: number
  className?: string
}

function TableLoadingState({
  rows = 5,
  columns = 4,
  colSpan = 1,
  className,
}: TableLoadingStateProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell colSpan={colSpan} className={cn('p-4', className)}>
            <div
              className="flex gap-4"
              role="status"
              aria-label="Loading table data"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-5 flex-1 min-w-0" />
              ))}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

/* -----------------------------------------------------------------------------
 * TableErrorState - Error state with retry button
 * ----------------------------------------------------------------------------- */

export interface TableErrorStateProps {
  /** Error message to display */
  message?: string
  /** Retry callback */
  onRetry?: () => void
  colSpan?: number
  className?: string
}

function TableErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  colSpan = 1,
  className,
}: TableErrorStateProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={cn('h-48 text-center', className)}
      >
        <div
          className="flex flex-col items-center justify-center gap-4 py-8"
          role="alert"
          aria-live="assertive"
          aria-label={`Error: ${message}`}
        >
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-base font-medium text-foreground">
              Failed to load data
            </p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2"
              aria-label="Retry loading data"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmptyState,
  TableLoadingState,
  TableErrorState,
}
