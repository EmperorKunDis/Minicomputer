import Header from '@/components/layout/Header';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import Bestsellers from '@/components/home/Bestsellers';
import FeaturedProduct from '@/components/home/FeaturedProduct';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F5]">
        <Header />
        
        <main>
          <Hero />
          <Categories />
          <Bestsellers />
          <FeaturedProduct />
        </main>
        
        <Footer />
      </div>
    </SmoothScroll>
  );
}
