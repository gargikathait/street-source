import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import { CartProvider } from "@/hooks/use-cart";
import { GroupOrdersProvider } from "@/hooks/use-group-orders";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VendorOnboarding from "./pages/VendorOnboarding";
import Analytics from "./pages/Analytics";
import MenuManagement from "./pages/MenuManagement";
import Inventory from "./pages/Inventory";
import SupplierComparison from "./pages/SupplierComparison";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="streetsource-theme">
      <LanguageProvider>
        <CartProvider>
          <GroupOrdersProvider>
            <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<VendorOnboarding />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/suppliers" element={<SupplierComparison />} />
              <Route path="/notifications" element={<Notifications />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
            </TooltipProvider>
          </GroupOrdersProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
