import { Monitor, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from "lucide-react";
import { Link } from "wouter";
import { useT } from "../../context/LanguageContext";

export function Footer() {
  const t = useT();

  return (
    <footer className="bg-[#050508] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">

          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background font-bold shadow-glow">
                <Monitor size={18} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                MiniComputer<span className="text-primary">.cz</span>
              </span>
            </Link>
            <p className="text-foreground/60 text-sm leading-relaxed max-w-xs">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6">{t('nav.shop')}</h3>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors text-sm">{t('labels.allCategories')}</Link></li>
              <li><Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors text-sm">{t('labels.miniPC')}</Link></li>
              <li><Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors text-sm">{t('labels.consoles')}</Link></li>
              <li><Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors text-sm">{t('labels.accessories')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6">{t('nav.contact')}</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">{t('nav.faq')}</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">{t('buttons.contactSupport')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6">{t('nav.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-foreground/60 text-sm">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Tech Street 42, 110 00 Praha 1</span>
              </li>
              <li className="flex items-center gap-3 text-foreground/60 text-sm">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+420 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-foreground/60 text-sm">
                <Mail size={18} className="text-primary shrink-0" />
                <span>podpora@minicomputer.cz</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} MiniComputer.cz. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-foreground/40 hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
