import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Filter, SlidersHorizontal, ChevronDown, Check, X, ShoppingCart } from "lucide-react";
import { mockProducts, ProductCategory } from "../lib/mock-data";
import { useCart } from "../store/useCart";
import { useT } from "../context/LanguageContext";
import product1Img from "../assets/images/product-1.png";

function getProductImg(src: string, fallbackSeed: string): string {
  if (src.startsWith('/')) return src;
  if (src === 'product-1') return product1Img;
  return `https://picsum.photos/seed/${fallbackSeed}/400/400`;
}

export default function Shop() {
  const { addItem } = useCart();
  const t = useT();
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'Vše'>('Vše');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories: (ProductCategory | 'Vše')[] = ['Vše', 'Mini PC'];
  const categoryLabels: Record<string, string> = {
    'Vše': t('labels.allCategories'),
    'Mini PC': t('labels.miniPC'),
  };

  const filteredProducts = activeCategory === 'Vše'
    ? mockProducts
    : mockProducts.filter(p => p.category === activeCategory);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-bold text-lg mb-4">{t('home.categories')}</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                activeCategory === cat ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-white/5'
              }`}
            >
              {categoryLabels[cat] || cat}
              {activeCategory === cat && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">{t('shop.sortBy')}</h3>
        </div>
        <div className="px-2">
          <input type="range" className="w-full accent-primary" min="0" max="30000" />
          <div className="flex justify-between text-xs text-foreground/50 mt-2">
            <span>0 Kč</span>
            <span>30 000+ Kč</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-4">{t('shop.filters')}</h3>
        <div className="space-y-3">
          {['Intel', 'AMD', 'Apple'].map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                <Check size={14} className="opacity-0 text-primary" />
              </div>
              <span className="text-foreground/80 group-hover:text-foreground transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">

        {/* Header & Breadcrumbs */}
        <div className="mb-10">
          <div className="flex text-sm text-foreground/50 mb-4 gap-2">
            <Link href="/" className="hover:text-primary transition-colors">{t('product.breadHome')}</Link>
            <span>/</span>
            <span className="text-foreground">{t('nav.shop')}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">{t('shop.title')}</h1>
              <p className="text-foreground/60">{t('shop.showing')} {filteredProducts.length} {t('shop.products')}</p>
            </div>

            <button
              className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg font-medium"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter size={18} />
              {t('shop.filters')}
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm text-foreground/70">
              <span>{t('shop.sortBy')}</span>
              <select className="bg-background border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-primary">
                <option>{t('shop.sortNewest')}</option>
                <option>{t('shop.sortPriceAsc')}</option>
                <option>{t('shop.sortPriceDesc')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
            <FilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: prefersReducedMotion ? 0 : i * 0.03, duration: prefersReducedMotion ? 0 : 0.35 }}
                  key={product.id}
                  className="bg-card rounded-2xl border border-white/10 overflow-hidden card-hover group flex flex-col"
                >
                  <Link href={`/product/${product.id}`} className="block relative aspect-square bg-secondary/50 p-6">
                    {product.badges.length > 0 && (
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        {product.badges.map(b => (
                          <span key={b} className="text-xs font-bold px-2 py-1 rounded bg-primary text-background">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="w-full h-full relative z-0 flex items-center justify-center">
                      <img
                        src={getProductImg(product.image, product.id)}
                        alt={product.name}
                        className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ${product.image.startsWith('/') ? 'object-cover rounded-lg' : 'mix-blend-screen'}`}
                      />
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <div className="text-xs text-primary font-mono mb-1">{product.category}</div>
                      <h3 className="font-display font-bold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      {product.specs.cpu && (
                        <div className="text-xs text-foreground/50 mt-2 line-clamp-1">
                          {product.specs.cpu} • {product.specs.ram}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        {product.originalPrice && (
                          <div className="text-xs text-foreground/40 line-through">
                            {product.originalPrice.toLocaleString('cs-CZ')} Kč
                          </div>
                        )}
                        <div className="font-bold text-xl">
                          {product.price.toLocaleString('cs-CZ')} Kč
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(product);
                        }}
                        className="group/btn relative flex items-center justify-center h-10 w-10 hover:w-auto hover:px-4 bg-white/5 hover:bg-primary rounded-full transition-all duration-300 overflow-hidden"
                      >
                        <ShoppingCart size={18} className="text-foreground group-hover/btn:text-background shrink-0" />
                        <span className="w-0 opacity-0 group-hover/btn:w-auto group-hover/btn:opacity-100 group-hover/btn:ml-2 text-background font-bold text-sm whitespace-nowrap transition-all duration-300">
                          {t('buttons.addToCart')}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load more */}
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 font-medium transition-colors">
                {t('buttons.readMore')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-card border-t border-white/10 rounded-t-3xl p-6 h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-bold text-2xl">{t('shop.filters')}</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar pb-6">
                <FilterSidebar />
              </div>
              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-4 rounded-xl bg-primary text-background font-bold"
                >
                  {t('shop.showing')} {filteredProducts.length} {t('shop.products')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
