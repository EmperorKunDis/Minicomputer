import { useState, useEffect } from "react";
import { useT, useLang } from "../context/LanguageContext";
import { ExternalLink, BookOpen, Rss } from "lucide-react";

interface Article {
  id: string;
  publishDate: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  image: string | null;
  tag: string;
  translations: Record<string, { title: string; excerpt: string }>;
}

interface BlogData {
  generated: string;
  articles: Article[];
}

const TAG_COLORS: Record<string, string> = {
  homelab:   'var(--color-primary, #00E5FF)',
  vmware:    '#7C4DFF',
  selfhosted:'#00BFA5',
  networking:'#FF6D00',
};

const TAGS = ['all', 'homelab', 'vmware', 'selfhosted', 'networking'];

export default function Blog() {
  const t = useT();
  const { lang } = useLang();
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
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-background text-foreground">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Rss className="w-6 h-6 text-primary" />
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">{t('blog.title')}</h1>
          </div>
          <p className="text-foreground/60 max-w-2xl">{t('blog.subtitle')}</p>
        </div>

        {/* Tag filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeTag === tag
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-white/10 text-foreground/50 hover:border-white/30 hover:text-foreground/80'
              }`}
            >
              {tag === 'all' ? 'All' : tag}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20 text-foreground/40 animate-pulse">Loading…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-foreground/40">{t('blog.noArticles')}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(article => {
            const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
            const tagColor = TAG_COLORS[article.tag] || '#00E5FF';
            const d = new Date(article.publishDate + 'T00:00:00');
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <a
                key={article.id}
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-white/5 bg-card overflow-hidden hover:border-primary/30 hover:shadow-glow transition-all duration-300 no-underline"
              >
                {article.image ? (
                  <div className="w-full h-44 overflow-hidden">
                    <img src={article.image} alt={tr.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-tech flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-foreground/20" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: tagColor, background: `${tagColor}20` }}>
                      {article.tag}
                    </span>
                    <span className="text-xs text-foreground/40">{dateStr}</span>
                  </div>
                  <h2 className="font-display font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {tr.title}
                  </h2>
                  <p className="text-sm text-foreground/60 line-clamp-3 flex-1 mb-4">
                    {tr.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs text-foreground/40 truncate max-w-[60%]">{article.source}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                      {t('blog.readOriginal')} <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
