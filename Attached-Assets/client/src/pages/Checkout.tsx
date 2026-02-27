import { useState } from "react";
import { useLocation, Link } from "wouter";
import { CheckCircle2, CreditCard, Truck, User } from "lucide-react";
import Header from "../components/layout/Header";
import { useCart } from "../context/CartContext";
import { mockProducts } from "../lib/mock-data";
import { useT } from "../context/LanguageContext";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useT();

  const displayItems = items.length > 0 ? items : [{ ...mockProducts[0], quantity: 1 }];
  const displayTotal = items.length > 0 ? totalPrice : mockProducts[0].price;

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    clearCart();
    setTimeout(() => setLocation('/'), 5000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--background))' }}>
        <div className="text-center max-w-md p-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>{t('checkout.orderSuccess')}</h1>
          <p className="mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.orderSuccessMsg')}</p>
          <Link href="/">
            <span className="inline-block px-8 py-3 rounded-xl font-bold cursor-pointer transition-all hover:opacity-90"
              style={{ background: '#00E5FF', color: '#0A0A0F' }}>
              {t('checkout.backToHome')}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-3xl font-display font-bold mb-8">{t('checkout.title')}</h1>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-10 max-w-sm mx-auto">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-[#00E5FF]' : ''}`} style={step < 1 ? { color: 'hsl(var(--muted-foreground))' } : {}}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 border-2 ${step >= 1 ? 'border-[#00E5FF] bg-[#00E5FF]/10' : 'border-muted'}`}>1</div>
              <span className="text-xs font-bold">{t('checkout.stepData')}</span>
            </div>
            <div className={`flex-1 h-px mx-4 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-[#00E5FF]' : ''}`} style={step < 2 ? { color: 'hsl(var(--muted-foreground))' } : {}}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 border-2 ${step >= 2 ? 'border-[#00E5FF] bg-[#00E5FF]/10' : 'border-muted'}`}>2</div>
              <span className="text-xs font-bold">{t('checkout.stepPayment')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleComplete}>
                <div className="space-y-6">
                  {step === 1 && (
                    <>
                      <div className="rounded-2xl border p-6" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                          <User size={20} style={{ color: '#00E5FF' }} /> {t('checkout.personalData')}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.firstName')}</label>
                            <input required type="text" className="w-full rounded-xl px-4 py-3 border text-sm outline-none focus:border-[#00E5FF]" style={{ background: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.lastName')}</label>
                            <input required type="text" className="w-full rounded-xl px-4 py-3 border text-sm outline-none focus:border-[#00E5FF]" style={{ background: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.email')}</label>
                            <input required type="email" className="w-full rounded-xl px-4 py-3 border text-sm outline-none focus:border-[#00E5FF]" style={{ background: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.phone')}</label>
                            <input required type="tel" className="w-full rounded-xl px-4 py-3 border text-sm outline-none focus:border-[#00E5FF]" style={{ background: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border p-6" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                          <Truck size={20} style={{ color: '#00E5FF' }} /> {t('checkout.shipping')}
                        </h2>
                        <div className="space-y-3">
                          <label className="flex items-center gap-4 p-4 rounded-xl cursor-pointer border border-[#00E5FF] bg-[#00E5FF]/5">
                            <input type="radio" name="shipping" defaultChecked />
                            <div className="flex-1">
                              <div className="font-bold text-sm">{t('checkout.shippingPPL')}</div>
                              <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.shippingPPLSub')}</div>
                            </div>
                            <span className="font-bold text-sm" style={{ color: '#00E5FF' }}>{t('labels.freeShipping')}</span>
                          </label>
                          <label className="flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-colors hover:bg-white/5" style={{ borderColor: 'hsl(var(--border))' }}>
                            <input type="radio" name="shipping" />
                            <div className="flex-1">
                              <div className="font-bold text-sm">{t('checkout.shippingZasilkovna')}</div>
                              <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.shippingZasilkovnaSub')}</div>
                            </div>
                            <span className="font-bold text-sm" style={{ color: '#00E5FF' }}>{t('labels.freeShipping')}</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <div className="rounded-2xl border p-6" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                      <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                        <CreditCard size={20} style={{ color: '#00E5FF' }} /> {t('checkout.paymentMethod')}
                      </h2>
                      <div className="space-y-3 mb-6">
                        <label className="flex items-center gap-4 p-4 rounded-xl cursor-pointer border border-[#00E5FF] bg-[#00E5FF]/5">
                          <input type="radio" name="payment" defaultChecked />
                          <div>
                            <div className="font-bold text-sm">{t('checkout.payCard')}</div>
                            <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.payCardSub')}</div>
                          </div>
                        </label>
                        <label className="flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-colors hover:bg-white/5" style={{ borderColor: 'hsl(var(--border))' }}>
                          <input type="radio" name="payment" />
                          <div>
                            <div className="font-bold text-sm">{t('checkout.payTransfer')}</div>
                            <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.payTransferSub')}</div>
                          </div>
                        </label>
                      </div>
                      <div className="space-y-3 p-4 rounded-xl border" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--background))' }}>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.cardNumber')}</label>
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-xl px-4 py-3 border text-sm outline-none focus:border-[#00E5FF] font-mono" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.expiry')}</label>
                            <input type="text" placeholder="MM/YY" className="w-full rounded-xl px-4 py-3 border text-sm outline-none focus:border-[#00E5FF] font-mono" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.cvc')}</label>
                            <input type="text" placeholder="123" className="w-full rounded-xl px-4 py-3 border text-sm outline-none focus:border-[#00E5FF] font-mono" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    {step === 2 && (
                      <button type="button" onClick={() => setStep(1)}
                        className="px-6 py-4 rounded-xl font-bold transition-colors"
                        style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))' }}>
                        {t('buttons.prevStep')}
                      </button>
                    )}
                    <button type="submit"
                      className="flex-1 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90"
                      style={{ background: '#00E5FF', color: '#0A0A0F' }}>
                      {step === 1 ? t('buttons.nextStep') : t('buttons.placeOrder')}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Summary */}
            <div>
              <div className="rounded-2xl border p-6 sticky top-24" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <h3 className="font-bold text-lg mb-4">{t('checkout.summary')}</h3>
                <div className="space-y-3 mb-4">
                  {displayItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" style={{ background: 'hsl(var(--muted))' }} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.quantity} {t('checkout.pcs')}</div>
                        <div className="font-bold text-sm mt-0.5" style={{ color: '#00E5FF' }}>{(item.price * item.quantity).toLocaleString('cs-CZ')} Kč</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2" style={{ borderColor: 'hsl(var(--border))' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.subtotal')}</span>
                    <span>{displayTotal.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>{t('checkout.shippingCost')}</span>
                    <span style={{ color: '#00E5FF' }}>{t('labels.freeShipping')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                    <span>{t('checkout.total')}</span>
                    <span style={{ color: '#00E5FF' }}>{displayTotal.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
