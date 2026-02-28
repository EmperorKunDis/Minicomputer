import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import NotFound from "@/pages/not-found";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import { useEffect } from "react";

function ThemeClassSync() {
  const { theme } = useTheme();
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return null;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
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
            <ThemeClassSync />
            <WouterRouter base={routerBase}>
              <div className="min-h-screen flex flex-col font-sans">
                <Navbar />
                <CartDrawer />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
              <Toaster />
            </WouterRouter>
          </ThemeProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
