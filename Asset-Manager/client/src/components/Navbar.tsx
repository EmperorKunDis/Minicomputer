import { Link, useLocation } from "wouter";
import { useCart } from "../context/CartContext";
import { useLang, useT } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { ShoppingCart, Menu, Home, Grid, User, Sun, Moon, Globe } from "lucide-react";
import { useState } from "react";
import { Lang } from "../lib/translations";

export function Navbar() {
  const [location] = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useT();
  const { lang, setLang, LANG_LABELS } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b px-6 py-4" style={{ background: 'color-mix(in srgb, var(--bg-main) 80%, transparent)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-heading font-bold tracking-tighter hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>
            MINICOMPUTER<span className="text-primary">.CZ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>{t('nav.home')}</Link>
            <Link href="/shop" className={`text-sm font-medium transition-colors ${location === '/shop' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>{t('nav.shop')}</Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{LANG_LABELS[lang]}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  {(['cs','en','de','pl','fr','es'] as Lang[]).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-colors ${lang === l ? 'text-primary' : ''}`}
                      style={{ color: lang === l ? '#00E5FF' : 'var(--text-muted)' }}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-primary transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(124,77,255,0.5)]">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="md:hidden p-2" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t px-6 py-3 flex items-center justify-between" style={{ background: 'color-mix(in srgb, var(--bg-card) 95%, transparent)', borderColor: 'var(--border-color)' }}>
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t('nav.home')}</span>
        </Link>
        <Link href="/shop" className={`flex flex-col items-center gap-1 transition-colors ${location === '/shop' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t('nav.shop')}</span>
        </Link>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-muted-foreground relative transition-colors hover:text-primary"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t('nav.cart')}</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-secondary text-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t('nav.account')}</span>
        </button>
      </div>
    </>
  );
}
