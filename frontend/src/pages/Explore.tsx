/**
 * Explore Page (Artwork Listing)
 * 
 * Implements a visually heavy but performantly constrained gallery.
 * Utilizes pseudo-virtualized grids and Debounced searching.
 */
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { MOTION_TOKENS } from '../design-tokens/motion';

// Mock Data scaled up to test grid performance visually
const MOCK_CATALOG = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  title: `Composition No. ${i + 1}`,
  artist: ['Elena Rostova', 'Marcus Chen', 'Aisha Doe', 'H. G. Wells'][i % 4],
  price: `${(Math.random() * 10 + 1).toFixed(1)} ETH`,
  category: ['digital', 'physical', 'hybrid'][i % 3],
  image: `https://images.unsplash.com/photo-${[
    '1618005182384-a83a8bd57fbe',
    '1501472312651-726afe119ff1',
    '1550684848-fac1c5b4e853',
    '1518640467707-6811f4a6ab73'
  ][i % 4]}?q=80&w=400`
}));

// Simple custom debounce hook to prevent excessive re-renders during search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const debouncedSearch = useDebounce(search, 300);

  // Memoize filtering to save CPU cycles on standard re-renders
  const filteredCatalog = useMemo(() => {
    return MOCK_CATALOG.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                            art.artist.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesFilter = filter === 'all' || art.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [debouncedSearch, filter]);

  return (
    <div className="w-full flex flex-col gap-12 mt-12 min-h-screen">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6 sticky top-24 bg-[var(--color-luxury-charcoal)] z-30 pt-4">
        <h1 className="text-3xl font-serif text-white tracking-widest uppercase">
          Curated <span className="text-[var(--color-luxury-gold)] italic">Vault</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input 
              type="text" 
              placeholder="Search artists or works..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-2 pl-10 text-sm text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-40 appearance-none bg-black/50 border border-white/10 p-2 pl-10 pr-8 text-sm text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm uppercase tracking-widest cursor-pointer"
            >
              <option value="all">Every Medium</option>
              <option value="digital">Digital Only</option>
              <option value="physical">Physical Asset</option>
              <option value="hybrid">Phygital</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pseudo-Virtualized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 pb-24">
        <AnimatePresence>
          {filteredCatalog.map((art, index) => (
            <motion.div 
              key={art.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.4, 
                ease: MOTION_TOKENS.major.ease,
                delay: index * 0.02 // Staggered entrance
              }}
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { duration: MOTION_TOKENS.micro.duration, ease: MOTION_TOKENS.micro.ease }
              }}
              className="group cursor-pointer flex flex-col gap-4"
            >
              <div className="w-full aspect-square overflow-hidden bg-black relative rounded-sm shadow-xl">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 will-change-transform"
                  loading="lazy"
                />
                
                {/* Immersive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <span className="text-xs text-[var(--color-luxury-gold)] border border-[var(--color-luxury-gold)]/50 px-2 py-1 rounded-sm tracking-widest uppercase bg-black/50 backdrop-blur-sm">Collect</span>
                    <span className="text-sm text-white font-mono">{art.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-white font-serif tracking-wide text-lg">{art.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest flex justify-between">
                  By <span className="text-white/80">{art.artist}</span>
                  <span className="text-white/30">{art.category}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCatalog.length === 0 && (
        <div className="w-full flex-grow flex items-center justify-center text-white/50 uppercase tracking-widest font-semibold p-24">
          No works found matching those criteria.
        </div>
      )}

    </div>
  );
}
