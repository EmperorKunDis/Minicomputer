import { useState } from "react";
import { useCart, CartItem } from "../context/CartContext";
import { mockProducts } from "../lib/mock-data";
import { BentoGrid, BentoCard } from "../components/BentoCard";
import { Link, useLocation } from "wouter";
import { CheckCircle2, CreditCard, Truck, User } from "lucide-react";
import { useT } from "../context/LanguageContext";

const DEMO_ITEMS: CartItem[] = [
  { ...mockProducts[0], quantity: 1 },
  { ...mockProducts[1], quantity: 1 },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useT();

  const displayItems = items.length > 0 ? items : DEMO_ITEMS;
  const displayTotal = items.length > 0 ? totalPrice : DEMO_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    clearCart();
    setTimeout(() => {
      setLocation('/');
    }, 5000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <BentoCard colSpan={6} className="text-center py-16 flex flex-col items-center max-w-xl">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">{t('checkout.orderSuccess')}</h1>
          <p className="text-muted-foreground mb-8">{t('checkout.orderSuccessMsg')}</p>
          <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-foreground transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            {t('checkout.backToHome')}
          </Link>
        </BentoCard>
      </div>
    );
  }

  return (
    <div className="pb-12 pt-6 max-w-[1440px] mx-auto px-4 md:px-6">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8 max-w-2xl mx-auto">
        <div className={`flex flex-col items-center transition-colors duration-500 ${step >= 1 ? 'text-primary' : 'text-zinc-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 border-2 transition-colors duration-500 ${step >= 1 ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'border-zinc-700 bg-transparent'}`}>1</div>
          <span className="text-xs font-bold uppercase tracking-wider">{t('checkout.stepData')}</span>
        </div>
        <div className={`flex-1 h-px mx-4 transition-colors duration-500 ${step >= 2 ? 'bg-primary' : 'bg-zinc-800'}`} />
        <div className={`flex flex-col items-center transition-colors duration-500 ${step >= 2 ? 'text-primary' : 'text-zinc-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 border-2 transition-colors duration-500 ${step >= 2 ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'border-zinc-700 bg-transparent'}`}>2</div>
          <span className="text-xs font-bold uppercase tracking-wider">{t('checkout.stepPayment')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-8">
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleComplete}>
            <BentoGrid className="!p-0 !max-w-full">

              {step === 1 && (
                <>
                  <BentoCard colSpan={12} className="mb-4">
                    <h2 className="flex items-center gap-2 text-xl font-bold mb-6 border-b border-border pb-4">
                      <User className="text-primary" /> {t('checkout.personalData')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('checkout.firstName')}</label>
                        <input required type="text" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" style={{ background: 'var(--bg-input)' }} />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('checkout.lastName')}</label>
                        <input required type="text" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" style={{ background: 'var(--bg-input)' }} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-muted-foreground mb-1">{t('checkout.email')}</label>
                        <input required type="email" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" style={{ background: 'var(--bg-input)' }} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-muted-foreground mb-1">{t('checkout.phone')}</label>
                        <input required type="tel" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" style={{ background: 'var(--bg-input)' }} />
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard colSpan={12}>
                    <h2 className="flex items-center gap-2 text-xl font-bold mb-6 border-b border-border pb-4">
                      <Truck className="text-secondary" /> {t('checkout.shipping')}
                    </h2>
                    <div className="space-y-3">
                      <label className="flex items-center gap-4 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                        <input type="radio" name="shipping" defaultChecked className="text-primary" />
                        <div className="flex-1">
                          <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{t('checkout.shippingPPL')}</div>
                          <div className="text-sm text-muted-foreground">{t('checkout.shippingPPLSub')}</div>
                        </div>
                        <div className="font-bold">{t('labels.freeShipping')}</div>
                      </label>
                      <label className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-foreground/5 transition-colors">
                        <input type="radio" name="shipping" className="text-primary" />
                        <div className="flex-1">
                          <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{t('checkout.shippingZasilkovna')}</div>
                          <div className="text-sm text-muted-foreground">{t('checkout.shippingZasilkovnaSub')}</div>
                        </div>
                        <div className="font-bold">{t('labels.freeShipping')}</div>
                      </label>
                    </div>
                  </BentoCard>
                </>
              )}

              {step === 2 && (
                <BentoCard colSpan={12}>
                  <h2 className="flex items-center gap-2 text-xl font-bold mb-6 border-b border-border pb-4">
                    <CreditCard className="text-primary" /> {t('checkout.paymentMethod')}
                  </h2>
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-4 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                      <input type="radio" name="payment" defaultChecked className="text-primary" />
                      <div className="flex-1">
                        <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{t('checkout.payCard')}</div>
                        <div className="text-sm text-muted-foreground">{t('checkout.payCardSub')}</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-foreground/5 transition-colors">
                      <input type="radio" name="payment" className="text-primary" />
                      <div className="flex-1">
                        <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{t('checkout.payTransfer')}</div>
                        <div className="text-sm text-muted-foreground">{t('checkout.payTransferSub')}</div>
                      </div>
                    </label>
                  </div>

                  {/* Mock CC Form */}
                  <div className="p-6 rounded-xl border border-border space-y-4 shadow-inner" style={{ background: 'var(--bg-input)' }}>
                     <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('checkout.cardNumber')}</label>
                        <input required type="text" placeholder="0000 0000 0000 0000" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-mono tracking-widest" style={{ background: 'var(--bg-card)' }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">{t('checkout.expiry')}</label>
                          <input required type="text" placeholder="MM/YY" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-mono" style={{ background: 'var(--bg-card)' }} />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">CVC</label>
                          <input required type="text" placeholder="123" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-mono" style={{ background: 'var(--bg-card)' }} />
                        </div>
                      </div>
                  </div>
                </BentoCard>
              )}

              <div className="col-span-12 mt-4 flex gap-4">
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold bg-foreground/5 hover:bg-foreground/10 transition-colors flex-1 max-w-[200px] border border-border">
                    {t('buttons.prevStep')}
                  </button>
                )}
                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-black font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
                  {step === 1 ? t('buttons.nextStep') : t('buttons.placeOrder')}
                </button>
              </div>
            </BentoGrid>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4">
          <BentoGrid className="!p-0 !max-w-full sticky top-24">
            <BentoCard colSpan={12} className="backdrop-blur" style={{ background: 'color-mix(in srgb, var(--bg-card) 80%, transparent)' }}>
              <h3 className="font-bold text-lg mb-4">{t('checkout.summary')}</h3>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                {displayItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-background border border-border" />
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)', opacity: 0.9 }}>{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.quantity} {t('checkout.pcs')}</div>
                      <div className="text-primary font-mono text-sm font-bold mt-1">{(item.price * item.quantity).toLocaleString('cs-CZ')} Kč</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t('checkout.subtotal')}</span>
                  <span>{displayTotal.toLocaleString('cs-CZ')} Kč</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t('checkout.shippingCost')}</span>
                  <span className="text-primary">{t('labels.freeShipping')}</span>
                </div>
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-border">
                  <span className="font-bold text-muted-foreground">{t('checkout.total')}</span>
                  <span className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF]">{displayTotal.toLocaleString('cs-CZ')} Kč</span>
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>

      </div>
    </div>
  );
}
