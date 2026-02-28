import { useParams, Link } from "wouter";
import { mockProducts } from "../lib/mock-data";
import { BentoGrid, BentoCard } from "../components/BentoCard";
import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";
import { ArrowLeft, Star, Truck, Shield, Check, Plus, Minus, Cpu, MemoryStick, HardDrive, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import gsap from "gsap";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("popis");
  const t = useT();

  const product = mockProducts.find(p => p.id === id) ?? mockProducts.find(p => p.featured) ?? mockProducts[0];

  useEffect(() => {
    gsap.fromTo('.detail-bento',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
    );
  }, [id]);

  if (!product) {
    return <div className="p-12 text-center text-muted-foreground">{t('product.notFound')}</div>;
  }

  const handleAdd = () => {
    for(let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  return (
    <div className="pb-12 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 mb-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('product.breadShop')}
        </Link>
      </div>

      <BentoGrid>
        {/* ROW 1 */}
        {/* Image Gallery */}
        <BentoCard colSpan={8} rowSpan={2} noPadding className="detail-bento bg-background group">
          <div className="relative w-full h-full min-h-[400px]">
            <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent opacity-60" />
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-border text-foreground text-xs font-bold rounded-full">
                {product.category.toUpperCase()}
              </span>
            </div>
          </div>
        </BentoCard>

        {/* Purchase Box */}
        <BentoCard colSpan={4} className="detail-bento flex flex-col">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-zinc-600'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-2">({product.reviews} {t('product.tabReviews').toLowerCase()})</span>
          </div>

          <h1 className="text-3xl font-heading font-bold mb-2">{product.name}</h1>
          <p className="text-primary font-mono text-sm mb-6">{product.shortSpecs}</p>

          <div className="text-4xl font-heading font-bold mb-6">{product.price.toLocaleString('cs-CZ')} Kč</div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center rounded-xl border border-border overflow-hidden" style={{ background: 'var(--bg-input)' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-foreground/5 transition-colors" style={{ color: 'var(--text-primary)' }}><Minus className="w-4 h-4"/></button>
              <span className="w-10 text-center font-mono font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-foreground/5 transition-colors" style={{ color: 'var(--text-primary)' }}><Plus className="w-4 h-4"/></button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-foreground transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
            >
              {t('buttons.addToCart')}
            </button>
          </div>

          <div className="space-y-3 mt-auto pt-6 border-t border-border text-sm">
            <div className="flex items-center gap-3 text-emerald-400 font-medium">
              <Check className="w-5 h-5" /> {t('labels.inStock')}
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Truck className="w-5 h-5" /> {t('labels.freeShippingOver')}
            </div>
          </div>
        </BentoCard>

        {/* ROW 2: Specs Mini Cards */}
        <BentoCard colSpan={4} className="detail-bento grid grid-cols-2 gap-4 bg-card/50">
          <div className="p-4 rounded-xl border border-border" style={{ background: 'var(--bg-input)' }}>
            <Cpu className="w-5 h-5 text-primary mb-2" />
            <div className="text-xs text-muted-foreground mb-1">Procesor</div>
            <div className="font-bold text-sm truncate">{product.specs["Procesor"]}</div>
          </div>
          <div className="p-4 rounded-xl border border-border" style={{ background: 'var(--bg-input)' }}>
            <MemoryStick className="w-5 h-5 text-secondary mb-2" />
            <div className="text-xs text-muted-foreground mb-1">RAM</div>
            <div className="font-bold text-sm truncate">{product.specs["RAM"] || "Integrovaná"}</div>
          </div>
          <div className="p-4 rounded-xl border border-border" style={{ background: 'var(--bg-input)' }}>
            <HardDrive className="w-5 h-5 text-[#FF3366] mb-2" />
            <div className="text-xs text-muted-foreground mb-1">{t('product.tabSpecs')}</div>
            <div className="font-bold text-sm truncate">{product.specs["Úložiště"] || "Volitelné"}</div>
          </div>
          <div className="p-4 rounded-xl border border-border" style={{ background: 'var(--bg-input)' }}>
            <Monitor className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-xs text-muted-foreground mb-1">Grafika</div>
            <div className="font-bold text-sm truncate">{product.specs["Grafika"] || "Integrovaná"}</div>
          </div>
        </BentoCard>

        {/* ROW 3: Full width description */}
        <BentoCard colSpan={12} className="detail-bento">
          <div className="flex gap-6 border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('popis')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'popis' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t('product.tabDescription')}
            </button>
            <button
              onClick={() => setActiveTab('parametry')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'parametry' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t('product.tabSpecs')}
            </button>
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'popis' && (
              <div className="text-muted-foreground leading-relaxed max-w-4xl">
                <h3 className="text-xl font-heading font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t('product.tabDescription')}</h3>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'parametry' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-right ml-4">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
