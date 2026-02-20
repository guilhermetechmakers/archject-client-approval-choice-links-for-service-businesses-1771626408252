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

  const handleSend = () => {
    if (!message.trim()) return
    setMessages((m) => [...m, { role: 'user', text: message.trim() }])
    setMessage('')
    // Simulate bot response
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: "Thanks for your message! Our support team typically responds within 24 hours. For immediate help, check our Knowledge Base or submit a support ticket.",
        },
      ])
    }, 600)
  }

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
          'hover:scale-105 transition-transform',
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
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-body font-semibold">Quick help</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Ask a quick question or choose a topic:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setMessages((m) => [...m, { role: 'user', text: q }])
                        setTimeout(() => {
                          setMessages((m) => [
                            ...m,
                            {
                              role: 'bot',
                              text: "I've noted your question. For detailed answers, check our Knowledge Base or submit a support ticket. We're here to help!",
                            },
                          ])
                        }, 500)
                      }}
                      className="text-caption px-3 py-1.5 rounded-full bg-accent hover:bg-accent/80 text-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
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
              ))
            )}
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
