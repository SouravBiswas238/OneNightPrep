import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, googleLogin, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    clearError();
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(from);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      // Redirect is handled by the API
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" />}
              error={emailError}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
              error={passwordError}
            />
          </div>
          
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            iconRight={<LogIn className="h-5 w-5" />}
          >
            Sign in
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#FFC107"
                />
                <path
                  d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
                  fill="#FF3D00"
                />
                <path
                  d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z"
                  fill="#4CAF50"
                />
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#1976D2"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;