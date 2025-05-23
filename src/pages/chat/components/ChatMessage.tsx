import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Message } from '../../../lib/types';
import { cn } from '../../../lib/utils';

interface ChatMessageProps {
  message: Message;
  onCopy: () => void;
}

const ChatMessage = ({ message, onCopy }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg animate-in',
        message.isUser ? 'chat-message-user' : 'chat-message-ai'
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center mb-2">
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-2',
              message.isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            {message.isUser ? 'U' : 'AI'}
          </div>
          <span className="font-medium">
            {message.isUser ? 'You' : 'AI Assistant'}
          </span>
        </div>
        
        {!message.isUser && (
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Copy message"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      
      <div className="ml-9 prose dark:prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={nord}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline hover:no-underline"
              />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;