
import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface User {
  id?: number;
  phone?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  block?: string;
  houseNumber?: string;
  whatsapp?: string;
  isLoggedIn?: boolean;
}

export interface Unit {
  id: number;
  userId: number;
  block: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}

// Update Category to match Supabase schema
export interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  unitId: string; // Changed from number to string to match mock data
  categoryId: number;
  title: string;
  description: string;
  photoUrl?: string;
  logoUrl?: string;
  whatsapp: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  block: string; // Added required block field
  house_number: string; // Added required house_number field
  // Relações
  category?: Category;
  unit?: Unit;
}

export interface ServiceWithProvider extends Service {
  providerName?: string;
  block?: string;
  number?: string;
}

// Add Property interface to match database schema
export interface Property {
  id: number;
  unit_id: string;
  title: string;
  description: string;
  type: "venda" | "aluguel";
  price?: string;
  bedrooms: number;
  garage_covered: boolean;
  is_renovated: boolean;
  whatsapp: string;
  status: string;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  profiles?: {
    name: string;
    block: string;
    house_number: string;
  };
  property_photos?: {
    photo_url: string;
    is_primary: boolean;
  }[];
}
