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
  homelab:   'var(--color-primary, #00E5FF)',
  vmware:    '#7C4DFF',
  selfhosted:'#00BFA5',
  networking:'#FF6D00',
};

const RAW_COLORS: Record<string, string> = {
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
        <div className="text-foreground/40 animate-pulse">{t('blog.loading')}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4 bg-background text-foreground">
        <BookOpen className="w-12 h-12 text-foreground/30" />
        <p className="text-foreground/50">{t('blog.articleNotFound')}</p>
        <Link href="/blog" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
        </Link>
      </div>
    );
  }

  const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
  const tagColor = TAG_COLORS[article.tag] || '#00E5FF';
  const rawColor = RAW_COLORS[article.tag] || '#00E5FF';
  const d = new Date(article.publishDate + 'T00:00:00');
  const dateLocale = lang === 'cs' ? 'cs-CZ' : lang === 'de' ? 'de-DE' : lang === 'pl' ? 'pl-PL' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
  const dateStr = d.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background text-foreground">
      <div className="container mx-auto max-w-3xl px-4 md:px-8">

        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t('blog.backToBlog')}
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: tagColor, background: `${rawColor}20` }}>
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

        <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight mb-5">
          {tr.title}
        </h1>

        {tr.excerpt && (
          <p className="text-base md:text-lg leading-relaxed mb-8 font-medium border-l-2 pl-4 text-foreground/80"
            style={{ borderColor: rawColor }}>
            {tr.excerpt}
          </p>
        )}

        {lang !== 'en' && article.body && (
          <div className="mb-6 px-4 py-3 rounded-xl text-xs border border-white/10 text-foreground/40 bg-white/3">
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
                    className="rounded-xl max-w-full h-auto my-6 mx-auto block shadow-lg"
                    loading="lazy"
                    style={{ border: `1px solid ${rawColor}25` }}
                  />
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-display font-bold mt-10 mb-3" style={{ color: rawColor }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-display font-semibold mt-8 mb-2" style={{ color: rawColor }}>{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold mt-6 mb-2" style={{ color: `${rawColor}cc` }}>{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="leading-relaxed mb-4 text-sm md:text-base text-foreground/75">{children}</p>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                    style={{ color: rawColor }}>{children}</a>
                ),
                pre: ({ children }) => (
                  <pre className="my-6 p-4 rounded-xl overflow-x-auto text-xs font-mono bg-white/4 border border-white/10">
                    {children}
                  </pre>
                ),
                code: ({ children, className }) => className
                  ? <code className={`${className} font-mono text-xs`}>{children}</code>
                  : <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-white/10" style={{ color: rawColor }}>{children}</code>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 pl-4 my-4 italic text-foreground/60"
                    style={{ borderColor: rawColor }}>{children}</blockquote>
                ),
                ul: ({ children }) => <ul className="list-disc pl-6 space-y-1 my-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1 my-4">{children}</ol>,
                li: ({ children }) => (
                  <li className="leading-relaxed text-sm md:text-base text-foreground/75">{children}</li>
                ),
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
                hr: () => <hr className="my-8 border-t border-white/10" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="text-left p-3 border-b font-semibold" style={{ borderColor: `${rawColor}40`, color: rawColor }}>{children}</th>
                ),
                td: ({ children }) => (
                  <td className="p-3 border-b border-white/6 text-sm text-foreground/75">{children}</td>
                ),
              }}
            >
              {article.translations[lang]?.body || article.body}
            </ReactMarkdown>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-foreground/40 mb-3">{t('blog.originalSource')}: <strong className="text-foreground/60">{article.source}</strong></p>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 text-background"
            style={{ background: rawColor }}
          >
            {t('blog.readOriginal')} <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
