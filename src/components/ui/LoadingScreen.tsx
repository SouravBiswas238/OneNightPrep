import { Loader } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader className="h-12 w-12 text-primary animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
        <p className="text-muted-foreground mt-2">
          Preparing your learning environment
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;