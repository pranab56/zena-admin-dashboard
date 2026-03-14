"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLoginMutation } from '@/features/auth/authApi';
import { setToken } from '@/features/auth/authSlice';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

interface LoginFormData {
  email: string;
  password: string;
  role: string;
}

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'ADMIN'
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email: string; password: string; role: string }>({
    email: '',
    password: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newErrors = { email: '', password: '', role: '' };

    // Validation
    if (!formData.email) {
      newErrors.email = t('email_required', { defaultValue: 'Email address is required' });
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('email_invalid', { defaultValue: 'Please enter a valid email address' });
    }

    if (!formData.password) {
      newErrors.password = t('password_required', { defaultValue: 'Password is required' });
    } else if (formData.password.length < 6) {
      newErrors.password = t('password_min_length', { defaultValue: 'Password must be at least 6 characters' });
    }

    if (!formData.role) {
      newErrors.role = t('role_required', { defaultValue: 'Role is required' });
    }

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!newErrors.email && !newErrors.password && !newErrors.role) {
      try {
        setIsLoading(true);
        const response = await login(formData).unwrap();

        if (response.success) {
          toast.success(response.message || t('login_success', { defaultValue: 'Login successful' }));
          dispatch(setToken(response.data.accessToken));
          localStorage.setItem('role', response.data.user.role);

          if (response.data.user.role === 'SUPER_ADMIN') {
            router.push('/overview');
          } else {
            router.push('/');
          }
        }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        console.log('Login error:', error);
        toast.error(err?.data?.message || t('login_failed', { defaultValue: 'Login failed! Please check your credentials.' }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isFormValid = formData.email.length > 0 &&
    formData.password.length > 0 &&
    formData.role.length > 0 &&
    !errors.email &&
    !errors.password &&
    !errors.role;

  return (
    <div className="flex min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-green-50 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>

      {/* Login Form - Centered */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-lg px-6 py-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-green-400 mb-2">{t('welcome_title')}</h1>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mb-3">{t('to_dashboard')}</h2>
            <p className="text-sm text-gray-600 px-2 sm:px-0">
              {t('sign_in_desc')}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-normal">
                {t('email')}<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="leonardo.leo@gmail.com"
                className={`mt-2 h-12 ${errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-green-400`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className='w-full'>
              <Label htmlFor="role" className="text-gray-700 font-normal">
                {t('role')}
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => {
                  setFormData({ ...formData, role: value });
                  if (errors.role) setErrors({ ...errors, role: '' });
                }}
              >
                <SelectTrigger
                  className={`mt-2 cursor-pointer h-12 py-6 w-full ${errors.role ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-0 focus:ring-green-400`}
                >
                  <SelectValue placeholder={t('select_role')} />
                </SelectTrigger>
                <SelectContent className=''>
                  <SelectItem value="ADMIN">{t('admin')}</SelectItem>
                  <SelectItem value="SUPER_ADMIN">{t('super_admin')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-normal">
                {t('password')}<span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="············"
                  className={`h-12 pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-green-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer  text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}

              {/* Forgot Password */}
              <div className="text-right mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-secondary hover:text-pink-600 hover:decoration-2 font-normal"
                >
                  {t('forgot_password')}
                </Link>
              </div>
            </div>

            {/* Role Field */}


            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-green-300 hover:bg-green-400 text-gray-800 font-medium h-12 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              {isLoading ? t('logging_in') : t('login')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
