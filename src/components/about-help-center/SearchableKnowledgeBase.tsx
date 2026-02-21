import { useState, useMemo } from 'react'
import { Search, BookOpen, FileText, LayoutTemplate, ChevronRight, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface KnowledgeArticle {
  id: string
  title: string
  description: string
  category: 'article' | 'guide' | 'template'
  slug: string
}

const defaultArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Getting Started with Archject',
    description: 'Learn the basics of creating approval requests and managing client feedback.',
    category: 'guide',
    slug: 'getting-started',
  },
  {
    id: '2',
    title: 'Creating Your First Approval Request',
    description: 'Step-by-step guide to create and send approval links to clients.',
    category: 'guide',
    slug: 'first-approval',
  },
  {
    id: '3',
    title: 'Understanding Client Review Flow',
    description: 'How clients receive, review, and submit their choices.',
    category: 'article',
    slug: 'client-review-flow',
  },
  {
    id: '4',
    title: 'Approval Request Templates',
    description: 'Pre-built templates for common design approval scenarios.',
    category: 'template',
    slug: 'approval-templates',
  },
  {
    id: '5',
    title: 'Exporting Approval Records',
    description: 'Export your approval history for records and compliance.',
    category: 'article',
    slug: 'export-records',
  },
  {
    id: '6',
    title: 'Onboarding Checklist',
    description: 'Complete checklist for new team members and projects.',
    category: 'guide',
    slug: 'onboarding-checklist',
  },
]

const categoryIcons = {
  article: FileText,
  guide: BookOpen,
  template: LayoutTemplate,
}

export interface SearchableKnowledgeBaseProps {
  /** Articles to display. When empty, shows empty state. When undefined, uses default articles. */
  articles?: KnowledgeArticle[]
}

export function SearchableKnowledgeBase({ articles: articlesProp }: SearchableKnowledgeBaseProps) {
  const [search, setSearch] = useState('')
  const articles = articlesProp ?? defaultArticles
  const isEmpty = articles.length === 0

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return articles
    const q = search.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    )
  }, [search, articles])

  const showEmptyState = isEmpty
  const showNoResultsState = !isEmpty && filteredArticles.length === 0

  return (
    <Card className="overflow-hidden rounded-xl shadow-card hover:shadow-lg transition-shadow duration-300 border-border">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Search className="h-5 w-5 text-primary" aria-hidden />
          Knowledge Base
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Articles, onboarding guides, and templates to help you get the most out of Archject
        </CardDescription>
        {!isEmpty && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              placeholder="Search articles, guides, templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-input"
              aria-label="Search knowledge base"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {showEmptyState ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="rounded-full bg-muted p-4 mb-4">
                <BookOpen className="h-12 w-12 text-muted-foreground" aria-hidden />
              </div>
              <h4 className="text-h3 font-semibold text-foreground mb-2">No articles yet</h4>
              <p className="text-body text-muted-foreground mb-6 max-w-sm">
                We&apos;re building our knowledge base. Check back soon or contact support for help.
              </p>
              <Button
                asChild
                variant="default"
                size="lg"
                className="min-h-[44px] px-6"
                aria-label="Contact support for help"
              >
                <a href="#contact-support">Contact support</a>
              </Button>
            </div>
          ) : showNoResultsState ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
              <h4 className="text-h3 font-semibold mb-2 text-foreground">No results found</h4>
              <p className="text-body text-muted-foreground mb-6 max-w-sm">
                Try a different search term or browse all articles above.
              </p>
              <Button
                onClick={() => setSearch('')}
                variant="default"
                size="lg"
                className="min-h-[44px] px-6"
                aria-label="Clear search and show all articles"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Clear search
              </Button>
            </div>
          ) : (
            filteredArticles.map((article, i) => {
              const Icon = categoryIcons[article.category]
              return (
                <a
                  key={article.id}
                  href={`#article-${article.slug}`}
                  className={cn(
                    'group flex items-start gap-4 px-6 py-4 transition-all duration-200 rounded-lg',
                    'hover:bg-accent/50 hover:shadow-md',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'animate-fade-in-up'
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-body font-semibold text-foreground group-hover:text-primary">
                      {article.title}
                    </h4>
                    <p className="text-caption text-muted-foreground mt-1 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </a>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
