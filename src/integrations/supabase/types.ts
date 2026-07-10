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
  public: {
    Tables: {
      community_groups: {
        Row: {
          created_at: string
          descricao: string
          id: string
          is_active: boolean
          link: string
          nicho: string
          plataforma: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          is_active?: boolean
          link: string
          nicho: string
          plataforma: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          is_active?: boolean
          link?: string
          nicho?: string
          plataforma?: string
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          affiliate_link: string | null
          conteudo: string
          created_at: string
          id: string
          is_published: boolean
          nicho: string
          subnicho: string
          subtitulo: string
          titulo: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          affiliate_link?: string | null
          conteudo: string
          created_at?: string
          id?: string
          is_published?: boolean
          nicho: string
          subnicho: string
          subtitulo: string
          titulo: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          affiliate_link?: string | null
          conteudo?: string
          created_at?: string
          id?: string
          is_published?: boolean
          nicho?: string
          subnicho?: string
          subtitulo?: string
          titulo?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          created_at: string
          email: string
          email_enviado: boolean
          gateway: string
          gateway_event_id: string | null
          id: string
          plano: string
          produto_nome: string | null
          status: string
          updated_at: string
          usuario_id: string
          valor: number | null
        }
        Insert: {
          created_at?: string
          email: string
          email_enviado?: boolean
          gateway?: string
          gateway_event_id?: string | null
          id?: string
          plano: string
          produto_nome?: string | null
          status?: string
          updated_at?: string
          usuario_id: string
          valor?: number | null
        }
        Update: {
          created_at?: string
          email?: string
          email_enviado?: boolean
          gateway?: string
          gateway_event_id?: string | null
          id?: string
          plano?: string
          produto_nome?: string | null
          status?: string
          updated_at?: string
          usuario_id?: string
          valor?: number | null
        }
        Relationships: []
      }
      projetos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nicho: string
          nome_negocio: string
          paginas_ia: Json
          usuario_id: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nicho: string
          nome_negocio: string
          paginas_ia?: Json
          usuario_id: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nicho?: string
          nome_negocio?: string
          paginas_ia?: Json
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projetos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          acesso_ate: string | null
          created_at: string
          ebooks_gerados_mes: number
          email: string
          id: string
          paginas_publicadas_total: number
          plano: string
          status: string
          trocar_senha_obrigatorio: boolean
          updated_at: string
          videos_gerados_mes: number
        }
        Insert: {
          acesso_ate?: string | null
          created_at?: string
          ebooks_gerados_mes?: number
          email: string
          id: string
          paginas_publicadas_total?: number
          plano?: string
          status?: string
          trocar_senha_obrigatorio?: boolean
          updated_at?: string
          videos_gerados_mes?: number
        }
        Update: {
          acesso_ate?: string | null
          created_at?: string
          ebooks_gerados_mes?: number
          email?: string
          id?: string
          paginas_publicadas_total?: number
          plano?: string
          status?: string
          trocar_senha_obrigatorio?: boolean
          updated_at?: string
          videos_gerados_mes?: number
        }
        Relationships: []
      }
      video_webhook_tokens: {
        Row: {
          created_at: string
          token: string
          video_id: string
        }
        Insert: {
          created_at?: string
          token: string
          video_id: string
        }
        Update: {
          created_at?: string
          token?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_webhook_tokens_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: true
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string
          ebook_id: string
          erro: string | null
          id: string
          render_id: string | null
          status: string
          updated_at: string
          usuario_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          ebook_id: string
          erro?: string | null
          id?: string
          render_id?: string | null
          status?: string
          updated_at?: string
          usuario_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          ebook_id?: string
          erro?: string | null
          id?: string
          render_id?: string | null
          status?: string
          updated_at?: string
          usuario_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_counter: {
        Args: { p_column: string; p_user_id: string }
        Returns: undefined
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
