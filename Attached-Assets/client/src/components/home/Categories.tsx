import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import officeImg from '@/assets/category-office.png';
import gamingImg from '@/assets/category-gaming.png';
import accessoriesImg from '@/assets/category-accessories.png';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    title: 'Mini PC pro kancelář',
    desc: 'Tichý chod, nízká spotřeba, vysoká efektivita pro každodenní práci.',
    count: 12,
    img: officeImg
  },
  {
    id: 2,
    title: 'Mini PC pro gaming',
    desc: 'Nekompromisní výkon v kompaktním balení. Připraveno na nejnovější tituly.',
    count: 8,
    img: gamingImg
  },
  {
    id: 3,
    title: 'Příslušenství',
    desc: 'Klávesnice, myši, monitory a další doplňky pro váš setup.',
    count: 34,
    img: accessoriesImg
  }
];

export default function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.from('.cat-title', {
        scrollTrigger: {
          trigger: '.cat-title',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Cards staggered
      gsap.from('.cat-card', {
        scrollTrigger: {
          trigger: '.cat-cards-container',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-[#0A0A0F] relative">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <h2 className="cat-title text-3xl md:text-4xl font-display font-bold text-white mb-12">
          Prozkoumejte naši nabídku
        </h2>
        
        <div className="cat-cards-container grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="cat-card group relative bg-[#1A1A24] rounded-xl border border-white/5 overflow-hidden cursor-pointer card-hover">
              
              <div className="aspect-[16/10] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A24] to-transparent z-10"></div>
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />
              </div>
              
              <div className="p-6 relative z-20 -mt-8">
                <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-sm text-[#9494A8] mb-6 line-clamp-2">{cat.desc}</p>
                
                <div className="flex items-center text-[#00E5FF] text-sm font-medium">
                  {cat.count} produktů 
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
