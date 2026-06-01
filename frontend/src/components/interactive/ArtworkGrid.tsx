/**
 * Interactive Artwork Grid (Tier 2)
 * 
 * Simulated virtualized grid rendering with subtle tilt physics.
 */
import { motion } from 'framer-motion';
import { MOTION_TOKENS } from '../../design-tokens/motion';

const MOCK_DATA = [
  { id: 1, title: 'Obsidian Veil', artist: 'Elena Rostova', price: '4.5 ETH', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' },
  { id: 2, title: 'Golden Ratio', artist: 'Marcus Chen', price: '2.1 ETH', image: 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=400' },
  { id: 3, title: 'Neon Silence', artist: 'Aisha Doe', price: '7.8 ETH', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400' },
  { id: 4, title: 'Void Architecture', artist: 'H. G. Wells', price: '12.0 ETH', image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=400' },
];

export function ArtworkGrid() {
  return (
    <section className="py-24">
      <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-serif text-white uppercase tracking-widest">
          Featured <span className="text-[var(--color-luxury-gold)] italic">Curation</span>
        </h2>
        <button className="text-xs font-semibold text-white/50 hover:text-white uppercase tracking-widest transition-colors duration-150">
          View All Collection &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {MOCK_DATA.map((art) => (
          <motion.div 
            key={art.id}
            whileHover={{ 
              scale: MOTION_TOKENS.luxuryScale, 
              y: -5
            }}
            transition={{
              duration: MOTION_TOKENS.micro.duration,
              ease: MOTION_TOKENS.micro.ease
            }}
            className="group cursor-pointer flex flex-col gap-4"
          >
            {/* Image Container with precise aspect ratios */}
            <div className="w-full aspect-[4/5] overflow-hidden bg-[var(--color-luxury-surface)] relative rounded-sm">
              <img 
                src={art.image} 
                alt={art.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
              
              {/* Subtle glassmorphism overlay containing quick actions */}
              <div className="absolute bottom-0 w-full p-4 bg-black/40 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-between items-center">
                <span className="text-xs text-white uppercase tracking-widest font-semibold">Preview</span>
                <span className="text-xs text-[var(--color-luxury-gold)] font-mono">{art.price}</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-col gap-1">
              <h3 className="text-white font-serif tracking-wide">{art.title}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest">
                By <span className="text-white/80">{art.artist}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
