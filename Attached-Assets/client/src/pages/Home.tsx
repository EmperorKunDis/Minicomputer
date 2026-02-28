import Header from '@/components/layout/Header';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import Bestsellers from '@/components/home/Bestsellers';
import FeaturedProduct from '@/components/home/FeaturedProduct';
import BlogPreview from '@/components/home/BlogPreview';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main>
          <Hero />
          <Categories />
          <Bestsellers />
          <FeaturedProduct />
          <BlogPreview />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
