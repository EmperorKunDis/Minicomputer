import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useT, useLang } from "../context/LanguageContext";
import { BookOpen, Tag, ArrowRight } from "lucide-react";

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

const TAG_COLORS: Record<string, string> = {
  homelab:   '#00E5FF',
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
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">{t('blog.title')}</h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('blog.subtitle')}</p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-4 py-1.5 rounded-full text-sm font-bold border transition-all"
              style={{
                borderColor: activeTag === tag ? (TAG_COLORS[tag] || 'var(--primary)') : 'var(--border-color)',
                color: activeTag === tag ? (TAG_COLORS[tag] || 'var(--primary)') : 'var(--text-muted)',
                background: activeTag === tag ? `${TAG_COLORS[tag] || 'var(--primary)'}15` : 'transparent',
              }}
            >
              {tag === 'all' ? '★ All' : tag}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">{t('blog.noArticles')}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(article => {
            const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
            const tagColor = TAG_COLORS[article.tag] || '#00E5FF';
            const d = new Date(article.publishDate + 'T00:00:00');
            const dateStr = d.toLocaleDateString(
              lang === 'cs' ? 'cs-CZ' : lang === 'de' ? 'de-DE' : lang === 'pl' ? 'pl-PL' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
              { day: 'numeric', month: 'short', year: 'numeric' }
            );
            const bodyPreview = (article.body || '').slice(0, 180).trim();

            return (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] no-underline"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                {/* Image or placeholder */}
                {article.image ? (
                  <div className="w-full h-44 overflow-hidden">
                    <img src={article.image} alt={tr.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-full h-44 flex items-center justify-center" style={{ background: `${tagColor}10` }}>
                    <BookOpen className="w-12 h-12 opacity-30" style={{ color: tagColor }} />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ color: tagColor, background: `${tagColor}15` }}>
                      <Tag className="w-2.5 h-2.5 inline mr-1" />{article.tag}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{dateStr}</span>
                  </div>
                  <h2 className="font-heading font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {tr.title}
                  </h2>
                  {/* Show translated excerpt first, then body preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    {tr.excerpt || bodyPreview}
                  </p>
                  {article.body && (
                    <p className="text-xs text-muted-foreground line-clamp-2 opacity-60">
                      {bodyPreview}…
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 mt-auto border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-xs text-muted-foreground truncate max-w-[60%]">{article.source}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold transition-colors group-hover:text-primary" style={{ color: tagColor }}>
                      Číst více <ArrowRight className="w-3 h-3" />
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
