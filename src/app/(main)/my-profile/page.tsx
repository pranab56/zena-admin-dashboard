"use client";

import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaEdit } from "react-icons/fa";
import { FiEye, FiEyeOff, FiMail, FiPhone, FiShield, FiUser } from "react-icons/fi";
import { HiOutlineCalendar } from "react-icons/hi";
import { MdOutlineSecurity } from "react-icons/md";
import { useChangePasswordMutation } from "../../../features/auth/authApi";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "../../../features/profile/profileApi";
import { baseURL } from '../../../utils/BaseURL';

// Interface definitions
interface EditFormData {
  profile: string | File;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

const ProfileSettings = () => {
  const { t } = useTranslation();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

  // API Hooks
  const { data: profileRes, isLoading: isProfileLoading } = useGetMyProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const profileData = profileRes?.data;

  const [editFormData, setEditFormData] = useState<EditFormData>({
    profile: '',
    name: '',
    email: '',
    role: '',
    phoneNumber: '',
  });

  const [previewImage, setPreviewImage] = useState<string>('');

  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });

  // Sync edit form with profile data
  useEffect(() => {
    if (profileData) {
      setEditFormData({
        profile: profileData.image || '',
        name: profileData.name || '',
        email: profileData.email || '',
        role: profileData.role || '',
        phoneNumber: profileData.phoneNumber || '', // Using phoneNumber from common patterns
      });
      setPreviewImage(profileData.image || '');
    }
  }, [profileData]);

  const handleEditProfile = (): void => {
    if (profileData) {
      setEditFormData({
        profile: profileData.image || '',
        name: profileData.name || '',
        email: profileData.email || '',
        role: profileData.role || '',
        phoneNumber: profileData.phoneNumber || '',
      });
      setPreviewImage(profileData.image || '');
    }
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (): Promise<void> => {
    try {
      const formData = new FormData();
      if (editFormData.profile instanceof File) {
        formData.append('image', editFormData.profile);
      }
      formData.append('name', editFormData.name);
      formData.append('email', editFormData.email);
      formData.append('phoneNumber', editFormData.phoneNumber);
      // Role is usually not editable by the user themselves in admin panels, but keeping it as per design
      // formData.append('role', editFormData.role); 

      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        toast.success(res.message || t('profile_updated_success', { defaultValue: 'Profile updated successfully' }));
        setIsEditProfileOpen(false);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || t('failed_to_update_profile', { defaultValue: 'Failed to update profile' }));
    }
  };

  const handleCancelEdit = (): void => {
    setIsEditProfileOpen(false);
  };

  const handleChangePassword = (): void => {
    setIsChangePasswordOpen(true);
  };

  const handleSavePassword = async (): Promise<void> => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error(t('passwords_not_match', { defaultValue: 'New password and confirm password do not match' }));
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      toast.error(t('password_too_short', { defaultValue: 'Password must be at least 6 characters long' }));
      return;
    }

    try {
      const res = await changePassword({
        oldPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || t('password_changed_success', { defaultValue: 'Password changed successfully' }));
        setPasswordFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangePasswordOpen(false);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || t('failed_to_change_password', { defaultValue: 'Failed to change password' }));
    }
  };

  const handleCancelPassword = (): void => {
    setPasswordFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangePasswordOpen(false);
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords): void => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData({ ...editFormData, profile: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isProfileLoading) {
    return <Loading />;
  }


  return (
    <div className="w-full">
      <div className="bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 font-primary tracking-tight">{t('profile_settings')}</h1>
          <p className="text-gray-500 mt-1">{t('manage_account')}</p>
        </div>

        {/* Profile Banner Style Header */}
        <div className="bg-gradient-to-r from-[#A8D5BA]/20 to-[#A8D5BA]/5 rounded-3xl p-6 md:p-10 mb-10 border border-[#A8D5BA]/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Image
                  src={previewImage ? (previewImage.startsWith('data:') ? previewImage : `${baseURL}/${previewImage}`) : '/placeholder.png'}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                />
                <button
                  onClick={handleEditProfile}
                  className="absolute -bottom-2 -end-2 bg-[#A8D5BA] text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <FaEdit size={16} />
                </button>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {profileData?.name || 'User'}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="bg-[#A8D5BA] text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                    {profileData?.role || 'ADMIN'}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${profileData?.status === 'ACTIVE' || profileData?.isOnline ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'} px-3 py-1 rounded-full border border-current opacity-70`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${profileData?.status === 'ACTIVE' || profileData?.isOnline ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    {profileData?.status || (profileData?.isOnline ? 'ONLINE' : 'OFFLINE')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 py-3 px-6 cursor-pointer rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-sm"
              >
                <FaEdit size={14} className="text-[#A8D5BA]" />
                <span>{t('edit_profile')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <FiUser size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t('personal_details')}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ps-1 flex items-center gap-1.5">
                    <FiUser size={10} className="text-[#A8D5BA]" /> {t('full_name')}
                  </label>
                  <div className="bg-gray-50/50 rounded-2xl px-6 py-4.5 text-gray-700 font-semibold border border-gray-100 flex items-center gap-3">
                    {profileData?.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ps-1 flex items-center gap-1.5">
                    <FiMail size={10} className="text-[#A8D5BA]" /> {t('email_address')}
                  </label>
                  <div className="bg-gray-50/50 rounded-2xl px-6 py-4.5 text-gray-700 font-semibold border border-gray-100 text-ellipsis overflow-hidden">
                    {profileData?.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ps-1 flex items-center gap-1.5">
                    <FiPhone size={10} className="text-[#A8D5BA]" /> {t('phone_number')}
                  </label>
                  <div className="bg-gray-50/50 rounded-2xl px-6 py-4.5 text-gray-700 font-semibold border border-gray-100">
                    {profileData?.phoneNumber || t('not_provided')}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ps-1 flex items-center gap-1.5">
                    <FiShield size={10} className="text-[#A8D5BA]" /> {t('last_updated')}
                  </label>
                  <div className="bg-gray-50/50 rounded-2xl px-6 py-4.5 text-gray-700 font-semibold border border-gray-100 flex items-center gap-3">
                    <HiOutlineCalendar className="text-gray-400" />
                    {profileData?.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-8">
            {/* Account Status Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MdOutlineSecurity className="text-[#D45D8A]" /> {t('account_security')}
              </h3>
              <div className="space-y-5">
                <div className="bg-pink-50/50 rounded-2xl p-5 border border-pink-100/50 text-center">
                  <p className="text-sm text-gray-600 mb-4">{t('protect_account')}</p>
                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-[#D45D8A] hover:bg-[#C14C79] text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-100 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {t('update_password')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                {t('refine_your_profile')}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Image
                    src={previewImage ? (previewImage.startsWith('data:') ? previewImage : `${baseURL}/${previewImage}`) : '/placeholder.png'}
                    alt="Profile"
                    width={110}
                    height={110}
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-gray-50 shadow-md group-hover:brightness-90 transition-all"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/40 text-white p-2 rounded-full backdrop-blur-sm">
                      <FaEdit size={20} />
                    </div>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">{t('click_photo_to_change')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ms-1">{t('full_name')}</label>
                  <div className="relative group/input">
                    <FiUser className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#A8D5BA] transition-colors" />
                    <Input
                      placeholder="E.g. Billal Hossan"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl ps-12 py-7 font-semibold focus:ring-[#A8D5BA]/20 focus:border-[#A8D5BA] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ms-1">{t('email')}</label>
                  <div className="relative group/input">
                    <FiMail className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#A8D5BA] transition-colors" />
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl ps-12 py-7 font-semibold focus:ring-[#A8D5BA]/20 focus:border-[#A8D5BA] transition-all"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ms-1">{t('access_level')}</label>
                  <div className="relative group/input">
                    <FiShield className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#A8D5BA] transition-colors" />
                    <Input
                      value={editFormData.role}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl ps-12 py-7 font-semibold focus:ring-[#A8D5BA]/20 focus:border-[#A8D5BA] transition-all grayscale opacity-50"
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ms-1">{t('phone')}</label>
                  <div className="relative group/input">
                    <FiPhone className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#A8D5BA] transition-colors" />
                    <Input
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl ps-12 py-7 font-semibold focus:ring-[#A8D5BA]/20 focus:border-[#A8D5BA] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex md:flex-row flex-col items-center gap-4 pt-4">
                <Button
                  onClick={handleCancelEdit}
                  variant="ghost"
                  className="w-full md:w-auto md:px-10 text-gray-400 hover:text-gray-600 hover:bg-gray-50 py-7 rounded-2xl font-bold transition-all"
                >
                  {t('discard_changes')}
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="w-full md:flex-1 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 py-7 rounded-2xl font-black shadow-[#A8D5BA]/20 shadow-xl transition-all active:scale-[0.98]"
                >
                  {isUpdating ? t('updating') : t('finalize_and_update')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8">
            <DialogHeader className="mb-8">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D45D8A]">
                <MdOutlineSecurity size={30} />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                {t('security_update')}
              </DialogTitle>
              <p className="text-center text-gray-400 text-xs font-semibold mt-1">{t('new_credentials_desc')}</p>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ps-1">{t('current_password')}</label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="············"
                    value={passwordFormData.oldPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, oldPassword: e.target.value })}
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl px-5 py-7 font-bold focus:ring-[#D45D8A]/10 focus:border-[#D45D8A] transition-all"
                  />
                  <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute end-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-500 transition-colors">
                    {showPasswords.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ps-1">{t('new_secure_password')}</label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="············"
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl px-5 py-7 font-bold focus:ring-[#D45D8A]/10 focus:border-[#D45D8A] transition-all"
                  />
                  <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute end-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-500 transition-colors">
                    {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ps-1">{t('confirm_identity')}</label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="············"
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl px-5 py-7 font-bold focus:ring-[#D45D8A]/10 focus:border-[#D45D8A] transition-all"
                  />
                  <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute end-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-500 transition-colors">
                    {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex md:flex-row flex-col items-center gap-4 pt-6">
                <Button
                  onClick={handleCancelPassword}
                  variant="ghost"
                  className="w-full md:w-auto md:px-8 text-gray-400 hover:bg-gray-50 py-7 rounded-2xl font-bold"
                >
                  {t('later')}
                </Button>
                <Button
                  onClick={handleSavePassword}
                  disabled={isChangingPassword}
                  className="w-full md:flex-1 bg-[#D45D8A] hover:bg-[#C14C79] text-white py-7 rounded-2xl font-black shadow-[#D45D8A]/20 shadow-xl transition-all active:scale-[0.98]"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('updating')}
                    </span>
                  ) : t('update_now')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;