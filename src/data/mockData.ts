
import { Category, Service, ServiceWithProvider } from "@/types";

export const mockCategories: Category[] = [
  { id: 1, name: "Limpeza", icon: "🧹", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 2, name: "Manutenção", icon: "🔧", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 3, name: "Jardinagem", icon: "🌱", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 4, name: "Cuidados", icon: "👶", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 5, name: "Alimentação", icon: "🍽️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 6, name: "Transporte", icon: "🚗", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 7, name: "Tecnologia", icon: "💻", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 8, name: "Ensino", icon: "📚", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

export const mockServices: Service[] = [
  {
    id: 1,
    unitId: 1,
    categoryId: 1,
    title: "Limpeza de Apartamento",
    description: "Serviço de limpeza geral para apartamentos de todos os tamanhos.",
    photoUrl: "https://source.unsplash.com/300x200/?cleaning",
    whatsapp: "5511999999999",
    status: "approved",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: 2,
    unitId: 2,
    categoryId: 2,
    title: "Reparo de Ar Condicionado",
    description: "Manutenção e reparo de sistemas de ar condicionado.",
    photoUrl: "https://source.unsplash.com/300x200/?air-conditioning",
    whatsapp: "5511999999998",
    status: "approved",
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z",
  },
  {
    id: 3,
    unitId: 3,
    categoryId: 3,
    title: "Corte de Grama e Jardinagem",
    description: "Serviços de jardinagem e corte de grama para áreas residenciais.",
    photoUrl: "https://source.unsplash.com/300x200/?gardening",
    whatsapp: "5511999999997",
    status: "approved",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
  {
    id: 4,
    unitId: 4,
    categoryId: 4,
    title: "Babá para Crianças",
    description: "Serviço de babá para cuidar de crianças de todas as idades.",
    photoUrl: "https://source.unsplash.com/300x200/?babysitting",
    whatsapp: "5511999999996",
    status: "approved",
    createdAt: "2024-01-13T00:00:00Z",
    updatedAt: "2024-01-13T00:00:00Z",
  },
  {
    id: 5,
    unitId: 5,
    categoryId: 5,
    title: "Entrega de Comida Caseira",
    description: "Entrega de refeições caseiras preparadas com ingredientes frescos.",
    photoUrl: "https://source.unsplash.com/300x200/?homemade-food",
    whatsapp: "5511999999995",
    status: "approved",
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
  {
    id: 6,
    unitId: 6,
    categoryId: 6,
    title: "Transporte de Pequenos Objetos",
    description: "Serviço de transporte para pequenos objetos e encomendas.",
    photoUrl: "https://source.unsplash.com/300x200/?delivery",
    whatsapp: "5511999999994",
    status: "approved",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 7,
    unitId: 7,
    categoryId: 7,
    title: "Aulas de Informática",
    description: "Aulas particulares de informática para iniciantes e avançados.",
    photoUrl: "https://source.unsplash.com/300x200/?computer-class",
    whatsapp: "5511999999993",
    status: "approved",
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
  {
    id: 8,
    unitId: 8,
    categoryId: 8,
    title: "Aulas de Reforço Escolar",
    description: "Aulas de reforço escolar em diversas matérias para alunos do ensino fundamental e médio.",
    photoUrl: "https://source.unsplash.com/300x200/?tutoring",
    whatsapp: "5511999999992",
    status: "approved",
    createdAt: "2024-01-17T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
  },
];

export const mockServicesWithProvider: ServiceWithProvider[] = mockServices.map(service => ({
  ...service,
  providerName: `Morador ${service.unitId}`,
  block: `${service.unitId}A`,
  number: `${service.unitId * 10}`,
}));

// Legacy function exports for backward compatibility
export const getAllCategories = () => mockCategories;
export const services = mockServices;
export const getServiceById = (id: number) => mockServices.find(service => service.id === id);
export const getServicesByCategory = (categoryId: number) => mockServices.filter(service => service.categoryId === categoryId);
export const searchServices = (query: string) => mockServices.filter(service => 
  service.title.toLowerCase().includes(query.toLowerCase()) ||
  service.description.toLowerCase().includes(query.toLowerCase())
);
