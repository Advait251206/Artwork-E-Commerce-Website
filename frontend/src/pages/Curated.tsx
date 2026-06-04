
export default function Curated() {
  return (
    <div className="w-full min-h-screen bg-[var(--color-luxury-charcoal)] text-white pt-24 px-6 lg:px-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl md:text-7xl font-serif text-[var(--color-luxury-gold)] mb-6 uppercase tracking-widest">
        Curated Collection
      </h1>
      <p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed mb-12">
        An exclusive selection of masterpieces handpicked by our expert curators. 
        This gallery is currently being assembled and will be unveiled to collectors soon.
      </p>
      <div className="w-24 h-px bg-[var(--color-luxury-gold)] opacity-50"></div>
    </div>
  );
}
