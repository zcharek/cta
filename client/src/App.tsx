import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";

// Pages principales
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import FAQ from "@/pages/FAQ";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/not-found";

// Pages de services - Gestion
import GestionProjetAgile from "@/pages/services/GestionProjetAgile";

// Pages de services - Tests fonctionnels
import Validation from "@/pages/services/Validation";
import Integration from "@/pages/services/Integration";
import Regression from "@/pages/services/Regression";
import Acceptation from "@/pages/services/Acceptation";

// Pages de services - Tests non-fonctionnels
import Charge from "@/pages/services/Charge";
import Stress from "@/pages/services/Stress";
import MonteeCharge from "@/pages/services/MonteeCharge";
import Accessibilite from "@/pages/services/Accessibilite";
import Compatibilite from "@/pages/services/Compatibilite";
import Ux from "@/pages/services/Ux";

// Pages de services - Outils
import Playwright from "@/pages/services/Playwright";
import Cypress from "@/pages/services/Cypress";
import Selenium from "@/pages/services/Selenium";
import Postman from "@/pages/services/Postman";
import k6 from "@/pages/services/k6";
import Percy from "@/pages/services/Percy";
import TestNG from "@/pages/services/TestNG";
import Cucumber from "@/pages/services/Cucumber";
import RestAssured from "@/pages/services/RestAssured";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router hook={useHashLocation}>
          <ScrollToTop />
          <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/faq" component={FAQ} />
          <Route path="/legal" component={Legal} />
          
          {/* Gestion de projet */}
          <Route path="/services/gestion-projet-agile" component={GestionProjetAgile} />
          
          {/* Tests fonctionnels */}
          <Route path="/services/validation" component={Validation} />
          <Route path="/services/integration" component={Integration} />
          <Route path="/services/regression" component={Regression} />
          <Route path="/services/acceptation" component={Acceptation} />
          
          {/* Tests non-fonctionnels */}
          <Route path="/services/charge" component={Charge} />
          <Route path="/services/stress" component={Stress} />
          <Route path="/services/montee-charge" component={MonteeCharge} />
          <Route path="/services/accessibilite" component={Accessibilite} />
          <Route path="/services/compatibilite" component={Compatibilite} />
          <Route path="/services/ux" component={Ux} />
          
          {/* Outils de test */}
          <Route path="/services/playwright" component={Playwright} />
          <Route path="/services/cypress" component={Cypress} />
          <Route path="/services/selenium" component={Selenium} />
          <Route path="/services/postman" component={Postman} />
          <Route path="/services/k6" component={k6} />
          <Route path="/services/percy" component={Percy} />
          <Route path="/services/testng" component={TestNG} />
          <Route path="/services/cucumber" component={Cucumber} />
          <Route path="/services/restassured" component={RestAssured} />
          
          <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
