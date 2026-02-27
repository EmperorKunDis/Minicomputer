import { Shield, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { useT } from '../../context/LanguageContext';

export default function Footer() {
  const t = useT();

  return (
    <>
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4 text-foreground">
                <Shield size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground font-bold mb-2">{t('product.warrantyLabel')}</h3>
              <p className="text-muted-foreground text-sm">{t('home.needHelpSub')}</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4 text-foreground">
                <Truck size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground font-bold mb-2">{t('product.delivery')}</h3>
              <p className="text-muted-foreground text-sm">{t('product.deliveryTime')}</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4 text-foreground">
                <RefreshCw size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground font-bold mb-2">{t('labels.freeShippingOver')}</h3>
              <p className="text-muted-foreground text-sm">{t('labels.freeShippingThreshold')}</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4 text-foreground">
                <CreditCard size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground font-bold mb-2">{t('checkout.paymentMethod')}</h3>
              <p className="text-muted-foreground text-sm">{t('checkout.payCard')}, {t('checkout.payTransfer')}</p>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-popover border-t border-border pt-16 pb-8">
        <div className="container mx-auto px-6 max-w-[1280px]">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <span className="font-display font-semibold text-xl tracking-tight mb-6 block text-foreground">
                minicomputer<span className="text-primary">.</span>
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('home.heroSubtitle')}
              </p>
            </div>

            <div>
              <h4 className="text-foreground font-bold mb-6">{t('nav.shop')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="/shop" className="hover:text-primary transition-colors">{t('labels.miniPC')}</a></li>
                <li><a href="/shop" className="hover:text-primary transition-colors">{t('labels.consoles')}</a></li>
                <li><a href="/shop" className="hover:text-primary transition-colors">{t('labels.accessories')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-bold mb-6">{t('nav.contact')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">{t('buttons.contactSupport')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-bold mb-6">{t('home.newsletterTitle')}</h4>
              <p className="text-muted-foreground text-sm mb-4">{t('home.newsletterSubtitle')}</p>
              <div className="flex bg-card rounded-lg border border-border overflow-hidden">
                <input
                  type="email"
                  placeholder={t('home.newsletterPlaceholder')}
                  className="bg-transparent border-none outline-none text-foreground text-sm px-4 py-2 w-full focus:ring-0"
                />
                <button className="bg-foreground/5 hover:bg-foreground/10 text-foreground px-4 py-2 text-sm font-medium transition-colors">
                  {t('buttons.subscribe')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border text-sm text-muted-foreground">
            <p>&copy; 2024 Minicomputer.cz. {t('footer.rights')}</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">Facebook</a>
              <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
