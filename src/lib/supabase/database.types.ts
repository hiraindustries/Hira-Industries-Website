export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contact_enquiries: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          enquiry_type: string;
          message: string;
          source: string;
          status: "new" | "read" | "contacted" | "archived";
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          enquiry_type: string;
          message: string;
          source?: string;
          status?: "new" | "read" | "contacted" | "archived";
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          enquiry_type?: string;
          message?: string;
          source?: string;
          status?: "new" | "read" | "contacted" | "archived";
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          description: string | null;
          image_url: string | null;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          description?: string | null;
          image_url?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
          description?: string | null;
          image_url?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string;
          subcategory_id: string | null;
          short_description: string;
          description: string;
          product_code: string | null;
          material: string | null;
          set_contents: string | null;
          pieces: number | null;
          available_colors: string[];
          features: string[];
          tags: string[];
          image_url: string | null;
          gallery_images: Json | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id: string;
          subcategory_id?: string | null;
          short_description: string;
          description: string;
          product_code?: string | null;
          material?: string | null;
          set_contents?: string | null;
          pieces?: number | null;
          available_colors?: string[];
          features?: string[];
          tags?: string[];
          image_url?: string | null;
          gallery_images?: Json | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category_id?: string;
          subcategory_id?: string | null;
          short_description?: string;
          description?: string;
          product_code?: string | null;
          material?: string | null;
          set_contents?: string | null;
          pieces?: number | null;
          available_colors?: string[];
          features?: string[];
          tags?: string[];
          image_url?: string | null;
          gallery_images?: Json | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_subcategory_id_fkey";
            columns: ["subcategory_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_enquiries: {
        Row: {
          id: string;
          product_id: string | null;
          name: string | null;
          phone: string | null;
          message: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          name?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          name?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_enquiries_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProductCategory =
  Database["public"]["Tables"]["product_categories"]["Row"];

export type CatalogueProduct =
  Database["public"]["Tables"]["products"]["Row"];

export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];

export type ContactEnquiry =
  Database["public"]["Tables"]["contact_enquiries"]["Row"];

export type ContactEnquiryStatus = ContactEnquiry["status"];
