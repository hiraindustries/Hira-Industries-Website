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
          status: "new" | "read" | "contacted" | "converted" | "spam" | "archived";
          priority: "low" | "normal" | "high" | "urgent";
          assigned_admin_email: string | null;
          internal_note: string | null;
          follow_up_at: string | null;
          converted_lead_id: string | null;
          converted_at: string | null;
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
          status?: "new" | "read" | "contacted" | "converted" | "spam" | "archived";
          priority?: "low" | "normal" | "high" | "urgent";
          assigned_admin_email?: string | null;
          internal_note?: string | null;
          follow_up_at?: string | null;
          converted_lead_id?: string | null;
          converted_at?: string | null;
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
          status?: "new" | "read" | "contacted" | "converted" | "spam" | "archived";
          priority?: "low" | "normal" | "high" | "urgent";
          assigned_admin_email?: string | null;
          internal_note?: string | null;
          follow_up_at?: string | null;
          converted_lead_id?: string | null;
          converted_at?: string | null;
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
      admin_audit_logs: {
        Row: {
          id: string;
          admin_user_id: string | null;
          admin_email: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          entity_display_name: string | null;
          before_summary: string | null;
          after_summary: string | null;
          success: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id?: string | null;
          admin_email?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          entity_display_name?: string | null;
          before_summary?: string | null;
          after_summary?: string | null;
          success?: boolean;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          user_id: string;
          email: string;
          display_name: string | null;
          role: "owner" | "admin" | "editor" | "sales" | "viewer";
          is_active: boolean;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          display_name?: string | null;
          role?: "owner" | "admin" | "editor" | "sales" | "viewer";
          is_active?: boolean;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string;
          display_name?: string | null;
          role?: "owner" | "admin" | "editor" | "sales" | "viewer";
          is_active?: boolean;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      crm_companies: {
        Row: {
          id: string;
          name: string;
          business_type: string | null;
          gst_number: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          primary_customer_id: string | null;
          notes: string | null;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          business_type?: string | null;
          gst_number?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          primary_customer_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["crm_companies"]["Insert"]>;
        Relationships: [];
      };
      crm_customers: {
        Row: {
          id: string;
          contact_name: string;
          company_id: string | null;
          company_name: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          gst_number: string | null;
          buyer_type: string | null;
          billing_address: string | null;
          shipping_address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          source: string;
          notes: string | null;
          status: "active" | "inactive" | "archived";
          converted_from_lead_id: string | null;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contact_name: string;
          company_id?: string | null;
          company_name?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          gst_number?: string | null;
          buyer_type?: string | null;
          billing_address?: string | null;
          shipping_address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          source?: string;
          notes?: string | null;
          status?: "active" | "inactive" | "archived";
          converted_from_lead_id?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["crm_customers"]["Insert"]>;
        Relationships: [];
      };
      crm_lead_events: {
        Row: {
          id: string;
          lead_id: string;
          event_type: "lead_created" | "enquiry_converted" | "status_changed" | "priority_changed" | "note_added" | "call_logged" | "whatsapp_opened" | "email_logged" | "catalogue_shared" | "follow_up_scheduled" | "follow_up_completed" | "customer_created" | "lead_won" | "lead_lost" | "lead_archived" | "lead_restored";
          title: string;
          description: string | null;
          metadata: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          event_type: Database["public"]["Tables"]["crm_lead_events"]["Row"]["event_type"];
          title: string;
          description?: string | null;
          metadata?: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      crm_leads: {
        Row: {
          id: string;
          source_enquiry_id: string | null;
          contact_name: string;
          company_name: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          buyer_type: string | null;
          source: string;
          interested_product_ids: string[];
          interested_category_ids: string[];
          estimated_quantity: string | null;
          budget_note: string | null;
          delivery_location: string | null;
          original_message: string | null;
          priority: "low" | "normal" | "high" | "urgent";
          status: "new" | "contacted" | "qualified" | "catalogue_sent" | "quote_requested" | "quote_sent" | "negotiation" | "won" | "lost" | "spam" | "archived";
          assigned_admin_id: string | null;
          assigned_admin_email: string | null;
          follow_up_at: string | null;
          last_contact_at: string | null;
          next_action: string | null;
          internal_summary: string | null;
          lost_reason: string | null;
          converted_customer_id: string | null;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_enquiry_id?: string | null;
          contact_name: string;
          company_name?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          buyer_type?: string | null;
          source?: string;
          interested_product_ids?: string[];
          interested_category_ids?: string[];
          estimated_quantity?: string | null;
          budget_note?: string | null;
          delivery_location?: string | null;
          original_message?: string | null;
          priority?: "low" | "normal" | "high" | "urgent";
          status?: Database["public"]["Tables"]["crm_leads"]["Row"]["status"];
          assigned_admin_id?: string | null;
          assigned_admin_email?: string | null;
          follow_up_at?: string | null;
          last_contact_at?: string | null;
          next_action?: string | null;
          internal_summary?: string | null;
          lost_reason?: string | null;
          converted_customer_id?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["crm_leads"]["Insert"]>;
        Relationships: [];
      };
      crm_tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          related_entity_type: "lead" | "customer" | "company" | "internal";
          related_entity_id: string | null;
          lead_id: string | null;
          customer_id: string | null;
          assigned_admin_id: string | null;
          assigned_admin_email: string | null;
          due_at: string | null;
          priority: "low" | "normal" | "high" | "urgent";
          status: "pending" | "in_progress" | "completed" | "cancelled";
          completed_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          related_entity_type?: "lead" | "customer" | "company" | "internal";
          related_entity_id?: string | null;
          lead_id?: string | null;
          customer_id?: string | null;
          assigned_admin_id?: string | null;
          assigned_admin_email?: string | null;
          due_at?: string | null;
          priority?: "low" | "normal" | "high" | "urgent";
          status?: "pending" | "in_progress" | "completed" | "cancelled";
          completed_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["crm_tasks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      convert_contact_enquiry_to_lead: {
        Args: {
          p_enquiry_id: string;
          p_admin_id: string;
          p_admin_email: string;
        };
        Returns: string;
      };
      convert_lead_to_customer: {
        Args: {
          p_lead_id: string;
          p_admin_id: string;
          p_admin_email: string;
          p_mark_won?: boolean;
        };
        Returns: string;
      };
    };
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

export type CrmLead = Database["public"]["Tables"]["crm_leads"]["Row"];

export type CrmLeadStatus = CrmLead["status"];

export type CrmLeadPriority = CrmLead["priority"];

export type CrmLeadEvent =
  Database["public"]["Tables"]["crm_lead_events"]["Row"];

export type CrmCustomer =
  Database["public"]["Tables"]["crm_customers"]["Row"];

export type CrmCustomerStatus = CrmCustomer["status"];

export type CrmTask = Database["public"]["Tables"]["crm_tasks"]["Row"];

export type CrmTaskStatus = CrmTask["status"];

export type CrmTaskPriority = CrmTask["priority"];
