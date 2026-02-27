import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { useT } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { mockProducts } from '../../lib/mock-data';

gsap.registerPlugin(ScrollTrigger);

export default function Bestsellers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const t = useT();
  const { addToCart } = useCart();

  const filters = [
    { key: 'all', label: t('labels.allCategories') },
    { key: 'Mini PC', label: t('labels.miniPC') },
  ];

  const displayProducts = activeFilter === 'all'
    ? mockProducts
    : mockProducts.filter(p => p.category === activeFilter);

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

  return (
    <section ref={containerRef} className="py-24 bg-popover">
      <div className="container mx-auto px-6 max-w-[1280px]">

        <div className="bs-header flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {t('home.popularProducts')}
            </h2>
            <p className="text-muted-foreground text-sm">({mockProducts.length} {t('shop.products')})</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bs-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(p => (
            <div key={p.id} className="bs-card group bg-card rounded-xl border border-border overflow-hidden card-hover flex flex-col">

              <Link href={`/product/${p.id}`} className="block aspect-[4/3] relative overflow-hidden bg-background">
                {p.isNew && (
                  <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                    {t('labels.new')}
                  </div>
                )}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-105"
                />
              </Link>

              <div className="p-5 flex-1 flex flex-col">
                <span className="font-mono text-[10px] text-primary uppercase mb-1">{p.category}</span>
                <Link href={`/product/${p.id}`}>
                  <h3 className="text-base font-bold text-foreground mb-1 hover:text-primary transition-colors cursor-pointer">{p.name}</h3>
                </Link>
                <p className="font-mono text-xs text-muted-foreground mb-4">{p.shortSpecs}</p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xl font-bold text-foreground font-mono">{p.price.toLocaleString('cs-CZ')} Kč</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
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
