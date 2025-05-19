
import { Category, Service, ServiceWithProvider, Unit, User } from "@/types";

// Categorias
export const categories: Category[] = [
  { id: 1, name: 'Limpeza', icon: 'home', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Encanamento', icon: 'settings', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, name: 'Elétrica', icon: 'info', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, name: 'Pintura', icon: 'edit', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 5, name: 'Jardinagem', icon: 'home', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 6, name: 'Informática', icon: 'settings', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 7, name: 'Móveis', icon: 'home', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 8, name: 'Aulas', icon: 'info', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Unidades
export const units: Unit[] = [
  { id: 1, userId: 1, block: 'A', number: '101', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, userId: 2, block: 'B', number: '202', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, userId: 3, block: 'C', number: '303', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, userId: 4, block: 'A', number: '401', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 5, userId: 5, block: 'B', number: '502', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Usuários
export const users: User[] = [
  { id: 1, phone: '(11) 91234-5678', name: 'João Silva', isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, phone: '(11) 98765-4321', name: 'Maria Oliveira', isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, phone: '(11) 99876-5432', name: 'Pedro Santos', isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, phone: '(11) 91122-3344', name: 'Ana Souza', isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 5, phone: '(11) 95566-7788', name: 'Carlos Ferreira', isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Serviços
export const services: ServiceWithProvider[] = [
  {
    id: 1,
    unitId: 1,
    categoryId: 1,
    title: 'Limpeza residencial completa',
    description: 'Ofereço serviços de limpeza completa para apartamentos. Experiência de mais de 5 anos com referências.',
    whatsapp: '5511912345678',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[0],
    providerName: 'João Silva',
    block: 'A',
    number: '101'
  },
  {
    id: 2,
    unitId: 2,
    categoryId: 2,
    title: 'Consertos hidráulicos',
    description: 'Resolvo problemas de vazamentos, troca de torneiras, chuveiros e reparos em geral.',
    whatsapp: '5511987654321',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[1],
    providerName: 'Maria Oliveira',
    block: 'B',
    number: '202'
  },
  {
    id: 3,
    unitId: 3,
    categoryId: 3,
    title: 'Serviços elétricos residenciais',
    description: 'Instalação de tomadas, lustres, interruptores e resolução de problemas elétricos.',
    whatsapp: '5511998765432',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[2],
    providerName: 'Pedro Santos',
    block: 'C',
    number: '303'
  },
  {
    id: 4,
    unitId: 4,
    categoryId: 4,
    title: 'Pintura de apartamentos',
    description: 'Serviço de pintura com acabamento profissional. Atendo a todo o condomínio.',
    whatsapp: '5511911223344',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[3],
    providerName: 'Ana Souza',
    block: 'A',
    number: '401'
  },
  {
    id: 5,
    unitId: 5,
    categoryId: 5,
    title: 'Jardinagem e paisagismo',
    description: 'Cuido do seu jardim, faço podas, plantio e manutenção de plantas.',
    whatsapp: '5511955667788',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[4],
    providerName: 'Carlos Ferreira',
    block: 'B',
    number: '502'
  },
  {
    id: 6,
    unitId: 1,
    categoryId: 6,
    title: 'Suporte de informática',
    description: 'Ajudo com problemas de computador, instalação de programas e redes Wi-Fi.',
    whatsapp: '5511912345678',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[5],
    providerName: 'João Silva',
    block: 'A',
    number: '101'
  },
  {
    id: 7,
    unitId: 2,
    categoryId: 7,
    title: 'Montagem de móveis',
    description: 'Monto qualquer tipo de móvel com rapidez e qualidade garantida.',
    whatsapp: '5511987654321',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[6],
    providerName: 'Maria Oliveira',
    block: 'B',
    number: '202'
  },
  {
    id: 8,
    unitId: 3,
    categoryId: 8,
    title: 'Aulas de matemática',
    description: 'Professor de matemática oferece aulas particulares para estudantes do ensino fundamental e médio.',
    whatsapp: '5511998765432',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: categories[7],
    providerName: 'Pedro Santos',
    block: 'C',
    number: '303'
  },
];

// Função para obter serviços filtrados por categoria
export const getServicesByCategory = (categoryId: number | null = null) => {
  if (categoryId === null) {
    return services.filter(service => service.status === 'approved');
  }
  return services.filter(service => service.status === 'approved' && service.categoryId === categoryId);
};

// Função para obter um serviço pelo ID
export const getServiceById = (id: number) => {
  return services.find(service => service.id === id);
};

// Função para buscar serviços por texto
export const searchServices = (text: string) => {
  const searchTerm = text.toLowerCase();
  return services.filter(service => 
    service.status === 'approved' && 
    (service.title.toLowerCase().includes(searchTerm) || 
     service.description.toLowerCase().includes(searchTerm))
  );
};

// Função para obter todas as categorias
export const getAllCategories = () => {
  return categories;
};
