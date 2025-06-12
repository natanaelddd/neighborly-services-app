
import { Category, Service, ServiceWithProvider } from "@/types";

// Categorias e serviços vazios - dados virão do Supabase
export const mockCategories: Category[] = [];
export const mockServices: Service[] = [];
export const mockServicesWithProvider: ServiceWithProvider[] = [];

// Funções de fallback que retornam arrays vazios
export const getAllCategories = () => mockCategories;
export const services = mockServices;

export const getServiceById = (id: number) => {
  return null;
};

export const getServicesByCategory = (categoryId: number | null) => {
  return [];
};

export const searchServices = (query: string) => {
  return [];
};
