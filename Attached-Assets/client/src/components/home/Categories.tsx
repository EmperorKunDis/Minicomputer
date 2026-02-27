import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import officeImg from '@/assets/category-office.png';
import gamingImg from '@/assets/category-gaming.png';
import accessoriesImg from '@/assets/category-accessories.png';
import { useT } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const categories = [
    {
      id: 1,
      titleKey: 'labels.miniPC',
      descKey: 'home.heroSubtitle',
      count: 12,
      img: officeImg
    },
    {
      id: 2,
      titleKey: 'labels.consoles',
      descKey: 'home.heroSubtitle',
      count: 8,
      img: gamingImg
    },
    {
      id: 3,
      titleKey: 'labels.accessories',
      descKey: 'home.heroSubtitle',
      count: 34,
      img: accessoriesImg
    }
  ];

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
    <section ref={containerRef} className="py-24 bg-background relative">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <h2 className="cat-title text-3xl md:text-4xl font-display font-bold text-foreground mb-12">
          {t('home.categories')}
        </h2>

        <div className="cat-cards-container grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="cat-card group relative bg-card rounded-xl border border-border overflow-hidden cursor-pointer card-hover">

              <div className="aspect-[16/10] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10"></div>
                <img
                  src={cat.img}
                  alt={t(cat.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />
              </div>

              <div className="p-6 relative z-20 -mt-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{t(cat.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{t(cat.descKey)}</p>

                <div className="flex items-center text-primary text-sm font-medium">
                  {cat.count} {t('shop.products')}
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
