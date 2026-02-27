import { useState, useEffect, useRef } from "react";
import { mockProducts } from "../lib/mock-data";
import { BentoGrid, BentoCard } from "../components/BentoCard";
import { Link } from "wouter";
import { Plus, Filter } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";
import gsap from "gsap";

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState("Všechny");
  const { addToCart } = useCart();
  const gridRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const filters = ["Všechny", "Mini PC"];

  const filteredProducts = activeFilter === "Všechny"
    ? mockProducts
    : mockProducts.filter(p => p.category === activeFilter);

  useEffect(() => {
    // Layout animation mock using basic GSAP stagger
    gsap.fromTo('.product-card',
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }
    );
  }, [activeFilter]);

  const getFilterLabel = (f: string) => {
    if (f === "Všechny") return t('labels.allCategories');
    if (f === "Mini PC") return t('labels.miniPC');
    return f;
  };

  return (
    <div className="pb-12 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold">{t('shop.title')}</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth">
          <div className="flex items-center gap-2 mr-2 text-zinc-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">{t('shop.filters')}</span>
          </div>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'bg-foreground/5 text-zinc-400 hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              {getFilterLabel(f)}
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef}>
        <BentoGrid>
          {filteredProducts.map((product, index) => {
            // Make every 4th item bigger if it's the "Všechny" view, to create an interesting grid
            const isLarge = activeFilter === "Všechny" && index % 5 === 0;

            return (
            <BentoCard
              key={product.id}
              colSpan={isLarge ? 8 : 4}
              rowSpan={isLarge ? 2 : undefined}
              noPadding
              className={`flex flex-col group product-card`}
            >
              <Link href={`/product/${product.id}`} className={`block relative ${isLarge ? 'h-[300px] md:h-full' : 'h-48'} overflow-hidden bg-background`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-md border border-border text-foreground text-[10px] font-bold rounded">
                    {product.category.toUpperCase()}
                  </span>
                  {product.isNew && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded">{t('labels.new')}</span>
                  )}
                </div>
              </Link>
              <div className={`p-6 flex flex-col flex-1 bg-gradient-to-b from-transparent to-card ${isLarge ? 'absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/90 to-transparent pt-20' : ''}`}>
                <div className="text-xs text-primary font-mono mb-2">{product.shortSpecs}</div>
                <Link href={`/product/${product.id}`} className={`${isLarge ? 'text-3xl' : 'text-lg'} font-bold leading-tight mb-4 hover:text-primary transition-colors`}>
                  {product.name}
                </Link>
                {isLarge && <p className="text-sm text-zinc-300 mb-6 max-w-md line-clamp-2">{product.description}</p>}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-heading font-bold text-xl">{product.price.toLocaleString('cs-CZ')} Kč</span>
                  <button
                    onClick={(e) => { e.preventDefault(); addToCart(product); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-primary hover:text-primary-foreground transition-colors font-medium text-sm border border-border"
                  >
                    <Plus className="w-4 h-4" /> {t('buttons.addToCart')}
                  </button>
                </div>
              </div>
            </BentoCard>
          )})}

          {filteredProducts.length === 0 && (
             <div className="col-span-12 text-center py-20 text-zinc-500">
               {t('shop.noProducts')}
             </div>
          )}
        </BentoGrid>
      </div>
    </div>
  );
}
