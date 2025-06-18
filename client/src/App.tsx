import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FAQ from "@/pages/FAQ";
import Legal from "@/pages/Legal";
import RendezVous from "@/pages/RendezVous";
import PremiumBackground from "./components/PremiumBackground";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // Handle anchor scrolling when navigating to home page with hash
    if (location === '/' && window.location.hash) {
      const hash = window.location.hash;
      // Wait for the component to render, then scroll
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/faq" component={FAQ} />
      <Route path="/legal" component={Legal} />
      <Route path="/rendez-vous" component={RendezVous} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('loaded');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId as string);
        if (targetElement) {
          window.scrollTo({
            top: (targetElement as HTMLElement).offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative overflow-hidden">
          <PremiumBackground />
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
