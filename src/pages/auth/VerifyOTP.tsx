import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Key, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { verifyOTP, error, clearError } = useAuth();

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
      await verifyOTP(email, otp);
      // After successful verification, redirect to reset password page
      navigate(`/reset-password?email=${email}&token=${otp}`);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('OTP verification failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Invalid Request</h1>
            <p className="mt-2 text-muted-foreground">
              Missing email parameter. Please try again from the forgot password page.
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
          <h1 className="text-3xl font-bold text-foreground">Verify OTP</h1>
          <p className="mt-2 text-muted-foreground">
            Enter the one-time password sent to your email
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
            <div className="text-sm text-muted-foreground">
              We sent a code to <span className="font-medium text-foreground">{email}</span>
            </div>
            
            <Input
              id="otp"
              type="text"
              label="One-Time Password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              icon={<Key className="h-5 w-5" />}
              error={otpError}
              autoFocus
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Verify OTP
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            className="inline-flex items-center text-sm font-medium text-primary"
            onClick={() => navigate('/forgot-password')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Forgot Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;