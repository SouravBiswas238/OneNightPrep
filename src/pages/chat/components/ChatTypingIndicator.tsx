const ChatTypingIndicator = () => {
  return (
    <div className="p-4 rounded-lg chat-message-ai animate-in">
      <div className="flex items-center mb-2">
        <div className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-medium mr-2">
          AI
        </div>
        <span className="font-medium">AI Assistant</span>
      </div>
      
      <div className="ml-9 flex items-center">
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-secondary animate-loader" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-secondary animate-loader" style={{ animationDelay: '300ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-secondary animate-loader" style={{ animationDelay: '600ms' }}></div>
        </div>
        <span className="ml-2 text-sm text-muted-foreground">AI is thinking...</span>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;