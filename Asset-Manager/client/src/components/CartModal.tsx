import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export function CartModal() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [, setLocation] = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    if (isCartOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'flex' });
      gsap.fromTo(modalRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.2 });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setLocation('/checkout');
  };

  const handleRemove = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const itemEl = (e.currentTarget as HTMLElement).closest('.cart-item');
    if (itemEl) {
      gsap.to(itemEl, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        onComplete: () => removeFromCart(id)
      });
    } else {
      removeFromCart(id);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md hidden items-center justify-center p-4"
    >
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      <div
        ref={modalRef}
        className="relative border rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-2xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>{t('cart.title')}</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 bg-foreground/5 rounded-full hover:bg-foreground/10 hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-foreground/20" />
              </div>
              <p className="text-muted-foreground font-medium">{t('cart.empty')}</p>
              <button
                onClick={() => { setIsCartOpen(false); setLocation('/shop'); }}
                className="mt-6 text-primary hover:underline"
              >
                {t('buttons.toShop')}
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item flex gap-4 p-4 rounded-xl border relative group" style={{ background: 'color-mix(in srgb, var(--bg-input) 50%, transparent)', borderColor: 'var(--border-color)' }}>
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-background" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm md:text-base leading-tight pr-8" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                  <p className="text-primary font-mono mt-1 font-bold">{item.price.toLocaleString('cs-CZ')} Kč</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center rounded-lg border border-border overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-foreground/10" style={{ color: 'var(--text-primary)' }}><Minus className="w-3 h-3"/></button>
                      <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-foreground/10" style={{ color: 'var(--text-primary)' }}><Plus className="w-3 h-3"/></button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="absolute top-4 right-4 text-foreground/40 hover:text-[#FF3366] transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-end mb-6">
              <span className="text-muted-foreground font-medium">{t('checkout.total')}</span>
              <span className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalPrice.toLocaleString('cs-CZ')} Kč
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all transform hover:-translate-y-1"
            >
              {t('buttons.goToCheckout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
