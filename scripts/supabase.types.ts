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
      localidades: {
        Row: {
          cod: number
          nome: string
          pop_local: number
          uf: string
        }
        Insert: {
          cod: number
          nome: string
          pop_local: number
          uf: string
        }
        Update: {
          cod?: number
          nome?: string
          pop_local?: number
          uf?: string
        }
        Relationships: []
      }
      sobrenomes: {
        Row: {
          freq_ac: number | null
          freq_al: number | null
          freq_am: number | null
          freq_ap: number | null
          freq_ba: number | null
          freq_br: number
          freq_ce: number | null
          freq_df: number | null
          freq_es: number | null
          freq_go: number | null
          freq_ma: number | null
          freq_mg: number | null
          freq_ms: number | null
          freq_mt: number | null
          freq_pa: number | null
          freq_pb: number | null
          freq_pe: number | null
          freq_pi: number | null
          freq_pr: number | null
          freq_rj: number | null
          freq_rn: number | null
          freq_ro: number | null
          freq_rr: number | null
          freq_rs: number | null
          freq_sc: number | null
          freq_se: number | null
          freq_sp: number | null
          freq_to: number | null
          nome: string
        }
        Insert: {
          freq_ac?: number | null
          freq_al?: number | null
          freq_am?: number | null
          freq_ap?: number | null
          freq_ba?: number | null
          freq_br: number
          freq_ce?: number | null
          freq_df?: number | null
          freq_es?: number | null
          freq_go?: number | null
          freq_ma?: number | null
          freq_mg?: number | null
          freq_ms?: number | null
          freq_mt?: number | null
          freq_pa?: number | null
          freq_pb?: number | null
          freq_pe?: number | null
          freq_pi?: number | null
          freq_pr?: number | null
          freq_rj?: number | null
          freq_rn?: number | null
          freq_ro?: number | null
          freq_rr?: number | null
          freq_rs?: number | null
          freq_sc?: number | null
          freq_se?: number | null
          freq_sp?: number | null
          freq_to?: number | null
          nome: string
        }
        Update: {
          freq_ac?: number | null
          freq_al?: number | null
          freq_am?: number | null
          freq_ap?: number | null
          freq_ba?: number | null
          freq_br?: number
          freq_ce?: number | null
          freq_df?: number | null
          freq_es?: number | null
          freq_go?: number | null
          freq_ma?: number | null
          freq_mg?: number | null
          freq_ms?: number | null
          freq_mt?: number | null
          freq_pa?: number | null
          freq_pb?: number | null
          freq_pe?: number | null
          freq_pi?: number | null
          freq_pr?: number | null
          freq_rj?: number | null
          freq_rn?: number | null
          freq_ro?: number | null
          freq_rr?: number | null
          freq_rs?: number | null
          freq_sc?: number | null
          freq_se?: number | null
          freq_sp?: number | null
          freq_to?: number | null
          nome?: string
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
    Enums: {},
  },
} as const
