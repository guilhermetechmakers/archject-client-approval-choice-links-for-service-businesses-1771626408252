import { useState } from 'react'
import { MessageSquare, Flag, CheckCircle2, Reply, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Comment } from '@/types/approval-request-detail'

interface CommentsThreadProps {
  comments: Comment[]
  onAddComment?: (content: string, parentId?: string) => void
  onResolve?: (commentId: string, resolved: boolean) => void
  onFlag?: (commentId: string, flagged: boolean) => void
  isSubmitting?: boolean
  className?: string
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function CommentItem({
  comment,
  onReply,
  onResolve,
  onFlag,
  isSubmitting,
  depth = 0,
}: {
  comment: Comment
  onReply?: (content: string, parentId: string) => void
  onResolve?: (commentId: string, resolved: boolean) => void
  onFlag?: (commentId: string, flagged: boolean) => void
  isSubmitting?: boolean
  depth?: number
}) {
  const [replyContent, setReplyContent] = useState('')
  const [showReply, setShowReply] = useState(false)

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(replyContent.trim(), comment.id)
      setReplyContent('')
      setShowReply(false)
    }
  }

  const hasReplies = comment.replies && comment.replies.length > 0

  return (
    <div className={cn(depth > 0 && 'ml-6 pl-4 border-l-2 border-border')}>
      <div
        className={cn(
          'rounded-lg p-4 transition-all duration-200',
          comment.flagged && 'bg-destructive/5 border border-destructive/20',
          comment.resolved && 'opacity-75'
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-body font-medium">{comment.author}</span>
              <span className="text-caption text-muted-foreground">
                {formatDateTime(comment.created_at)}
              </span>
              {comment.resolved && (
                <span className="text-caption text-success">Resolved</span>
              )}
              {comment.flagged && (
                <span className="text-caption text-destructive">Flagged</span>
              )}
            </div>
            <p className="text-body mt-1">{comment.content}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onResolve && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onResolve(comment.id, !comment.resolved)}
                title={comment.resolved ? 'Unresolve' : 'Resolve'}
              >
                <CheckCircle2
                  className={cn(
                    'h-4 w-4',
                    comment.resolved ? 'text-success' : 'text-muted-foreground'
                  )}
                />
              </Button>
            )}
            {onFlag && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onFlag(comment.id, !comment.flagged)}
                title={comment.flagged ? 'Unflag' : 'Flag'}
              >
                <Flag
                  className={cn(
                    'h-4 w-4',
                    comment.flagged ? 'text-destructive' : 'text-muted-foreground'
                  )}
                />
              </Button>
            )}
          </div>
        </div>

        {!comment.parent_id && onReply && (
          <div className="mt-3">
            {showReply ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px]"
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyContent.trim() || isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowReply(false)
                      setReplyContent('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReply(true)}
              >
                <Reply className="h-4 w-4" />
                Reply
              </Button>
            )}
          </div>
        )}
      </div>

      {hasReplies && (
        <div className="mt-3 space-y-3">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onResolve={onResolve}
              onFlag={onFlag}
              isSubmitting={isSubmitting}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentsThread({
  comments,
  onAddComment,
  onResolve,
  onFlag,
  isSubmitting = false,
  className,
}: CommentsThreadProps) {
  const [newComment, setNewComment] = useState('')
  const topLevelComments = comments.filter((c) => !c.parent_id)

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim())
      setNewComment('')
    }
  }

  const handleReply = (content: string, parentId: string) => {
    onAddComment?.(content, parentId)
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-popover', className)}>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>Inline replies, resolve and flag actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {onAddComment && (
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
              disabled={isSubmitting}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </Button>
          </div>
        )}

        {topLevelComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-h3 font-medium mt-4">No comments yet</h3>
            <p className="text-body text-muted-foreground mt-2 max-w-sm">
              Comments from clients and team members will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onResolve={onResolve}
                onFlag={onFlag}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
