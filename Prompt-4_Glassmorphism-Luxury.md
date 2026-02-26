## PROMPT 4 — „GLASSMORPHISM LUXURY"
**Filosofie: Ultra-premium, luxusní pocit. Skleněné plochy, hloubka, elegance. Inspirace: apple.com Vision Pro stránky.**

```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.

Vytvořím ti e-shop pro minicomputer.cz v ultra-premium, luxusním stylu. Design je založený na glassmorphism — průhledné, matné skleněné plochy plovoucí nad tmavým pozadím s jemnými gradienty a světelnými efekty. Inspirace: Apple Vision Pro marketing stránky, high-end hodinářské weby, automobilový luxury segment.

DESIGNOVÝ PŘÍSTUP — "GLASSMORPHISM LUXURY":
Vše působí, jako by prvky UI byly skleněné panely plovoucí v prostoru. Pozadí obsahuje jemné, pomalu se pohybující gradient orby (blob animace). Celý web evokuje pocit: "Toto není obyčejný e-shop, toto je butik."

TECHNICKÝ STACK:
- Next.js (App Router) + TypeScript
- Tailwind CSS + custom utility classes pro glass efekty
- Framer Motion (parallax, scroll-triggered, layout animations)
- Zustand
- next/image pro optimalizaci

SPECIFICKÝ DESIGN:
- Glass card: background: rgba(255,255,255,0.05), backdrop-filter: blur(20px), border: 1px solid rgba(255,255,255,0.10), border-radius: 24px
- Glass card hover: background: rgba(255,255,255,0.08), border: 1px solid rgba(0,229,255,0.20), box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(0,229,255,0.10)
- Pozadí: #050508 (téměř černá) s animated gradient orbs:
  - Orb 1: radial-gradient 500px, #00E5FF at 10% opacity, pomalý pohyb (60s CSS animation)
  - Orb 2: radial-gradient 400px, #7C4DFF at 8% opacity, jiný timing (45s)
  - Orb 3: radial-gradient 300px, #FF6B6B at 5% opacity, (55s)
- Typografie: Space Grotesk extra thin (weight 300) pro velké nadpisy (80-120px), běžná tloušťka pro menší. Velké nadpisy mají letter-spacing: -0.04em.
- Accent barva: Bílá (#FFFFFF) pro primární CTA místo cyan. Cyan je sekundární. Purple pro highlights.
- Ceny: Velké, bílé, Space Grotesk weight 700.

HOMEPAGE:

HERO — Fullscreen (100vh):
- Pozadí: Animated gradient orbs (viz výše) + subtle noise texture overlay (CSS grain efekt)
- Centrovaný obsah:
  - Malý badge nahoře: "Nová kolekce 2025" v glass pill (malá glass kapsle)
  - Obrovský nadpis (80-120px): "Výkon bez kompromisů" — bílý text, extra light weight
  - Podnázev (18px): "Špičkové mini počítače pro práci, hry i kreativitu" — šedý text
  - CTA: Dva tlačítka — "Prozkoumat kolekci" (bílé, solid, černý text) a "Zjistit více" (glass button, bílý text)
  - Velký produktový obrázek uprostřed s ambient lighting efektem — za produktem je velký, rozmazaný cyan glow (jako by produkt svítil)
- Scroll indicator dole: Animated chevron s "Scrollujte dolů"

TRUST STRIP:
- Horizontální glass bar přes celou šířku
- 4 trust signály s ikonami: Doprava zdarma | 30 dní na vrácení | Záruka 3 roky | Bezpečná platba
- Ikony jsou thin-line, bílé

PRODUKTOVÁ SEKCE — "Naše kolekce":
- Nadpis sekce: malý label "KOLEKCE" v mono, velký nadpis "Vyberte si svůj"
- 3 velké glass karty vedle sebe (každá min 380px):
  - Kategorie karta: velký obrázek produktu s ambient glow, název kategorie ("Mini PC pro kancelář"), počet produktů, CTA šipka
  - Při hoveru: karta se jemně natočí ve 3D (perspective transform, rotateY 2-3deg) + glow se zintenzivní
  - TILT EFEKT: Karta reaguje na pozici myši — jemný 3D tilt (max ±5deg). Implementuj pomocí mouse tracking + transform.

FEATURED PRODUCT — Fullwidth sekce:
- Jeden produkt na celou šířku
- Vlevo: velký obrázek s parallax efektem (posouvá se pomaleji než scroll)
- Vpravo: glass panel s detaily:
  - Název produktu (velký)
  - Specs ve dvou sloupcích (glass mini-karty uvnitř):
    - CPU | RAM
    - Storage | GPU
  - Cena (velká, bílá)
  - CTA "Přidat do košíku" (bílé tlačítko)
  - Pod CTA: "✓ Skladem — expedice do 24h"

SOCIAL PROOF:
- Horizontální infinite scroll carousel s recenzemi v glass kartách
- Každá recenze: hvězdy, text (max 2 řádky), jméno, "Ověřený nákup" badge
- Carousel se pohybuje automaticky, pomalý plynulý scroll (marquee efekt)

NEWSLETTER:
- Glass card centrovaná, gradient border (animated — barvy se posouvají)
- Nadpis: "Novinky a slevy přímo do schránky"
- Input + tlačítko

FOOTER:
- Glass background, 4 sloupce, subtle
- Logo s glow efektem

SHOP PAGE:
- Produkty v glass kartách, 3 sloupce
- Filtry nahoře jako glass pills/chips
- Při hover na kartu: 3D tilt efekt + ambient glow za produktem se rozsvítí
- Quick view: klik na kartu otevře modal s glass overlay (backdrop blur celé stránky)

PRODUCT DETAIL:
- Hero obrázek: fullwidth s parallax, produkt "lebdí" nad gradient pozadím
- Glass panel pod obrázkem s veškerými info
- Specs: bento grid z glass karet, každá spec má ikonu + hodnotu
- Galerie: Glass thumbnaily s active state (cyan border)
- Recenze: Glass karty se staggered animací
- Related: Horizontální glass karty carousel

KOŠÍK:
- Fullscreen glass overlay (backdrop-filter: blur(30px) na celé stránce)
- Centrální glass panel (max 600px) s produkty
- Každý produkt: mini glass karta s obrázkem, názvem, cenou, quantity
- Sticky spodní bar: celkem + CTA

CHECKOUT:
- Multi-step v glass panelech
- Každý krok je glass karta, která se animuje (slide) při přechodu
- Adresy, doprava, platba — vše v glass UI
- Progress: glass pills nahoře, aktivní svítí cyan

SPECIÁLNÍ EFEKTY:
- Animated gradient orbs v pozadí (3 orby, pomalý pohyb, nízká opacita)
- Noise/grain texture overlay (subtle, 2-3% opacity)
- 3D tilt na kartách (mousemove tracking)
- Parallax na hero obrázcích
- Animated gradient borders (hue rotate animation)
- Glass reveal: elementy se při scrollu "materializují" z rozmazaného stavu do ostrého
- Cursor: custom — malý kroužek s trailing efektem (opacity ring, který cursor sleduje s mírným zpožděním)
- Page transitions: blur + fade (stránka se při odchodu rozmaže a nová se zaostří)

MOBILE:
- Glass efekty zachovány (backdrop-filter funguje na moderních mobilech)
- Simplifikovaný layout, 1 sloupec
- Bottom sheet pro košík a filtry
- Gesture support (swipe na carouselech)
- Zmenšené orby v pozadí (performance)

Plně funkční e-shop, mock data 10+ produktů, ČEŠTINA, responzivní, plně interaktivní košík a checkout.
```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.


---

