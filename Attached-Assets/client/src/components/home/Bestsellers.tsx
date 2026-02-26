import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Reusing generated images for mock data
import gamingImg from '@/assets/category-gaming.png';
import officeImg from '@/assets/category-office.png';
import heroImg from '@/assets/hero-minipc.png';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: 'NUC 13 Pro Desk Edition',
    category: 'Mini PC',
    specs: 'i7-1360P, 32GB RAM, 1TB SSD',
    price: '21 990 Kč',
    badge: 'NOVINKA',
    img: heroImg,
  },
  {
    id: 2,
    name: 'Beelink SER6 Max',
    category: 'Mini PC',
    specs: 'Ryzen 7 7735HS, 16GB, 500GB',
    price: '14 490 Kč',
    badge: 'SLEVA -15%',
    badgeColor: 'destructive',
    img: officeImg,
  },
  {
    id: 3,
    name: 'Minisforum UM790 Pro',
    category: 'Gaming',
    specs: 'Ryzen 9 7940HS, 32GB, 1TB',
    price: '18 990 Kč',
    img: gamingImg,
  },
  {
    id: 4,
    name: 'Geekom AS6',
    category: 'Gaming',
    specs: 'Ryzen 9 6900HX, 32GB, 1TB',
    price: '16 590 Kč',
    img: heroImg,
  }
];

const filters = ['Všechny', 'Mini PC', 'Konzole', 'Příslušenství'];

export default function Bestsellers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('Všechny');
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.from('.bs-header', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 20, opacity: 0, duration: 0.6
      });
      
      gsap.from('.bs-card', {
        scrollTrigger: {
          trigger: '.bs-grid',
          start: 'top 80%',
        },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = (name: string) => {
    toast({
      title: "Přidáno do košíku",
      description: `${name} byl úspěšně přidán.`,
      duration: 3000,
    });
  };

  return (
    <section ref={containerRef} className="py-24 bg-[#111118]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        
        <div className="bs-header flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Bestsellery
            </h2>
            <p className="text-[#9494A8] text-sm">(8 produktů)</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f 
                    ? 'bg-[#00E5FF] text-[#0A0A0F]' 
                    : 'bg-[#1A1A24] text-[#9494A8] hover:text-white border border-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bs-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bs-card group bg-[#1A1A24] rounded-xl border border-white/5 overflow-hidden card-hover flex flex-col">
              
              <div className="aspect-[4/3] relative overflow-hidden bg-[#0A0A0F]">
                {p.badge && (
                  <div className={`absolute top-3 left-3 z-20 px-2 py-1 rounded-full text-[10px] font-bold ${
                    p.badgeColor === 'destructive' ? 'bg-[#FF3366] text-white' : 'bg-[#00E5FF] text-[#0A0A0F]'
                  }`}>
                    {p.badge}
                  </div>
                )}
                <img 
                  src={p.img} 
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-105 opacity-90"
                />
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <span className="font-mono text-[10px] text-[#00E5FF] uppercase mb-1">{p.category}</span>
                <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
                <p className="font-mono text-xs text-[#6B6B80] mb-4">{p.specs}</p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xl font-bold text-white font-mono">{p.price}</span>
                  <button 
                    onClick={() => handleAddToCart(p.name)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#0A0A0F] transition-colors"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
