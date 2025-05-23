import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button
          onClick={() => navigate('/')}
          iconLeft={<Home className="h-4 w-4 mr-2" />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;