export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[var(--color-luxury-charcoal)] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl uppercase tracking-widest text-white mb-6">Gallery Unavailable</h2>
      <p className="max-w-md text-white/50 mb-8">
        The exhibition you are looking for does not exist or has been relocated to a private collection.
      </p>
      <a href="/" className="px-8 py-3 bg-[var(--color-luxury-gold)] text-black uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors duration-300">
        Return Home
      </a>
    </div>
  );
}
