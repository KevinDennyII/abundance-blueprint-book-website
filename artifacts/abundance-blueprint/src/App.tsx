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
import BlogPost from "@/pages/BlogPost";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPosts from "@/pages/admin/AdminPosts";
import AdminPostEditor from "@/pages/admin/AdminPostEditor";
import AdminComments from "@/pages/admin/AdminComments";
import AdminPageSeo from "@/pages/admin/AdminPageSeo";
import AdminPasskeys from "@/pages/admin/AdminPasskeys";
import AdminAccount from "@/pages/admin/AdminAccount";
import { AdminAuthProvider } from "@/components/admin/AdminAuth";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SeoProvider } from "@/lib/seo";

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
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/blog" component={Blog} />
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
            <Router />
          </WouterRouter>
        </SeoProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
