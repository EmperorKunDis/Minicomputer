import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Globe, Sun, Moon, ShoppingBag, Rss, BookOpen, ArrowRight } from "lucide-react";
import { useT, useLang } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { Lang } from "../lib/translations";

interface Article {
  id: string;
  publishDate: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  image: string | null;
  tag: string;
  body: string;
  translations: Record<string, { title: string; excerpt: string }>;
}

interface BlogData {
  generated: string;
  articles: Article[];
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  homelab:    { bg: '#EFF6FF', text: '#2563EB' },
  vmware:     { bg: '#F5F3FF', text: '#7C3AED' },
  selfhosted: { bg: '#ECFDF5', text: '#059669' },
  networking: { bg: '#FFF7ED', text: '#EA580C' },
};

const TAGS = ['all', 'homelab', 'vmware', 'selfhosted', 'networking'];

export default function Blog() {
  const t = useT();
  const { lang, setLang, LANG_LABELS } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { toggleCart, itemsCount } = useCart();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('all');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blog-data.json`)
      .then(r => r.json())
      .then((data: BlogData) => {
        const today = new Date().toISOString().slice(0, 10);
        const visible = data.articles
          .filter(a => a.publishDate <= today)
          .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
        setArticles(visible);
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTag === 'all' ? articles : articles.filter(a => a.tag === activeTag);

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
              <Link href="/shop" className="hover:text-foreground transition-colors">{t('nav.shop')}</Link>
              <Link href="/blog" className="text-foreground font-semibold">{t('nav.blog')}</Link>
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

      {/* Page header */}
      <div className="pt-16 border-b border-border bg-card">
        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="flex items-center gap-2 mb-2">
            <Rss className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">RSS Feed</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('blog.title')}</h1>
          <p className="text-muted-foreground max-w-2xl">{t('blog.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-wrap gap-2 mb-8">
          {TAGS.map(tag => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {tag === 'all' ? 'All posts' : tag}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="text-center py-20 text-muted-foreground">Loading articles…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">{t('blog.noArticles')}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(article => {
            const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
            const tagStyle = TAG_COLORS[article.tag] ?? { bg: '#F1F5F9', text: '#64748B' };
            const d = new Date(article.publishDate + 'T00:00:00');
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            const bodyPreview = (article.body || '').slice(0, 180).trim();

            return (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 no-underline"
              >
                {article.image ? (
                  <div className="w-full h-44 overflow-hidden bg-muted">
                    <img src={article.image} alt={tr.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary/30" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: tagStyle.bg, color: tagStyle.text }}>
                      {article.tag}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{dateStr}</span>
                  </div>
                  <h2 className="font-semibold text-foreground text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {tr.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    {tr.excerpt || bodyPreview}
                  </p>
                  {article.body && (
                    <p className="text-xs text-muted-foreground/60 line-clamp-2">
                      {bodyPreview}…
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 mt-auto border-t border-border">
                    <span className="text-xs text-muted-foreground truncate max-w-[60%]">{article.source}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
