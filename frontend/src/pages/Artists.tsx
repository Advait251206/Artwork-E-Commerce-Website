import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Artist {
  _id: string;
  name: string;
  penName?: string;
}

export default function Artists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users/artists`);
        if (response.data.success) {
          setArtists(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch artists:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArtists();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] text-white pt-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-luxury-gold)] mb-12 uppercase tracking-widest border-b border-white/10 pb-6">
          Featured Artists
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-t-2 border-[var(--color-luxury-gold)] rounded-full animate-spin"></div>
          </div>
        ) : artists.length === 0 ? (
          <p className="text-white/50 text-xl font-light">No artists have registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => {
              const displayName = artist.penName || artist.name;
              return (
                <div 
                  key={artist._id} 
                  className="bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center text-center hover:border-[var(--color-luxury-gold)] cursor-pointer transition-colors duration-500 group"
                  onClick={() => navigate(`/artists/${artist._id}`)}
                >
                  <div className="w-24 h-24 rounded-full bg-[var(--color-luxury-gold)]/20 mb-6 flex items-center justify-center text-[var(--color-luxury-gold)] text-3xl font-serif">
                    {displayName ? displayName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <h3 className="text-2xl font-serif text-white group-hover:text-[var(--color-luxury-gold)] transition-colors duration-300">
                    {displayName}
                  </h3>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
