export interface Product {
  id: string;
  name: string;
  category: 'Mini PC' | 'Konzole' | 'Příslušenství';
  price: number;
  originalPrice?: number;
  image: string;
  shortSpecs: string;
  description: string;
  specs: Record<string, string>;
  isNew?: boolean;
  featured?: boolean;
  rating: number;
  reviews: number;
}

export const mockProducts: Product[] = [
  {
    id: "powerbox-lite",
    name: "PowerBox Lite",
    category: "Mini PC",
    price: 8990,
    originalPrice: 10990,
    image: "/products/powerbox-lite/PowerBoxLite_image1.jpeg",
    shortSpecs: "Intel Core i5-8259U | 16GB DDR4 | 512GB NVMe",
    description: "Výkonný mini PC s procesorem Intel Core i5-8259U 8. generace, 16 GB DDR4 RAM a 512 GB NVMe SSD. Podporuje až 3 monitory, Wi-Fi 6 a Bluetooth 5.2.",
    specs: {
      "Procesor": "Intel Core i5-8259U, 4 jádra / 8 vláken, až 3,8 GHz",
      "RAM": "16 GB DDR4",
      "Úložiště": "512 GB NVMe SSD",
      "Grafika": "Intel Iris Plus 655",
      "Porty": "4× USB 3.0, 1× USB-C, 2× HDMI, 1× VGA, 1× LAN",
      "Bezdrátové spojení": "Wi-Fi 6.0 + Bluetooth 5.2",
      "OS": "Windows 11 Pro",
      "Rozměry": "130 × 126 × 51 mm",
      "Hmotnost": "450 g"
    },
    isNew: false,
    featured: true,
    rating: 4.7,
    reviews: 38
  },
  {
    id: "picobox-home",
    name: "PicoBox Home",
    category: "Mini PC",
    price: 7490,
    originalPrice: 8990,
    image: "/products/picobox-home/PicoBoxHome_image1.jpeg",
    shortSpecs: "Intel N200 | 16GB DDR4 | 1TB SSD",
    description: "Úsporný mini PC s procesorem Intel N200, 16 GB RAM a 1 TB SSD. Vestavěný LCD displej. Tichý, spolehlivý a energeticky šetrný.",
    specs: {
      "Procesor": "Intel N200, 4 jádra, až 3,70 GHz",
      "RAM": "16 GB DDR4",
      "Úložiště": "1 TB SSD",
      "Displej": "Vestavěný LCD displej",
      "Porty": "2× USB 3.0, 2× USB 2.0, 2× HDMI 4K, 2× LAN",
      "Bezdrátové spojení": "Wi-Fi 6.0 + Bluetooth 5.2",
      "OS": "Windows 11 Pro",
      "Rozměry": "124 × 128 × 41 mm",
      "Hmotnost": "380 g"
    },
    isNew: true,
    featured: true,
    rating: 4.8,
    reviews: 22
  },
  {
    id: "picobox-pro",
    name: "PicoBox Pro",
    category: "Mini PC",
    price: 6990,
    originalPrice: 8490,
    image: "/products/picobox-pro/PicoBoxPro_image1.jpeg",
    shortSpecs: "Intel N100 | 16GB DDR4 | 512GB SSD",
    description: "Mini PC s procesorem Intel N100 12. generace, LED podsvícením a vyměnitelným HDD bay. Tichý provoz, kompaktní design.",
    specs: {
      "Procesor": "Intel N100 (12. generace), 4 jádra",
      "RAM": "16 GB DDR4",
      "Úložiště": "512 GB M.2 SSD",
      "Design": "LED podsvícení",
      "Porty": "2× USB 3.0, 1× USB 2.0, 2× HDMI, 1× LAN",
      "Bezdrátové spojení": "Wi-Fi 6.0 + Bluetooth 5.2",
      "OS": "Windows 11 Pro",
      "Rozměry": "128 × 128 × 52 mm",
      "Hmotnost": "386 g"
    },
    isNew: false,
    featured: false,
    rating: 4.6,
    reviews: 17
  },
  {
    id: "picobox-mini",
    name: "PicoBox Mini",
    category: "Mini PC",
    price: 5990,
    originalPrice: 7490,
    image: "/products/picobox-mini/PicoBoxMini_image1.jpeg",
    shortSpecs: "Intel N100 | 16GB DDR4 | 512GB SSD",
    description: "Nejmenší mini PC – 35 × 35 × 44 mm. Nabízí 3× HDMI 4K, 2× LAN, Wi-Fi 6 a Windows 11 Pro.",
    specs: {
      "Procesor": "Intel N100, až 3,4 GHz Turbo",
      "RAM": "16 GB DDR4",
      "Úložiště": "512 GB SSD",
      "Video výstupy": "3× HDMI 4K",
      "Porty": "3× USB 3.0, 2× LAN 1000M",
      "Bezdrátové spojení": "Wi-Fi 6.0 + Bluetooth 4.2",
      "OS": "Windows 11 Pro",
      "Rozměry": "35 × 35 × 44 mm",
      "Hmotnost": "204 g"
    },
    isNew: true,
    featured: false,
    rating: 4.9,
    reviews: 11
  },
];
