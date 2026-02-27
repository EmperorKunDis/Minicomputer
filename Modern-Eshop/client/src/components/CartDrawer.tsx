import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQty, total } = useCart();
  const [, navigate] = useLocation();
  const t = useT();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-card shadow-2xl flex flex-col border-l border-border">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" size={20} />
            <h2 className="font-bold text-lg">{t('cart.title')}</h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
              <ShoppingBag size={48} className="mb-4 opacity-30" />
              <p className="font-medium">{t('cart.empty')}</p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-4 text-primary hover:underline text-sm font-medium"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border">
                  <img
                    src={item.product.heroImage}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <h3 className="font-semibold text-sm truncate">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.product.shortDesc.split(',')[0]}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-border rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center hover:text-primary transition-colors text-muted-foreground"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center hover:text-primary transition-colors text-muted-foreground"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-sm">
                      {(item.product.price * item.quantity).toLocaleString('cs-CZ')} Kč
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-border bg-muted">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('cart.subtotal')}</span>
                <span>{total.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('checkout.shippingCost')}</span>
                <span className="text-primary font-semibold">{t('labels.freeShipping')}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-5 pb-4 border-t border-border pt-3">
              <span>{t('cart.total')}</span>
              <span>{total.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <Button
              className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-blue-500/20 text-base"
              onClick={() => { setCartOpen(false); navigate('/checkout'); }}
            >
              {t('cart.checkout')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
