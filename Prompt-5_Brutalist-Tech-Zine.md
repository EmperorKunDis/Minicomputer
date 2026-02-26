## PROMPT 5 — „BRUTALIST TECH ZINE"
**Filosofie: Anti-design. Brutalistický, surový, ale funkční. Jako tištěný tech magazín / zine. Inspirace: Virgil Abloh, Demna, brutalist web design.**

```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.

Vytvořím ti e-shop pro minicomputer.cz ve stylu BRUTALIST TECH ZINE — radikálně odlišný od jakéhokoliv běžného e-shopu. Vypadá jako experimentální tištěný magazín / zine o technologiích, ale je to plně funkční e-shop. Anti-design, který paradoxně přitahuje pozornost a zvyšuje konverzi díky své odlišnosti.

DESIGNOVÝ PŘÍSTUP — "BRUTALIST TECH ZINE":
Rozbij všechna pravidla klasického e-commerce designu — ale strategicky. Velké typografie, asymetrické layouty, překrývající se elementy, raw estetika. Ale: navigace je jasná, nákupní proces je snadný, CTA jsou viditelné. Chaos je kontrolovaný.

TECHNICKÝ STACK:
- React + Vite + TypeScript
- Vanilla CSS (custom properties, grid, NO framework — maximální kontrola)
- GSAP (ScrollTrigger, text animations, drag)
- Zustand
- React Router

SPECIFICKÝ DESIGN:
- Primární barvy: #0A0A0F (pozadí), #FFFFFF (text — vysoký kontrast), #FF3333 (akcentní ČERVENÁ místo cyan — brutalistický feel)
- Sekundární: #00E5FF (cyan pouze pro interaktivní elementy a ceny)
- Font: Space Grotesk pro VŠECHNO ale v extrémních velikostech:
  - Hero nadpisy: 120-200px, uppercase, letter-spacing: -0.06em (tight)
  - Body: 16px, normální
  - Labels: 10px, uppercase, letter-spacing: 0.2em, červená
- Borders: 2-3px solid bílé (tlusté, viditelné — anti-subtle)
- Žádné border-radius NIKDE (0px vše) — sharp, brutální
- Žádné shadows — flat design pushed to extreme
- Žádné gradienty na pozadí — čistá černá

HOMEPAGE:

HEADER — Oversized:
- Logo "MINICOMPUTER" v obrovském textu (48px), uppercase, zabírá celou šířku
- Pod ním: tenká červená linka (2px)
- Navigace pod čárou: [ OBCHOD ] — [ O NÁS ] — [ FAQ ] — [ KONTAKT ] — [ KOŠÍK(0) ]
- Vše uppercase, letter-spacing 0.15em, 12px
- ŽÁDNÝ hamburger na mobilu — navigace se zmenší ale zůstane viditelná (horizontal scroll)

HERO — Fullscreen, asymetrický:
- Levá polovina (60%): 
  - Obrovský text "MINI" (200px) na prvním řádku
  - Pod ním "COMPUTER" (160px) s odsazením doprava
  - Pod ním červený label "NÁKUP TECHNOLOGIÍ BEZ KOMPROMISŮ" (10px, spacing 0.2em)
  - CTA: "NAKUPOVAT →" — velké tlačítko, bílý text, červený border (3px), NO fill. Při hoveru: fill se změní na červenou, text na černý.
- Pravá polovina (40%):
  - Produktový obrázek — ale VELKÝ, přesahující okraje sekce (overflow: visible), s rotací 5deg
  - Pod obrázkem: název produktu a cena v mono fontu

MARQUEE STRIP:
- Horizontální nekonečný scroll text (marquee):
  "DOPRAVA ZDARMA ★ ZÁRUKA 3 ROKY ★ PODPORA 24/7 ★ DOPRAVA ZDARMA ★ ..."
- Bílý text na červeném pozadí, uppercase, 14px
- Scroll rychlost: 40px/s

PRODUKTOVÁ SEKCE — "KATALOG":
- Nadpis "KATALOG" přes celou šířku, 120px, uppercase, s červenou hvězdičkou za textem
- Pod ním: Počet produktů "12 POLOŽEK" malým textem

PRODUKTOVÉ KARTY — Magazine Layout:
NE uniformní grid. Karty mají RŮZNÉ velikosti a rozmístění, jako stránky magazínu:
- Karta 1 (velká, 2/3 šířky): Velký obrázek nahoře, název pod ním (48px), specs v řadě (mono, 11px), cena (32px, cyan), tlačítko "PŘIDAT" (červený outline)
- Karta 2 (malá, 1/3 šířky): Pouze název, cena, malý obrázek. Vertikální layout.
- Karta 3 (fullwidth): Horizontální karta — obrázek vlevo (50%), info vpravo. Jako magazine spread.
- Karta 4 a 5 (50/50): Dvě karty vedle sebe, symetrické
- Tento pattern se opakuje pro další produkty

BORDERS na kartách: 2px solid white. Při hoveru: border změní na červenou + obsah se posune (translateX(4px) translateY(-4px)) — brutalistický "offset shadow" efekt (jako fyzický stín, ale realizovaný posunem)

PRODUCT DETAIL — Magazine Spread:
- Fullwidth layout:
  - Levá strana (50%): Obrázek produktu, VELKÝ, černobílý filtr s cyan tint (mix-blend-mode)
  - Pravá strana (50%): 
    - Label: "PRODUKT / 001" v červené, 10px
    - Název: obrovský (64px), uppercase
    - Specs: každý parametr na vlastním řádku, formátovaný jako:
      ```
      CPU ————————— AMD Ryzen 7 7735HS
      RAM ————————— 32 GB DDR5
      SSD ————————— 512 GB NVMe
      GPU ————————— AMD Radeon 680M
      ```
      (Dashed line connect between label and value)
    - Cena: 48px, cyan
    - CTA: "DO KOŠÍKU →" velké tlačítko, červený border
    - Dostupnost: "● SKLADEM" s zeleným puntíkem

RECENZE:
- Pull quotes styl — velké uvozovky (120px, červené), text recenze (24px), jméno malým písmem
- Rozmístěné asymetricky na stránce

KOŠÍK:
- Fullscreen page (ne modal, ne sidebar)
- Název stránky: "KOŠÍK" (120px) v horní části
- Produkty v přísné tabulce s tlustými borders (2px):
  ```
  ┃ PRODUKT              ┃ KS  ┃ CENA        ┃
  ┃ GESEURO WizBox G     ┃ 1   ┃ 12 990 Kč   ┃ [×]
  ┃ USB-C Hub 7v1        ┃ 2   ┃  1 780 Kč   ┃ [×]
  ```
- Celkem: velké číslo (48px, cyan) pod tabulkou
- CTA: "ZAPLATIT →" fullwidth červené tlačítko (poprvé filled/plný, ne outline — protože je to finální akce)

CHECKOUT:
- Single page, brutalistický formulář
- Labels VELKÉ (uppercase, 10px spacing), inputs mají 2px border, ŽÁDNÝ radius
- Sekce oddělené tlustými červenými čárami
- Progress: "KROK 1 Z 3" v levém horním rohu, velký text

ANIMACE — Minimální ale impaktní:
- Text reveal: Nadpisy se "vysunou" zespodu (clipPath animation), jeden řádek po druhém
- Marquee: Continuous scroll
- Hover offset: Karty se posunou (translateX/Y) — jako brutalistický "shadow"
- Page transition: Hard cut (žádný fade — stránka se prostě změní, instantně — brutalistické)
- Scroll: Sekce se objeví s simple fade (opacity 0→1), žádné fancy efekty
- Cart badge: číslo se změní s krátkou scale animací
- Obrázky: Při scrollu lehký parallax + při hoveru se změní z grayscale na barvu (transition 0.5s)

TYPOGRAFICKÁ HRA:
- Míchání velikostí: Na jednom řádku může být 12px text vedle 48px čísla
- Rotated text: Některé labels jsou otočené o 90° (vertical text na levém okraji sekcí)
- Strikethrough: U slev — původní cena přeškrtnutá červeně, nová cena v cyan

MOBILE:
- Layout se přeuspořádá na jednosloupcový
- Text zůstane velký (ale přizpůsobený — 80px místo 200px pro hero)
- Horizontální scroll pro produkty v mobilní verzi
- Sticky bottom: "KOŠÍK (2) — 14 770 Kč [→]"
- Žádný hamburger — top nav horizontální scroll

Mock data 10+ produktů, ČEŠTINA, plně funkční e-shop, košík, checkout. Tento design musí být ODVÁŽNÝ ale POUŽITELNÝ.
```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.


---

## Souhrn odlišností mezi iteracemi

| # | Název | Layout | Animace | Barvy | Vibe |
|---|-------|--------|---------|-------|------|
| 1 | Scrollytelling Product Theater | Plynulý vertikální příběh | Scroll-triggered, parallax, stagger | Cyan + Purple gradient | Apple-like, cinematický |
| 2 | Bento Dashboard E-Shop | Modulární widgety, grid | Staggered reveal, countUp, ripple | Cyan + Purple, dashboard feel | nzxt.com, iOS widgets |
| 3 | Terminal / Hacker Aesthetic | CLI rozhraní, tabulky, mono | Typewriter, glitch, scanlines | Cyan na černé, mono | panic.com, frame.work, hacker |
| 4 | Glassmorphism Luxury | Plovoucí glass panely | 3D tilt, orby, parallax, blur | Bílá + subtle cyan, luxury | Apple Vision Pro, haute couture |
| 5 | Brutalist Tech Zine | Asymetrický, magazine | Clip-path reveal, hard cuts, offset | Červená + bílá + černá, raw | Virgil Abloh, anti-design |

---

*Každý prompt je self-contained — můžeš ho vložit do Replit Agent přímo. Všechny sdílejí stejnou funkčnost (e-shop, košík, checkout) ale liší se radikálně ve vizuálním přístupu, animačních principech a celkovém zážitku.*
