import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, verifyEmail, sendVerificationEmail, error, clearError } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setOtpError('');
    clearError();
    
    // Validate OTP
    if (!otp.trim()) {
      setOtpError('OTP is required');
      isValid = false;
    } else if (otp.length < 4) {
      setOtpError('OTP must be at least 4 characters');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await verifyEmail(otp);
      setVerificationSuccess(true);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Email verification failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      await sendVerificationEmail();
      setResendSuccess(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to resend verification code:', err);
    } finally {
      setIsResending(false);
    }
  };

  if (verificationSuccess) {
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
              Email Verified!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Your email has been successfully verified. You can now access all features.
            </p>
          </div>
          <div className="mt-6">
            <Button
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Verify Your Email</h1>
          <p className="mt-2 text-muted-foreground">
            Enter the verification code sent to your email
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {resendSuccess && (
          <div className="bg-success/10 text-success p-3 rounded-md">
            <p>Verification code resent successfully. Please check your inbox.</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              We sent a code to <span className="font-medium text-foreground">{user?.email}</span>
            </div>
            
            <Input
              id="otp"
              type="text"
              label="Verification Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              icon={<Key className="h-5 w-5" />}
              error={otpError}
            />
            
            <div className="text-right">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                loading={isResending}
                disabled={resendSuccess}
              >
                Resend Code
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Verify Email
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            className="inline-flex items-center text-sm font-medium text-primary"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;