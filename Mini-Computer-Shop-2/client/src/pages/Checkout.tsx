import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { CheckCircle2, CreditCard, Truck, User, ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../store/useCart";
import { useT } from "../context/LanguageContext";

const slide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function Checkout() {
  const { items, getTotals, clearCart, removeItem, updateQuantity } = useCart();
  const { subtotal, itemsCount } = getTotals();
  const t = useT();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setSuccess(true);
    clearCart();
    setTimeout(() => navigate('/'), 5000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">{t('checkout.orderSuccess')}</h1>
          <p className="text-foreground/60 mb-8 text-lg">
            {t('checkout.orderSuccessMsg')}
          </p>
          <Link href="/" className="inline-block px-8 py-4 bg-primary text-background font-bold rounded-xl btn-hover shadow-[0_0_30px_rgba(0,229,255,0.3)]">
            {t('buttons.backToHome')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Back link */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors text-sm font-medium mb-8">
          <ArrowLeft size={16} /> {t('buttons.prevStep')}
        </Link>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 max-w-xs mx-auto">
          {[t('checkout.stepData'), t('checkout.stepPayment')].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex flex-col items-center transition-colors ${step >= i + 1 ? 'text-primary' : 'text-foreground/30'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step >= i + 1 ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'border-white/10'}`}>
                  {i + 1}
                </div>
                <span className="text-xs mt-1.5 font-medium tracking-wide uppercase">{label}</span>
              </div>
              {i < 1 && (
                <div className={`w-20 h-px mx-3 mb-5 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" {...slide} className="space-y-5">
                    <div className="bg-card border border-white/5 rounded-2xl p-8">
                      <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                        <User className="text-primary" size={20} /> {t('checkout.personalData')}
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.firstName')}</label>
                          <input required type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.lastName')}</label>
                          <input required type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.email')}</label>
                          <input required type="email" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.phone')}</label>
                          <input required type="tel" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.address')}</label>
                          <input required type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.city')}</label>
                          <input required type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.zip')}</label>
                          <input required type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-white/5 rounded-2xl p-8">
                      <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                        <Truck className="text-accent" size={20} /> {t('checkout.shipping')}
                      </h2>
                      <div className="space-y-3">
                        {[
                          { label: t('checkout.shippingPPL'), sub: t('checkout.shippingPPLSub'), price: t('labels.freeShipping') },
                          { label: t('checkout.shippingZasilkovna'), sub: t('checkout.shippingZasilkovnaSub'), price: t('labels.freeShipping') },
                        ].map((opt, i) => (
                          <label key={i} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${i === 0 ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:bg-white/5'}`}>
                            <input type="radio" name="shipping" defaultChecked={i === 0} className="accent-[hsl(var(--primary))]" />
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{opt.label}</div>
                              <div className="text-xs text-foreground/50">{opt.sub}</div>
                            </div>
                            <span className="text-primary font-semibold text-sm">{opt.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" {...slide}>
                    <div className="bg-card border border-white/5 rounded-2xl p-8">
                      <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                        <CreditCard className="text-primary" size={20} /> {t('checkout.paymentMethod')}
                      </h2>
                      <div className="space-y-3 mb-6">
                        {[
                          { label: t('checkout.payCard'), sub: t('checkout.payCardSub') },
                          { label: t('checkout.payTransfer'), sub: t('checkout.payTransferSub') },
                        ].map((opt, i) => (
                          <label key={i} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${i === 0 ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:bg-white/5'}`}>
                            <input type="radio" name="payment" defaultChecked={i === 0} className="accent-[hsl(var(--primary))]" />
                            <div>
                              <div className="font-semibold text-sm">{opt.label}</div>
                              <div className="text-xs text-foreground/50">{opt.sub}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="bg-background rounded-xl border border-white/5 p-6 space-y-4">
                        <div>
                          <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.cardNumber')}</label>
                          <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm font-mono tracking-widest focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.expiry')}</label>
                            <input required type="text" placeholder="MM/YY" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-colors" />
                          </div>
                          <div>
                            <label className="text-xs text-foreground/50 font-medium mb-1.5 block uppercase tracking-wide">{t('checkout.cvc')}</label>
                            <input required type="text" placeholder="123" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 mt-5">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    {t('buttons.prevStep')}
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-accent text-background font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all"
                >
                  {step === 1 ? t('buttons.nextStep') : t('buttons.placeOrder')}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-card border border-white/5 rounded-2xl p-8">
              <h3 className="font-display font-bold text-xl mb-6">
                {t('checkout.summary')} ({itemsCount} {t('checkout.pcs')})
              </h3>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-6">
                {items.length === 0 ? (
                  <p className="text-foreground/50 text-sm">
                    {t('checkout.emptyCart')}{' '}
                    <Link href="/shop" className="text-primary hover:underline">{t('buttons.toShop')}</Link>
                  </p>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-background border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product.image.startsWith('/') ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <span className="font-medium text-sm truncate">{item.product.name}</span>
                          <button onClick={() => removeItem(item.product.id)} className="text-foreground/30 hover:text-destructive shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-background border border-white/10 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-5 h-5 flex items-center justify-center text-foreground/60 hover:text-foreground disabled:opacity-30">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center text-foreground/60 hover:text-foreground">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-primary font-mono font-bold text-sm">
                            {(item.product.price * item.quantity).toLocaleString('cs-CZ')} Kč
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-foreground/60">
                  <span>{t('checkout.subtotal')}</span>
                  <span>{subtotal.toLocaleString('cs-CZ')} Kč</span>
                </div>
                <div className="flex justify-between text-sm text-foreground/60">
                  <span>{t('checkout.shippingCost')}</span>
                  <span className="text-primary font-semibold">{t('labels.freeShipping')}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-xl pt-3 mt-1 border-t border-white/5">
                  <span>{t('checkout.total')}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    {subtotal.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
