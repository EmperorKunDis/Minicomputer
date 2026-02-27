import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Filter } from "lucide-react";
import Header from "../components/layout/Header";
import { mockProducts } from "../lib/mock-data";
import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { addToCart } = useCart();
  const t = useT();

  const filters = [
    { key: "all", label: t('labels.allCategories') },
    { key: "Mini PC", label: t('labels.miniPC') },
  ];

  const filtered = activeFilter === "all"
    ? mockProducts
    : mockProducts.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-[1280px]">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
              {t('shop.title')}
            </h1>
            <p className="text-lg" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {t('shop.subtitle')}
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-8">
            <Filter size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
            <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('shop.filters')}</span>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border hover:border-primary/30'
                }`}
                style={activeFilter !== f.key ? { color: 'hsl(var(--muted-foreground))' } : {}}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-2xl overflow-hidden border transition-all hover:-translate-y-1"
                style={{
                  background: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-[4/3] overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  {product.isNew && (
                    <span className="inline-block px-2 py-0.5 bg-[#00E5FF] text-[#0A0A0F] text-[10px] font-bold rounded mb-3">
                      {t('labels.new')}
                    </span>
                  )}
                  <p className="text-xs font-mono mb-2" style={{ color: '#00E5FF' }}>{product.shortSpecs}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-display font-bold text-lg mb-2 hover:text-[#00E5FF] transition-colors cursor-pointer" style={{ color: 'hsl(var(--card-foreground))' }}>
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-xl" style={{ color: 'hsl(var(--foreground))' }}>
                      {product.price.toLocaleString('cs-CZ')} Kč
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5FF]/10 hover:bg-[#00E5FF] hover:text-[#0A0A0F] transition-colors text-sm font-medium border border-[#00E5FF]/20"
                      style={{ color: '#00E5FF' }}
                    >
                      <Plus size={16} /> {t('buttons.addToCart')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-20" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {t('shop.noProducts')}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
