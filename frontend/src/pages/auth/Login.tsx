/**
 * Login Page
 * 
 */
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Success - save token
      if (data.data?.accessToken) {
        setAuth(data.data.accessToken, data.data.user);
      }
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md bg-[var(--color-luxury-surface)] border border-white/10 p-10 rounded-sm shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-luxury-gold)] to-transparent opacity-50"></div>
        
        <h1 className="text-3xl font-serif text-white uppercase tracking-widest text-center mb-2">Access</h1>
        <p className="text-xs text-center text-[var(--color-text-secondary)] uppercase tracking-widest mb-10">
          Enter the sanctuary
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-sm text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs text-white/70 uppercase tracking-widest font-semibold flex justify-between">
              Email Address / Alias
            </label>
            <input 
              id="email" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm"
              placeholder="curator@aura.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <label htmlFor="password" className="text-xs text-white/70 uppercase tracking-widest font-semibold">
                Passphrase
              </label>
              <Link to="/forgot" className="text-[10px] text-[var(--color-luxury-gold)] uppercase tracking-widest hover:text-white transition-colors duration-150">
                Recover
              </Link>
            </div>
            <input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm"
              placeholder="••••••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full mt-4 bg-white text-black py-4 font-semibold uppercase tracking-widest transition-colors duration-300 rounded-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-luxury-gold)] hover:text-white'}`}
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/50 tracking-widest uppercase">
          Not holding an invitation? <Link to="/register" className="text-white hover:text-[var(--color-luxury-gold)] transition-colors duration-150">Request Access</Link>
        </p>
      </motion.div>
    </div>
  );
}
