import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  LogOut, 
  Moon, 
  Plus, 
  Settings, 
  Sun, 
  User, 
  Folder, 
  ChevronDown, 
  ChevronRight,
  MessageSquare, 
  Upload 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import { folderAPI, chatAPI, pdfAPI } from '../../lib/api';
import { Folder as FolderType, Session, PDFDocument } from '../../lib/types';
import { truncateText } from '../../lib/utils';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [folders, setFolders] = useState<FolderType[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState({
    folders: true,
    pdfs: true,
  });
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch folders
        const folderResponse = await folderAPI.getFolders();
        setFolders(folderResponse.data);
        
        // Initialize expanded state for folders
        const initialExpandedState = folderResponse.data.reduce(
          (acc, folder) => ({ ...acc, [folder.id]: false }),
          {}
        );
        setExpandedFolders(initialExpandedState);
        
        // Fetch sessions
        const sessionResponse = await chatAPI.getSessions();
        setSessions(sessionResponse.data);
        
        // Fetch PDFs
        const pdfResponse = await pdfAPI.getPDFs();
        setPdfs(pdfResponse.data);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSection = (section: 'folders' | 'pdfs') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId],
    });
  };

  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) return;
      
      const response = await folderAPI.createFolder(newFolderName);
      setFolders([...folders, response.data]);
      setExpandedFolders({
        ...expandedFolders,
        [response.data.id]: true,
      });
      
      // Reset form
      setNewFolderName('');
      setIsCreatingFolder(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const createNewChat = async (folderId?: string) => {
    try {
      const name = `Chat ${new Date().toLocaleString()}`;
      const response = await chatAPI.createSession(name, folderId);
      setSessions([...sessions, response.data]);
      navigate(`/chat/${folderId || ''}/${response.data.id}`);
      closeSidebar(); // Close sidebar on mobile
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await pdfAPI.uploadPDF(file);
      setPdfs([...pdfs, response.data]);
      navigate(`/pdf/${response.data.id}`);
      closeSidebar(); // Close sidebar on mobile
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">One Night Preparation</h1>
        <p className="text-sm text-muted-foreground">AI Learning Assistant</p>
      </div>
      
      {/* Actions */}
      <div className="p-3 space-y-2">
        <Button 
          className="w-full justify-start"
          onClick={() => createNewChat()}
          iconLeft={<MessageSquare className="h-4 w-4" />}
        >
          New Chat
        </Button>
        
        <Button 
          className="w-full justify-start"
          variant="outline"
          iconLeft={<Upload className="h-4 w-4" />}
          onClick={() => document.getElementById('pdf-upload')?.click()}
        >
          Upload PDF
        </Button>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Folders Section */}
        <div className="mb-4">
          <div 
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/50 rounded-md"
            onClick={() => toggleSection('folders')}
          >
            <div className="flex items-center">
              {expandedSections.folders ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">Folders</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsCreatingFolder(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {expandedSections.folders && (
            <div className="ml-2">
              {isCreatingFolder && (
                <div className="flex items-center p-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="ml-2"
                    onClick={handleCreateFolder}
                  >
                    Save
                  </Button>
                </div>
              )}
              
              {folders.length === 0 && !loading ? (
                <div className="text-sm text-muted-foreground p-2">
                  No folders yet. Create one to organize your chats.
                </div>
              ) : (
                folders.map((folder) => (
                  <div key={folder.id} className="mb-1">
                    <div 
                      className="flex items-center p-2 cursor-pointer hover:bg-muted/50 rounded-md"
                      onClick={() => toggleFolder(folder.id)}
                    >
                      {expandedFolders[folder.id] ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      <Folder className="h-4 w-4 mr-2" />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    
                    {expandedFolders[folder.id] && (
                      <div className="ml-8">
                        {sessions
                          .filter((session) => session.folderId === folder.id)
                          .map((session) => (
                            <NavLink
                              key={session.id}
                              to={`/chat/${folder.id}/${session.id}`}
                              className={({ isActive }) =>
                                `flex items-center p-2 text-sm rounded-md ${
                                  isActive
                                    ? 'bg-accent text-accent-foreground'
                                    : 'hover:bg-muted/50'
                                }`
                              }
                              onClick={closeSidebar}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {truncateText(session.name, 20)}
                            </NavLink>
                          ))}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start mt-1 text-muted-foreground"
                          onClick={() => createNewChat(folder.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          New Chat
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {/* Ungrouped sessions */}
              <div className="mt-2">
                {sessions
                  .filter((session) => !session.folderId)
                  .map((session) => (
                    <NavLink
                      key={session.id}
                      to={`/chat/${session.id}`}
                      className={({ isActive }) =>
                        `flex items-center p-2 text-sm rounded-md ${
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted/50'
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {truncateText(session.name, 20)}
                    </NavLink>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        {/* PDFs Section */}
        <div className="mb-4">
          <div 
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/50 rounded-md"
            onClick={() => toggleSection('pdfs')}
          >
            <div className="flex items-center">
              {expandedSections.pdfs ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">PDF Documents</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('pdf-upload')?.click();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {expandedSections.pdfs && (
            <div className="ml-2">
              {pdfs.length === 0 && !loading ? (
                <div className="text-sm text-muted-foreground p-2">
                  No PDFs yet. Upload a document to start learning.
                </div>
              ) : (
                pdfs.map((pdf) => (
                  <NavLink
                    key={pdf.id}
                    to={`/pdf/${pdf.id}`}
                    className={({ isActive }) =>
                      `flex items-center p-2 text-sm rounded-md ${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted/50'
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {truncateText(pdf.name, 25)}
                  </NavLink>
                ))
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            iconLeft={<User className="h-4 w-4" />}
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            iconLeft={<Settings className="h-4 w-4" />}
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            iconLeft={<LogOut className="h-4 w-4" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;