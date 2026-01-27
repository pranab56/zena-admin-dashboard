"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface ApiError {
  data?: {
    message?: string;
  };
}



export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [otpMatchLoading, setOtpMatchLoading] = useState<boolean>(false);
  const [resendOtpLoading, setResendOtpLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Simulated token - in real app, get from URL params
  const forgetToken = 'demo-forget-token-12345';

  // Fixed ref callback
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Submit on Enter if OTP is complete
    if (e.key === 'Enter' && otp.join('').length === 6) {
      handleSubmit();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle submit
  const handleSubmit = async (): Promise<void> => {
    setError('');

    const otpValue = otp.join('');

    // Validation for 6 digits
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (!forgetToken) {
      setError('Invalid token. Please try again.');
      return;
    }

    try {
      setOtpMatchLoading(true);

      console.log('Verifying OTP:', { otp: otpValue, token: forgetToken });

      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpMatchLoading(false);

      // Simulate redirect
      // router.push(`/auth/reset-password?forgetOtpMatchToken=${response.data?.forgetOtpMatchToken}`);
      router.push('/auth/reset-password');

    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError?.data?.message || 'OTP verification failed!');
      setOtpMatchLoading(false);
    }
  };

  // Handle resend
  const handleResend = async (): Promise<void> => {
    if (!forgetToken) {
      alert('Invalid token. Please try again.');
      return;
    }

    try {
      setResendOtpLoading(true);

      console.log('Resending OTP for token:', forgetToken);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Your API call would go here
      // const response = await resendOtp(forgetToken).unwrap() as ResetPasswordResponse;

      alert('OTP resent successfully!');
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();

      setResendOtpLoading(false);
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError?.data?.message || 'Failed to resend OTP');
      setResendOtpLoading(false);
    }
  };

  const isLoading = otpMatchLoading || resendOtpLoading;

  return (
    <div className="flex min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-green-50 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>

      {/* Verification Form - Centered */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-lg px-6 py-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
          {/* Icon & Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-green-400 mb-2">Account Recovery</h1>
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">Verify Your Identity</h2>
            <p className="text-sm text-gray-600 mb-4 px-2 sm:px-0">
              To help keep your account safe, we need to make sure it&apos;s really you trying to sign in
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-gray-700 mb-1 font-semibold">Get a Verification Code</p>
              <p className="text-xs text-gray-600">
                We&apos;ve sent a 6-digit code to{' '}
                <span className="font-semibold text-gray-800">*********@example.com</span>
              </p>
            </div>
          </div>

          {/* OTP Form */}
          <div className="space-y-6">
            {/* OTP Input Fields - 6 inputs */}
            <div>
              <div className="flex justify-center gap-1 sm:gap-2 mb-4">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={setInputRef(index)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold border-2 ${error ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-400 transition-all`}
                  />
                ))}
              </div>
              {error && (
                <p className="text-center text-sm text-red-500 mb-2">{error}</p>
              )}
              <p className="text-center text-xs text-gray-500">
                Enter the 6-digit verification code
              </p>
            </div>

            {/* Verify Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !forgetToken || otp.join('').length !== 6}
              className="w-full bg-green-300 hover:bg-green-400 text-gray-800 font-medium h-12 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpMatchLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            {/* Resend Link */}
            <div className="text-center text-sm text-gray-600 flex items-center justify-center gap-2">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendOtpLoading || !forgetToken}
                className="text-pink-500 hover:text-pink-600 font-medium underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                {resendOtpLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
              <a
                href="/auth/login"
                className="text-pink-500 hover:text-pink-600 font-medium"
              >
                ← Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}