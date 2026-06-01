import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, LogOut, X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-[var(--color-luxury-charcoal)]/80 backdrop-blur-md border-b border-white/5 pb-4 pt-6 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Sidebar" 
            className="hover:text-[var(--color-luxury-gold)] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link 
            to="/" 
            className="text-2xl font-serif tracking-widest uppercase text-white hover:text-[var(--color-luxury-gold)] transition-colors duration-300"
          >
            Aura
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider font-semibold">
          <Link to="/explore" className="text-white/70 hover:text-white transition-colors duration-150">Explore</Link>
          <Link to="/artists" className="text-white/70 hover:text-white transition-colors duration-150">Artists</Link>
          <Link to="/curated" className="text-white/70 hover:text-white transition-colors duration-150">Curated</Link>
          {user?.role === 'artist' && (
            <Link to="/dashboard" className="text-[var(--color-luxury-gold)] hover:text-white transition-colors duration-150">Dashboard</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-[var(--color-luxury-gold)] hover:text-white transition-colors duration-150">Admin Panel</Link>
          )}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search" 
            className="hover:text-[var(--color-luxury-gold)] transition-colors duration-150"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-xs uppercase tracking-widest text-[var(--color-luxury-gold)] hidden md:inline-block hover:text-white transition-colors">
                {user.name || user.firstName}
              </Link>
              <button 
                onClick={logout} 
                aria-label="Logout" 
                className="text-white/70 hover:text-red-400 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" aria-label="Account" className="hover:text-[var(--color-luxury-gold)] transition-colors duration-150">
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </header>

      {/* Hamburger Mobile/Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMenu}></div>
          <div className="relative w-80 max-w-[80vw] bg-[var(--color-luxury-charcoal)] h-full border-r border-white/10 shadow-2xl flex flex-col pt-24 px-8 pb-12 animate-in slide-in-from-left duration-300">
            <button onClick={closeMenu} className="absolute top-8 right-6 text-white/50 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <nav className="flex flex-col space-y-6 flex-grow">
              <Link onClick={closeMenu} to="/" className="text-2xl font-serif text-white hover:text-[var(--color-luxury-gold)] transition-colors flex items-center justify-between group">
                Home <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link onClick={closeMenu} to="/explore" className="text-2xl font-serif text-white hover:text-[var(--color-luxury-gold)] transition-colors flex items-center justify-between group">
                Explore <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link onClick={closeMenu} to="/artists" className="text-2xl font-serif text-white hover:text-[var(--color-luxury-gold)] transition-colors flex items-center justify-between group">
                Artists <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link onClick={closeMenu} to="/curated" className="text-2xl font-serif text-white hover:text-[var(--color-luxury-gold)] transition-colors flex items-center justify-between group">
                Curated <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <div className="h-px bg-white/10 my-4"></div>
              
              {user ? (
                <>
                  <Link onClick={closeMenu} to="/profile" className="text-xl font-serif text-[var(--color-luxury-gold)] hover:text-white transition-colors flex items-center justify-between group">
                    Settings <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  {user.role === 'artist' && (
                    <Link onClick={closeMenu} to="/dashboard" className="text-xl font-serif text-[var(--color-luxury-gold)] hover:text-white transition-colors flex items-center justify-between group">
                      Dashboard <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link onClick={closeMenu} to="/admin" className="text-xl font-serif text-[var(--color-luxury-gold)] hover:text-white transition-colors flex items-center justify-between group">
                      Admin Panel <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )}
                  <button onClick={() => { logout(); closeMenu(); }} className="text-left text-xl font-serif text-red-400 hover:text-red-300 transition-colors mt-auto">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link onClick={closeMenu} to="/login" className="text-xl font-serif text-[var(--color-luxury-gold)] hover:text-white transition-colors flex items-center justify-between group">
                  Sign In <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-4xl px-6 relative">
            <button onClick={() => setIsSearchOpen(false)} className="absolute -top-16 right-6 text-white/50 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artists, collections, or masterpieces..." 
                className="w-full bg-transparent border-b-2 border-white/20 text-3xl md:text-5xl text-white pb-4 px-2 focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors font-serif placeholder-white/20"
              />
              <button type="submit" className="absolute right-4 bottom-6 text-[var(--color-luxury-gold)] hover:text-white transition-colors">
                <Search className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
