import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Save, Lock } from 'lucide-react';

export default function Profile() {
  const { user, token, setAuth } = useAuthStore();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    penName: user?.penName || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [profileStatus, setProfileStatus] = useState({ loading: false, error: '', success: '' });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus({ loading: true, error: '', success: '' });
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users/profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProfileStatus({ loading: false, error: '', success: 'Profile updated successfully.' });
        // Update user store state correctly
        setAuth(token!, res.data.data);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setProfileStatus({ loading: false, error: err.response?.data?.message || 'Failed to update profile.', success: '' });
      } else if (err instanceof Error) {
        setProfileStatus({ loading: false, error: err.message, success: '' });
      } else {
        setProfileStatus({ loading: false, error: 'An unknown error occurred.', success: '' });
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: '', success: '' });
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users/password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setPasswordStatus({ loading: false, error: '', success: 'Password updated successfully.' });
        setPasswordForm({ currentPassword: '', newPassword: '' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPasswordStatus({ loading: false, error: err.response?.data?.message || 'Failed to update password.', success: '' });
      } else if (err instanceof Error) {
        setPasswordStatus({ loading: false, error: err.message, success: '' });
      } else {
        setPasswordStatus({ loading: false, error: 'An unknown error occurred.', success: '' });
      }
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] text-white pt-32 px-6 flex justify-center items-center">
        <p className="text-xl font-light text-white/50">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] text-white pt-32 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[var(--color-luxury-gold)] mb-12 uppercase tracking-widest border-b border-white/10 pb-6">
          Account Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Profile Details */}
          <div className="bg-white/5 border border-white/10 p-8 relative flex flex-col">
            <h2 className="text-2xl font-serif mb-6 text-white uppercase tracking-widest">Profile Details</h2>
            {profileStatus.error && <p className="text-red-500 mb-4 text-sm">{profileStatus.error}</p>}
            {profileStatus.success && <p className="text-green-500 mb-4 text-sm">{profileStatus.success}</p>}
            
            <form onSubmit={handleProfileSubmit} className="space-y-6 flex-grow flex flex-col">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                />
              </div>

              {user.role === 'artist' ? (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Pen Name (Public)</label>
                  <input
                    type="text"
                    value={profileForm.penName}
                    onChange={(e) => setProfileForm({ ...profileForm, penName: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Username (Public)</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={profileStatus.loading}
                className="w-full mt-auto flex items-center justify-center space-x-2 py-3 bg-white/10 text-white hover:bg-[var(--color-luxury-gold)] hover:text-black transition-colors duration-300 disabled:opacity-50"
              >
                {profileStatus.loading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span className="uppercase tracking-widest text-sm font-bold">Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="bg-white/5 border border-white/10 p-8 relative flex flex-col">
            <h2 className="text-2xl font-serif mb-6 text-white uppercase tracking-widest">Security</h2>
            {passwordStatus.error && <p className="text-red-500 mb-4 text-sm">{passwordStatus.error}</p>}
            {passwordStatus.success && <p className="text-green-500 mb-4 text-sm">{passwordStatus.success}</p>}
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6 flex-grow flex flex-col">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={passwordStatus.loading}
                className="w-full mt-auto flex items-center justify-center space-x-2 py-3 bg-white/10 text-white hover:bg-[var(--color-luxury-gold)] hover:text-black transition-colors duration-300 disabled:opacity-50"
              >
                {passwordStatus.loading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span className="uppercase tracking-widest text-sm font-bold">Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
