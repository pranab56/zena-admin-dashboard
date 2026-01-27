"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ApiError {
  data?: {
    message?: string;
  };
}


interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ newPassword: string; confirmPassword: string }>({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulated token - in real app, get from URL params
  const forgetToken = 'demo-token-12345';

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors = { newPassword: '', confirmPassword: '' };

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    // If no errors, proceed with password reset
    if (!newErrors.newPassword && !newErrors.confirmPassword) {
      if (!forgetToken) {
        alert('Invalid or missing token. Please try again.');
        return;
      }

      try {
        setIsLoading(true);

        const resetData: ResetPasswordData = {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          token: forgetToken
        };

        console.log('Reset data:', resetData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Your API call would go here
        // const response = await resetPassword(resetData).unwrap() as ResetPasswordResponse;

        alert('Password reset successful! Redirecting to login...');

        // Clear form fields
        setNewPassword('');
        setConfirmPassword('');

        setIsLoading(false);

        // Redirect to login after a brief delay
        setTimeout(() => {
          // router.push('/auth/login');
          console.log('Redirecting to login...');
        }, 1500);

      } catch (error) {
        console.log('Reset password error:', error);
        const apiError = error as ApiError;
        alert(apiError?.data?.message || 'Password reset failed!');
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Check if form is valid for button state
  const isFormValid = newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    !errors.newPassword &&
    !errors.confirmPassword;

  // Password strength indicators
  const passwordChecks = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: 'One lowercase letter', valid: /(?=.*[a-z])/.test(newPassword) },
    { label: 'One uppercase letter', valid: /(?=.*[A-Z])/.test(newPassword) },
    { label: 'One number', valid: /(?=.*\d)/.test(newPassword) }
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-green-50 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>

      {/* Reset Password Form - Centered */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-lg px-6 py-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-green-400 mb-2">Create New Password</h1>
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">Secure Your Account</h2>
            <p className="text-sm text-gray-600 px-2 sm:px-0">
              To help keep your account safe, create a strong password that meets all the requirements below
            </p>
          </div>

          {/* Reset Password Form */}
          <div className="space-y-5">
            {/* New Password Field */}
            <div>
              <Label htmlFor="newPassword" className="text-gray-700 font-semibold">
                New Password<span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-2">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your new password here..."
                  className={`h-12 pr-12 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-green-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                Confirm New Password<span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your confirm new password here..."
                  className={`h-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-green-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-linear-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-gray-700 mb-3">Password must contain:</p>
              <ul className="space-y-2">
                {passwordChecks.map((check, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs">
                    {check.valid ? (
                      <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    ) : (
                      <Circle size={16} className="text-gray-400 shrink-0" />
                    )}
                    <span className={check.valid ? 'text-green-700 font-medium' : 'text-gray-600'}>
                      {check.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Change Password Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid || !forgetToken}
              className="w-full bg-green-300 hover:bg-green-400 text-gray-800 font-medium h-12 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center text-sm text-gray-600  pt-4 border-t border-gray-200">
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