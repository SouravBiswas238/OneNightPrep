import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { resetPassword, error, clearError } = useAuth();

  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setPasswordError('');
    setConfirmPasswordError('');
    clearError();
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await resetPassword(token, password);
      setResetSuccess(true);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Password reset failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg animate-fade-in">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success/20 text-success">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>
          <div className="mt-6">
            <Button
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Invalid Request</h1>
            <p className="mt-2 text-muted-foreground">
              Missing required parameters. Please try again from the forgot password page.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => navigate('/forgot-password')}
          >
            Back to Forgot Password
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your new password
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
              id="password"
              type="password"
              label="New Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
              error={passwordError}
            />
            
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
              error={confirmPasswordError}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;