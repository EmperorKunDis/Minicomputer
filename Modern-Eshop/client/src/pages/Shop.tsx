import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Globe, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { useCart } from "../context/CartContext";
import { useT, useLang } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Lang } from "../lib/translations";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

type SortKey = 'featured' | 'price-asc' | 'price-desc';

export default function Shop() {
  const { addItem, toggleCart, itemsCount } = useCart();
  const [, navigate] = useLocation();
  const t = useT();
  const { lang, setLang, LANG_LABELS } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('featured');

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [sort]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl tracking-tight hover:text-primary transition-colors">
            minicomputer.cz
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
              <Link href="/shop" className="text-foreground font-semibold">{t('nav.shop')}</Link>
              <a href="mailto:info@minicomputer.cz" className="hover:text-foreground transition-colors">{t('nav.contact')}</a>
            </nav>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Globe size={16} />
                  <span>{LANG_LABELS[lang]}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    {(['cs','en','de','pl','fr','es'] as Lang[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangMenuOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${lang === l ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                      >{LANG_LABELS[l]}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={toggleTheme} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            <button onClick={toggleCart} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag size={20} />
              {itemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="pt-12 pb-8 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3">{t('shop.title')}</h1>
            <p className="text-muted-foreground text-lg">{t('shop.subtitle')}</p>
          </div>
        </section>

        {/* Sort Bar */}
        <section className="pb-8">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {t('shop.showing')} {sorted.length} {t('shop.of')} {products.length} {t('shop.products')}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('shop.sortBy')}</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="text-sm border border-border rounded-xl px-3 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="featured">{t('shop.sortFeatured')}</option>
                  <option value="price-asc">{t('shop.sortPriceAsc')}</option>
                  <option value="price-desc">{t('shop.sortPriceDesc')}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {sorted.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={i}
                >
                  <div className="group bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="aspect-[4/3] bg-muted overflow-hidden">
                        <img
                          src={product.heroImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold text-primary tracking-wider uppercase mb-1 block">
                            {product.badge}
                          </span>
                          <h2 className="text-xl font-bold">{product.name}</h2>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          {product.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {product.originalPrice.toLocaleString("cs-CZ")} Kč
                            </div>
                          )}
                          <div className="text-xl font-extrabold">
                            {product.price.toLocaleString("cs-CZ")} Kč
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.shortDesc}</p>
                      <div className="text-xs text-muted-foreground mb-4">{product.dimensions} · {product.weight}</div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => addItem(product)}
                        >
                          <ShoppingBag size={14} className="mr-1.5" />
                          {t('buttons.addToCart')}
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full border-border" onClick={() => navigate(`/product/${product.id}`)}>
                          {t('buttons.viewDetail')} <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-display font-bold text-xl text-muted-foreground">minicomputer.cz</div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} minicomputer.cz s.r.o. {t('footer.rights')}
          </div>
          <div className="text-muted-foreground text-sm">info@minicomputer.cz</div>
        </div>
      </footer>
    </div>
  );
}
