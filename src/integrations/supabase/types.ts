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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ogloszenia: {
        Row: {
          adres: string | null
          biust: string | null
          cena_umnie: number | null
          cena_umnie_15min: number | null
          cena_umnie_30min: number | null
          cena_umnie_noc: number | null
          cena_wyjazd: number | null
          cena_wyjazd_15min: number | null
          cena_wyjazd_30min: number | null
          cena_wyjazd_noc: number | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_confirmed: boolean | null
          is_paid: boolean | null
          kategoria: string
          kolor_oczu: string | null
          kolor_wlosow: string | null
          krotki_opis: string | null
          ksztalt_biustu: string | null
          miasto: string
          narodowosc: string | null
          orientacja: string | null
          pelny_opis: string | null
          plec: string | null
          rodzaj_biustu: string | null
          rozmiar_biustu: string | null
          tatuaze: string | null
          telefon: string | null
          telegram: string | null
          typ: string
          tytul: string
          updated_at: string | null
          user_id: string
          waga: string | null
          whatsapp: string | null
          wiek: string | null
          wojewodztwo: string | null
          www: string | null
          wyjazdy: string | null
          wzrost: string | null
        }
        Insert: {
          adres?: string | null
          biust?: string | null
          cena_umnie?: number | null
          cena_umnie_15min?: number | null
          cena_umnie_30min?: number | null
          cena_umnie_noc?: number | null
          cena_wyjazd?: number | null
          cena_wyjazd_15min?: number | null
          cena_wyjazd_30min?: number | null
          cena_wyjazd_noc?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_confirmed?: boolean | null
          is_paid?: boolean | null
          kategoria: string
          kolor_oczu?: string | null
          kolor_wlosow?: string | null
          krotki_opis?: string | null
          ksztalt_biustu?: string | null
          miasto: string
          narodowosc?: string | null
          orientacja?: string | null
          pelny_opis?: string | null
          plec?: string | null
          rodzaj_biustu?: string | null
          rozmiar_biustu?: string | null
          tatuaze?: string | null
          telefon?: string | null
          telegram?: string | null
          typ: string
          tytul: string
          updated_at?: string | null
          user_id: string
          waga?: string | null
          whatsapp?: string | null
          wiek?: string | null
          wojewodztwo?: string | null
          www?: string | null
          wyjazdy?: string | null
          wzrost?: string | null
        }
        Update: {
          adres?: string | null
          biust?: string | null
          cena_umnie?: number | null
          cena_umnie_15min?: number | null
          cena_umnie_30min?: number | null
          cena_umnie_noc?: number | null
          cena_wyjazd?: number | null
          cena_wyjazd_15min?: number | null
          cena_wyjazd_30min?: number | null
          cena_wyjazd_noc?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_confirmed?: boolean | null
          is_paid?: boolean | null
          kategoria?: string
          kolor_oczu?: string | null
          kolor_wlosow?: string | null
          krotki_opis?: string | null
          ksztalt_biustu?: string | null
          miasto?: string
          narodowosc?: string | null
          orientacja?: string | null
          pelny_opis?: string | null
          plec?: string | null
          rodzaj_biustu?: string | null
          rozmiar_biustu?: string | null
          tatuaze?: string | null
          telefon?: string | null
          telegram?: string | null
          typ?: string
          tytul?: string
          updated_at?: string | null
          user_id?: string
          waga?: string | null
          whatsapp?: string | null
          wiek?: string | null
          wojewodztwo?: string | null
          www?: string | null
          wyjazdy?: string | null
          wzrost?: string | null
        }
        Relationships: []
      }
      ogloszenia_godziny: {
        Row: {
          created_at: string | null
          dzien_tygodnia: string
          godzina_do: string
          godzina_od: string
          id: string
          ogloszenie_id: string
        }
        Insert: {
          created_at?: string | null
          dzien_tygodnia: string
          godzina_do: string
          godzina_od: string
          id?: string
          ogloszenie_id: string
        }
        Update: {
          created_at?: string | null
          dzien_tygodnia?: string
          godzina_do?: string
          godzina_od?: string
          id?: string
          ogloszenie_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ogloszenia_godziny_ogloszenie_id_fkey"
            columns: ["ogloszenie_id"]
            isOneToOne: false
            referencedRelation: "ogloszenia"
            referencedColumns: ["id"]
          },
        ]
      }
      ogloszenia_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          ogloszenie_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          ogloszenie_id: string
          storage_path: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          ogloszenie_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "ogloszenia_images_ogloszenie_id_fkey"
            columns: ["ogloszenie_id"]
            isOneToOne: false
            referencedRelation: "ogloszenia"
            referencedColumns: ["id"]
          },
        ]
      }
      ogloszenia_preferencje: {
        Row: {
          created_at: string | null
          id: string
          ogloszenie_id: string
          preferencja: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ogloszenie_id: string
          preferencja: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ogloszenie_id?: string
          preferencja?: string
        }
        Relationships: [
          {
            foreignKeyName: "ogloszenia_preferencje_ogloszenie_id_fkey"
            columns: ["ogloszenie_id"]
            isOneToOne: false
            referencedRelation: "ogloszenia"
            referencedColumns: ["id"]
          },
        ]
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
