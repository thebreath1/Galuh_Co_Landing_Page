import React, { Suspense, lazy } from 'react';
import { Head } from '@inertiajs/react';
import { LazyMotion, MotionConfig } from 'motion/react';
import type { LandingPageProps } from '@/types/landing';

const loadMotionFeatures = () => import('@/lib/motion-features').then((res) => res.default);

import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { NavbarSection } from '@/components/sections/NavbarSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';

const CollectionSection = lazy(() =>
    import('@/components/sections/CollectionSection').then((m) => ({ default: m.CollectionSection }))
);
const WhyChooseUsSection = lazy(() =>
    import('@/components/sections/WhyChooseUsSection').then((m) => ({ default: m.WhyChooseUsSection }))
);
const HowToOrderSection = lazy(() =>
    import('@/components/sections/HowToOrderSection').then((m) => ({ default: m.HowToOrderSection }))
);
const CorporateGiftingSection = lazy(() =>
    import('@/components/sections/CorporateGiftingSection').then((m) => ({ default: m.CorporateGiftingSection }))
);
const TestimonialsSection = lazy(() =>
    import('@/components/sections/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection }))
);
const FaqSection = lazy(() =>
    import('@/components/sections/FaqSection').then((m) => ({ default: m.FaqSection }))
);
const FooterCtaSection = lazy(() =>
    import('@/components/sections/FooterCtaSection').then((m) => ({ default: m.FooterCtaSection }))
);

export default function Welcome({ products, testimonials, whatsappNumber, siteSettings, flash }: LandingPageProps) {
    const waNumber = siteSettings?.whatsapp_number || whatsappNumber || '6281234567890';

    return (
        <LazyMotion features={loadMotionFeatures}>
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
                    <HeroSection whatsappNumber={waNumber} settings={siteSettings} />

                    {/* 3. Tentang Brand & 3 Nilai Filosofi */}
                    <AboutSection settings={siteSettings} />

                    {/* 4-9. Lazy-loaded Below-the-Fold Sections */}
                    <Suspense fallback={<div className="min-h-[600px]" aria-hidden="true" />}>
                        <CollectionSection products={products} whatsappNumber={waNumber} settings={siteSettings} />
                        <WhyChooseUsSection />
                        <HowToOrderSection />
                        <CorporateGiftingSection whatsappNumber={waNumber} flash={flash} />
                        <TestimonialsSection testimonials={testimonials} settings={siteSettings} />
                        <FaqSection />
                    </Suspense>
                </main>

                {/* 10. Penutup CTA & Footer Informasi Kontak */}
                <Suspense fallback={null}>
                    <FooterCtaSection whatsappNumber={waNumber} />
                </Suspense>

                {/* Floating WhatsApp Button (Fixed Bottom-Right) */}
                <FloatingWhatsApp whatsappNumber={waNumber} />
            </div>
            </MotionConfig>
        </LazyMotion>
    );
}
