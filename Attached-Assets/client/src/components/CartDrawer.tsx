import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '../context/CartContext';
import { useT } from '../context/LanguageContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const t = useT();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 z-[61] w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-xl font-display font-bold text-foreground">
                {t('cart.title')}
                {items.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                    <ShoppingCart size={36} className="text-foreground/20" />
                  </div>
                  <p className="text-muted-foreground font-medium mb-6">{t('cart.empty')}</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {t('buttons.toShop')} →
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-background border border-border">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-card border border-border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-primary font-mono font-bold text-sm mb-3">
                        {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                      </p>
                      <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border bg-background/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('checkout.total')}</span>
                  <span className="text-2xl font-display font-bold text-foreground">
                    {totalPrice.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all transform hover:-translate-y-0.5">
                    {t('buttons.goToCheckout')} →
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
