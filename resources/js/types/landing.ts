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

export interface LandingPageProps {
    products: Product[];
    whatsappNumber: string;
    flash?: {
        success?: string;
        error?: string;
    };
}
