import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { requestPasswordReset, error, clearError } = useAuth();

  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setEmailError('');
    clearError();
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      setSuccessMessage(`Password reset instructions sent to ${email}. Please check your inbox.`);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Password reset request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Forgot Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-success/10 text-success p-3 rounded-md">
            <p>{successMessage}</p>
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
              disabled={!!successMessage}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={!!successMessage}
          >
            Reset Password
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="flex items-center justify-center text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;