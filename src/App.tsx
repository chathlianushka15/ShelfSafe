import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import AddItem from "./pages/AddItem";
import Alerts from "./pages/Alerts";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute"; // new

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"     element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected — redirect to /auth if not logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/add-item"   element={<AddItem />} />
            <Route path="/alerts"     element={<Alerts />} />
            <Route path="/insights"   element={<Insights />} />
            <Route path="/settings"   element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;