/**
 * Global Footer
 */
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 mt-auto bg-[var(--color-luxury-charcoal)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-xl font-serif tracking-widest uppercase text-white mb-2">Aura</h2>
          <p className="text-sm text-white/50 max-w-sm">
            The premier destination for luxury digital & physical artwork. 
            Curated exclusively for discerning collectors.
          </p>
        </div>

        <nav className="flex gap-12 text-sm uppercase tracking-wider font-semibold">
          <div className="flex flex-col gap-4">
            <Link to="/about" className="text-white/50 hover:text-[var(--color-luxury-gold)] transition-colors duration-150">About</Link>
            <Link to="/careers" className="text-white/50 hover:text-[var(--color-luxury-gold)] transition-colors duration-150">Careers</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/terms" className="text-white/50 hover:text-[var(--color-luxury-gold)] transition-colors duration-150">Terms</Link>
            <Link to="/privacy" className="text-white/50 hover:text-[var(--color-luxury-gold)] transition-colors duration-150">Privacy</Link>
          </div>
        </nav>
      </div>
      <div className="w-full text-center py-6 border-t border-white/5 text-xs text-white/30 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Aura Fine Arts. All rights reserved.
      </div>
    </footer>
  );
}
