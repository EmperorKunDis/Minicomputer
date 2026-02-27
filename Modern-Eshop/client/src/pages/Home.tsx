import { useState } from "react";
import { Link } from "wouter";
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

export default function Home() {
  const { toggleCart, itemsCount } = useCart();
  const t = useT();
  const { lang, setLang, LANG_LABELS } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display font-bold text-xl tracking-tight">minicomputer.cz</div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/shop" className="hover:text-foreground transition-colors">{t('nav.shop')}</Link>
              <a href="mailto:info@minicomputer.cz" className="hover:text-foreground transition-colors">{t('nav.contact')}</a>
              <a href="https://www.minicomputer.cz" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">minicomputer.cz</a>
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
        {/* Hero */}
        <section className="pt-16 pb-20 text-center">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wider mb-6">
                MINI PC
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
                {t('home.heroTitle')}<br />
                <span className="text-gradient-blue">{t('home.heroGradient')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
                {t('home.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={i + 1}
                >
                  <Link href={`/product/${product.id}`} className="group block bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      <img
                        src={product.heroImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-xs font-semibold text-primary tracking-wider uppercase mb-1 block">
                            {product.badge}
                          </span>
                          <h2 className="text-2xl font-bold">{product.name}</h2>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          {product.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {product.originalPrice.toLocaleString("cs-CZ")} Kč
                            </div>
                          )}
                          <div className="text-2xl font-extrabold">
                            {product.price.toLocaleString("cs-CZ")} Kč
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{product.shortDesc}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{product.dimensions} · {product.weight}</div>
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                          {t('buttons.viewDetail')} <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">{t('home.needHelp')}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('home.needHelpSub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full px-8 bg-gray-900 text-white hover:bg-gray-800"
                onClick={() => window.location.href = "mailto:info@minicomputer.cz"}
              >
                {t('buttons.writeEmail')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-border"
                onClick={() => window.open("https://www.minicomputer.cz", "_blank")}
              >
                minicomputer.cz
              </Button>
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
