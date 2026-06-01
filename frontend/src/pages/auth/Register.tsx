/**
 * Registration Page
 * 
 * Incorporates Tiered Role Selection (Collector vs Artist) organically into the flow.
 */
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [role, setRole] = useState<'collector' | 'artist'>('collector');
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [penName, setPenName] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: Record<string, string> = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        role: role === 'collector' ? 'buyer' : 'artist',
      };

      if (role === 'collector' && username) payload.username = username;
      if (role === 'artist' && penName) payload.penName = penName;

      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // Success - save token & show message
      if (data.data && data.data.accessToken) {
        setAuth(data.data.accessToken, data.data.user);
      }
      
      setSuccess('Application submitted & approved! Welcome to Aura.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
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
        className="w-full max-w-lg bg-[var(--color-luxury-surface)] border border-white/10 p-10 rounded-sm shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-luxury-gold)] to-transparent opacity-50"></div>
        
        <h1 className="text-3xl font-serif text-white uppercase tracking-widest text-center mb-2">Request Access</h1>
        <p className="text-xs text-center text-[var(--color-text-secondary)] uppercase tracking-widest mb-8">
          Aura is highly curated. Membership is approved conditionally.
        </p>

        {/* Role Selection Toggle */}
        <div className="flex w-full mb-8 border border-white/20 p-1 rounded-sm bg-black/30">
          <button 
            type="button"
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-semibold transition-colors duration-300 rounded-sm ${role === 'collector' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
            onClick={() => setRole('collector')}
          >
            Collector
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-semibold transition-colors duration-300 rounded-sm ${role === 'artist' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
            onClick={() => setRole('artist')}
          >
            Artist
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-sm text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 border border-green-500/50 text-green-200 p-3 rounded-sm text-sm text-center">
              {success}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="first_name" className="text-xs text-white/70 uppercase tracking-widest font-semibold">First Name</label>
              <input id="first_name" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="last_name" className="text-xs text-white/70 uppercase tracking-widest font-semibold">Last Name</label>
              <input id="last_name" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs text-white/70 uppercase tracking-widest font-semibold">Email Address</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm" />
          </div>

          {role === 'collector' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-col gap-2"
            >
              <label htmlFor="username" className="text-xs text-white/70 uppercase tracking-widest font-semibold">Username</label>
              <input id="username" type="text" required placeholder="@your_handle" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm" />
            </motion.div>
          )}

          {role === 'artist' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-col gap-2"
            >
              <label htmlFor="penName" className="text-xs text-[var(--color-luxury-gold)] uppercase tracking-widest font-semibold">Pen Name (Required)</label>
              <input id="penName" type="text" required placeholder="Your artist alias" value={penName} onChange={(e) => setPenName(e.target.value)} className="w-full bg-black/50 border border-[var(--color-luxury-gold)]/50 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm" />
            </motion.div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs text-white/70 uppercase tracking-widest font-semibold">Passphrase</label>
            <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors duration-300 rounded-sm" />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-white text-black py-4 font-semibold uppercase tracking-widest transition-colors duration-300 rounded-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-luxury-gold)] hover:text-white'}`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/50 tracking-widest uppercase">
          Already approved? <Link to="/login" className="text-white hover:text-[var(--color-luxury-gold)] transition-colors duration-150">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
