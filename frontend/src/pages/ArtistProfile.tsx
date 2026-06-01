import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface ArtistData {
  name: string;
  penName?: string;
}

interface ArtworkData {
  _id: string;
  title: string;
  price: number;
  images?: { thumbnail?: string };
}

export default function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Artist
        const artistRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users/artists/${id}`);
        if (artistRes.data.success) {
          setArtist(artistRes.data.data);
        }

        // Fetch their artworks
        const artworkRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/artworks?artist=${id}`);
        if (artworkRes.data.success) {
          setArtworks(artworkRes.data.data.artworks || artworkRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch artist profile:', err);
        // Optionally redirect if not found
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    } else {
      navigate('/artists');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] flex justify-center items-center">
        <div className="w-12 h-12 border-t-2 border-[var(--color-luxury-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-serif text-[var(--color-luxury-gold)] mb-4">Artist Not Found</h1>
        <button onClick={() => navigate('/artists')} className="px-6 py-2 border border-[var(--color-luxury-gold)] text-[var(--color-luxury-gold)] hover:bg-[var(--color-luxury-gold)] hover:text-black transition-colors uppercase tracking-widest text-sm">
          Return to Artists
        </button>
      </div>
    );
  }

  const displayName = artist.penName || artist.name;

  return (
    <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] text-white pt-32 px-6 lg:px-12 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 border-b border-white/10 pb-12">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[var(--color-luxury-gold)]/20 mb-6 flex items-center justify-center text-[var(--color-luxury-gold)] text-5xl md:text-7xl font-serif border-4 border-[var(--color-luxury-charcoal)] ring-2 ring-[var(--color-luxury-gold)]/30">
            {displayName ? displayName.charAt(0).toUpperCase() : 'A'}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-luxury-gold)] mb-4">{displayName}</h1>
          <p className="text-white/50 uppercase tracking-widest">Artist Portfolio</p>
        </div>

        <div>
          <h2 className="text-2xl font-serif mb-8 uppercase tracking-widest text-white/80">Approved Works</h2>
          {artworks.length === 0 ? (
            <div className="text-center py-20 border border-white/10 bg-white/5">
              <p className="text-white/50 font-light">This artist has not published any artworks yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((art) => (
                <div key={art._id} className="bg-white/5 border border-white/10 overflow-hidden group cursor-pointer" onClick={() => navigate(`/artwork/${art._id}`)}>
                  <div className="relative aspect-square overflow-hidden bg-black/50">
                    {art.images?.thumbnail ? (
                      <img src={art.images.thumbnail} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-white/20">No Image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-[var(--color-luxury-gold)] mb-2 truncate group-hover:text-white transition-colors">{art.title}</h3>
                    <p className="text-xl font-light text-white/80">${art.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
