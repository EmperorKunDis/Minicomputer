export type ProductCategory = 'Mini PC' | 'Konzole' | 'Příslušenství';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  shortDesc: string;
  description: string;
  specs: {
    cpu?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
    ports?: string;
    [key: string]: string | undefined;
  };
  image: string;
  gallery: string[];
  badges: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "powerbox-lite",
    name: "PowerBox Lite",
    category: "Mini PC",
    price: 9990,
    shortDesc: "Výkonný kancelářský mini PC s Intel Core i5 – tichý, kompaktní, energeticky úsporný",
    description: "PowerBox Lite je moderní, cenově výhodný a miniaturní počítač určený zejména pro kanceláře, školy, úřady a domácnosti. Plně nahradí klasické stolní počítače s mnohem nižší spotřebou a tichým provozem. Podporuje připojení až 3 HDMI monitorů s rozlišením 4K. Vestavěný WiFi 6.0 a Bluetooth 5.2 zajišťují bezdrátové ovládání tiskáren, skenerů a projektorů. Počítač je ideálně navržen pro montáž přímo na zadní stranu monitoru pomocí VESA držáku.",
    specs: {
      cpu: "Intel Core i5-8259U (4 jádra, 8 vláken, 3.8 GHz)",
      ram: "16 GB SO-DIMM DDR4 (max 64 GB)",
      storage: "512 GB M.2 NVMe SSD (max 4 TB)",
      gpu: "Intel Iris Plus 655",
      ports: "4× USB 3.0, 1× USB-C, 2× HDMI, 1× VGA, 1× LAN RJ45, Audio 3.5mm",
      wifi: "WiFi 6.0 + Bluetooth 5.2",
      os: "Windows 11 Pro",
      dimensions: "130 × 126 × 51 mm, 450 g"
    },
    image: `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image1.jpeg`,
    gallery: [
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image1.jpeg`,
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image2.jpeg`,
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image3.jpeg`,
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image4.jpeg`,
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image5.jpeg`,
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image6.jpeg`,
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image7.jpeg`,
      `${import.meta.env.BASE_URL}products/powerbox-lite/PowerBoxLite_image8.jpeg`
    ],
    badges: ["KANCELÁŘ & DOMÁCNOST"],
    rating: 4.8,
    reviewsCount: 37,
    inStock: true
  },
  {
    id: "picobox-home",
    name: "PicoBox Home",
    category: "Mini PC",
    price: 7490,
    shortDesc: "Elegantní mini PC s LCD displejem a Intel N200 pro domácnost i kancelář",
    description: "PicoBox Home je elegantní, moderní a cenově výhodný minipočítač vhodný zejména pro kanceláře, školy, úřady a domácnosti. Pohání ho výkonný procesor Intel Alder Lake N200. Unikátní vestavěný personalizovaný LCD displej zobrazuje provozní stav, datum a čas, teplotu, výkon, spotřebu i náhledy fotografií. Efektivní konstrukce zajišťuje účinné odvádění tepla. Podporuje připojení jednoho nebo dvou HDMI monitorů s rozlišením 4K. WiFi 6.0 a Bluetooth 5.2 umožňují bezdrátové ovládání periférií.",
    specs: {
      cpu: "Intel Alder Lake N200 (4 jádra, 4 vlákna, 3.70 GHz)",
      ram: "16 GB SO-DIMM DDR4",
      storage: "1 TB SSD (Dual Channel M.2 SATA + NVMe)",
      gpu: "Intel UHD Graphics",
      ports: "2× USB 3.0, 2× USB 2.0, 2× HDMI 4K, 2× LAN RJ45, Audio 3.5mm",
      wifi: "WiFi 6.0 + Bluetooth 5.2",
      os: "Windows 11 Pro",
      dimensions: "124 × 128 × 41 mm, 380 g"
    },
    image: `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image1.jpeg`,
    gallery: [
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image1.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image2.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image3.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image4.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image5.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image6.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image7.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image8.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-home/PicoBoxHome_image9.jpeg`
    ],
    badges: ["LCD DISPLEJ"],
    rating: 4.7,
    reviewsCount: 52,
    inStock: true
  },
  {
    id: "picobox-pro",
    name: "PicoBox Pro",
    category: "Mini PC",
    price: 6490,
    originalPrice: 7290,
    shortDesc: "Tiché mini PC 12. generace Intel N100 s LED iluminací a VESA montáží",
    description: "PicoBox Pro je moderní, cenově výhodný, miniaturní, energeticky úsporný a tichý minipočítač určený zejména pro domácnosti. Plně nahradí klasické stolní počítače. Disponuje procesorem 12. generace Intel N100 s nízkou spotřebou pouhých 6 W. Elegantní LED iluminace zvyšuje potěšení z práce. Odnímatelná část skříně umožňuje snadné rozšíření úložiště až na 2 TB. V balení je obsažen VESA mount držák pro montáž za monitor.",
    specs: {
      cpu: "Intel Alder Lake N100 (4 jádra, 4 vlákna, 12. generace)",
      ram: "16 GB DDR4",
      storage: "512 GB M.2 2280 SSD (max 2 TB)",
      gpu: "Intel UHD Graphics",
      ports: "2× USB 3.0, 1× USB 2.0, 2× HDMI 4K, 1× LAN RJ45, Audio 3.5mm",
      wifi: "WiFi 6.0 + Bluetooth 5.2",
      os: "Windows 11 Pro",
      dimensions: "128 × 128 × 52 mm, 386 g"
    },
    image: `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image1.jpeg`,
    gallery: [
      `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image1.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image2.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image3.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image4.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image5.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image6.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-pro/PicoBoxPro_image7.jpeg`
    ],
    badges: ["SLEVA", "LED ILUMINACE"],
    rating: 4.6,
    reviewsCount: 84,
    inStock: true
  },
  {
    id: "picobox-mini",
    name: "PicoBox Mini",
    category: "Mini PC",
    price: 5990,
    shortDesc: "Nejmenší mini PC na světě velikosti dlaně – Intel N100, 3× HDMI 4K, dvojitá LAN",
    description: "Zažijte výpočetní techniku v úplně jiném rozměru s PicoBox Mini. S hmotností pouhých 204 g a rozměry 35 × 35 × 44 mm se vejde do dlaně. Pohání ho Intel N100 s turbo frekvencí 3.4 GHz. Podporuje 3 HDMI 4K displeje a má dual 1000M LAN porty – ideální pro firewally i souborová úložiště. Perfektní společník na cesty nebo do kanceláře. Vybaven funkcí Wake On LAN a automatickým zapnutím.",
    specs: {
      cpu: "Intel Alder Lake-N N100 (3.4 GHz turbo, 6 MB cache)",
      ram: "16 GB DDR4",
      storage: "512 GB M.2 SSD",
      gpu: "Intel UHD Graphics (4K UHD 60Hz)",
      ports: "3× USB 3.0, 3× HDMI 4K, 2× LAN RJ45 1000M, Audio 3.5mm",
      wifi: "WiFi 6.0 dvoupásmový 2.4/5G + Bluetooth 4.2",
      os: "Windows 11 Pro / Linux",
      dimensions: "35 × 35 × 44 mm, 204 g"
    },
    image: `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image1.jpeg`,
    gallery: [
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image1.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image2.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image3.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image4.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image5.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image6.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image7.jpeg`,
      `${import.meta.env.BASE_URL}products/picobox-mini/PicoBoxMini_image8.jpeg`
    ],
    badges: ["NEJMENŠÍ NA SVĚTĚ", "DUAL LAN"],
    rating: 4.9,
    reviewsCount: 31,
    inStock: true
  },
];