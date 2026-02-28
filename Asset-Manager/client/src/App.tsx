import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { CartModal } from "./components/CartModal";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route component={NotFound} />
    </Switch>
  );
}

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ThemeProvider defaultTheme="dark">
            <CartProvider>
              <WouterRouter base={routerBase}>
                <div className="min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground font-sans relative overflow-x-hidden" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
                  <Navbar />
                  <main className="flex-1 relative z-10">
                    <AppRoutes />
                  </main>
                  <CartModal />
                  {/* Ambient Background glow elements */}
                  <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C4DFF]/10 blur-[150px] rounded-full pointer-events-none z-0" />
                  <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00E5FF]/10 blur-[150px] rounded-full pointer-events-none z-0" />
                </div>
                <Toaster />
              </WouterRouter>
            </CartProvider>
          </ThemeProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
