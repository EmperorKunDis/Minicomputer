import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImg from '@/assets/hero-minipc.png';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProduct() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imgRef.current) return;
    
    // Parallax effect
    gsap.to(imgRef.current, {
      y: '10%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

  }, []);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] to-[#111118] z-0"></div>
      
      <div className="container mx-auto px-6 max-w-[1280px] relative z-10 text-center">
        
        <div className="inline-block px-4 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold font-mono tracking-wider mb-8">
          PRODUKT MĚSÍCE
        </div>
        
        <div className="max-w-[800px] mx-auto relative mb-12">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#7C4DFF]/20 blur-[120px] rounded-full z-0"></div>
          
          <img 
            ref={imgRef}
            src={heroImg} 
            alt="Featured Product" 
            className="w-full h-auto relative z-10 drop-shadow-2xl"
          />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
            Minisforum EliteMini HX90
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {['Ryzen 9 5900HX', 'Radeon™ Graphics', '32GB DDR4', '512GB PCIe SSD'].map((spec, i) => (
              <div key={i} className="bg-[#1A1A24] border border-white/5 py-3 rounded-lg text-sm text-[#9494A8] font-mono">
                {spec}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <span className="text-3xl font-bold text-white font-mono">19 490 Kč</span>
            <button className="bg-[#00E5FF] text-[#0A0A0F] font-bold px-8 py-4 rounded-lg hover:bg-[#00E5FF]/90 transition-colors flex items-center">
              Zjistit více <span className="ml-2">→</span>
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
}
