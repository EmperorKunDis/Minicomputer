import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useT, useLang } from "../context/LanguageContext";
import { BookOpen, Radio, ArrowRight } from "lucide-react";

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="w-6 h-6 text-[#00E5FF]" />
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">{t('blog.title')}</h1>
          </div>
          <p className="text-foreground/50 max-w-xl mx-auto text-sm">{t('blog.subtitle')}</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {TAGS.map(tag => {
            const color = TAG_COLORS[tag] || '#00E5FF';
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-200"
                style={{
                  borderColor: activeTag === tag ? color : 'rgba(255,255,255,0.08)',
                  color: activeTag === tag ? color : 'rgba(255,255,255,0.4)',
                  background: activeTag === tag ? `${color}12` : 'transparent',
                }}
              >
                {tag === 'all' ? '✦ All' : tag}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="text-center py-20 text-foreground/30 animate-pulse">Loading…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-foreground/30">{t('blog.noArticles')}</div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filtered.map(article => {
            const tr = article.translations[lang] ?? article.translations['en'] ?? { title: '', excerpt: '' };
            const tagColor = TAG_COLORS[article.tag] || '#00E5FF';
            const d = new Date(article.publishDate + 'T00:00:00');
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            const bodyPreview = (article.body || '').slice(0, 180).trim();

            return (
              <motion.div key={article.id} variants={item}>
                <Link
                  href={`/blog/${article.id}`}
                  className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 no-underline h-full"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {article.image ? (
                    <div className="w-full h-44 overflow-hidden">
                      <img src={article.image} alt={tr.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center" style={{ background: `${tagColor}08` }}>
                      <BookOpen className="w-10 h-10" style={{ color: `${tagColor}40` }} />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ color: tagColor, background: `${tagColor}15` }}
                      >
                        {article.tag}
                      </span>
                      <span className="text-[11px] text-foreground/30">{dateStr}</span>
                    </div>
                    <h2
                      className="font-display font-semibold text-sm leading-snug mb-2 line-clamp-2 transition-colors group-hover:opacity-100"
                      style={{ color: 'rgba(255,255,255,0.85)' }}
                    >
                      {tr.title}
                    </h2>
                    <p className="text-xs text-foreground/40 line-clamp-2 mb-1 leading-relaxed">
                      {tr.excerpt || bodyPreview}
                    </p>
                    {article.body && (
                      <p className="text-xs text-foreground/25 line-clamp-2 leading-relaxed">
                        {bodyPreview}…
                      </p>
                    )}
                    <div
                      className="flex items-center justify-between pt-3 mt-auto border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-[11px] text-foreground/30 truncate max-w-[60%]">{article.source}</span>
                      <span
                        className="flex items-center gap-1 text-[11px] font-semibold transition-opacity group-hover:opacity-100 opacity-50"
                        style={{ color: tagColor }}
                      >
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
