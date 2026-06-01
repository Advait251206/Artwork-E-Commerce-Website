import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Check, X, Image as ImageIcon, Users, Activity, ShoppingBag, Search, Edit3 } from 'lucide-react';

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

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'artworks'>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtworks: 0,
    pendingArtworks: 0,
    totalOrders: 0
  });
  const [artworks, setArtworks] = useState<ArtworkNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [artworkStatus, setArtworkStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats', err);
    }
  }, [token]);

  const fetchArtworks = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/admin/artworks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setArtworks(res.data.data.artworks || res.data.data);
      }
    } catch (err) {
      console.error('Error fetching artworks', err);
    }
  }, [token]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchArtworks()]);
    setLoading(false);
  }, [fetchStats, fetchArtworks]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [user, navigate, fetchData]);

  const handleModerate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    let rejectionReason = undefined;
    if (status === 'REJECTED') {
      const reason = window.prompt('Please provide a reason for rejecting this artwork:');
      if (reason === null) return; // User cancelled
      rejectionReason = reason.trim();
    } else {
      if (!window.confirm(`Are you sure you want to approve this artwork?`)) return;
    }

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/admin/artworks/${id}/status`, 
        { status, rejectionReason }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh both stats and artworks
    } catch (err) {
      console.error('Error moderating artwork', err);
      alert('Failed to update status.');
    }
  };

  if (loading && Object.keys(stats).length === 0) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] flex justify-center items-center">
        <div className="w-8 h-8 border-t-2 border-[var(--color-luxury-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredArtworks = artworks.filter((art) => {
    if (artworkStatus !== 'ALL' && art.status !== artworkStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        art.title?.toLowerCase().includes(query) ||
        art.description?.toLowerCase().includes(query) ||
        art.artist?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // --- Extract Card Renderer ---
  const renderArtworkCard = (art: ArtworkNode) => (
    <div key={art._id} className="bg-white/5 border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="w-full md:w-32 h-32 bg-black/50 shrink-0 border border-white/10">
        {art.images?.thumbnail ? (
          <img src={art.images.thumbnail} alt={art.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
        )}
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="text-2xl font-serif text-[var(--color-luxury-gold)]">{art.title}</h3>
          <span className={`text-xs px-2 py-1 uppercase tracking-widest border ${
            art.status === 'APPROVED' ? 'border-green-500 text-green-500' :
            art.status === 'REJECTED' ? 'border-red-500 text-red-500' :
            'border-yellow-500 text-yellow-500 bg-yellow-500/10'
          }`}>
            {art.status}
          </span>
          {art.isEdited && art.status === 'PENDING' && (
            <span className="text-xs px-2 py-1 uppercase tracking-widest border border-blue-400 text-blue-400 bg-blue-500/10">
              Edited
            </span>
          )}
        </div>
        <p className="text-white/70 mb-2 font-light line-clamp-2">{art.description}</p>
        
        {art.status === 'REJECTED' && art.rejectionReason && (
          <p className="text-red-400 mb-2 text-sm italic border-l-2 border-red-500 pl-3">Reason: {art.rejectionReason}</p>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-white/50 mb-4">
          <span>By: {art.artist?.name || 'Unknown Artist'}</span>
          <span>•</span>
          <span>${art.price.toLocaleString()}</span>
          <span>•</span>
          <span className="capitalize">{art.category}</span>
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
        {art.status !== 'APPROVED' && (
          <button 
            onClick={() => handleModerate(art._id, 'APPROVED')}
            className="flex-1 md:w-32 py-2 bg-green-500/10 text-green-500 border border-green-500/50 hover:bg-green-500 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Approve
          </button>
        )}
        {art.status !== 'REJECTED' && (
          <button 
            onClick={() => handleModerate(art._id, 'REJECTED')}
            className="flex-1 md:w-32 py-2 bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Reject
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] text-white pt-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-[var(--color-luxury-gold)] uppercase tracking-widest mb-12 border-b border-white/10 pb-6">
          Admin Control Center
        </h1>

        <div className="flex space-x-8 mb-12 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 uppercase tracking-widest font-bold transition-colors ${activeTab === 'overview' ? 'text-[var(--color-luxury-gold)] border-b-2 border-[var(--color-luxury-gold)]' : 'text-white/50 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('artworks')}
            className={`pb-4 uppercase tracking-widest font-bold transition-colors flex items-center space-x-2 ${activeTab === 'artworks' ? 'text-[var(--color-luxury-gold)] border-b-2 border-[var(--color-luxury-gold)]' : 'text-white/50 hover:text-white'}`}
          >
            <span>Artworks Review</span>
            {stats.pendingArtworks > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pendingArtworks}</span>
            )}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 flex items-center space-x-4">
              <div className="p-4 bg-[var(--color-luxury-gold)]/20 text-[var(--color-luxury-gold)] rounded-full">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-serif">{stats.totalUsers}</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 flex items-center space-x-4">
              <div className="p-4 bg-[var(--color-luxury-gold)]/20 text-[var(--color-luxury-gold)] rounded-full">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Total Artworks</p>
                <p className="text-3xl font-serif">{stats.totalArtworks}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 flex items-center space-x-4">
              <div className="p-4 bg-red-500/20 text-red-500 rounded-full">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Pending Review</p>
                <p className="text-3xl font-serif">{stats.pendingArtworks}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 flex items-center space-x-4">
              <div className="p-4 bg-[var(--color-luxury-gold)]/20 text-[var(--color-luxury-gold)] rounded-full">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Total Orders</p>
                <p className="text-3xl font-serif">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artworks' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex space-x-2 bg-black/30 p-1 border border-white/10 rounded-sm w-full md:w-auto overflow-x-auto">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setArtworkStatus(status)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors whitespace-nowrap rounded-sm ${artworkStatus === status ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm text-sm"
                />
              </div>
            </div>

            <div className="space-y-6">
            {filteredArtworks.length === 0 ? (
              <div className="text-center py-20 border border-white/10 bg-white/5">
                <p className="text-white/50">No {artworkStatus !== 'ALL' ? artworkStatus.toLowerCase() : ''} artworks found.</p>
              </div>
            ) : artworkStatus === 'PENDING' ? (
              <div className="space-y-12">
                {/* Pending View Splitting */}
                {filteredArtworks.filter(a => !a.isEdited).length > 0 && (
                  <div>
                    <h3 className="text-xl font-serif text-[var(--color-luxury-gold)] mb-6 uppercase tracking-widest border-b border-white/10 pb-2">
                      First Time Approvals
                    </h3>
                    <div className="space-y-6">
                      {filteredArtworks.filter(a => !a.isEdited).map(renderArtworkCard)}
                    </div>
                  </div>
                )}
                {filteredArtworks.filter(a => a.isEdited).length > 0 && (
                  <div>
                    <h3 className="text-xl font-serif text-blue-400 mb-6 uppercase tracking-widest border-b border-blue-500/30 pb-2 flex items-center gap-3">
                      <Edit3 className="w-5 h-5" /> Artist Edits
                    </h3>
                    <div className="space-y-6 bg-blue-500/5 p-4 md:p-6 border border-blue-500/20 rounded-sm">
                      {filteredArtworks.filter(a => a.isEdited).map(renderArtworkCard)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredArtworks.map(renderArtworkCard)}
              </div>
            )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
