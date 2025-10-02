import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: 'cliente' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          role?: 'cliente' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'cliente' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          base_price: number;
          image_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          unit: 'g' | 'ml' | 'pieza';
          current_stock: number;
          minimum_stock: number;
          cost_per_unit: number;
          created_at: string;
          updated_at: string;
        };
      };
      option_groups: {
        Row: {
          id: string;
          name: string;
          is_required: boolean;
          allow_multiple: boolean;
          display_order: number;
        };
      };
      options: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          additional_price: number;
          display_order: number;
        };
      };
    };
  };
};
