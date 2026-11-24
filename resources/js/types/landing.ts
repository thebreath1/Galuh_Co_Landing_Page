export interface Product {
    id: number;
    name: string;
    slug: string;
    category: 'Lebaran' | 'Natal' | 'Corporate' | 'Wedding' | string;
    short_description: string;
    contents: string[];
    price_from: number;
    image: string;
    sort_order: number;
    is_active: boolean;
}

export interface SiteSettings {
    hero_headline: string;
    hero_subheadline: string;
    hero_primary_cta_label: string;
    hero_secondary_cta_label: string;
    hero_bg_image: string;
    hero_left_image: string;
    hero_right_image: string;
    hero_stat_1_value: string;
    hero_stat_1_label: string;
    hero_stat_2_value: string;
    hero_stat_2_label: string;
    hero_stat_3_value: string;
    hero_stat_3_label: string;
    about_eyebrow: string;
    about_title: string;
    about_description: string;
    collection_eyebrow: string;
    collection_title: string;
    collection_description: string;
    testimonials_eyebrow: string;
    testimonials_title: string;
    testimonials_description: string;
    whatsapp_number: string;
}

export interface TestimonialRecord {
    id: number;
    initials: string;
    name: string;
    role: string;
    content: string;
    product_tag: string;
    rating: number;
    sort_order: number;
    is_active: boolean;
}

export interface InquiryRecord {
    id: number;
    name: string;
    company: string | null;
    email: string | null;
    whatsapp_number: string;
    estimated_quantity: string;
    budget_per_package: string | null;
    needed_date: string | null;
    notes: string | null;
    created_at: string;
}

export interface InquiryFormData {
    name: string;
    company: string;
    email: string;
    whatsapp_number: string;
    estimated_quantity: string;
    budget_per_package: string;
    needed_date: string;
    notes: string;
    website?: string; // honeypot
}

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface OrderRecord {
    id: number;
    order_code: string;
    product_id: number | null;
    product_name: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    customer_name: string;
    customer_whatsapp: string;
    customer_email: string | null;
    delivery_date: string | null;
    shipping_address: string;
    greeting_card_note: string | null;
    status: OrderStatus;
    admin_note: string | null;
    reviewed_at: string | null;
    created_at: string;
    product?: {
        id: number;
        name: string;
        image: string;
        category: string;
    } | null;
    reviewer?: {
        id: number;
        name: string;
    } | null;
}

export interface LandingPageProps {
    products: Product[];
    testimonials?: TestimonialRecord[];
    whatsappNumber: string;
    siteSettings?: SiteSettings;
    flash?: {
        success?: string;
        error?: string;
    };
}
