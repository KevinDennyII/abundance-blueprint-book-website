import { Redirect, Route, Switch, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Book from "@/pages/Book";
import Contact from "@/pages/Contact";
import Circle from "@/pages/Circle";
import Blog from "@/pages/Blog";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/book" component={Book} />
      <Route path="/work-with-me" component={Contact} />
      <Route path="/contact">
        <Redirect to="/work-with-me" />
      </Route>
      <Route path="/circle" component={Circle} />
      <Route path="/blog" component={Blog} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
