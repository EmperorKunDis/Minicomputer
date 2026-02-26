import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImg from '@/assets/hero-minipc.png';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Parallax effect for the image
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        y: '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // Entrance animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.hero-title', { 
        y: 40, opacity: 0, duration: 1, delay: 0.1, ease: 'power3.out',
      });
      gsap.from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out', stagger: 0.1 });
      gsap.from('.hero-trust', { opacity: 0, duration: 1, delay: 0.6 });
      
      if (imgRef.current) {
        gsap.from(imgRef.current, { scale: 1.05, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power2.out' });
      }
      
      // Floating badges
      gsap.to('.float-badge-1', { y: -10, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.float-badge-2', { y: 10, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
      gsap.to('.float-badge-3', { y: -8, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-[#0A0A0F]">
      <div className="container mx-auto px-6 max-w-[1280px] flex flex-col md:flex-row items-center gap-12">
        
        {/* Text Column (55%) */}
        <div ref={textRef} className="w-full md:w-[55%] z-10">
          <div className="hero-badge inline-block font-mono text-[11px] text-[#00E5FF] tracking-[0.15em] font-bold mb-6 px-3 py-1 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5">
            MINICOMPUTER.CZ
          </div>
          
          <h1 className="hero-title text-5xl md:text-6xl lg:text-[64px] font-display font-bold leading-[1.1] mb-6 text-[#F0F0F5]">
            Technologie, která se <br/>
            <span className="text-gradient">vejde na dlaň</span>
          </h1>
          
          <p className="hero-desc text-lg md:text-xl text-[#9494A8] mb-10 max-w-[540px] leading-relaxed">
            Výkonné mini počítače pro práci, gaming i domácí kino. Česká zákaznická podpora, rychlé doručení.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button className="hero-cta bg-[#00E5FF] text-[#0A0A0F] font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-[#00E5FF]/90 transition-colors">
              Prozkoumat obchod
            </button>
            <button className="hero-cta bg-transparent border border-white/10 text-white font-medium text-sm px-7 py-3.5 rounded-lg hover:bg-white/5 transition-colors">
              Více o nás
            </button>
          </div>
          
          <div className="hero-trust flex flex-wrap items-center gap-4 text-[13px] text-[#6B6B80]">
            <span className="flex items-center gap-1"><span className="text-[#00E5FF]">✓</span> Doprava zdarma od 3999 Kč</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1"><span className="text-[#00E5FF]">✓</span> Záruka 3 roky</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1"><span className="text-[#00E5FF]">✓</span> Expedice do 24h</span>
          </div>
        </div>

        {/* Visual Column (45%) */}
        <div className="w-full md:w-[45%] relative mt-12 md:mt-0">
          <div className="absolute inset-0 bg-[#00E5FF] opacity-5 blur-[100px] rounded-full"></div>
          
          <div className="relative">
            <img 
              ref={imgRef}
              src={heroImg} 
              alt="High-end Mini PC" 
              className="w-full h-auto object-cover rounded-2xl border border-white/5 shadow-2xl"
            />
            
            {/* Floating Spec Badges */}
            <div className="float-badge-1 absolute top-4 -left-4 md:-left-8 bg-[#1A1A24]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
              <span className="font-mono text-xs text-white">Ryzen 7</span>
            </div>
            <div className="float-badge-2 absolute bottom-20 -right-4 md:-right-8 bg-[#1A1A24]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
              <span className="font-mono text-xs text-white">32 GB DDR5</span>
            </div>
            <div className="float-badge-3 absolute top-1/2 -right-6 bg-[#1A1A24]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
              <span className="font-mono text-xs text-white">1TB NVMe</span>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
