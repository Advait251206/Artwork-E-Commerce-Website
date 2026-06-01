import React, { useState } from 'react';
import { X, Upload, DollarSign, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: {
    _id?: string;
    title?: string;
    description?: string;
    price?: number | string;
    category?: string;
    sellingType?: string;
    images?: { original?: string, thumbnail?: string };
  } | null;
}

export default function UploadModal({ isOpen, onClose, onSuccess, editItem }: UploadModalProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'painting',
    imageUrl: '',
    sellingType: 'fixed',
    auctionDuration: '24',
  });

  React.useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          title: editItem.title || '',
          description: editItem.description || '',
          price: editItem.price?.toString() || '',
          category: editItem.category || 'painting',
          imageUrl: editItem.images?.original || '',
          sellingType: editItem.sellingType || 'fixed',
          auctionDuration: '24',
        });
      } else {
        setFormData({ title: '', description: '', price: '', category: 'painting', imageUrl: '', sellingType: 'fixed', auctionDuration: '24' });
      }
      setImageFile(null);
      setError('');
    }
  }, [isOpen, editItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('price', formData.price);
      payload.append('category', formData.category);
      payload.append('sellingType', formData.sellingType);

      if (formData.sellingType === 'auction') {
        payload.append('auctionDuration', formData.auctionDuration);
      }

      if (imageFile) {
        payload.append('image', imageFile);
      } else if (!editItem) {
        setError('Please select an image to upload.');
        setLoading(false);
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      if (editItem) {
        await axios.put(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/artworks/${editItem._id}`,
          payload,
          { headers }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/artworks`,
          payload,
          { headers }
        );
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errData = err.response?.data as { message?: string, errors?: { path: string, message: string }[] };
        if (errData?.errors && errData.errors.length > 0) {
          setError(errData.errors.map(e => `${e.path}: ${e.message}`).join(' | '));
        } else {
          setError(errData?.message || `Failed to ${editItem ? 'update' : 'upload'} artwork`);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[var(--color-luxury-charcoal)] border border-[var(--color-luxury-gold)]/20 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-serif text-[var(--color-luxury-gold)] mb-8 uppercase tracking-widest text-center">
          {editItem ? 'Edit Artwork' : 'Exhibit Artwork'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                  placeholder="Masterpiece Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {formData.sellingType === 'auction' ? 'Starting Price (USD)' : 'Price (USD)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-4 h-4 text-white/40" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-white/70">Image Upload</label>
                  <div className="group relative flex items-center">
                    <div className="w-4 h-4 rounded-full border border-white/50 text-white/50 flex items-center justify-center text-xs font-serif cursor-help hover:text-white hover:border-white transition-colors">
                      i
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full -left-2 mb-2 w-64 p-3 bg-black/90 border border-white/10 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 backdrop-blur-md shadow-xl">
                      Select a high-quality JPG, PNG, or WEBP file from your device.
                      <div className="absolute top-full left-4 border-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="w-4 h-4 text-white/40" />
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    required={!editItem}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="w-full bg-black/50 border border-white/10 pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors file:mr-4 file:py-2 file:px-4 file:bg-[var(--color-luxury-gold)] file:text-black file:border-0 file:font-semibold hover:file:bg-[#e6c175] file:cursor-pointer"
                  />
                </div>
                {formData.imageUrl && !imageFile && (
                  <div className="mt-2 text-xs text-white/50">
                    Current image loaded. Uploading a new file will replace it.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors appearance-none"
                >
                  <option value="painting">Painting</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="photography">Photography</option>
                  <option value="digital">Digital Art</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Selling Mode</label>
                <select
                  value={formData.sellingType}
                  onChange={(e) => setFormData({ ...formData, sellingType: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors appearance-none"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="auction">Auction / Bidding</option>
                </select>
              </div>

              {formData.sellingType === 'auction' && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Auction Duration</label>
                  <select
                    value={formData.auctionDuration}
                    onChange={(e) => setFormData({ ...formData, auctionDuration: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors appearance-none"
                  >
                    <option value="24">24 Hours</option>
                    <option value="72">3 Days</option>
                    <option value="168">7 Days</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors resize-none"
                  placeholder="The story behind the artwork..."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-[var(--color-luxury-gold)] text-black font-bold tracking-widest uppercase hover:bg-white transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-t-2 border-black rounded-full animate-spin"></div>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>{editItem ? 'Save Changes' : 'Submit to Gallery'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
