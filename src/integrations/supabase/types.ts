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
      car_colors: {
        Row: {
          car_id: string
          code: string
          created_at: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          car_id: string
          code: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          car_id?: string
          code?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_colors_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      car_images: {
        Row: {
          car_id: string
          created_at: string
          id: string
          url: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          url: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      car_interiors: {
        Row: {
          car_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_interiors_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      car_trims: {
        Row: {
          car_id: string
          created_at: string
          id: string
          name: string
          price: string
          specs: Json
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          name: string
          price: string
          specs?: Json
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          name?: string
          price?: string
          specs?: Json
        }
        Relationships: [
          {
            foreignKeyName: "car_trims_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          base_price: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          specs: Json
          updated_at: string
        }
        Insert: {
          base_price: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          specs?: Json
          updated_at?: string
        }
        Update: {
          base_price?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          specs?: Json
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          car_preferences: string
          contact_method: string
          created_at: string
          id: string
          name: string
          phone: string
          timing: string
        }
        Insert: {
          car_preferences: string
          contact_method: string
          created_at?: string
          id?: string
          name: string
          phone: string
          timing: string
        }
        Update: {
          car_preferences?: string
          contact_method?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string
          timing?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          car_name: string
          color: string | null
          contact_method: string
          created_at: string
          id: string
          interior: string | null
          name: string
          phone: string
          price: string | null
          trim_name: string | null
        }
        Insert: {
          car_name: string
          color?: string | null
          contact_method: string
          created_at?: string
          id?: string
          interior?: string | null
          name: string
          phone: string
          price?: string | null
          trim_name?: string | null
        }
        Update: {
          car_name?: string
          color?: string | null
          contact_method?: string
          created_at?: string
          id?: string
          interior?: string | null
          name?: string
          phone?: string
          price?: string | null
          trim_name?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
