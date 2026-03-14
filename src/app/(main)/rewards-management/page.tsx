"use client";
import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAllRewardQuery, useCreateRewardMutation, useUpdateRewardMutation } from '@/features/admin/reward/rewardApi';
import { baseURL } from '@/utils/BaseURL';
import { FilePenLine, ImageIcon, Loader2, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface Reward {
  _id: string;
  rewardName: string;
  rewardPoints: number;
  description: string;
  rewardStatus: boolean;
  rewardImage: string;
  service: string;
  whatsIncluded: string[];
  redemptionPolicy: string;
}

interface FormData {
  name: string;
  points: string;
  category: string;
  description: string;
  included: string;
  policy: string;
}

export default function LoyaltyRewards() {
  const { t } = useTranslation();
  const { data: apiResponse, isLoading, refetch } = useAllRewardQuery({});
  const [createReward, { isLoading: isCreating }] = useCreateRewardMutation();
  const [updateReward, { isLoading: isUpdating }] = useUpdateRewardMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rewards = useMemo(() => apiResponse?.data || [], [apiResponse]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    points: '',
    category: '',
    description: '',
    included: '',
    policy: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // You would typically upload the file to your server here
      // For now, we'll store it as a File object
      // In a real app, you'd upload it and get a URL back
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (formData.name && formData.points) {
      const formDataToSubmit = new FormData();
      const dataObject = {
        rewardName: formData.name,
        rewardPoints: parseInt(formData.points),
        service: formData.category,
        description: formData.description,
        whatsIncluded: formData.included.split('\n').filter(i => i.trim() !== ''),
        redemptionPolicy: formData.policy,
      };

      formDataToSubmit.append('data', JSON.stringify(dataObject));

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formDataToSubmit.append('image', file);
      }

      try {
        let res;
        if (isEditMode && editingId) {
          res = await updateReward({ id: editingId, data: formDataToSubmit }).unwrap();
          toast.success(t('reward_updated_success', { defaultValue: 'Reward updated successfully' }));
        } else {
          res = await createReward(formDataToSubmit).unwrap();
          toast.success(t('reward_created_success', { defaultValue: 'Reward created successfully' }));
        }

        if (res.success) {
          // Reset form
          setFormData({
            name: '',
            points: '',
            category: '',
            description: '',
            included: '',
            policy: ''
          });
          setImagePreview('');
          setIsEditMode(false);
          setEditingId(null);
          setIsModalOpen(false);
          refetch();
        }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || t('error_general', { defaultValue: 'Something went wrong' }));
      }
    }
  };

  const handleEdit = (reward: Reward) => {
    setIsEditMode(true);
    setEditingId(reward._id);
    setFormData({
      name: reward.rewardName,
      points: reward.rewardPoints.toString(),
      category: reward.service || '',
      description: reward.description || '',
      included: (reward.whatsIncluded || []).join('\n'),
      policy: reward.redemptionPolicy || ''
    });

    if (reward.rewardImage) {
      setImagePreview(`${baseURL}${reward.rewardImage}`);
    } else {
      setImagePreview('');
    }

    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      points: '',
      category: '',
      description: '',
      included: '',
      policy: ''
    });
    setImagePreview('');
    setIsEditMode(false);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const toggleRewardStatus = async (reward: Reward) => {
    setTogglingId(reward._id);
    try {
      const formDataToSubmit = new FormData();
      const dataObject = {
        rewardStatus: !reward.rewardStatus
      };
      formDataToSubmit.append('data', JSON.stringify(dataObject));

      const res = await updateReward({ id: reward._id, data: formDataToSubmit }).unwrap();
      if (res.success) {
        toast.success(t('reward_status_updated', { status: !reward.rewardStatus ? t('activated', { defaultValue: 'activated' }) : t('deactivated', { defaultValue: 'deactivated' }), defaultValue: `Reward ${!reward.rewardStatus ? 'activated' : 'deactivated'} successfully` }));
        refetch();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredRewards: Reward[] = rewards.filter((reward: Reward) =>
    reward.rewardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-normal text-gray-800">{t('loyalty_rewards')}</h1>
            <p className="text-xs md:text-sm text-gray-700">{t('loyalty_rewards_desc')}</p>
          </div>
          <Button
            onClick={() => {
              setIsEditMode(false);
              setEditingId(null);
              setFormData({
                name: '',
                points: '',
                category: '',
                description: '',
                included: '',
                policy: ''
              });
              setImagePreview('');
              setIsModalOpen(true);
            }}
            className="bg-[#7fa885] hover:bg-[#6f9875] text-white h-10 px-6 rounded flex items-center justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
          >
            <Plus className="w-4 h-4" />
            {t('create_new_reward')}
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 mt-6 w-full flex items-center gap-4">
          <Input
            placeholder={t('search_rewards')}
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="bg-white border-gray-400 h-10 w-full"
          />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Rewards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
              {filteredRewards.map((reward) => (
                <div key={reward._id} className="bg-white rounded-lg overflow-hidden border border-gray-300 flex flex-col h-full shadow-sm">
                  {/* Image */}
                  <div className="relative h-44 sm:h-40 bg-gray-300 shrink-0">
                    <Image
                      src={`${baseURL}${reward.rewardImage}`}
                      width={1000}
                      height={1000}
                      alt={reward.rewardName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 start-2 bg-[#4a4a4a] text-[10px] font-bold text-white px-2 py-1 rounded">
                      {reward.rewardPoints} {t('pts', { defaultValue: 'PTS' })}
                    </div>
                    {!reward.rewardStatus && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-gray-800/80 border border-gray-600 text-white text-[10px] px-3 py-1 rounded uppercase tracking-wider font-bold">
                          {t('inactive')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3.5 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                      {reward.rewardName}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">
                      {reward.description}
                    </p>

                    {/* Controls */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-medium ${reward.rewardStatus ? 'text-green-600' : 'text-gray-400'}`}>
                          {reward.rewardStatus ? t('active') : t('inactive')}
                        </span>
                        {togglingId === reward._id ? (
                          <div className="flex items-center justify-center w-8 h-4">
                            <Loader2 className="w-4 h-4 animate-spin text-[#7fa885]" />
                          </div>
                        ) : (
                          <Switch
                            checked={reward.rewardStatus}
                            onCheckedChange={() => toggleRewardStatus(reward)}
                            className="data-[state=checked]:bg-[#7fa885] scale-90 cursor-pointer"
                          />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(reward)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                      >
                        <FilePenLine className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Create/Edit Reward Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl w-[95vw] sm:w-full p-4 sm:p-6 max-h-[96vh] overflow-y-auto rounded-xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg text-gray-800">
                {isEditMode ? t('edit_reward') : t('create_new_reward')}
              </DialogTitle>
            </DialogHeader>

            {/* Image Upload */}
            <div className="relative">
              <div
                className="bg-[#b5b5b5] border-2 border-dashed border-gray-400 rounded-lg h-48 flex flex-col items-center justify-center mb-2 cursor-pointer transition-colors"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <div className="text-white text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                        <p className="text-sm font-medium">{t('click_to_change_image', { defaultValue: 'Click to change image' })}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-600 mb-2" />
                    <p className="text-sm text-gray-700">{t('upload_reward_image')}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('upload_image_hint')}</p>
                  </>
                )}
              </div>

              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearImage}
                  className="absolute top-2 end-2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-800 mb-2 block">
                  {t('reward_name')} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t('reward_name_placeholder')}
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  className="bg-white border-gray-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-800 mb-2 block">
                  {t('points_required')} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t('points_placeholder')}
                  type="number"
                  value={formData.points}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('points', e.target.value)}
                  className="bg-white border-gray-400"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-800 mb-2 block">
                {t('reward_category')} <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder={t('category_placeholder')}
                value={formData.category}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('category', e.target.value)}
                className="bg-white border-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-800 mb-2 block">{t('description')}</label>
                <Textarea
                  placeholder={t('description_placeholder')}
                  value={formData.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                  className="bg-white border-gray-400 min-h-[120px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-800 mb-2 block">{t('whats_included')}</label>
                <Textarea
                  placeholder={t('included_placeholder')}
                  value={formData.included}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('included', e.target.value)}
                  className="bg-white border-gray-400 min-h-[120px]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-800 mb-2 block">{t('redemption_policy')}</label>
              <Textarea
                placeholder={t('policy_placeholder')}
                value={formData.policy}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('policy', e.target.value)}
                className="bg-white border-gray-400 min-h-[100px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="bg-[#9d9d9d] hover:bg-[#8d8d8d] text-white px-6 order-2 sm:order-1"
                disabled={isCreating || isUpdating}
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#7fa885] hover:bg-[#6f9875] text-white px-6 order-1 sm:order-2"
                disabled={!formData.name || !formData.points || isCreating || isUpdating}
              >
                {isEditMode ? (isUpdating ? t('updating') : t('update')) : (isCreating ? t('saving') : t('save'))}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  );
}