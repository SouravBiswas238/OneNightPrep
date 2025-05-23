import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, Plus, FolderPlus, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { chatAPI, folderAPI, pdfAPI } from '../../lib/api';
import { Session, Folder, PDFDocument } from '../../lib/types';
import { formatDate, truncateText } from '../../lib/utils';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalFolders: 0,
    totalPdfs: 0,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sessions
        const sessionsResponse = await chatAPI.getSessions();
        const allSessions = sessionsResponse.data;
        
        // Sort sessions by date and take the 5 most recent
        const sortedSessions = [...allSessions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentSessions(sortedSessions.slice(0, 5));
        
        // Fetch folders
        const folderResponse = await folderAPI.getFolders();
        setFolders(folderResponse.data);
        
        // Fetch PDFs
        const pdfResponse = await pdfAPI.getPDFs();
        setPdfs(pdfResponse.data);
        
        // Set stats
        setStats({
          totalSessions: allSessions.length,
          totalFolders: folderResponse.data.length,
          totalPdfs: pdfResponse.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const createNewChat = async () => {
    try {
      const name = `Chat ${new Date().toLocaleString()}`;
      const response = await chatAPI.createSession(name);
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const createNewFolder = async () => {
    try {
      const name = `Folder ${new Date().toLocaleTimeString()}`;
      await folderAPI.createFolder(name);
      // Refresh folders
      const folderResponse = await folderAPI.getFolders();
      setFolders(folderResponse.data);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const response = await pdfAPI.uploadPDF(file);
      navigate(`/pdf/${response.data.id}`);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const Greeting = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 18) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
    
    return greeting;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {Greeting()}, {user?.name || 'Learner'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your AI learning dashboard
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            onClick={createNewChat}
            iconLeft={<MessageSquare className="h-4 w-4" />}
          >
            New Chat
          </Button>
          
          <Button
            variant="outline"
            onClick={() => document.getElementById('dashboard-pdf-upload')?.click()}
            iconLeft={<FileText className="h-4 w-4" />}
          >
            Upload PDF
          </Button>
          <input
            id="dashboard-pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Total Sessions</h3>
            <div className="p-2 bg-primary/10 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.totalSessions}</p>
          <p className="text-muted-foreground text-sm mt-1">Conversations with AI</p>
        </div>
        
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Folders</h3>
            <div className="p-2 bg-secondary/10 rounded-full">
              <FolderPlus className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.totalFolders}</p>
          <p className="text-muted-foreground text-sm mt-1">Organized collections</p>
        </div>
        
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">PDF Documents</h3>
            <div className="p-2 bg-accent/10 rounded-full">
              <FileText className="h-5 w-5 text-accent" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.totalPdfs}</p>
          <p className="text-muted-foreground text-sm mt-1">Uploaded study materials</p>
        </div>
      </div>
      
      {/* Recent Sessions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Conversations</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/chat')}
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* New Chat Card */}
          <div 
            className="bg-card hover:bg-accent/5 border border-border rounded-lg p-4 cursor-pointer transition-colors flex flex-col justify-center items-center h-40"
            onClick={createNewChat}
          >
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Start New Chat</h3>
            <p className="text-sm text-muted-foreground mt-1">Begin a new conversation</p>
          </div>
          
          {/* Recent sessions */}
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 h-40">
                <div className="animate-pulse flex flex-col h-full">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="flex-grow"></div>
                  <div className="h-3 bg-muted rounded w-1/4 mt-2"></div>
                </div>
              </div>
            ))
          ) : recentSessions.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center h-40 col-span-2">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recent conversations</p>
              <p className="text-sm text-muted-foreground mt-1">Start a new chat to begin learning</p>
            </div>
          ) : (
            recentSessions.map((session) => (
              <div 
                key={session.id}
                className="bg-card hover:bg-accent/5 border border-border rounded-lg p-4 cursor-pointer transition-colors"
                onClick={() => navigate(`/chat/${session.folderId || ''}/${session.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{truncateText(session.name, 30)}</h3>
                    {session.lastMessage && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {truncateText(session.lastMessage, 50)}
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(session.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Documents & Folders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Folders */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Folders</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={createNewFolder}
            >
              Add Folder
            </Button>
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 border-b border-border last:border-0">
                  <div className="animate-pulse flex items-center">
                    <div className="rounded-full bg-muted h-10 w-10 mr-4"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : folders.length === 0 ? (
              <div className="p-8 text-center">
                <FolderPlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No folders yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create folders to organize your chats
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={createNewFolder}
                >
                  Create Folder
                </Button>
              </div>
            ) : (
              folders.map((folder, index) => (
                <div 
                  key={folder.id}
                  className={`p-4 flex items-center justify-between hover:bg-accent/5 cursor-pointer ${
                    index !== folders.length - 1 ? 'border-b border-border' : ''
                  }`}
                  onClick={() => navigate(`/folders/${folder.id}`)}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-secondary/10 rounded-md mr-3">
                      <FolderPlus className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{folder.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {folder.sessionCount || 0} {folder.sessionCount === 1 ? 'chat' : 'chats'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(folder.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* PDF Documents */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">PDF Documents</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('dashboard-pdf-upload')?.click()}
            >
              Upload PDF
            </Button>
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 border-b border-border last:border-0">
                  <div className="animate-pulse flex items-center">
                    <div className="rounded-md bg-muted h-10 w-10 mr-4"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : pdfs.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No documents yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload PDFs to ask questions about them
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById('dashboard-pdf-upload')?.click()}
                >
                  Upload PDF
                </Button>
              </div>
            ) : (
              pdfs.map((pdf, index) => (
                <div 
                  key={pdf.id}
                  className={`p-4 flex items-center justify-between hover:bg-accent/5 cursor-pointer ${
                    index !== pdfs.length - 1 ? 'border-b border-border' : ''
                  }`}
                  onClick={() => navigate(`/pdf/${pdf.id}`)}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-accent/10 rounded-md mr-3">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">{truncateText(pdf.name, 30)}</h3>
                      <p className="text-xs text-muted-foreground">
                        Uploaded on {formatDate(pdf.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;