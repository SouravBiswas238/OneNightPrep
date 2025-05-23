import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Info, MoreVertical, Folder, Edit, Trash, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import ChatMessage from './components/ChatMessage';
import ChatTypingIndicator from './components/ChatTypingIndicator';
import ChatWelcome from './components/ChatWelcome';
import { chatAPI, folderAPI } from '../../lib/api';
import { Message, Session, Folder as FolderType } from '../../lib/types';
import { copyToClipboard } from '../../lib/utils';

const ChatPage = () => {
  const { folderId, sessionId } = useParams<{ folderId?: string; sessionId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [folder, setFolder] = useState<FolderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Create a new session if none exists
  useEffect(() => {
    const createNewSession = async () => {
      try {
        if (!sessionId) {
          const name = `Chat ${new Date().toLocaleString()}`;
          const response = await chatAPI.createSession(name, folderId);
          navigate(`/chat/${folderId || ''}/${response.data.id}`);
        }
      } catch (error) {
        console.error('Error creating new session:', error);
      }
    };
    
    createNewSession();
  }, [sessionId, folderId, navigate]);

  // Fetch session data, messages, and folder (if applicable)
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        
        // Get session details
        const sessionResponse = await chatAPI.getSession(sessionId);
        setSession(sessionResponse.data);
        setNewTitle(sessionResponse.data.name);
        
        // Get messages
        const messagesResponse = await chatAPI.getMessages(sessionId);
        setMessages(messagesResponse.data);
        
        // If in a folder, get folder details
        if (folderId) {
          const folderResponse = await folderAPI.getFolders();
          const currentFolder = folderResponse.data.find(f => f.id === folderId);
          if (currentFolder) {
            setFolder(currentFolder);
          }
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionData();
  }, [sessionId, folderId]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle click outside options menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sending a message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;
    
    try {
      setSending(true);
      
      // Optimistically add user message to UI
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        content: inputMessage,
        isUser: true,
        createdAt: new Date().toISOString(),
        sessionId: sessionId,
      };
      
      setMessages([...messages, tempUserMessage]);
      setInputMessage('');
      
      // Send message to API
      const response = await chatAPI.sendMessage(sessionId, inputMessage);
      
      // Replace temp message with real one and add AI response
      setMessages(prev => 
        [...prev.filter(m => m.id !== tempUserMessage.id), response.data.userMessage, response.data.aiMessage]
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temporary message on error
      setMessages(prev => prev.filter(m => m.id !== `temp-${Date.now()}`));
    } finally {
      setSending(false);
    }
  };

  // Handle input keypress
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Reset height to auto to properly calculate the new height
    e.target.style.height = 'auto';
    // Set the height to scrollHeight to fit the content
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Update session title
  const updateSessionTitle = async () => {
    if (!sessionId || !newTitle.trim()) return;
    
    try {
      await chatAPI.updateSession(sessionId, { name: newTitle });
      setSession(prev => prev ? { ...prev, name: newTitle } : null);
      setEditingTitle(false);
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  // Delete session
  const deleteSession = async () => {
    if (!sessionId) return;
    
    if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      try {
        await chatAPI.deleteSession(sessionId);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  // Export chat as markdown
  const exportChat = () => {
    if (!session || messages.length === 0) return;
    
    let markdown = `# ${session.name}\n\n`;
    markdown += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    messages.forEach(message => {
      markdown += `## ${message.isUser ? 'You' : 'AI'}\n\n`;
      markdown += `${message.content}\n\n`;
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if there are any messages
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-card">
        <div className="flex items-center">
          {folder && (
            <div className="flex items-center text-muted-foreground mr-2">
              <Folder className="h-4 w-4 mr-1" />
              <span className="text-sm">{folder.name}</span>
              <span className="mx-2">/</span>
            </div>
          )}
          
          {editingTitle ? (
            <div className="flex items-center">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border-b border-primary bg-transparent px-1 mr-2 focus:outline-none"
                autoFocus
                onBlur={updateSessionTitle}
                onKeyDown={(e) => e.key === 'Enter' && updateSessionTitle()}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={updateSessionTitle}
              >
                Save
              </Button>
            </div>
          ) : (
            <h1 className="text-lg font-medium truncate max-w-[200px] sm:max-w-md">
              {session?.name || 'New Chat'}
            </h1>
          )}
        </div>
        
        <div className="relative" ref={optionsRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border z-10">
              <div className="py-1">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent/10"
                  onClick={() => {
                    setEditingTitle(true);
                    setShowOptions(false);
                    setTimeout(() => document.querySelector('input')?.focus(), 100);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Rename Chat
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent/10"
                  onClick={() => {
                    exportChat();
                    setShowOptions(false);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Chat
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    deleteSession();
                    setShowOptions(false);
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isEmpty && !loading ? (
          <ChatWelcome />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onCopy={() => copyToClipboard(message.content)}
              />
            ))}
            {sending && <ChatTypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Chat input */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-start">
          <div className="relative flex-1 overflow-hidden rounded-lg border border-input focus-within:ring-1 focus-within:ring-ring bg-background">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              className="max-h-[200px] min-h-[56px] w-full resize-none border-0 bg-transparent px-3.5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              rows={1}
              disabled={sending}
              autoFocus
            />
          </div>
          
          <Button
            className="ml-2 flex-shrink-0"
            disabled={!inputMessage.trim() || sending}
            onClick={sendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          <span>
            AI responses are AI-generated. Provide specific questions for more accurate answers.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;