import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Wifi,
  Box,
  Usb,
  ShoppingBag,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getProduct, products } from "@/lib/products";
import { useCart } from "../context/CartContext";
import { useT, useLang } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Lang } from "../lib/translations";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const iconMap = {
  cpu: Cpu,
  memory: MemoryStick,
  storage: HardDrive,
  display: Monitor,
  wifi: Wifi,
  size: Box,
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const product = getProduct(params.id ?? "") ?? products[0];
  const [activeImg, setActiveImg] = useState(0);
  const { addItem, toggleCart, itemsCount } = useCart();
  const t = useT();
  const { lang, setLang, LANG_LABELS } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('product.breadHome')}</h1>
          <Link href="/">
            <Button variant="outline">{t('buttons.backToHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-100">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl tracking-tight hover:text-primary transition-colors">
            minicomputer.cz
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#overview" className="hover:text-foreground transition-colors">{t('product.tabDescription')}</a>
            <a href="#features" className="hover:text-foreground transition-colors">{t('product.tabSpecs')}</a>
            <a href="#specs" className="hover:text-foreground transition-colors">{t('product.tabSpecs')}</a>
          </nav>
          <div className="flex items-center gap-3">
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
            <Button
              className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-blue-500/20 transition-all"
              onClick={() => { addItem(product); }}
            >
              {t('buttons.addToCart')}
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section id="overview" className="relative overflow-hidden pt-12 lg:pt-20 pb-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="max-w-3xl z-10 relative"
              >
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wider mb-6">
                  {product.badge}
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight whitespace-pre-line">
                  {product.name}. {"\n"}
                  <span className="text-gradient-blue">{product.tagline.split("\n")[1]}</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
                  {product.shortDesc}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="rounded-full px-8 text-lg h-14 bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/10"
                    onClick={() => addItem(product)}
                  >
                    <ShoppingBag className="mr-2" size={20} />
                    {product.ctaText}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 text-lg h-14 border-border"
                    onClick={() => document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {t('product.tabSpecs')}
                  </Button>
                </div>
              </motion.div>

              {/* Hero Image with gallery */}
              <motion.div
                initial={{ opacity: 1, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full max-w-3xl mt-16 relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-muted">
                  <img
                    src={product.galleryImages[activeImg]}
                    alt={`${product.name} - ${activeImg + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {product.galleryImages.length > 1 && (
                  <div className="flex gap-2 mt-4 justify-center flex-wrap">
                    {product.galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                          activeImg === i ? "border-blue-500" : "border-transparent hover:border-muted-foreground"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Specs Bento Grid */}
        <section className="py-20 bg-muted" id="features">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{product.highlights[0]?.title}</h2>
              <p className="text-muted-foreground">
                {product.dimensions} · {product.weight}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {product.highlights.map((h, i) => {
                const Icon = iconMap[h.icon];
                const colClass = h.wide ? "col-span-1 md:col-span-2" : "";
                const colors = [
                  "bg-blue-50 text-blue-600",
                  "bg-purple-50 text-purple-600",
                  "bg-green-50 text-green-600",
                  "bg-orange-50 text-orange-600",
                  "bg-teal-50 text-teal-600",
                  "bg-pink-50 text-pink-600",
                ];
                return (
                  <div
                    key={i}
                    className={`bg-card p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow ${colClass}`}
                  >
                    <div className={`h-12 w-12 ${colors[i % colors.length]} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{h.title}</h3>
                    <p className="text-muted-foreground mb-4">{h.desc}</p>
                    {h.detail && (
                      <div className="bg-muted rounded-2xl p-4 inline-flex items-center gap-3">
                        <div className="text-sm font-semibold">{h.detail}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LCP Feature (optional) */}
        {product.lcpFeature && (
          <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{product.lcpFeature.title}</h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{product.lcpFeature.desc}</p>
                  <ul className="space-y-4">
                    {product.lcpFeature.bullets.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-medium">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">✓</div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2 relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-[3rem] transform rotate-3 opacity-10"></div>
                  <img
                    src={product.lcpFeature.image}
                    alt={product.name}
                    className="relative rounded-[2.5rem] shadow-2xl z-10 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Full Specifications */}
        <section id="specs" className="py-24 bg-gray-900 text-white rounded-[3rem] mx-4 lg:mx-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 blur-[120px] rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="container mx-auto px-6 lg:px-16 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{t('product.tabSpecs')}</h2>
              <p className="text-gray-400">{product.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-4xl mx-auto">
              {product.specs.map((spec, i) => (
                <div key={i} className="border-b border-gray-800 pb-4">
                  <div className="text-gray-400 text-sm mb-1">{spec.label}</div>
                  <div className="text-xl font-medium">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-gray-800/50 rounded-3xl p-8 max-w-4xl mx-auto border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Usb className="text-blue-400" /> Ports
              </h3>
              <div className="flex flex-wrap gap-4">
                {product.ports.map((port, i) => (
                  <span key={i} className="px-4 py-2 bg-gray-800 rounded-full text-sm">{port}</span>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-sm text-gray-400">
                  <strong>{t('product.tabDescription')}:</strong> {product.boxContent}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-6">
            {product.originalPrice && (
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="text-muted-foreground line-through text-2xl">{product.originalPrice.toLocaleString("cs-CZ")} Kč</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">{t('labels.sale')}</span>
              </div>
            )}
            <div className="text-5xl font-extrabold mb-4">
              {product.price.toLocaleString("cs-CZ")} Kč
            </div>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {product.shortDesc}
            </p>
            <Button
              size="lg"
              className="rounded-full px-12 text-lg h-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-blue-500/20"
              onClick={() => addItem(product)}
            >
              <ShoppingBag className="mr-2" size={20} />
              {product.ctaText}
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="font-display font-bold text-xl text-muted-foreground hover:text-foreground transition-colors">minicomputer.cz</Link>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} minicomputer.cz s.r.o. {t('footer.rights')}
          </div>
          <div className="text-muted-foreground text-sm">
            info@minicomputer.cz
          </div>
        </div>
      </footer>
    </div>
  );
}
