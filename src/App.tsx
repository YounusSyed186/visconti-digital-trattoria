import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import { DayPickerProvider } from "react-day-picker";
import FullMenuPage from "./components/MoreMenu";
import PhysicalMenuCarousel from "./components/Physicalmenu";
import './il8n'

const queryClient = new QueryClient();

const App = () => {
  // Define initialProps to configure the DayPickerProvider
  const initialProps = {
    selected: new Date(), // Initial selected date (can be customized)
    // You can add other properties here as required for your DayPicker configuration
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DayPickerProvider initialProps={initialProps}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/full/:category" element={<FullMenuPage />} />
              <Route path="/menuPhy" element={<PhysicalMenuCarousel />} />
              
              {/* Admin Routes */}
              
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DayPickerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
