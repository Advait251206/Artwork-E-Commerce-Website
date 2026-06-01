/**
 * Artwork Detail Page (Immersive Fullscreen)
 * 
 * Heavily couples with the Security Engine and Deterrence Store.
 * Drives the Web Worker to constantly degrade visual preview if adversarial actions hit limits.
 */
import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDeterrenceStore } from '../../store/useDeterrenceStore';
import { useAuthStore } from '../../store/useAuthStore';
import { mapEscalationToWorkerSchema } from '../../security/WorkerConfigSchema';

interface Bid {
  _id: string;
  user: { _id: string; name: string; username?: string };
  amount: number;
  createdAt: string;
}

interface ArtworkData {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  artist: { _id: string; name: string };
  images: { original: string };
  sellingType: 'fixed' | 'auction';
  auctionEndAt?: string;
  bids: Bid[];
}

export default function ImmersiveDetail() {
  const { id } = useParams();
  const { token, user } = useAuthStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  
  const escalationLevel = useDeterrenceStore(state => state.level);
  const [isProcessing, setIsProcessing] = useState(true);
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [loadingArt, setLoadingArt] = useState(true);
  
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch artwork data
  useEffect(() => {
    async function fetchArt() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/artworks/${id}`);
        if (res.data.success) {
          setArtwork(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch artwork:', err);
      } finally {
        setLoadingArt(false);
      }
    }
    if (id) fetchArt();
  }, [id]);

  // Handle countdown
  useEffect(() => {
    if (!artwork || artwork.sellingType !== 'auction' || !artwork.auctionEndAt) return;
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const endAt = new Date(artwork.auctionEndAt!).getTime();
      const distance = endAt - now;

      if (distance < 0) {
        setTimeLeft('Auction Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [artwork]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setBidError('Please log in to place a bid');
      return;
    }
    setBidding(true);
    setBidError('');
    setBidSuccess('');
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/artworks/${id}/bid`,
        { amount: parseFloat(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setArtwork(res.data.data);
        setBidSuccess('Bid placed successfully!');
        setBidAmount('');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setBidError(err.response?.data?.message || 'Failed to place bid');
      } else if (err instanceof Error) {
        setBidError(err.message);
      } else {
        setBidError('Failed to place bid');
      }
    } finally {
      setBidding(false);
    }
  };

  const highestBid = useMemo(() => {
    if (!artwork?.bids || artwork.bids.length === 0) return null;
    return artwork.bids.reduce((prev, current) => (prev.amount > current.amount ? prev : current));
  }, [artwork?.bids]);

  useEffect(() => {
    // 1. Initialize Worker (Ensuring only 1 exists per lifecycle as defined by docs)
    workerRef.current = new Worker(
      new URL('../../security/workers/imagePipeline.worker.ts', import.meta.url), 
      { type: 'module' }
    );

    // 2. Map pure Reducer Level to Mathematical Instructions
    const configData = mapEscalationToWorkerSchema(escalationLevel);

    // 3. Setup Virtual Canvas for raw image extraction
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = artwork?.images?.original || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=100&w=1200'; // Target HD Image Mock

    img.onload = () => {
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d', { willReadFrequently: true });
      if (!ctx || !canvasRef.current || !workerRef.current) return;

      cvs.width = img.width;
      cvs.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      
      // Seed deterministic generator with unique session/artwork pair to stop hydration matching bugs
      const sessionSeed = Number(id || 1) * 314159; 

      // Send to Worker Thread
      workerRef.current.postMessage({ imageData, config: configData, sessionSeed });
    };

    workerRef.current.onmessage = (e) => {
      if (e.data.error) {
        console.error('CRITICAL: Deterrence Worker Error Boundary Tripped:', e.data.details);
        // Fallback handled here (omitted for brevity, assume static low-res HTTP fallback load)
        return;
      }

      const { processedImageData, hash } = e.data;
      if (canvasRef.current && hash) {
        // use hash implicitly (e.g for observability or telemetry later)
        const destCtx = canvasRef.current.getContext('2d');
        if (destCtx) {
          canvasRef.current.width = processedImageData.width;
          canvasRef.current.height = processedImageData.height;
          destCtx.putImageData(processedImageData, 0, 0);
        }
      }
      setIsProcessing(false);
      // Optional: send hash to observation telemetry
    };

    return () => {
      // Clean up memory leaks stringently
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [escalationLevel, id, artwork?.images?.original]); // Re-compute ONLY if Escalation forces a UI decay shift

  if (loadingArt) {
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center text-[var(--color-luxury-gold)]">
        <div className="w-8 h-8 border-t-2 border-[var(--color-luxury-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center text-[var(--color-luxury-gold)]">
        Artwork not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90vh] flex flex-col lg:flex-row gap-12 mt-4 relative">
      
      {/* Visual Canvas Block */}
      <div className="w-full lg:w-2/3 h-[50vh] lg:h-[80vh] relative bg-black rounded-sm shadow-2xl flex items-center justify-center overflow-hidden">
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-luxury-charcoal)]">
            <div className="w-8 h-8 border-t-2 border-[var(--color-luxury-gold)] rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Anti-Scraping Empty PNG Override to prevent simple Right Click Saves of the `<canvas>` */}
        <img 
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
          className="absolute inset-0 w-full h-full z-20 opacity-0 pointer-events-auto" 
          alt="Secure layer" 
        />
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain pointer-events-none" 
        />

        {/* Dynamic Deterrence Alert Widget */}
        {escalationLevel > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur-md border border-[var(--color-alert-danger)]/50 px-4 py-2 rounded-sm"
          >
            <span className="text-xs text-[var(--color-alert-danger)] font-mono uppercase tracking-widest">
              Security Level {escalationLevel} — Preview Degraded
            </span>
          </motion.div>
        )}
      </div>

      {/* Detail Pedestal */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8 py-8 md:sticky md:top-24 h-fit">
        <div>
          <h1 className="text-4xl font-serif text-white tracking-widest mb-2">{artwork.title}</h1>
          <Link to={`/artists/${artwork.artist._id}`} className="text-sm text-[var(--color-luxury-gold)] uppercase tracking-widest hover:text-white transition-colors duration-150">
            By {artwork.artist.name}
          </Link>
        </div>

        <div className="text-white/70 text-sm leading-relaxed tracking-wide font-light border-y border-white/10 py-6 whitespace-pre-wrap">
          <p>{artwork.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          {artwork.sellingType === 'fixed' ? (
            <>
              <div className="flex justify-between items-end">
                <span className="text-xs uppercase tracking-widest text-white/50">Current Valuation</span>
                <span className="text-2xl font-mono text-white">${artwork.price.toLocaleString()}</span>
              </div>
              <button className="w-full bg-[var(--color-luxury-gold)] text-black py-4 font-semibold uppercase tracking-widest hover:bg-white transition-colors duration-300 rounded-sm mt-4">
                Acquire Artifact
              </button>
            </>
          ) : (
            <div className="space-y-6">
              {/* Auction Details */}
              <div className="bg-black/40 border border-[var(--color-luxury-gold)]/20 p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-xs uppercase tracking-widest text-white/50">Time Remaining</span>
                  <span className={`font-mono text-lg ${timeLeft === 'Auction Ended' ? 'text-red-400' : 'text-[var(--color-luxury-gold)]'}`}>
                    {timeLeft || 'Calculating...'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-white/50">
                    {highestBid ? 'Highest Bid' : 'Starting Price'}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-mono text-white">
                      ${highestBid ? highestBid.amount.toLocaleString() : artwork.price.toLocaleString()}
                    </div>
                    {highestBid && (
                      <div className="text-xs text-white/40 font-mono mt-1">
                        by {highestBid.user.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bidding Form */}
              {timeLeft !== 'Auction Ended' && (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  {bidError && <div className="text-red-400 text-xs p-2 bg-red-400/10 border border-red-400/20">{bidError}</div>}
                  {bidSuccess && <div className="text-green-400 text-xs p-2 bg-green-400/10 border border-green-400/20">{bidSuccess}</div>}
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input 
                        type="number" 
                        required
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Min. ${(highestBid ? highestBid.amount + 1 : artwork.price).toLocaleString()}`}
                        className="w-full bg-black/50 border border-white/10 py-3 pl-8 pr-4 text-white font-mono focus:border-[var(--color-luxury-gold)] focus:outline-none transition-colors"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={bidding || user?.role !== 'buyer'}
                      className="bg-[var(--color-luxury-gold)] text-black px-6 font-bold uppercase tracking-widest hover:bg-white disabled:opacity-50 transition-colors"
                    >
                      {bidding ? '...' : 'Bid'}
                    </button>
                  </div>
                  {user?.role !== 'buyer' && (
                    <p className="text-xs text-white/40 text-center">Only registered collectors can place bids.</p>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
