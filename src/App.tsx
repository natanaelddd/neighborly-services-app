
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import ServicesListPage from './pages/ServicesListPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NewServicePage from './pages/NewServicePage';
import { AuthProvider } from './contexts/AuthContext';
import NewPropertyPage from './pages/NewPropertyPage';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import StorageBuckets from "@/components/admin/StorageBuckets";
import DemoModeToggle from "@/components/DemoModeToggle";
import PropertiesPage from './pages/PropertiesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <StorageBuckets />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesListPage />} />
                  <Route path="/services/:id" element={<ServiceDetailPage />} />
                  <Route path="/servicos" element={<ServicesListPage />} />
                  <Route path="/servicos/:id" element={<ServiceDetailPage />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />

                  {/* Rotas protegidas */}
                  <Route path="/services/new" element={
                    <ProtectedRoute>
                      <NewServicePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/servicos/novo" element={
                    <ProtectedRoute>
                      <NewServicePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/properties/new" element={
                    <ProtectedRoute>
                      <NewPropertyPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/user-dashboard" element={
                    <ProtectedRoute>
                      <UserDashboardPage />
                    </ProtectedRoute>
                  } />

                  {/* Rota de admin - corrigida */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  } />

                  {/* Página não encontrada */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <DemoModeToggle />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
