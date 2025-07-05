import React, { useState } from 'react';
import { useCreateProfile, useFetchProfile } from '../functions/contract';
import toast from 'react-hot-toast';

interface ProfileCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileCreationModal: React.FC<ProfileCreationModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const { createProfile, loading } = useCreateProfile();
  const { handleFetch } = useFetchProfile();

  const avatars = [
    '/user-avatar/avatar-1.svg',
    '/user-avatar/avatar-2.svg',
    '/user-avatar/avatar-3.svg',
    '/user-avatar/avatar-4.svg',
    '/user-avatar/avatar-5.svg',
    '/user-avatar/avatar-6.svg',
    '/user-avatar/avatar-7.svg',
    '/user-avatar/avatar-8.svg',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    
    if (username.length < 4) {
      toast.error('Username must be at least 4 characters long');
      return;
    }
    
    if (!selectedAvatar) {
      toast.error('Please select an avatar');
      return;
    }

    const success = await createProfile(username, selectedAvatar);
    if (success) {
      handleFetch();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-[#08172E] mb-4">Complete Your Profile</h2>
        <p className="text-sm text-gray-600 mb-6">
          Please provide your username and select an avatar to complete your profile setup.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#08172E] mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98E2D]"
              minLength={4}
            />
            {username.length > 0 && username.length < 4 && (
              <p className="text-red-500 text-xs mt-1">
                Username must be at least 4 characters long
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#08172E] mb-2">
              Choose an Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`w-12 h-12 cursor-pointer border-2 rounded-md transition-all ${
                    selectedAvatar === avatar
                      ? 'border-[#F98E2D] bg-[#F98E2D]/10'
                      : 'border-gray-300 hover:border-[#F98E2D]/50'
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !username.trim() || username.length < 4 || !selectedAvatar}
              className="flex-1 px-4 py-2 bg-[#08172E] text-white rounded-md hover:bg-[#08172E]/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationModal; 