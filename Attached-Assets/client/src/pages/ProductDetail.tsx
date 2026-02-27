import { useRoute, Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronRight, Star, Truck, Shield } from "lucide-react";
import Header from "../components/layout/Header";
import { mockProducts } from "../lib/mock-data";
import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { addToCart } = useCart();
  const t = useT();
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const product = mockProducts.find(p => p.id === params?.id) || mockProducts[0];

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-[1280px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <Link href="/"><span className="hover:text-[#00E5FF] cursor-pointer transition-colors">{t('product.breadHome')}</span></Link>
            <ChevronRight size={14} />
            <Link href="/shop"><span className="hover:text-[#00E5FF] cursor-pointer transition-colors">{t('product.breadShop')}</span></Link>
            <ChevronRight size={14} />
            <span style={{ color: 'hsl(var(--foreground))' }}>{product.name}</span>
          </nav>

          {/* Product Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {product.isNew && (
                <span className="inline-block px-2 py-0.5 bg-[#00E5FF] text-[#0A0A0F] text-xs font-bold rounded mb-4">
                  {t('labels.new')}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{product.name}</h1>
              <p className="text-sm font-mono mb-4" style={{ color: '#00E5FF' }}>{product.shortSpecs}</p>

              <div className="flex items-center gap-2 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} className={i <= Math.floor(product.rating) ? 'fill-[#00E5FF] text-[#00E5FF]' : ''} style={{ color: 'hsl(var(--muted-foreground))' }} />
                ))}
                <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>({product.reviews})</span>
              </div>

              <div className="mb-6">
                {product.originalPrice && (
                  <div className="text-sm line-through" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {product.originalPrice.toLocaleString('cs-CZ')} Kč
                  </div>
                )}
                <div className="text-4xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                  {product.price.toLocaleString('cs-CZ')} Kč
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 mb-4 transition-all hover:opacity-90"
                style={{ background: '#00E5FF', color: '#0A0A0F' }}
              >
                <ShoppingCart size={20} /> {t('buttons.addToCart')}
              </button>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ borderColor: 'hsl(var(--border))' }}>
                  <Truck size={16} style={{ color: '#00E5FF' }} />
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'hsl(var(--foreground))' }}>{t('product.delivery')}</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('product.deliveryTime')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ borderColor: 'hsl(var(--border))' }}>
                  <Shield size={16} style={{ color: '#00E5FF' }} />
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'hsl(var(--foreground))' }}>{t('product.warrantyLabel')}</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('product.warrantyDuration')}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 border-b mb-8" style={{ borderColor: 'hsl(var(--border))' }}>
              {([
                { key: 'description', label: t('product.tabDescription') },
                { key: 'specs', label: t('product.tabSpecs') },
                { key: 'reviews', label: t('product.tabReviews') },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#00E5FF] text-[#00E5FF]'
                      : 'border-transparent'
                  }`}
                  style={activeTab !== tab.key ? { color: 'hsl(var(--muted-foreground))' } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <p className="leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--foreground))' }}>
                {product.description}
              </p>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                        <td className="py-3 pr-4 text-sm font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>{key}</td>
                        <td className="py-3 text-sm" style={{ color: 'hsl(var(--foreground))' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-2xl space-y-4">
                <div className="p-6 rounded-2xl border" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="flex items-center gap-2 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={14} className="fill-[#00E5FF] text-[#00E5FF]" />
                    ))}
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                    "Skvělý produkt, doporučuji. Výkon překvapuje."
                  </p>
                  <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Jan N. • <span style={{ color: '#00E5FF' }}>&#10003; {t('home.reviewVerified')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
