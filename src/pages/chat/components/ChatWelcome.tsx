import { BookOpen, Lightbulb, FileText } from 'lucide-react';

const ChatWelcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center px-4 -mt-16">
      <div className="p-4 bg-secondary/10 rounded-full mb-6">
        <BookOpen className="h-12 w-12 text-secondary" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Welcome to Your AI Assistant</h1>
      <p className="text-muted-foreground mb-8">
        I'm here to help you learn and answer your questions. What would you like to know today?
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="bg-card border border-border rounded-lg p-4 text-left">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-primary/10 rounded-full mr-3">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Example Questions</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary cursor-pointer">"Explain quantum computing in simple terms"</li>
            <li className="hover:text-primary cursor-pointer">"How does photosynthesis work?"</li>
            <li className="hover:text-primary cursor-pointer">"What is the significance of the Pythagorean theorem?"</li>
          </ul>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 text-left">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-accent/10 rounded-full mr-3">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-medium">Document Queries</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary cursor-pointer">"Summarize key points from my uploaded document"</li>
            <li className="hover:text-primary cursor-pointer">"What are the main arguments in chapter 3?"</li>
            <li className="hover:text-primary cursor-pointer">"Find all references to climate change in my PDF"</li>
          </ul>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-8">
        Remember: I'm an AI assistant and may occasionally make mistakes. Always verify critical information.
      </p>
    </div>
  );
};

export default ChatWelcome;