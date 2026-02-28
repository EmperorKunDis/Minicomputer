import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Search, ShoppingCart, Sun, Moon, Globe } from 'lucide-react';
import { gsap } from 'gsap';
import { useT, useLang } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { Lang } from '../../lib/translations';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = useT();
  const { lang, setLang, LANG_LABELS } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <header
      ref={headerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 bg-background/80 backdrop-blur-md border-b border-border' : 'py-6 bg-transparent'
      }`}
    >
      {/* Mouse tracking highlight */}
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 z-[-1] transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 229, 255, 0.04), transparent 40%)`
          }}
        />
      )}

      <div className="container mx-auto px-6 max-w-[1280px] flex items-center justify-between">
        <Link href="/">
          <span className="font-display font-semibold text-xl tracking-tight cursor-pointer">
            minicomputer<span className="text-[#00E5FF]">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-foreground">
          <Link href="/"><span className="hover:text-primary transition-colors cursor-pointer">{t('nav.home')}</span></Link>
          <div className="group relative py-2">
            <Link href="/shop"><span className="hover:text-primary transition-colors cursor-pointer">{t('nav.shop')}</span></Link>
          </div>
          <Link href="/blog"><span className="hover:text-primary transition-colors cursor-pointer">{t('nav.blog')}</span></Link>
          <Link href="/about"><span className="hover:text-primary transition-colors cursor-pointer">{t('nav.about')}</span></Link>
          <Link href="/faq"><span className="hover:text-primary transition-colors cursor-pointer">FAQ</span></Link>
          <Link href="/contact"><span className="hover:text-primary transition-colors cursor-pointer">{t('nav.contact')}</span></Link>
        </nav>

        <div className="flex items-center space-x-5">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-sm"
            >
              <Globe size={16} strokeWidth={1.5} />
              <span className="text-xs font-medium">{LANG_LABELS[lang]}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 rounded-lg overflow-hidden border border-border bg-popover">
                {(['cs','en','de','pl','fr','es'] as Lang[]).map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-xs font-medium hover:bg-foreground/5 transition-colors ${lang === l ? 'text-primary' : 'text-foreground/60'}`}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="text-foreground hover:text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          </button>

          <button className="text-foreground hover:text-primary transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
