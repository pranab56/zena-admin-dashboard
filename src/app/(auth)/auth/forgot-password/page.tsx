"use client";


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ForgotEmailResponse {
  message?: string;
  data?: {
    forgetToken: string;
  };
}

interface ApiError {
  data?: {
    message?: string;
  };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (): Promise<void> => {
    setError('');

    // Validation
    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Your API call would go here
      // const response = await forgotEmail({ email: email }).unwrap() as ForgotEmailResponse;

      // Show success state
      setIsSuccess(true);

      // Simulate redirect after success
      setTimeout(() => {
        alert('OTP sent! Redirecting to verification page...');
        // router.push(`/auth/verify-email?forgetToken=${response.data?.forgetToken}`);
      }, 1000);

      setIsLoading(false);
    } catch (error) {
      const apiError = error as ApiError;
      console.log('Forgot password error:', error);
      setError(apiError?.data?.message || 'Failed to send OTP. Please try again.');
      setIsSuccess(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-green-50 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>

      {/* Forgot Password Form - Centered */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md p-10 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-green-400 mb-2">Forgot Password?</h1>
            <h2 className="text-xl font-medium text-gray-700 mb-3">Don't worry, we've got you covered!</h2>
            <p className="text-sm text-gray-600">
              Enter your registered email address and we'll send you<br />an OTP to reset your password
            </p>
          </div>

          {/* Forgot Password Form */}
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-normal">
                Email Address<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                  setIsSuccess(false);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email address here..."
                disabled={isSuccess}
                className={`mt-2 h-12 ${error ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-green-400 disabled:opacity-70 disabled:cursor-not-allowed`}
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
              )}
            </div>

            {/* Send OTP Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || isSuccess || !email}
              className="w-full bg-green-300 hover:bg-green-400 text-gray-800 font-medium h-12 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending OTP...' : isSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  OTP Sent
                </span>
              ) : 'Send OTP'}
            </Button>

            {/* Success Message */}
            {isSuccess && (
              toast.success('OTP sent! Redirecting to verification page...')
            )}

            {/* Back to Login Link */}
            <div className="text-center text-sm text-gray-600 mt-2 pt-4 border-t border-gray-200">
              Remember your password?{' '}
              <a
                href="/auth/login"
                className="text-pink-500 hover:text-pink-600 font-medium"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}