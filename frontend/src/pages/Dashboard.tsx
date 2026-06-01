import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import UploadModal from '../components/UploadModal';
import { useNavigate } from 'react-router-dom';

interface ArtworkNode {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  rejectionReason?: string;
  isEdited?: boolean;
  images?: { thumbnail: string };
  artist?: { name: string };
}

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<ArtworkNode[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editItem, setEditItem] = useState<ArtworkNode | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMyArtworks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/artworks/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setArtworks(res.data.data.artworks || res.data.data);
      }
    } catch (err) {
      console.error('Error fetching artworks', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user || user.role !== 'artist') {
      navigate('/');
      return;
    }
    fetchMyArtworks();
  }, [user, navigate, fetchMyArtworks]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this masterpiece?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/artworks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyArtworks();
    } catch (err) {
      console.error('Error deleting artwork', err);
      alert('Failed to delete artwork.');
    }
  };

  const handleEditClick = (art: ArtworkNode) => {
    if (art.status !== 'PENDING') {
      const confirmEdit = window.confirm(
        'Editing this artwork will send it back to Admin for re-approval. Send to Admin or Cancel?'
      );
      if (!confirmEdit) return;
    }
    setEditItem(art);
    setIsUploadOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] text-white pt-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-6 gap-6">
          <h1 className="text-4xl font-serif text-[var(--color-luxury-gold)] uppercase tracking-widest">
            Artist Dashboard
          </h1>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-luxury-gold)] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Artwork</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <div className="w-8 h-8 border-t-2 border-[var(--color-luxury-gold)] rounded-full animate-spin"></div>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20 border border-white/10 bg-white/5">
            <h2 className="text-2xl font-serif mb-4">No Artworks Yet</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto font-light leading-relaxed">
              Your gallery is currently empty. Start uploading your masterpieces to showcase them to collectors around the world.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-8 py-3 border border-[var(--color-luxury-gold)] text-[var(--color-luxury-gold)] uppercase tracking-widest font-bold hover:bg-[var(--color-luxury-gold)] hover:text-black transition-colors duration-300"
            >
              Upload First Piece
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => (
              <div key={art._id} className="bg-white/5 border border-white/10 overflow-hidden group">
                <div className="relative aspect-square overflow-hidden bg-black/50">
                  {art.images?.thumbnail ? (
                    <img src={art.images.thumbnail} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/20">No Image</div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 text-xs uppercase tracking-widest border border-white/20">
                    <span className={art.status === 'APPROVED' ? 'text-green-500' : art.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'}>
                      {art.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-[var(--color-luxury-gold)] mb-2 truncate">{art.title}</h3>
                  <p className="text-xl mb-4 font-light">${art.price.toLocaleString()}</p>
                  
                  {art.status === 'REJECTED' && art.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-500/10 border-l-2 border-red-500 text-sm">
                      <p className="text-red-400 font-bold mb-1">Reason for Rejection:</p>
                      <p className="text-red-300 italic line-clamp-3">{art.rejectionReason}</p>
                    </div>
                  )}

                  <div className="flex space-x-6 border-t border-white/10 pt-4">
                    <button onClick={() => handleEditClick(art)} className="text-white/50 hover:text-white flex items-center space-x-2 transition-colors">
                      <Edit3 className="w-4 h-4" /> <span className="text-sm uppercase tracking-wider">Edit</span>
                    </button>
                    <button onClick={() => handleDelete(art._id)} className="text-white/50 hover:text-red-500 flex items-center space-x-2 transition-colors">
                      <Trash2 className="w-4 h-4" /> <span className="text-sm uppercase tracking-wider">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => { setIsUploadOpen(false); setEditItem(null); }} 
        onSuccess={fetchMyArtworks}
        editItem={editItem}
      />
    </div>
  );
}
