import React from 'react';
import { Head } from '@inertiajs/react';
import { MotionConfig } from 'motion/react';
import type { LandingPageProps } from '@/types/landing';

import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { NavbarSection } from '@/components/sections/NavbarSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { CollectionSection } from '@/components/sections/CollectionSection';
import { WhyChooseUsSection } from '@/components/sections/WhyChooseUsSection';
import { HowToOrderSection } from '@/components/sections/HowToOrderSection';
import { CorporateGiftingSection } from '@/components/sections/CorporateGiftingSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { FooterCtaSection } from '@/components/sections/FooterCtaSection';

export default function Welcome({ products, whatsappNumber, flash }: LandingPageProps) {
    const waNumber = whatsappNumber || '6281234567890';

    return (
        <MotionConfig reducedMotion="user">
            <Head>
                <title>GALUH & CO. | Hampers Mewah & Corporate Gifting Eksklusif</title>
                <meta
                    name="description"
                    content="Koleksi hampers premium dan corporate gifting mewah dari GALUH & CO. Dikurasi dengan sentuhan personal, delikasi artisanal, dan pengemasan eksklusif."
                />
            </Head>

            <div className="min-h-screen bg-[#FDFBF7] text-[#2C2724] font-sans antialiased selection:bg-[#C8A951]/20 selection:text-[#1B382B] overflow-x-clip">
                {/* 1. Sticky Navigation Bar */}
                <NavbarSection whatsappNumber={waNumber} />

                <main id="main-content">
                    {/* 2. Hero Section (Single H1, CTAs, Hampers Visual) */}
                    <HeroSection whatsappNumber={waNumber} />

                    {/* 3. Tentang Brand & 3 Nilai Filosofi */}
                    <AboutSection />

                    {/* 4. Katalog Koleksi Hampers (Filter Kategori & WA Order) */}
                    <CollectionSection products={products} whatsappNumber={waNumber} />

                    {/* 5. Kenapa Memilih Kami (Keunggulan & Count-Up Numbers) */}
                    <WhyChooseUsSection />

                    {/* 6. Langkah Cara Pemesanan */}
                    <HowToOrderSection />

                    {/* 7. Corporate Gifting, Client Marquee & Form Inquiry */}
                    <CorporateGiftingSection whatsappNumber={waNumber} flash={flash} />

                    {/* 8. Testimoni Klien Korporat & Personal (Carousel) */}
                    <TestimonialsSection />

                    {/* 9. Pertanyaan yang Sering Diajukan (FAQ Accordion) */}
                    <FaqSection />
                </main>

                {/* 10. Penutup CTA & Footer Informasi Kontak */}
                <FooterCtaSection whatsappNumber={waNumber} />

                {/* Floating WhatsApp Button (Fixed Bottom-Right) */}
                <FloatingWhatsApp whatsappNumber={waNumber} />
            </div>
        </MotionConfig>
    );
}
