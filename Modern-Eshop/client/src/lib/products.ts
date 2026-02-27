export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductData {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  shortDesc: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  price: number;
  originalPrice?: number;
  ctaText: string;
  specs: ProductSpec[];
  ports: string[];
  highlights: {
    icon: 'cpu' | 'memory' | 'storage' | 'display' | 'wifi' | 'size';
    title: string;
    desc: string;
    detail?: string;
    wide?: boolean;
  }[];
  lcpFeature?: {
    title: string;
    desc: string;
    bullets: string[];
    image: string;
  };
  dimensions: string;
  weight: string;
  boxContent: string;
}

export const products: ProductData[] = [
  {
    id: "powerbox-lite",
    name: "PowerBox Lite",
    tagline: "Kancelářský výkon.\nBez kompromisů.",
    badge: "KANCELÁŘ & DOMÁCNOST",
    shortDesc: "Výkonný mini PC s Intel Core i5, navržený pro úřady, kanceláře i školy. Tichý, kompaktní a energeticky úsporný.",
    description: "PowerBox Lite plně nahradí klasické stolní počítače s mnohem nižší spotřebou a tichým provozem. S procesorem Intel Core i5-8259U – stejným, jaký pohání MacBook Pro – zvládne i náročné kancelářské úkoly. Podporuje až 3 monitory s rozlišením 4K.",
    heroImage: "/products/powerbox-lite/PowerBoxLite_image1.jpeg",
    galleryImages: [
      "/products/powerbox-lite/PowerBoxLite_image1.jpeg",
      "/products/powerbox-lite/PowerBoxLite_image2.jpeg",
      "/products/powerbox-lite/PowerBoxLite_image3.jpeg",
      "/products/powerbox-lite/PowerBoxLite_image4.jpeg",
      "/products/powerbox-lite/PowerBoxLite_image5.jpeg",
      "/products/powerbox-lite/PowerBoxLite_image6.jpeg",
      "/products/powerbox-lite/PowerBoxLite_image7.jpeg",
      "/products/powerbox-lite/PowerBoxLite_image8.jpeg",
    ],
    price: 9990,
    ctaText: "Objednat PowerBox Lite",
    specs: [
      { label: "Procesor", value: "Intel Core i5-8259U (4 jádra, 8 vláken, 3.8 GHz)" },
      { label: "Operační paměť", value: "16 GB SO-DIMM DDR4 (max 64 GB)" },
      { label: "Úložiště", value: "512 GB M.2 2280 NVMe SSD (max 4 TB)" },
      { label: "Operační systém", value: "Windows 11 Pro" },
      { label: "Rozměry a hmotnost", value: "130 × 126 × 51 mm • 450 g" },
      { label: "Napájení", value: "Adaptér 230VAC / 19V 3.42A" },
    ],
    ports: ["4× USB 3.0", "1× USB-C", "2× HDMI (4K)", "1× VGA", "1× LAN RJ45", "1× Audio 3.5mm Jack"],
    highlights: [
      { icon: 'cpu', title: "Intel Core i5-8259U", desc: "Stejný procesor jako u MacBook Pro. 4 jádra, 8 vláken, turbo až 3.8 GHz.", detail: "TDP: 28W", wide: true },
      { icon: 'memory', title: "16 GB DDR4", desc: "SO-DIMM DDR4, rozšiřitelná až na 64 GB." },
      { icon: 'storage', title: "512 GB NVMe", desc: "M.2 2280 NVMe SSD. Rozšiřitelný až na 4 TB." },
      { icon: 'display', title: "3× 4K monitory", desc: "Podpora připojení až tří HDMI displejů s rozlišením 4K UHD.", wide: true },
      { icon: 'wifi', title: "WiFi 6.0 + BT 5.2", desc: "Bezdrátové ovládání tiskáren, skenerů a projektorů." },
      { icon: 'size', title: "VESA montáž", desc: "Ideálně navržen pro montáž na zadní stranu monitoru." },
    ],
    dimensions: "130 × 126 × 51 mm",
    weight: "450 g",
    boxContent: "1× Mini PC, 1× síťový adaptér 230VAC / 19V 3.42A",
  },
  {
    id: "picobox-home",
    name: "PicoBox Home",
    tagline: "Malý tělem,\nvelký výkonem.",
    badge: "NOVINKA",
    shortDesc: "Výkonný, tichý a energeticky úsporný minipočítač pro domácí i kancelářské použití s unikátním LCD displejem.",
    description: "PicoBox Home je elegantní, moderní a cenově výhodný minipočítač. Pohání ho Intel Alder Lake N200. Unikátní vestavěný LCD displej zobrazuje provozní stav, teplotu, spotřebu i náhledy fotografií v reálném čase. Efektivní konstrukce zajišťuje účinné odvádění tepla.",
    heroImage: "/products/picobox-home/PicoBoxHome_image1.jpeg",
    galleryImages: [
      "/products/picobox-home/PicoBoxHome_image1.jpeg",
      "/products/picobox-home/PicoBoxHome_image2.jpeg",
      "/products/picobox-home/PicoBoxHome_image3.jpeg",
      "/products/picobox-home/PicoBoxHome_image4.jpeg",
      "/products/picobox-home/PicoBoxHome_image5.jpeg",
      "/products/picobox-home/PicoBoxHome_image6.jpeg",
      "/products/picobox-home/PicoBoxHome_image7.jpeg",
      "/products/picobox-home/PicoBoxHome_image8.jpeg",
      "/products/picobox-home/PicoBoxHome_image9.jpeg",
    ],
    price: 7490,
    ctaText: "Objednat PicoBox Home",
    specs: [
      { label: "Procesor", value: "Intel Alder Lake N200 (4 jádra, 4 vlákna, 3.70 GHz)" },
      { label: "Operační paměť", value: "16 GB SO-DIMM DDR4" },
      { label: "Úložiště", value: "1 TB SSD (Dual Channel M.2 SATA + NVMe)" },
      { label: "Operační systém", value: "Windows 11 Pro" },
      { label: "Rozměry a hmotnost", value: "124 × 128 × 41 mm • 380 g" },
      { label: "Napájení", value: "Adaptér 230VAC / 12V 4A" },
    ],
    ports: ["2× USB 3.0", "2× USB 2.0", "2× HDMI (4K)", "2× LAN RJ45", "1× Audio 3.5mm Jack"],
    highlights: [
      { icon: 'cpu', title: "Intel Alder Lake N200", desc: "4 jádra, 4 vlákna, frekvence až 3.70 GHz. Rychlý a spolehlivý chod pro všechny denní úkoly.", detail: "TDP: Pouhých 6W", wide: true },
      { icon: 'memory', title: "16 GB RAM", desc: "Rychlá SO-DIMM DDR4 paměť pro bezproblémový multitasking." },
      { icon: 'storage', title: "1 TB SSD", desc: "Dual Channel M.2 SATA + NVMe pro bleskové načítání." },
      { icon: 'display', title: "Duální 4K displeje", desc: "Dva HDMI výstupy pro přímé připojení dvou monitorů ve 4K. Podpora dotykových obrazovek.", wide: true },
      { icon: 'wifi', title: "WiFi 6.0 + BT 5.2", desc: "Stabilní bezdrátové připojení a ovládání periférií." },
      { icon: 'size', title: "Kompaktní pouzdro", desc: "Vestavěno v praktickém malém pouzdře. Určeno pro denní práci." },
    ],
    lcpFeature: {
      title: "Mějte vše pod kontrolou. Přehledně a ihned.",
      desc: "PicoBox Home má vestavěný personalizovaný LCD displej. Zobrazuje klíčové informace v reálném čase.",
      bullets: ["Provozní stav a výkon", "Aktuální datum a čas", "Teplota komponent", "Spotřeba energie", "Náhledy fotografií a obrázků"],
      image: "/products/picobox-home/PicoBoxHome_image2.jpeg",
    },
    dimensions: "124 × 128 × 41 mm",
    weight: "380 g",
    boxContent: "1× Mini PC Intel N200, 1× HDMI kabel, 1× síťový adaptér 100–240VAC / 12V 4A",
  },
  {
    id: "picobox-pro",
    name: "PicoBox Pro",
    tagline: "Profesionální výkon.\nS elegantní iluminací.",
    badge: "SLEVA",
    shortDesc: "Mini PC 12. generace Intel N100 s elegantní LED iluminací, nízkou spotřebou 6W a odnímatelným rozšiřitelným úložištěm.",
    description: "PicoBox Pro je moderní, cenově výhodný, miniaturní a tichý minipočítač s procesorem 12. generace Intel N100. Elegantní LED iluminace zvyšuje potěšení z práce. Odnímatelná část skříně umožňuje snadné rozšíření SSD až na 2 TB. V balení je VESA mount pro montáž za monitor.",
    heroImage: "/products/picobox-pro/PicoBoxPro_image1.jpeg",
    galleryImages: [
      "/products/picobox-pro/PicoBoxPro_image1.jpeg",
      "/products/picobox-pro/PicoBoxPro_image2.jpeg",
      "/products/picobox-pro/PicoBoxPro_image3.jpeg",
      "/products/picobox-pro/PicoBoxPro_image4.jpeg",
      "/products/picobox-pro/PicoBoxPro_image5.jpeg",
      "/products/picobox-pro/PicoBoxPro_image6.jpeg",
      "/products/picobox-pro/PicoBoxPro_image7.jpeg",
    ],
    price: 6490,
    originalPrice: 7290,
    ctaText: "Objednat PicoBox Pro",
    specs: [
      { label: "Procesor", value: "Intel Alder Lake N100 (4 jádra, 4 vlákna, 12. generace)" },
      { label: "Operační paměť", value: "16 GB DDR4" },
      { label: "Úložiště", value: "512 GB M.2 2280 SSD (rozšiřitelný až na 2 TB)" },
      { label: "Operační systém", value: "Windows 11 Pro" },
      { label: "Rozměry a hmotnost", value: "128 × 128 × 52 mm • 386 g" },
      { label: "Napájení", value: "Adaptér 230VAC / 12V 2.5A" },
    ],
    ports: ["2× USB 3.0", "1× USB 2.0", "2× HDMI (4K)", "1× LAN RJ45", "1× Audio 3.5mm Jack"],
    highlights: [
      { icon: 'cpu', title: "Intel N100 (12. gen.)", desc: "Čtyřjádrový procesor s nízkou spotřebou pouhých 6W a vysokým výkonem.", detail: "TDP: 6W", wide: true },
      { icon: 'memory', title: "16 GB DDR4", desc: "Rychlá DDR4 paměť pro plynulý multitasking." },
      { icon: 'storage', title: "512 GB SSD", desc: "M.2 2280 SSD s odnímatelnou rozšiřitelnou kapacitou až 2 TB." },
      { icon: 'display', title: "Duální HDMI 4K", desc: "Připojení dvou monitorů 4K. VESA mount pro montáž za monitor v balení.", wide: true },
      { icon: 'wifi', title: "WiFi 6.0 + BT 5.2", desc: "Bezdrátové ovládání tiskáren, skenerů a dalších zařízení." },
      { icon: 'size', title: "LED iluminace", desc: "Elegantní LED iluminace zvyšující potěšení z každodenní práce." },
    ],
    dimensions: "128 × 128 × 52 mm",
    weight: "386 g",
    boxContent: "1× Mini PC Intel N100, 1× HDMI kabel, 1× VESA mount držák, 1× síťový adaptér 230VAC / 12V 2.5A",
  },
  {
    id: "picobox-mini",
    name: "PicoBox Mini",
    tagline: "Nejmenší na světě.\nVejde se do dlaně.",
    badge: "UNIKÁT",
    shortDesc: "Nejmenší mini PC velikosti dlaně s Intel N100. 3× HDMI 4K, dvojitá LAN, jen 204 g.",
    description: "Zažijte výpočetní techniku v úplně jiném rozměru. PicoBox Mini s hmotností 204 g a rozměry 35 × 35 × 44 mm se vejde do dlaně. Intel N100 s turbo frekvencí 3.4 GHz, 3 HDMI 4K displeje a dual 1000M LAN – ideální pro firewally, servery i cestování. Vybaven Wake On LAN a automatickým zapnutím.",
    heroImage: "/products/picobox-mini/PicoBoxMini_image1.jpeg",
    galleryImages: [
      "/products/picobox-mini/PicoBoxMini_image1.jpeg",
      "/products/picobox-mini/PicoBoxMini_image2.jpeg",
      "/products/picobox-mini/PicoBoxMini_image3.jpeg",
      "/products/picobox-mini/PicoBoxMini_image4.jpeg",
      "/products/picobox-mini/PicoBoxMini_image5.jpeg",
      "/products/picobox-mini/PicoBoxMini_image6.jpeg",
      "/products/picobox-mini/PicoBoxMini_image7.jpeg",
      "/products/picobox-mini/PicoBoxMini_image8.jpeg",
    ],
    price: 5990,
    ctaText: "Objednat PicoBox Mini",
    specs: [
      { label: "Procesor", value: "Intel Alder Lake-N N100 (turbo 3.4 GHz, 6 MB cache)" },
      { label: "Operační paměť", value: "16 GB DDR4" },
      { label: "Úložiště", value: "512 GB M.2 SSD" },
      { label: "Grafika", value: "Intel UHD Graphics (4K UHD 60Hz)" },
      { label: "Operační systém", value: "Windows 11 Pro / Linux" },
      { label: "Rozměry a hmotnost", value: "35 × 35 × 44 mm • 204 g" },
      { label: "Napájení", value: "Adaptér 100–240VAC / 12V 2.5A" },
    ],
    ports: ["3× USB 3.0", "3× HDMI (4K)", "2× LAN RJ45 (1000M)", "1× Audio 3.5mm Jack"],
    highlights: [
      { icon: 'cpu', title: "Intel N100 (3.4 GHz)", desc: "Bleskurychlý procesor s 6MB cache. Výkon srovnatelný s Intel i5-7400 v benchmarku.", detail: "TDP: Ultra nízký", wide: true },
      { icon: 'memory', title: "16 GB DDR4", desc: "S 512 GB M.2 SSD pro bezkonkurenční rychlost a efektivitu." },
      { icon: 'storage', title: "512 GB SSD", desc: "Rychlý M.2 SSD s 4K UHD grafikou Intel UHD Graphics." },
      { icon: 'display', title: "3× HDMI 4K", desc: "Ztrojnásobte produktivitu – připojte tři 4K monitory najednou.", wide: true },
      { icon: 'wifi', title: "WiFi 6.0 + Dual LAN", desc: "Dvoupásmový 2.4/5G WiFi 6.0 a dva 1000M LAN porty pro maximální konektivitu." },
      { icon: 'size', title: "35 × 35 × 44 mm", desc: "Na světě nejmenší PC. Váha jen 204 g – vždy s sebou." },
    ],
    dimensions: "35 × 35 × 44 mm",
    weight: "204 g",
    boxContent: "1× Mini PC Intel N100, 1× HDMI kabel, 1× VESA držák, 1× napájecí adaptér 100–240VAC / 12V 2.5A",
  },
];

export function getProduct(id: string): ProductData | undefined {
  return products.find(p => p.id === id);
}
