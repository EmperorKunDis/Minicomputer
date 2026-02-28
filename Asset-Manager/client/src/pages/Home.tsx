import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { BentoGrid, BentoCard } from "../components/BentoCard";
import { mockProducts, faqData } from "../lib/mock-data";
import { useCart } from "../context/CartContext";
import { useT, useLang } from "../context/LanguageContext";
import { Monitor, Gamepad2, Headphones, ArrowRight, Star, Plus, BookOpen, Rss } from "lucide-react";
import gsap from "gsap";
import { useCountUp } from "../hooks/use-count-up";

interface BlogArticle {
  id: string; publishDate: string; source: string; image: string | null;
  tag: string; body: string;
  translations: Record<string, { title: string; excerpt: string }>;
}

const TAG_COLORS: Record<string, string> = { homelab:'#00E5FF', vmware:'#7C4DFF', selfhosted:'#00BFA5', networking:'#FF6D00' };

function LatestBlogPosts() {
  const t = useT();
  const { lang } = useLang();
  const [posts, setPosts] = useState<BlogArticle[]>([]);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blog-data.json`)
      .then(r => r.json())
      .then((d: { articles: BlogArticle[] }) => {
        const today = new Date().toISOString().slice(0, 10);
        setPosts(d.articles.filter(a => a.publishDate <= today).slice(0, 3));
      }).catch(() => {});
  }, []);
  if (!posts.length) return null;
  return (
    <BentoCard colSpan={8} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rss className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>{t('blog.title')}</h2>
        </div>
        <Link href="/blog" className="flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
          {t('buttons.viewAll')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map(post => {
          const tr = post.translations[lang] ?? post.translations['en'] ?? { title: '', excerpt: '' };
          const color = TAG_COLORS[post.tag] || '#00E5FF';
          return (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex flex-col rounded-xl border p-4 transition-all hover:border-primary/40 no-underline" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {post.image
                ? <img src={post.image} alt={tr.title} className="w-full h-28 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full h-28 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${color}10` }}><BookOpen className="w-8 h-8" style={{ color: `${color}50` }} /></div>
              }
              <span className="text-[10px] font-bold uppercase mb-2 px-2 py-0.5 rounded-full self-start" style={{ color, background: `${color}15` }}>{post.tag}</span>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>{tr.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{tr.excerpt || post.body.slice(0, 100)}</p>
            </Link>
          );
        })}
      </div>
    </BentoCard>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const t = useT();

  const customers = useCountUp(2500);
  const warranty = useCountUp(3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.bento-item',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.1
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const featuredProduct = mockProducts[0];
  const compactProducts = mockProducts.slice(1, 4);

  return (
    <div ref={containerRef} className="pb-12 pt-6">
      <BentoGrid>
        {/* ROW 1 */}
        <BentoCard colSpan={8} rowSpan={2} className="group overflow-hidden bg-gradient-to-br from-card to-background">
          <div className="absolute inset-0 bg-[#00E5FF] opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00E5FF] blur-[120px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />

          <div className="flex flex-col md:flex-row h-full gap-8 relative z-10">
            <div className="flex-1 flex flex-col justify-center items-start">
              <span className="px-3 py-1 bg-foreground/10 text-primary text-xs font-bold rounded-full mb-4 font-mono tracking-wider">
                {t('home.heroBadge')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-[1.1]">
                {t('home.heroTitle').replace(t('home.heroGradient'), '').trim()} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF]">{t('home.heroGradient')}</span>
              </h1>
              <p className="text-zinc-400 mb-8 text-sm md:text-base max-w-md">
                {featuredProduct.description}
              </p>
              <div className="flex items-center gap-6 mt-auto">
                <div>
                  <div className="text-sm text-zinc-500 line-through">21 990 Kč</div>
                  <div className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>{featuredProduct.price.toLocaleString('cs-CZ')} Kč</div>
                </div>
                <button
                  onClick={() => addToCart(featuredProduct)}
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-foreground hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
                >
                  {t('buttons.buyNow')}
                </button>
              </div>
            </div>
            <div className="flex-1 relative hidden md:block">
              <img
                src={featuredProduct.image}
                alt="Featured Mini PC"
                className="absolute inset-0 w-full h-full object-cover rounded-xl border border-border group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </BentoCard>

        <BentoCard colSpan={4} className="flex flex-col justify-center items-center text-center gap-6 py-12">
          <div>
            <div className="text-4xl font-heading font-bold text-primary mb-1">{customers}+</div>
            <div className="text-sm font-medium text-zinc-400">{t('home.customers')}</div>
          </div>
          <div className="w-12 h-[1px] bg-foreground/10" />
          <div>
            <div className="text-4xl font-heading font-bold text-secondary mb-1">{t('home.shippingHours')}</div>
            <div className="text-sm font-medium text-zinc-400">{t('home.shippingTime')}</div>
          </div>
          <div className="w-12 h-[1px] bg-foreground/10" />
          <div>
            <div className="text-4xl font-heading font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{warranty} {t('home.warrantyYears')}</div>
            <div className="text-sm font-medium text-zinc-400">{t('home.warranty')}</div>
          </div>
        </BentoCard>

        {/* ROW 2: Quick Actions */}
        <BentoCard colSpan={3} smallRadius className="group cursor-pointer p-0">
          <Link href="/shop" className="flex items-center gap-4 w-full h-full p-6">
            <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">{t('labels.miniPC')}</div>
              <div className="text-xs text-zinc-500 font-mono">{t('home.products12')}</div>
            </div>
          </Link>
        </BentoCard>

        <BentoCard colSpan={3} smallRadius className="group cursor-pointer p-0">
          <Link href="/shop" className="flex items-center gap-4 w-full h-full p-6">
            <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center group-hover:bg-[#7C4DFF]/20 group-hover:text-[#7C4DFF] transition-colors">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">{t('labels.consoles')}</div>
              <div className="text-xs text-zinc-500 font-mono">5 PRODUKTŮ</div>
            </div>
          </Link>
        </BentoCard>

        <BentoCard colSpan={3} smallRadius className="group cursor-pointer p-0">
          <Link href="/shop" className="flex items-center gap-4 w-full h-full p-6">
            <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center group-hover:bg-[#FF3366]/20 group-hover:text-[#FF3366] transition-colors">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">{t('labels.accessories')}</div>
              <div className="text-xs text-zinc-500 font-mono">24 PRODUKTŮ</div>
            </div>
          </Link>
        </BentoCard>

        <BentoCard colSpan={3} smallRadius noPadding className="bg-gradient-to-r from-[#00E5FF]/20 to-[#7C4DFF]/20 border-none cursor-pointer group">
          <div className="h-full w-full flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="text-center relative z-10">
              <div className="font-bold text-foreground mb-1">{t('home.freeShippingPromo')}</div>
              <div className="text-xs font-mono text-primary">{t('labels.freeShippingThreshold')}</div>
            </div>
          </div>
        </BentoCard>

        {/* ROW 3: Products */}
        {compactProducts.map((product) => (
          <BentoCard key={product.id} colSpan={4} noPadding className="flex flex-col group">
            <Link href={`/product/${product.id}`} className="block relative h-48 overflow-hidden bg-background">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded">
                  {t('labels.new')}
                </span>
              )}
            </Link>
            <div className="p-5 flex flex-col flex-1">
              <div className="text-xs text-zinc-500 font-mono mb-2">{product.shortSpecs}</div>
              <Link href={`/product/${product.id}`} className="font-bold text-lg leading-tight mb-4 hover:text-primary transition-colors">{product.name}</Link>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-heading font-bold text-xl">{product.price.toLocaleString('cs-CZ')} Kč</span>
                <button
                  onClick={(e) => { e.preventDefault(); addToCart(product); }}
                  className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </BentoCard>
        ))}

        {/* ROW 4: Mixed */}
        <BentoCard colSpan={6} hoverable={false} className="relative min-h-[300px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #0A0A0F 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #7C4DFF 0%, transparent 60%), radial-gradient(circle at 80% 20%, #00E5FF 0%, transparent 50%)' }} />
          <div className="relative z-10 flex flex-col justify-end h-full">
            <span className="text-primary font-bold font-mono text-sm mb-2">{t('home.guideTag')}</span>
            <h3 className="text-3xl font-heading font-bold text-foreground mb-4">{t('home.guideTitle')}<br/>{t('home.guideSubtitle')}</h3>
            <button className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors w-max">
              {t('buttons.readMore')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </BentoCard>

        <BentoCard colSpan={6} className="flex flex-col justify-center">
          <div className="flex gap-1 mb-6">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
          </div>
          <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed mb-6">
            "{t('home.heroReview')}"
          </blockquote>
          <div className="flex items-center gap-4 mt-auto">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C4DFF] to-[#00E5FF] p-[2px]">
              <div className="w-full h-full bg-card rounded-full flex items-center justify-center font-bold text-sm">JN</div>
            </div>
            <div>
              <div className="font-bold">{t('home.heroReviewAuthor')}</div>
              <div className="text-xs text-primary font-medium flex items-center gap-1">
                ✓ {t('home.reviewVerified')}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* ROW 5 */}
        <BentoCard colSpan={4}>
          <h3 className="font-bold mb-4">{t('home.faqTitle')}</h3>
          <div className="space-y-4">
            {faqData.slice(0, 2).map((faq, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{faq.q}</div>
                <div className="text-xs text-zinc-400 line-clamp-2">{faq.a}</div>
              </div>
            ))}
          </div>
        </BentoCard>

        <LatestBlogPosts />

        <BentoCard colSpan={8} className="bg-[#7C4DFF]/10 flex flex-col md:flex-row items-center justify-center gap-8 border-[#7C4DFF]/30">
          <div className="flex-1">
            <h3 className="text-2xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('home.newsletterTitle')}</h3>
            <p className="text-zinc-400 text-sm">{t('home.newsletterSubtitle')}</p>
          </div>
          <div className="flex-1 w-full flex gap-2">
            <input
              type="email"
              placeholder={t('home.newsletterPlaceholder')}
              className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:border-[#7C4DFF] transition-colors"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            />
            <button className="bg-secondary text-foreground font-bold px-6 py-3 rounded-xl hover:bg-foreground hover:text-background transition-colors">
              {t('buttons.subscribe')}
            </button>
          </div>
        </BentoCard>

      </BentoGrid>
    </div>
  );
}
