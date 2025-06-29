export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_properties: {
        Row: {
          created_at: string | null
          description: string
          details: string
          id: number
          image_url: string
          price: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          details: string
          id?: number
          image_url: string
          price?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          details?: string
          id?: number
          image_url?: string
          price?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      featured_services: {
        Row: {
          created_at: string | null
          id: number
          service_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          service_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          service_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string | null
          display_order: number
          id: number
          label: string
          path: string
          updated_at: string | null
          visible: boolean
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: number
          label: string
          path: string
          updated_at?: string | null
          visible?: boolean
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: number
          label?: string
          path?: string
          updated_at?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          block: string
          created_at: string
          email: string
          house_number: string
          id: string
          name: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          block: string
          created_at?: string
          email: string
          house_number: string
          id: string
          name: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          block?: string
          created_at?: string
          email?: string
          house_number?: string
          id?: string
          name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          bedrooms: number
          created_at: string | null
          description: string
          garage_covered: boolean | null
          id: number
          is_renovated: boolean | null
          price: string | null
          rejection_reason: string | null
          status: string
          title: string
          type: string
          unit_id: string | null
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          bedrooms?: number
          created_at?: string | null
          description: string
          garage_covered?: boolean | null
          id?: number
          is_renovated?: boolean | null
          price?: string | null
          rejection_reason?: string | null
          status?: string
          title: string
          type?: string
          unit_id?: string | null
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          bedrooms?: number
          created_at?: string | null
          description?: string
          garage_covered?: boolean | null
          id?: number
          is_renovated?: boolean | null
          price?: string | null
          rejection_reason?: string | null
          status?: string
          title?: string
          type?: string
          unit_id?: string | null
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_photos: {
        Row: {
          created_at: string | null
          id: number
          is_primary: boolean | null
          photo_url: string
          property_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_primary?: boolean | null
          photo_url: string
          property_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_primary?: boolean | null
          photo_url?: string
          property_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      service_photos: {
        Row: {
          created_at: string | null
          id: number
          is_primary: boolean | null
          photo_url: string
          service_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_primary?: boolean | null
          photo_url: string
          service_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_primary?: boolean | null
          photo_url?: string
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_photos_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          block: string
          category_id: number | null
          created_at: string
          description: string
          house_number: string
          id: number
          photo_url: string | null
          status: string
          title: string
          unit_id: string | null
          updated_at: string
          whatsapp: string
        }
        Insert: {
          block: string
          category_id?: number | null
          created_at?: string
          description: string
          house_number: string
          id?: number
          photo_url?: string | null
          status?: string
          title: string
          unit_id?: string | null
          updated_at?: string
          whatsapp: string
        }
        Update: {
          block?: string
          category_id?: number | null
          created_at?: string
          description?: string
          house_number?: string
          id?: number
          photo_url?: string | null
          status?: string
          title?: string
          unit_id?: string | null
          updated_at?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: number
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
