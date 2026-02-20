import { useState, useMemo } from 'react'
import { Search, BookOpen, FileText, LayoutTemplate, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
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

export function SearchableKnowledgeBase() {
  const [search, setSearch] = useState('')

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return defaultArticles
    const q = search.toLowerCase()
    return defaultArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Articles, onboarding guides, and templates to help you get the most out of Archject
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles, guides, templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search knowledge base"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-h3 font-semibold mb-2">No results found</h3>
              <p className="text-body text-muted-foreground mb-4 max-w-sm">
                Try a different search term or browse all articles above.
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-primary hover:underline text-caption font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredArticles.map((article, i) => {
              const Icon = categoryIcons[article.category]
              return (
                <a
                  key={article.id}
                  href={`#article-${article.slug}`}
                  className={cn(
                    'flex items-start gap-4 px-6 py-4 transition-all duration-200',
                    'hover:bg-accent/50',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'animate-fade-in-up'
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
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
