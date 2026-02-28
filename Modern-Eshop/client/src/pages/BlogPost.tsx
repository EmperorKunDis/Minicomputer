import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Globe, Sun, Moon, ShoppingBag, ArrowLeft, ExternalLink, Calendar, Tag, BookOpen } from "lucide-react";
import { useT, useLang } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { Lang } from "../lib/translations";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Article {
  id: string;
  publishDate: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  image: string | null;
  tag: string;
  body: string;
  translations: Record<string, { title: string; excerpt: string; body?: string }>;
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

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const t = useT();
  const { lang, setLang, LANG_LABELS } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { toggleCart, itemsCount } = useCart();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blog-data.json`)
      .then(r => r.json())
      .then((data: BlogData) => {
        const found = data.articles.find(a => a.id === id) ?? null;
        setArticle(found);
      })
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

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

      <div className="container mx-auto max-w-3xl px-6 pt-24 pb-20">
        {loading && <div className="pt-20 text-center text-muted-foreground">{t('blog.loading')}</div>}

        {!loading && !article && (
          <div className="pt-20 flex flex-col items-center gap-4">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">{t('blog.articleNotFound')}</p>
            <Link href="/blog" className="text-primary hover:underline flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
            </Link>
          </div>
        )}

        {!loading && article && (() => {
          const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
          const tagStyle = TAG_COLORS[article.tag] ?? { bg: '#F1F5F9', text: '#64748B' };
          const d = new Date(article.publishDate + 'T00:00:00');
          const dateLocale = lang === 'cs' ? 'cs-CZ' : lang === 'de' ? 'de-DE' : lang === 'pl' ? 'pl-PL' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
          const dateStr = d.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });

          return (
            <>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 mt-4">
                <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: tagStyle.bg, color: tagStyle.text }}>
                  <Tag className="w-3 h-3 inline mr-1" />{article.tag}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" /> {dateStr}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{article.source}</span>
              </div>

              {article.image && (
                <div className="w-full rounded-2xl overflow-hidden mb-8 border border-border" style={{ maxHeight: '420px' }}>
                  <img src={article.image} alt={tr.title} className="w-full h-full object-cover" />
                </div>
              )}

              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-5 text-foreground">
                {tr.title}
              </h1>

              {tr.excerpt && (
                <p className="text-base md:text-lg leading-relaxed mb-8 font-medium border-l-4 pl-4 text-foreground/80"
                  style={{ borderColor: tagStyle.text }}>
                  {tr.excerpt}
                </p>
              )}

              {lang !== 'en' && article.body && (
                <div className="mb-6 px-4 py-3 rounded-xl text-xs border border-border bg-muted text-muted-foreground">
                  ℹ️ {t('blog.bodyLanguageNote')}
                </div>
              )}

              {/* Full Markdown body */}
              {article.body && (
                <div className="blog-body mt-2">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ src, alt }) => (
                        <img
                          src={src ?? ''}
                          alt={alt ?? ''}
                          className="rounded-xl max-w-full h-auto my-6 mx-auto block shadow-md border border-border"
                          loading="lazy"
                        />
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold mt-10 mb-3 text-foreground" style={{ color: tagStyle.text }}>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mt-8 mb-2" style={{ color: tagStyle.text }}>{children}</h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-base font-semibold mt-6 mb-2 text-foreground/80">{children}</h4>
                      ),
                      p: ({ children }) => (
                        <p className="leading-relaxed mb-4 text-sm md:text-base text-foreground/80">{children}</p>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                          style={{ color: tagStyle.text }}>{children}</a>
                      ),
                      pre: ({ children }) => (
                        <pre className="my-6 p-4 rounded-xl overflow-x-auto text-xs font-mono bg-muted border border-border">
                          {children}
                        </pre>
                      ),
                      code: ({ children, className }) => className
                        ? <code className={`${className} font-mono text-xs`}>{children}</code>
                        : <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-muted border border-border text-foreground">{children}</code>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 pl-4 my-4 italic text-muted-foreground"
                          style={{ borderColor: tagStyle.text }}>{children}</blockquote>
                      ),
                      ul: ({ children }) => <ul className="list-disc pl-6 space-y-1 my-4">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1 my-4">{children}</ol>,
                      li: ({ children }) => (
                        <li className="leading-relaxed text-sm md:text-base text-foreground/80">{children}</li>
                      ),
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      hr: () => <hr className="my-8 border-t border-border" />,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="w-full text-sm border-collapse border border-border">{children}</table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="text-left p-3 bg-muted border border-border font-semibold text-foreground">{children}</th>
                      ),
                      td: ({ children }) => (
                        <td className="p-3 border border-border text-foreground/80">{children}</td>
                      ),
                    }}
                  >
                    {article.translations[lang]?.body || article.body}
                  </ReactMarkdown>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">{t('blog.originalSource')}: <strong className="text-foreground">{article.source}</strong></p>
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 text-white"
                  style={{ background: tagStyle.text }}
                >
                  {t('blog.readOriginal')} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
