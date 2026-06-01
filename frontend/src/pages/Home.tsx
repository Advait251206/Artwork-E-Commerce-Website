/**
 * Home Page (Landing)
 * 
 * Aggregates Tier 3 Hero and Tier 2 Interactive Grids within the RootLayout constraints.
 */
import { Suspense, lazy } from 'react';
import { ArtworkGrid } from '../components/interactive/ArtworkGrid';

// Lazy load the heaviest Tier 3 component to pass BundleSizer limits
const HeroScene = lazy(() => import('../components/3d/HeroScene'));

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-12">
      <Suspense fallback={<div className="w-full h-[60vh] bg-[var(--color-luxury-charcoal)] animate-pulse" />}>
        <HeroScene />
      </Suspense>

      <section className="text-center max-w-3xl mx-auto py-12 border-b border-white/5">
        <h2 className="text-3xl font-serif text-white tracking-widest uppercase mb-4">
          The Gallery of <span className="text-[var(--color-luxury-gold)] italic">Tomorrow</span>
        </h2>
        <p className="text-sm text-white/60 leading-relaxed uppercase tracking-widest">
          Aura is an exclusive sanctuary for digital fine arts. Access is strictly curated to ensure
          uncompromising quality and providence.
        </p>
      </section>

      <ArtworkGrid />
    </div>
  );
}
