import { Shield, Truck, RefreshCw, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <section className="py-20 bg-[#0A0A0F] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#1A1A24] border border-white/5 flex items-center justify-center mb-4 text-white">
                <Shield size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold mb-2">Odborná podpora</h3>
              <p className="text-[#9494A8] text-sm">Pomůžeme s výběrem i nastavením. Jsme experti na mini PC.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#1A1A24] border border-white/5 flex items-center justify-center mb-4 text-white">
                <Truck size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold mb-2">Rychlé doručení</h3>
              <p className="text-[#9494A8] text-sm">Skladové položky expedujeme do 24 hodin.</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#1A1A24] border border-white/5 flex items-center justify-center mb-4 text-white">
                <RefreshCw size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold mb-2">Snadné vrácení</h3>
              <p className="text-[#9494A8] text-sm">Něco nesedí? Zboží můžete vrátit do 14 dnů bez udání důvodu.</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#1A1A24] border border-white/5 flex items-center justify-center mb-4 text-white">
                <CreditCard size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold mb-2">Bezpečné platby</h3>
              <p className="text-[#9494A8] text-sm">Apple Pay, Google Pay, karty, převody. Vše zabezpečeno.</p>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-[#111118] border-t border-white/5 pt-16 pb-8">
        <div className="container mx-auto px-6 max-w-[1280px]">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <span className="font-display font-semibold text-xl tracking-tight mb-6 block text-white">
                minicomputer<span className="text-[#00E5FF]">.</span>
              </span>
              <p className="text-[#9494A8] text-sm leading-relaxed">
                Specialista na kompaktní výkon. Přinášíme top technologie v nejmenším možném balení pro firmy i hráče.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Obchod</h4>
              <ul className="space-y-3 text-sm text-[#9494A8]">
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Mini PC pro kancelář</a></li>
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Gaming Mini PC</a></li>
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Příslušenství</a></li>
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Slevy a akce</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Podpora</h4>
              <ul className="space-y-3 text-sm text-[#9494A8]">
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Doprava a platba</a></li>
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Reklamace a vrácení</a></li>
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Časté dotazy (FAQ)</a></li>
                <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Kontakt</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Newsletter</h4>
              <p className="text-[#9494A8] text-sm mb-4">Novinky a akce do emailu.</p>
              <div className="flex bg-[#1A1A24] rounded-lg border border-white/5 overflow-hidden">
                <input 
                  type="email" 
                  placeholder="Váš e-mail" 
                  className="bg-transparent border-none outline-none text-white text-sm px-4 py-2 w-full focus:ring-0"
                />
                <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 text-sm font-medium transition-colors">
                  Odebírat
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-[#6B6B80]">
            <p>© 2024 Minicomputer.cz. Všechna práva vyhrazena.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
          
        </div>
      </footer>
    </>
  );
}
