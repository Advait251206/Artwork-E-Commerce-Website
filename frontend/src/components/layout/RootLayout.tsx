/**
 * Root Application Layout
 * 
 * Enforces unified spacing, structural A11y, and hosts the Navbar/Footer.
 */
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-luxury-charcoal)] text-[var(--color-text-primary)]">
      {/* Skip Navigation for Keyboard A11y */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-[var(--color-luxury-gold)] text-black px-4 py-2 rounded-md font-semibold"
      >
        Skip to main content
      </a>

      <Navbar />
      
      <main id="main-content" className="flex-grow pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
