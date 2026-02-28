import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
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
      <div className="min-h-screen pt-28 flex items-center justify-center bg-background">
        <div className="text-foreground/40 animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4 bg-background text-foreground">
        <BookOpen className="w-12 h-12 text-foreground/20" />
        <p className="text-foreground/40">Article not found.</p>
        <Link href="/blog" className="text-primary hover:underline flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
        </Link>
      </div>
    );
  }

  const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
  const tagColor = TAG_COLORS[article.tag] || '#00E5FF';
  const d = new Date(article.publishDate + 'T00:00:00');
  const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const paragraphs = (article.body || '').split('\n\n').filter(p => p.trim().length > 10);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background text-foreground">
      <div className="container mx-auto max-w-3xl px-4 md:px-8">

        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: tagColor, background: `${tagColor}15` }}>
              <Tag className="w-3 h-3 inline mr-1" />{article.tag}
            </span>
            <span className="flex items-center gap-1 text-xs text-foreground/40">
              <Calendar className="w-3.5 h-3.5" /> {dateStr}
            </span>
            <span className="text-xs text-foreground/30 ml-auto">{article.source}</span>
          </div>

          {article.image && (
            <div className="w-full rounded-2xl overflow-hidden mb-8 border border-white/5" style={{ maxHeight: '420px' }}>
              <img src={article.image} alt={tr.title} className="w-full h-full object-cover" />
            </div>
          )}

          <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight mb-5" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {tr.title}
          </h1>

          {tr.excerpt && (
            <p className="text-base md:text-lg leading-relaxed mb-8 font-medium border-l-2 pl-4"
              style={{ color: 'rgba(255,255,255,0.75)', borderColor: tagColor }}>
              {tr.excerpt}
            </p>
          )}

          {lang !== 'en' && article.body && (
            <div className="mb-6 px-4 py-3 rounded-xl text-xs border" style={{ borderColor: `${tagColor}25`, background: `${tagColor}08`, color: 'rgba(255,255,255,0.4)' }}>
              ℹ️ {t('blog.bodyLanguageNote')}
            </div>
          )}

          {paragraphs.length > 0 && (
            <div className="space-y-4">
              {paragraphs.map((para, i) => {
                const isHeading = para.length < 100 && i > 0;
                return isHeading ? (
                  <h2 key={i} className="text-lg font-display font-bold mt-8 mb-2" style={{ color: tagColor }}>
                    {para}
                  </h2>
                ) : (
                  <p key={i} className="leading-relaxed text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {para}
                  </p>
                );
              })}
            </div>
          )}

          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t('blog.originalSource')}: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{article.source}</strong>
            </p>
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: tagColor, color: '#000' }}
            >
              {t('blog.readOriginal')} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
