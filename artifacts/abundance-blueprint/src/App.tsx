import { Redirect, Route, Switch, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Book from "@/pages/Book";
import Library from "@/pages/Library";
import Live from "@/pages/Live";
import Crisis from "@/pages/Crisis";
import WorkWithMe from "@/pages/WorkWithMe";
import Contact from "@/pages/Contact";
import Circle from "@/pages/Circle";
import FinancialWellnessReset from "@/pages/FinancialWellnessReset";
import CashFlowIntensive from "@/pages/CashFlowIntensive";
import ReadinessAssessment from "@/pages/ReadinessAssessment";
import Okayinaire from "@/pages/Okayinaire";
import Pulse from "@/pages/pulse/Pulse";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPosts from "@/pages/admin/AdminPosts";
import AdminPostEditor from "@/pages/admin/AdminPostEditor";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminEventEditor from "@/pages/admin/AdminEventEditor";
import AdminPodcastAppearances from "@/pages/admin/AdminPodcastAppearances";
import AdminPodcastAppearanceEditor from "@/pages/admin/AdminPodcastAppearanceEditor";
import AdminComments from "@/pages/admin/AdminComments";
import AdminPageSeo from "@/pages/admin/AdminPageSeo";
import AdminPasskeys from "@/pages/admin/AdminPasskeys";
import AdminAccount from "@/pages/admin/AdminAccount";
import { AdminAuthProvider } from "@/components/admin/AdminAuth";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { ExternalRedirect } from "@/components/ExternalRedirect";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SeoProvider } from "@/lib/seo";
import {
  GUIDE_WALKTHROUGH_URL,
  LETTER_SITE_URL,
  LIBRARY_HOURS_URL,
} from "@/lib/social";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/book" component={Book} />
      <Route path="/library" component={Library} />
      <Route path="/live" component={Live} />
      <Route path="/crisis" component={Crisis} />
      <Route path="/shop">
        <Redirect to="/library" />
      </Route>
      <Route path="/work-with-me" component={WorkWithMe} />
      <Route path="/contact" component={Contact} />
      <Route path="/financial-wellness-reset" component={FinancialWellnessReset} />
      {/* Unlisted — share after discovery; not linked from Work With Me or nav. */}
      <Route path="/cash-flow-intensive" component={CashFlowIntensive} />
      <Route path="/readiness-assessment" component={ReadinessAssessment} />
      <Route path="/services">
        <Redirect to="/work-with-me" />
      </Route>
      <Route path="/circle" component={Circle} />
      {/* Unlisted landing — not in nav; share URL only. */}
      <Route path="/okayinaire" component={Okayinaire} />
      {/* Unlisted Weekly Money Pulse — Kit share URL only; not in nav. */}
      <Route path="/pulse" component={Pulse} />
      {/* Public letter lives on letter.longmoneyconcepts.com (host 301 + SPA fallback). */}
      <Route path="/articles/:slug">
        <ExternalRedirect href={LETTER_SITE_URL} />
      </Route>
      <Route path="/articles">
        <ExternalRedirect href={LETTER_SITE_URL} />
      </Route>
      <Route path="/blog/:slug">
        <ExternalRedirect href={LETTER_SITE_URL} />
      </Route>
      <Route path="/blog">
        <ExternalRedirect href={LETTER_SITE_URL} />
      </Route>
      {/* Short links for guides — change target URLs in social.ts / Infisical only. */}
      <Route path="/walkthrough">
        <ExternalRedirect href={GUIDE_WALKTHROUGH_URL} />
      </Route>
      <Route path="/libraryhours">
        {LIBRARY_HOURS_URL ? (
          <ExternalRedirect href={LIBRARY_HOURS_URL} />
        ) : (
          <Redirect to="/library" />
        )}
      </Route>
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      <Route path="/admin/login">
        <AdminAuthProvider>
          <AdminLogin />
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/posts/new">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPostEditor mode="new" />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/posts/:id/edit">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPostEditor mode="edit" />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/posts">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPosts />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/events/new">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminEventEditor mode="new" />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/events/:id/edit">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminEventEditor mode="edit" />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/events">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminEvents />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/podcast-appearances/new">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPodcastAppearanceEditor mode="new" />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/podcast-appearances/:id/edit">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPodcastAppearanceEditor mode="edit" />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/podcast-appearances">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPodcastAppearances />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/comments">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminComments />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/seo">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPageSeo />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/passkeys">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminPasskeys />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin/account">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminAccount />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>
      <Route path="/admin">
        <AdminAuthProvider>
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        </AdminAuthProvider>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SeoProvider>
          <WouterRouter
            base={(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}
          >
            <ScrollToTop />
            <GoogleAnalytics />
            <Router />
          </WouterRouter>
        </SeoProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
