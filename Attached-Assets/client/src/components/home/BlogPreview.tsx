import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useT, useLang } from '../../context/LanguageContext';
import { BookOpen, Rss, ArrowRight } from 'lucide-react';

interface BlogArticle {
  id: string;
  publishDate: string;
  source: string;
  image: string | null;
  tag: string;
  body: string;
  translations: Record<string, { title: string; excerpt: string }>;
}

const TAG_COLORS: Record<string, string> = {
  homelab:   '#00E5FF',
  vmware:    '#7C4DFF',
  selfhosted:'#00BFA5',
  networking:'#FF6D00',
};

export default function BlogPreview() {
  const t = useT();
  const { lang } = useLang();
  const [posts, setPosts] = useState<BlogArticle[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blog-data.json`)
      .then(r => r.json())
      .then((d: { articles: BlogArticle[] }) => {
        const today = new Date().toISOString().slice(0, 10);
        setPosts(d.articles.filter(a => a.publishDate <= today).slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <section className="py-24 px-4 md:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Rss className="w-5 h-5 text-[#00E5FF]" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {t('blog.title')}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/blog" className="flex items-center gap-1 text-sm font-semibold text-[#00E5FF] hover:opacity-80 transition-opacity no-underline">
              {t('buttons.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const tr = post.translations[lang] ?? post.translations['en'] ?? { title: '', excerpt: '' };
            const color = TAG_COLORS[post.tag] || '#00E5FF';

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link
                  href={`/blog/${post.id}`}
                  className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 no-underline h-full"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={tr.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center" style={{ background: `${color}08` }}>
                      <BookOpen className="w-10 h-10" style={{ color: `${color}40` }} />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full self-start mb-3"
                      style={{ color, background: `${color}15` }}
                    >
                      {post.tag}
                    </span>
                    <h3
                      className="font-display font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'rgba(255,255,255,0.82)' }}
                    >
                      {tr.title}
                    </h3>
                    <p className="text-xs text-foreground/40 line-clamp-3 flex-1 leading-relaxed">
                      {tr.excerpt || post.body.slice(0, 140)}
                    </p>
                    <div
                      className="flex items-center gap-1 text-[11px] font-semibold mt-3 opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{ color }}
                    >
                      Read more <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
