import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useT, useLang } from "../context/LanguageContext";
import { ArrowLeft, ExternalLink, Calendar, Tag, BookOpen } from "lucide-react";
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
        <div className="text-muted-foreground animate-pulse">{t('blog.loading')}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        <BookOpen className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">{t('blog.articleNotFound')}</p>
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

        {/* Language note */}
        {lang !== 'en' && article.body && (
          <div className="mb-6 px-4 py-3 rounded-xl text-xs border" style={{ borderColor: `${tagColor}30`, background: `${tagColor}08`, color: 'var(--text-muted)' }}>
            ℹ️ {t('blog.bodyLanguageNote')}
          </div>
        )}

        {/* Full body — rendered as Markdown */}
        {article.body && (
          <div className="blog-body mt-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => (
                  <img
                    src={src ?? ''}
                    alt={alt ?? ''}
                    className="rounded-xl max-w-full h-auto my-6 mx-auto block shadow-lg"
                    loading="lazy"
                    style={{ border: `1px solid ${tagColor}30` }}
                  />
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mt-10 mb-3" style={{ color: tagColor }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mt-8 mb-2" style={{ color: tagColor }}>{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold mt-6 mb-2" style={{ color: `${tagColor}cc` }}>{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="leading-relaxed mb-4 text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.78)' }}>{children}</p>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                    style={{ color: tagColor }}>{children}</a>
                ),
                pre: ({ children }) => (
                  <pre className="my-6 p-4 rounded-xl overflow-x-auto text-xs font-mono"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${tagColor}25` }}>
                    {children}
                  </pre>
                ),
                code: ({ children, className }) => className
                  ? <code className={`${className} font-mono text-xs`}>{children}</code>
                  : <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(255,255,255,0.08)', color: tagColor }}>{children}</code>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 pl-4 my-4 italic opacity-70"
                    style={{ borderColor: tagColor }}>{children}</blockquote>
                ),
                ul: ({ children }) => <ul className="list-disc pl-6 space-y-1 my-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1 my-4">{children}</ol>,
                li: ({ children }) => (
                  <li className="leading-relaxed text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>{children}</li>
                ),
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic opacity-80">{children}</em>,
                hr: () => <hr className="my-8 border-t opacity-20" style={{ borderColor: tagColor }} />,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="text-left p-3 border-b font-semibold" style={{ borderColor: `${tagColor}40`, color: tagColor }}>{children}</th>
                ),
                td: ({ children }) => (
                  <td className="p-3 border-b text-sm" style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)' }}>{children}</td>
                ),
              }}
            >
              {article.translations[lang]?.body || article.body}
            </ReactMarkdown>
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
