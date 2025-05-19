
export interface User {
  id: number;
  phone: string;
  name?: string;
  email?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: number;
  userId: number;
  block: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: number;
  unitId: number;
  categoryId: number;
  title: string;
  description: string;
  photoUrl?: string;
  whatsapp: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  // Relações
  category?: Category;
  unit?: Unit;
}

export interface ServiceWithProvider extends Service {
  providerName?: string;
  block?: string;
  number?: string;
}
