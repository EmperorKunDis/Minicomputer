import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useT, useLang } from "../context/LanguageContext";
import { ArrowLeft, ExternalLink, Calendar, Tag, BookOpen } from "lucide-react";

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

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const t = useT();
  const { lang } = useLang();
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        <div className="text-muted-foreground animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        <BookOpen className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">Article not found.</p>
        <Link href="/blog" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
        </Link>
      </div>
    );
  }

  const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
  const tagColor = TAG_COLORS[article.tag] || '#00E5FF';
  const d = new Date(article.publishDate + 'T00:00:00');
  const dateStr = d.toLocaleDateString(
    lang === 'cs' ? 'cs-CZ' : lang === 'de' ? 'de-DE' : lang === 'pl' ? 'pl-PL' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  // Split body into paragraphs
  const paragraphs = (article.body || '').split('\n\n').filter(p => p.trim().length > 10);

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <div className="max-w-[780px] mx-auto px-4 md:px-8">

        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-xs font-bold uppercase px-3 py-1 rounded-full" style={{ color: tagColor, background: `${tagColor}18` }}>
            <Tag className="w-3 h-3 inline mr-1" />{article.tag}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" /> {dateStr}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">{article.source}</span>
        </div>

        {/* Hero image */}
        {article.image && (
          <div className="w-full rounded-2xl overflow-hidden mb-8" style={{ maxHeight: '420px' }}>
            <img src={article.image} alt={tr.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-5" style={{ color: 'var(--text-primary)' }}>
          {tr.title}
        </h1>

        {/* Translated excerpt / lead */}
        {tr.excerpt && (
          <p className="text-base md:text-lg leading-relaxed mb-8 font-medium border-l-2 pl-4" style={{ color: 'var(--text-primary)', borderColor: tagColor, opacity: 0.9 }}>
            {tr.excerpt}
          </p>
        )}

        {/* Language note for body */}
        {lang !== 'en' && article.body && (
          <div className="mb-6 px-4 py-3 rounded-xl text-xs border" style={{ borderColor: `${tagColor}30`, background: `${tagColor}08`, color: 'var(--text-muted)' }}>
            ℹ️ {t('blog.bodyLanguageNote')}
          </div>
        )}

        {/* Full body content */}
        {paragraphs.length > 0 && (
          <div className="prose prose-invert max-w-none space-y-4" style={{ color: 'var(--text-primary)' }}>
            {paragraphs.map((para, i) => {
              const isHeading = para.length < 100 && !para.includes(' — ') && para === para.trim();
              return isHeading && i > 0 ? (
                <h2 key={i} className="text-lg font-bold mt-8 mb-2" style={{ color: tagColor }}>
                  {para}
                </h2>
              ) : (
                <p key={i} className="leading-relaxed text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.78)' }}>
                  {para}
                </p>
              );
            })}
          </div>
        )}

        {/* Read original CTA */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm text-muted-foreground mb-3">{t('blog.originalSource')}: <strong>{article.source}</strong></p>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: tagColor, color: '#000' }}
          >
            {t('blog.readOriginal')} <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
