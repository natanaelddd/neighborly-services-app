
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ServicesListPage from "@/pages/ServicesListPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import NewServicePage from "@/pages/NewServicePage";
import AboutPage from "@/pages/AboutPage";
import CategoryPage from "@/pages/CategoryPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesListPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/services/new" element={<NewServicePage />} />
              <Route path="/categories" element={<ServicesListPage />} />
              <Route path="/categories/:categoryId" element={<CategoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
