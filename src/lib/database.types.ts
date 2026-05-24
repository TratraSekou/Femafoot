export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          city: string
          coach: string
          created_at: string
          description: string | null
          division: string
          founded_year: number | null
          id: number
          logo_url: string | null
          name: string
          players: number
          region: string | null
          short: string
          stadium: string
          status: string
        }
        Insert: {
          city: string
          coach: string
          created_at?: string
          description?: string | null
          division: string
          founded_year?: number | null
          id?: never
          logo_url?: string | null
          name: string
          players?: number
          region?: string | null
          short: string
          stadium: string
          status: string
        }
        Update: {
          city?: string
          coach?: string
          created_at?: string
          description?: string | null
          division?: string
          founded_year?: number | null
          id?: never
          logo_url?: string | null
          name?: string
          players?: number
          region?: string | null
          short?: string
          stadium?: string
          status?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          category: string
          created_at: string
          end_date: string | null
          id: number
          logo_url: string | null
          name: string
          season: string
          start_date: string | null
          status: string
          type: string
        }
        Insert: {
          category: string
          created_at?: string
          end_date?: string | null
          id?: never
          logo_url?: string | null
          name: string
          season: string
          start_date?: string | null
          status?: string
          type: string
        }
        Update: {
          category?: string
          created_at?: string
          end_date?: string | null
          id?: never
          logo_url?: string | null
          name?: string
          season?: string
          start_date?: string | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_size: string
          file_url: string
          id: number
          status: string
          title: string
          type: string | null
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          file_size: string
          file_url: string
          id?: never
          status: string
          title: string
          type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_size?: string
          file_url?: string
          id?: never
          status?: string
          title?: string
          type?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_club_id: number
          away_score: number | null
          competition_id: number
          created_at: string
          home_club_id: number
          home_score: number | null
          id: number
          match_date: string
          referee: string | null
          status: string
        }
        Insert: {
          away_club_id: number
          away_score?: number | null
          competition_id: number
          created_at?: string
          home_club_id: number
          home_score?: number | null
          id?: never
          match_date: string
          referee?: string | null
          status: string
        }
        Update: {
          away_club_id?: number
          away_score?: number | null
          competition_id?: number
          created_at?: string
          home_club_id?: number
          home_score?: number | null
          id?: never
          match_date?: string
          referee?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_club_id_fkey"
            columns: ["away_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_club_id_fkey"
            columns: ["home_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string
          id: string
          published_at: string
          slug: string
          status: string
          tags: string[]
          title: string
          views: number
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt: string
          id?: string
          published_at?: string
          slug: string
          status: string
          tags?: string[]
          title: string
          views?: number
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: number
          is_read: boolean
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          is_read?: boolean
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          is_read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          price: number
          product_id: number
          quantity: number
          size: string | null
        }
        Insert: {
          id?: never
          order_id: number
          price: number
          product_id: number
          quantity?: number
          size?: string | null
        }
        Update: {
          id?: never
          order_id?: number
          price?: number
          product_id?: number
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_email: string
          client_name: string
          client_neighborhood: string
          client_phone: string
          created_at: string
          expires_at: string
          id: number
          status: string
          total: number
        }
        Insert: {
          client_email: string
          client_name: string
          client_neighborhood: string
          client_phone: string
          created_at?: string
          expires_at?: string
          id?: never
          status: string
          total: number
        }
        Update: {
          client_email?: string
          client_name?: string
          client_neighborhood?: string
          client_phone?: string
          created_at?: string
          expires_at?: string
          id?: never
          status?: string
          total?: number
        }
        Relationships: []
      }
      players: {
        Row: {
          birth_date: string | null
          club_id: number
          created_at: string
          first_name: string
          id: number
          last_name: string
          nationality: string
          photo_url: string | null
          position: string
          shirt_number: number | null
          status: string
        }
        Insert: {
          birth_date?: string | null
          club_id: number
          created_at?: string
          first_name: string
          id?: never
          last_name: string
          nationality?: string
          photo_url?: string | null
          position: string
          shirt_number?: number | null
          status?: string
        }
        Update: {
          birth_date?: string | null
          club_id?: number
          created_at?: string
          first_name?: string
          id?: never
          last_name?: string
          nationality?: string
          photo_url?: string | null
          position?: string
          shirt_number?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: number
          images: string[] | null
          name: string
          price: number
          reserved: number
          sizes: string[] | null
          stock: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: never
          images?: string[] | null
          name: string
          price: number
          reserved?: number
          sizes?: string[] | null
          stock?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: never
          images?: string[] | null
          name?: string
          price?: number
          reserved?: number
          sizes?: string[] | null
          stock?: number
        }
        Relationships: []
      }
      roles: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: never
          name: string
        }
        Update: {
          description?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          email: string | null
          federation_name: string
          id: number
          language: string | null
          logo_url: string | null
          phone: string | null
          social_links: Json | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          email?: string | null
          federation_name?: string
          id: number
          language?: string | null
          logo_url?: string | null
          phone?: string | null
          social_links?: Json | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          email?: string | null
          federation_name?: string
          id?: number
          language?: string | null
          logo_url?: string | null
          phone?: string | null
          social_links?: Json | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      standings: {
        Row: {
          club_id: number
          competition_id: number
          draws: number
          form: string[] | null
          goal_difference: number
          goals_against: number
          goals_for: number
          id: number
          losses: number
          played: number
          points: number
          wins: number
        }
        Insert: {
          club_id: number
          competition_id: number
          draws?: number
          form?: string[] | null
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: never
          losses?: number
          played?: number
          points?: number
          wins?: number
        }
        Update: {
          club_id?: number
          competition_id?: number
          draws?: number
          form?: string[] | null
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: never
          losses?: number
          played?: number
          points?: number
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "standings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standings_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_reservations: {
        Row: {
          client_name: string
          client_phone: string
          created_at: string
          expires_at: string
          id: string
          quantity: number
          status: string
          ticket_id: number
        }
        Insert: {
          client_name: string
          client_phone: string
          created_at?: string
          expires_at?: string
          id?: string
          quantity?: number
          status: string
          ticket_id: number
        }
        Update: {
          client_name?: string
          client_phone?: string
          created_at?: string
          expires_at?: string
          id?: string
          quantity?: number
          status?: string
          ticket_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_reservations_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          available_quantity: number
          category: string
          id: number
          match_id: number
          price: number
          reserved_quantity: number
          status: string
        }
        Insert: {
          available_quantity: number
          category: string
          id?: never
          match_id: number
          price: number
          reserved_quantity?: number
          status?: string
        }
        Update: {
          available_quantity?: number
          category?: string
          id?: never
          match_id?: number
          price?: number
          reserved_quantity?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role_id: number | null
          status: string
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role_id?: number | null
          status?: string
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role_id?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      release_expired_orders: { Args: never; Returns: undefined }
      release_expired_tickets: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
