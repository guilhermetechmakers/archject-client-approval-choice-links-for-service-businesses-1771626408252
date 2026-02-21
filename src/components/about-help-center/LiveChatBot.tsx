import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const quickReplies = [
  'How do I create an approval?',
  'Reset my password',
  'Export records',
  'Contact support',
]

export function LiveChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([])
  const [isBotTyping, setIsBotTyping] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return
    setMessages((m) => [...m, { role: 'user', text: message.trim() }])
    setMessage('')
    setIsBotTyping(true)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: "Thanks for your message! Our support team typically responds within 24 hours. For immediate help, check our Knowledge Base or submit a support ticket.",
        },
      ])
      setIsBotTyping(false)
    }, 600)
  }

  const handleQuickReply = (q: string) => {
    setMessages((m) => [...m, { role: 'user', text: q }])
    setIsBotTyping(true)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: "I've noted your question. For detailed answers, check our Knowledge Base or submit a support ticket. We're here to help!",
        },
      ])
      setIsBotTyping(false)
    }, 500)
  }

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
          'hover:scale-105 transition-transform duration-200',
          'bg-primary text-primary-foreground'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))]',
            'rounded-lg border border-border bg-card shadow-modal',
            'animate-fade-in-up'
          )}
          role="dialog"
          aria-label="Quick help chat"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-body font-semibold text-foreground">Quick help</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto p-4 space-y-3 min-h-[12rem]">
            {messages.length === 0 ? (
              /* Empty state: icon + heading + description + CTA per Design Reference */
              <div
                className="flex flex-col items-center justify-center gap-4 py-6 text-center"
                role="status"
                aria-live="polite"
                aria-label="No messages yet. Start a conversation or choose a topic below."
              >
                <div className="rounded-full bg-muted p-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-body font-medium text-foreground">
                    Start a conversation
                  </p>
                  <p className="text-caption text-muted-foreground max-w-[16rem]">
                    Ask a quick question or choose a topic below to get help.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((q) => (
                    <Button
                      key={q}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleQuickReply(q)}
                      className="rounded-full text-caption h-auto py-1.5 px-3"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-lg px-3 py-2 text-caption',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start" role="status" aria-label="Support is typing">
                    <div className="rounded-lg px-3 py-2 bg-muted">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-background text-foreground placeholder:text-muted-foreground"
              aria-label="Message input"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim() || isBotTyping}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
