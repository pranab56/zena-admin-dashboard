"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FilePenLine, ImageIcon, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';

interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  status: 'active' | 'inactive' | 'disable';
  image: string | File;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 1,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'active',
      image: '/images/image2.jpg'
    },
    {
      id: 2,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'active',
      image: '/images/image2.jpg'
    },
    {
      id: 3,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'inactive',
      image: '/images/image2.jpg'
    },
    {
      id: 4,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'active',
      image: '/images/image2.jpg'
    },
    {
      id: 5,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'disable',
      image: '/images/image2.jpg'
    },
    {
      id: 6,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'active',
      image: '/images/image2.jpg'
    },
    {
      id: 7,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'inactive',
      image: '/images/image2.jpg'
    },
    {
      id: 8,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'active',
      image: '/images/image2.jpg'
    },
    {
      id: 9,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'disable',
      image: '/images/image2.jpg'
    },
    {
      id: 10,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'disable',
      image: '/images/image2.jpg'
    },
    {
      id: 11,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'active',
      image: '/images/image2.jpg'
    },
    {
      id: 12,
      name: 'Free Signature Haircut',
      points: 500,
      description: 'Valid for any stylist tier',
      status: 'active',
      image: '/images/image2.jpg'
    }
  ]);

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

  const handleSave = () => {
    if (formData.name && formData.points) {
      if (isEditMode && editingId) {
        // Update existing reward
        setRewards(rewards.map(reward => {
          if (reward.id === editingId) {
            return {
              ...reward,
              name: formData.name,
              points: parseInt(formData.points),
              description: formData.description || 'Valid for any stylist tier',
              // In a real app, you'd update the image if a new one was uploaded
            };
          }
          return reward;
        }));
      } else {
        // Create new reward
        const newReward: Reward = {
          id: rewards.length + 1,
          name: formData.name,
          points: parseInt(formData.points),
          description: formData.description || 'Valid for any stylist tier',
          status: 'active',
          image: imagePreview || '/api/placeholder/400/300'
        };
        setRewards([...rewards, newReward]);
      }

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
    }
  };

  const handleEdit = (reward: Reward) => {
    setIsEditMode(true);
    setEditingId(reward.id);
    setFormData({
      name: reward.name,
      points: reward.points.toString(),
      category: '',
      description: reward.description,
      included: '',
      policy: ''
    });

    // If reward.image is a string URL, use it as preview
    if (typeof reward.image === 'string') {
      setImagePreview(reward.image);
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

  const toggleRewardStatus = (id: number) => {
    setRewards(rewards.map(reward => {
      if (reward.id === id) {
        let newStatus: Reward['status'];
        if (reward.status === 'active') newStatus = 'disable';
        else if (reward.status === 'disable') newStatus = 'active';
        else newStatus = 'active';
        return { ...reward, status: newStatus };
      }
      return reward;
    }));
  };

  const filteredRewards = rewards.filter(reward =>
    reward.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImageUrl = (image: string | File): string => {
    if (typeof image === 'string') {
      return image;
    } else if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return '/api/placeholder/400/300';
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-normal text-gray-800 mb-1">Loyalty Rewards</h1>
            <p className="text-sm text-gray-700">Configure and monitor your salon&apos;s reward catalog.</p>
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
            className="bg-[#7fa885] hover:bg-[#6f9875] text-white h-10 px-4 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Reward
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 mt-6 w-full">
          <Input
            placeholder="Search rewards"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="bg-white border-gray-400 h-10 w-full"
          />
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-lg overflow-hidden border border-gray-300">
              {/* Image */}
              <div className="relative h-40 bg-gray-300">
                <Image
                  src={getImageUrl(reward.image)}
                  width={1000}
                  height={1000}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#4a4a4a] text-white text-xs px-2 py-1 rounded">
                  {reward.points} PTS
                </div>
                {(reward.status === 'inactive' || reward.status === 'disable') && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-700 text-white text-xs px-3 py-1 rounded uppercase tracking-wide">
                      INACTIVE
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  {reward.name}
                </h3>
                <p className="text-xs text-red-400 mb-3">
                  {reward.description}
                </p>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      {reward.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={reward.status === 'active'}
                      onCheckedChange={() => toggleRewardStatus(reward.id)}
                      className="data-[state=checked]:bg-[#7fa885]"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(reward)}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <FilePenLine className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Reward Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg text-gray-800">
                {isEditMode ? 'Edit Reward' : 'Create New Reward'}
              </DialogTitle>
            </DialogHeader>

            {/* Image Upload */}
            <div className="relative">
              <div
                className="bg-[#b5b5b5] border-2 border-dashed border-gray-400 rounded-lg h-48 flex flex-col items-center justify-center mb-2 cursor-pointer hover:bg-[#a5a5a5] transition-colors"
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
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-white text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                        <p className="text-sm">Click to change image</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-600 mb-2" />
                    <p className="text-sm text-gray-700">Click to upload reward image</p>
                    <p className="text-xs text-gray-600 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </>
                )}
              </div>

              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearImage}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
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
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-800 mb-2 block">
                  Reward Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter your reward name.."
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  className="bg-white border-gray-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-800 mb-2 block">
                  Points Required <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter points"
                  type="number"
                  value={formData.points}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('points', e.target.value)}
                  className="bg-white border-gray-400"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-800 mb-2 block">
                Reward category <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter the reward category"
                value={formData.category}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('category', e.target.value)}
                className="bg-white border-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-800 mb-2 block">Description</label>
                <Textarea
                  placeholder="Enter the description"
                  value={formData.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                  className="bg-white border-gray-400 min-h-[120px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-800 mb-2 block">What&apos;s Included</label>
                <Textarea
                  placeholder="Enter the included features"
                  value={formData.included}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('included', e.target.value)}
                  className="bg-white border-gray-400 min-h-[120px]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-800 mb-2 block">Redemption Policy</label>
              <Textarea
                placeholder="Specify any restrictions or specific rules."
                value={formData.policy}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('policy', e.target.value)}
                className="bg-white border-gray-400 min-h-[100px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="bg-[#9d9d9d] hover:bg-[#8d8d8d] text-gray-800 px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#7fa885] hover:bg-[#6f9875] text-white px-6"
                disabled={!formData.name || !formData.points}
              >
                {isEditMode ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}