## PROMPT 3 — „TERMINAL / HACKER AESTHETIC"
**Filosofie: E-shop jako terminál. CLI estetika. Pro tech-savvy publikum. Inspirace: panic.com + frame.work.**

```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.

Vytvořím ti radikálně odlišný e-shop pro minicomputer.cz. Design je inspirovaný terminálem / CLI rozhraním — vypadá jako by nakupování probíhalo v příkazové řádce. Ale pod kapotou je to plně funkční e-shop s moderním UX. Inspirace: panic.com (playfulness), frame.work (transparency, tech honesty).

DESIGNOVÝ PŘÍSTUP — "TERMINAL COMMERCE":
Web vypadá jako hackerský terminál, ale je přívětivý a funkční. Typografie je monospace dominantní. Animace simulují psaní textu (typewriter efekt). Navigace se tváří jako příkazy. Ale všechno je klikací a intuitivní — forma terminálu, funkce e-shopu.

TECHNICKÝ STACK:
- React + Vite + TypeScript
- Styled Components (pro dynamické CSS, theme-aware)
- Framer Motion + vlastní typewriter hook
- Zustand (store)
- React Router

SPECIFICKÝ DESIGN TOHOTO PROMPTU:
- Primární font: JetBrains Mono VŠUDE (včetně nadpisů)
- Sekundární font: Space Grotesk pouze pro ceny a CTA
- Pozadí: čistá #0A0A0F (jako terminál)
- Text: #00E5FF (cyan — jako terminal prompt) pro nadpisy a akcentní text
- Body text: #B0B0C0 (světlejší šedá, lepší čitelnost pro mono font)
- Chybové hlášky: #FF5252
- Úspěch: #00E676
- Kurzor: blikající blokový kurzor (CSS animation) za texty
- Borders: dashed nebo dotted místo solid (evokace ASCII art)
- Žádné border-radius na kartách (sharp corners = terminal feel), POUZE na tlačítkách 4px

HOMEPAGE:

Na loadu se spustí "boot sekvence" — animace jako by se počítač zapínal:
```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.

> Initializing minicomputer.cz...
> Loading products.............. OK
> Checking inventory............ OK  
> System ready.
> Welcome, user.
```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.

(Typewriter efekt, 30ms na znak, zelený text na černém pozadí. Trvá max 3 sekundy, pak se animace dá skipnout kliknutím.)

Po boot sekvenci se odkryje hlavní stránka:

HEADER:
- Vypadá jako terminal tab bar: `[ minicomputer.cz ] | [ /shop ] | [ /cart (0) ] | [ /about ] | [ /faq ]`
- Aktivní tab je cyan, ostatní šedé
- Vpravo: `user@guest` a ikona přihlášení

HERO:
- Vlevo velký ASCII-art styl nadpis (ale čistý, ne skutečný ASCII art):
  ```
  $ find --best-mini-pc
  
  > GESEURO WizBox G
  > AMD Ryzen 7 7735HS
  > 32 GB DDR5 | 512 GB NVMe
  > ________________________________
  > price: 12 990 Kč
  > status: SKLADEM ✓
  
  [KOUPIT] [VÍCE INFO]
  ```
- Vpravo placeholder obrázek produktu s glitch/scanline efektem (CSS overlay)

PRODUKTOVÝ LISTING (Shop):
- Vypadá jako output `$ list --all --sort=price`:
  ```
  ID    PRODUKT                    CPU              RAM    CENA       AKCE
  001   GESEURO WizBox G           Ryzen 7 7735HS   32GB   12 990 Kč  [+KOŠÍK]
  002   GESEURO NonBox G           Ryzen 5 7535HS   16GB    8 990 Kč  [+KOŠÍK]
  003   GESEURO ProBox             Ryzen 9 7945HX   64GB   24 990 Kč  [+KOŠÍK]
  ```
- Ale SOUČASNĚ existuje toggle "Zobrazení": [TABULKA] / [KARTY] — v režimu Karty jsou produkty ve standardních kartách s obrázky, ale stále s terminal feel (sharp corners, mono font, dashed borders)

FILTRY:
- Vypadají jako CLI commands:
  ```
  $ filter --category=[Mini PC ▼] --price-max=[20000] --brand=[Všechny ▼]
  > Nalezeno: 8 produktů | Seřazeno: cena ↑
  ```
- Ale klikatelné dropdowny a inputy

PRODUCT DETAIL:
- Rozložení jako man page (manuálová stránka):
  ```
  GESEURO WizBox G(1)          MINICOMPUTER.CZ          GESEURO WizBox G(1)
  
  NÁZEV
       GESEURO WizBox G — Kompaktní výkonný mini počítač
  
  SPECIFIKACE
       --cpu         AMD Ryzen 7 7735HS (8 jader, 16 vláken)
       --ram         32 GB DDR5 4800 MHz
       --storage     512 GB NVMe M.2 SSD
       --gpu         AMD Radeon 680M (integrovaná)
       --os          Windows 11 Pro
       --dimensions  127 × 128 × 47 mm
       --weight      438 g
  
  CENA
       12 990 Kč                                    [██████████] SKLADEM
  
  AKCE
       [PŘIDAT DO KOŠÍKU]    [SROVNAT]    [SDÍLET]
  ```
- Pod tím: galerie obrázků (normální, ale s subtle scanline overlay)
- Recenze formátované jako git commits:
  ```
  commit a3f2b1c — ⭐⭐⭐⭐⭐ — Jan K., 15.01.2025
  "Skvělý malý počítač, tichý a výkonný. Doporučuji."
  ```

KOŠÍK:
- Vypadá jako output příkazu:
  ```
  $ cart --show
  
  ┌─────────────────────────────────────────────────┐
  │ #  POLOŽKA              QTY   CENA     SUBTOTAL │
  ├─────────────────────────────────────────────────┤
  │ 1  GESEURO WizBox G     1    12990    12 990 Kč │
  │ 2  USB-C Hub            2      890     1 780 Kč │
  ├─────────────────────────────────────────────────┤
  │                          CELKEM:     14 770 Kč  │
  │                          DOPRAVA:     ZDARMA    │
  │                          ─────────────────────  │
  │                          K ÚHRADĚ:   14 770 Kč  │
  └─────────────────────────────────────────────────┘
  
  [POKRAČOVAT K PLATBĚ] [VYPRÁZDNIT]
  ```
- ASCII tabulka border, ale plně funkční s +/- tlačítky a odebrání

CHECKOUT:
- Step by step jako interactive prompt:
  ```
  $ checkout --start
  
  [KROK 1/3] Doručovací údaje
  > Jméno: [____________]
  > Email: [____________]
  > Telefon: [____________]
  > Ulice: [____________]
  > Město: [____________]
  > PSČ: [____________]
  
  [POKRAČOVAT →]
  ```

ANIMACE:
- Typewriter efekt na nadpisech a hero textu
- Blikající kurzor (█) za aktivními texty
- Glitch efekt při page transition (krátký, 200ms)
- Terminal-style loading: `[████████░░] 80%` progress bar pro checkout
- Hover na produktech: řádek se zvýrazní (background: rgba(0,229,255,0.05))
- Scroll: text se "vypisuje" jako by terminál vypisoval output
- 404 stránka: `$ cd /neexistující-stránka → ERROR 404: Page not found. Try: $ cd /shop`

EASTER EGG:
- Pokud uživatel klikne na "terminal input" v headeru, může napsat příkazy:
  - `help` → zobrazí seznam příkazů
  - `cart` → otevře košík
  - `search [term]` → vyhledá produkt
  - `dark` / `light` → přepne theme (light = bílé pozadí, černý text, retro terminal look)

MOBILE:
- Zachová terminal estetiku, ale zjednodušenou
- Hamburger menu stylizované jako `$ menu --open`
- Bottom sticky bar: `[🏠] [🔍] [🛒(2)] [👤]`
- Tabulkové zobrazení produktů se změní na kartové (auto)

Mock data pro 10+ produktů. Vše v ČEŠTINĚ. Plně funkční e-shop.
```
Nejprve si prohlédni aktuální web: https://www.minicomputer.cz
Prozkoumej homepage, shop stránku (https://www.minicomputer.cz/shop) a alespoň jeden product detail. Použij reálné produkty, ceny a texty z aktuálního webu jako základ pro nový design.


---

