import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";
import { CheckCircle2, ArrowLeft, CreditCard, Truck, User } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const t = useT();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setSuccess(true);
    clearCart();
    setTimeout(() => navigate('/'), 5000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">{t('checkout.orderSuccess')}</h1>
          <p className="text-muted-foreground mb-8">{t('checkout.orderSuccessMsg')}</p>
          <Link href="/">
            <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('checkout.backToHome')}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> {t('buttons.prevStep')}
        </Link>
        <div className="flex-1 text-center font-bold text-lg tracking-tight">minicomputer.cz</div>
        <div className="w-16" />
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          {[t('checkout.shipping'), t('checkout.paymentMethod')].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex flex-col items-center transition-colors ${step >= i + 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step >= i + 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>
                  {i + 1}
                </div>
                <span className="text-xs mt-1.5 font-medium">{label}</span>
              </div>
              {i < 1 && (
                <div className={`w-20 h-0.5 mx-3 mb-4 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
                    <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <User size={20} className="text-primary" /> {t('checkout.personalData')}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.firstName')}</label>
                        <input required type="text" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.lastName')}</label>
                        <input required type="text" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.email')}</label>
                        <input required type="email" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.phone')}</label>
                        <input required type="tel" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.address')}</label>
                        <input required type="text" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.city')}</label>
                        <input required type="text" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.zip')}</label>
                        <input required type="text" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
                    <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <Truck size={20} className="text-primary" /> {t('checkout.shipping')}
                    </h2>
                    <div className="space-y-3">
                      {[
                        { label: t('checkout.shippingPPL'), sub: t('checkout.shippingPPLSub'), price: t('labels.freeShipping') },
                        { label: t('checkout.shippingZasilkovna'), sub: t('checkout.shippingZasilkovnaSub'), price: t('labels.freeShipping') },
                      ].map((opt, i) => (
                        <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${i === 0 ? 'border-primary bg-blue-50' : 'border-border hover:bg-accent'}`}>
                          <input type="radio" name="shipping" defaultChecked={i === 0} className="text-primary accent-blue-600" />
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{opt.label}</div>
                            <div className="text-xs text-muted-foreground">{opt.sub}</div>
                          </div>
                          <span className="text-primary font-semibold text-sm">{opt.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
                  <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" /> {t('checkout.paymentMethod')}
                  </h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: t('checkout.payCard'), sub: t('checkout.payCardSub') },
                      { label: t('checkout.payTransfer'), sub: t('checkout.payTransferSub') },
                    ].map((opt, i) => (
                      <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${i === 0 ? 'border-primary bg-blue-50' : 'border-border hover:bg-accent'}`}>
                        <input type="radio" name="payment" defaultChecked={i === 0} className="accent-blue-600" />
                        <div>
                          <div className="font-semibold text-sm">{opt.label}</div>
                          <div className="text-xs text-muted-foreground">{opt.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="bg-muted rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.cardNumber')}</label>
                      <input required type="text" placeholder="0000 0000 0000 0000" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.expiry')}</label>
                        <input required type="text" placeholder="MM/YY" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t('checkout.cvc')}</label>
                        <input required type="text" placeholder="123" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="rounded-full px-6 border-border"
                  >
                    {t('buttons.prevStep')}
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-blue-500/20 text-base"
                >
                  {step === 1 ? t('buttons.nextStep') : t('buttons.placeOrder')}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-muted rounded-3xl border border-border p-8">
              <h3 className="font-bold text-lg mb-6">{t('checkout.summary')}</h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.length > 0 ? items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-background shrink-0 border border-border">
                      <img src={item.product.heroImage} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.quantity} {t('checkout.pcs')}</div>
                      <div className="text-primary font-bold text-sm mt-1">{(item.product.price * item.quantity).toLocaleString('cs-CZ')} Kč</div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">
                    {t('checkout.emptyCart')}{' '}
                    <Link href="/" className="text-primary hover:underline">{t('buttons.backToHome')}</Link>
                  </p>
                )}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t('checkout.subtotal')}</span>
                  <span>{total.toLocaleString('cs-CZ')} Kč</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t('checkout.shippingCost')}</span>
                  <span className="text-primary font-semibold">{t('labels.freeShipping')}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-border mt-1">
                  <span>{t('checkout.total')}</span>
                  <span>{total.toLocaleString('cs-CZ')} Kč</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
