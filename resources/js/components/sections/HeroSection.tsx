import React, { useRef } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import type { SiteSettings } from '@/types/landing';

interface HeroSectionProps {
    whatsappNumber: string;
    settings?: SiteSettings;
}

const HERO_FLOATING_HAMPERS = [
    {
        side: 'left' as const,
        src: '/images/hero-hamper-left.webp',
        alt: 'Koleksi hampers eksklusif kotak hijau zamrud dengan pita emas dan toples kue artisan GALUH & CO.',
        positionClass:
            'left-3 lg:left-7 xl:left-14 2xl:left-24 top-1/2 -translate-y-[58%]',
        mobileRotateClass: '-rotate-3',
        floatAnimate: { y: [-8, 8, -8], rotate: [-5, -3, -5] },
        duration: 6,
    },
    {
        side: 'right' as const,
        src: '/images/hero-hamper-right.webp',
        alt: 'Koleksi hampers rotan mewah dengan pita satin hijau, cokelat artisan, madu, dan kukis GALUH & CO.',
        positionClass:
            'right-3 lg:right-7 xl:right-14 2xl:right-24 top-1/2 -translate-y-[42%]',
        mobileRotateClass: 'rotate-3',
        floatAnimate: { y: [8, -8, 8], rotate: [5, 3, 5] },
        duration: 6.6,
    },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
    whatsappNumber,
    settings,
}) => {
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik memesan hampers untuk momen spesial.',
    )}`;
    const bgImage = settings?.hero_bg_image || '/images/hero-hampers-bg.webp';
    const headline =
        settings?.hero_headline ||
        'Hampers Eksklusif untuk Setiap Hantaran Berkesan';
    const subheadline =
        settings?.hero_subheadline ||
        'Selamat datang di GALUH & CO. — kurasi kotak hadiah & hampers premium untuk Lebaran, Natal, Corporate, dan Wedding dengan kudapan pilihan, kemasan mewah, serta sentuhan personal.';
    const primaryCtaLabel = settings?.hero_primary_cta_label || 'Lihat Koleksi';
    const secondaryCtaLabel =
        settings?.hero_secondary_cta_label || 'Pesan via WhatsApp';
    const floatingHampers = HERO_FLOATING_HAMPERS.map((item) => ({
        ...item,
        src:
            item.side === 'left'
                ? settings?.hero_left_image || item.src
                : settings?.hero_right_image || item.src,
    }));

    const sectionRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);
    const leftCardRef = useRef<HTMLDivElement>(null);
    const rightCardRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const prefersReducedMotion = useReducedMotion();

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (prefersReducedMotion || !sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (bgRef.current) {
                bgRef.current.style.transform = `translate3d(${(-normX * 28).toFixed(1)}px, ${(-normY * 20).toFixed(1)}px, 0)`;
            }
            if (orbRef.current) {
                orbRef.current.style.transform = `translate3d(${(normX * 36).toFixed(1)}px, ${(normY * 28).toFixed(1)}px, 0)`;
            }
            if (leftCardRef.current) {
                leftCardRef.current.style.transform = `translate3d(${(normX * 16).toFixed(1)}px, ${(normY * 12).toFixed(1)}px, 0)`;
            }
            if (rightCardRef.current) {
                rightCardRef.current.style.transform = `translate3d(${(-normX * 18).toFixed(1)}px, ${(-normY * 14).toFixed(1)}px, 0)`;
            }
        });
    };

    const handleMouseLeave = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (bgRef.current) {
            bgRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
        if (orbRef.current) {
            orbRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
        if (leftCardRef.current) {
            leftCardRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
        if (rightCardRef.current) {
            rightCardRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
    };

    const headlineWords = headline.split(' ');

    return (
        <section
            ref={sectionRef}
            id="hero"
            aria-label="Hero Section"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center justify-center overflow-hidden bg-[#F2EBDC] py-14 sm:py-16 md:py-20"
        >
            {/* Full-bleed Hampers Background Image with Interactive Parallax */}
            <div
                ref={bgRef}
                aria-hidden="true"
                className="absolute -inset-6 z-0 transition-transform duration-500 ease-out will-change-transform"
            >
                <img
                    src={bgImage}
                    alt="Latar belakang koleksi hampers eksklusif GALUH & CO. dengan pita dan kudapan artisan"
                    width={768}
                    height={326}
                    className="h-full w-full scale-105 object-cover object-center md:object-right"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                />
            </div>

            {/* Warm Ivory Atmospheric Scrim for High Readability & Luxury Tone */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#F2EBDC]/88 via-[#F2EBDC]/76 to-[#F2EBDC]/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,235,220,0.78)_0%,rgba(242,235,220,0.18)_75%)]" />
                {/* Soft interactive golden glow orb */}
                <div
                    ref={orbRef}
                    className="absolute top-1/3 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C5AA74]/15 blur-3xl transition-transform duration-500 ease-out"
                />
            </div>

            {/* Floating Hamper Photos (Left & Right Flanks on Tablet/Desktop) */}
            {floatingHampers.map((hamper) => (
                <div
                    key={hamper.side}
                    aria-hidden="true"
                    className={`absolute hidden md:block ${hamper.positionClass} pointer-events-none z-10 select-none`}
                >
                    <div
                        ref={
                            hamper.side === 'left' ? leftCardRef : rightCardRef
                        }
                        className="transition-transform duration-500 ease-out will-change-transform"
                    >
                        <m.div
                            animate={
                                prefersReducedMotion
                                    ? undefined
                                    : hamper.floatAnimate
                            }
                            transition={
                                prefersReducedMotion
                                    ? undefined
                                    : {
                                          duration: hamper.duration,
                                          repeat: Infinity,
                                          ease: 'easeInOut',
                                      }
                            }
                            className="shadow-luxury w-28 rounded-2xl border border-[#A88B54]/45 bg-[#FFFFFF]/92 p-1.5 backdrop-blur-xs will-change-transform lg:w-40 xl:w-48 2xl:w-52"
                        >
                            <img
                                src={hamper.src}
                                alt=""
                                width={440}
                                height={440}
                                className="aspect-square w-full rounded-xl object-cover"
                                loading="eager"
                                decoding="async"
                            />
                        </m.div>
                    </div>
                </div>
            ))}

            {/* Centered Hero Content */}
            <div className="relative z-20 mx-auto w-full max-w-xl px-4 sm:px-6 lg:max-w-2xl lg:px-8 xl:max-w-3xl">
                <div className="flex flex-col items-center text-center">
                    {/* Single H1 Headline — Instant LCP + Subtle Hover Lift */}
                    <h1 className="mb-5 flex max-w-3xl flex-wrap justify-center gap-x-3 gap-y-1.5 font-serif text-3xl leading-[1.18] font-bold tracking-tight text-[#16233B] sm:text-5xl lg:text-6xl">
                        {headlineWords.map((word, idx) => (
                            <m.span
                                key={idx}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                                className={
                                    word === 'Hampers' ||
                                    word === 'Eksklusif' ||
                                    word === 'Berkesan'
                                        ? 'cursor-default font-normal text-[#8A703E] italic'
                                        : 'cursor-default'
                                }
                            >
                                {word}
                            </m.span>
                        ))}
                    </h1>

                    {/* Subheadline */}
                    <p className="mb-7 max-w-2xl text-base leading-relaxed font-medium text-[#1E2430] sm:text-lg">
                        {subheadline}
                    </p>

                    {/* 2 CTA Buttons (Unchanged Functions) */}
                    <div className="mb-9 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
                        <m.a
                            href="#koleksi"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="shadow-luxury hover:shadow-luxury-hover group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#16233B] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#F2EBDC] uppercase transition-all hover:bg-[#203252] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                        >
                            <span>{primaryCtaLabel}</span>
                            <ArrowRight className="h-4 w-4 text-[#C5AA74] transition-transform group-hover:translate-x-1" />
                        </m.a>

                        <m.a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#A88B54] bg-[#FFFFFF]/95 px-8 py-3.5 text-sm font-semibold tracking-wide text-[#16233B] uppercase shadow-sm backdrop-blur-xs transition-all hover:bg-[#EAE1CE] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                        >
                            <WhatsAppIcon className="h-4 w-4 fill-current text-[#25D366]" />
                            <span>{secondaryCtaLabel}</span>
                        </m.a>
                    </div>

                    {/* Interactive Trust Metrics / Social Proof */}
                    <div className="grid w-full max-w-xl grid-cols-3 gap-4 border-t border-[#16233B]/15 pt-6 sm:gap-8">
                        <m.div
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                            className="cursor-default rounded-xl px-2 py-2 transition-colors hover:bg-[#FFFFFF]/55"
                        >
                            <p className="font-serif text-2xl font-bold text-[#16233B] sm:text-3xl">
                                {settings?.hero_stat_1_value || '5.000+'}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-[#1E2430]/80 sm:text-sm">
                                {settings?.hero_stat_1_label ||
                                    'Hampers Terkirim'}
                            </p>
                        </m.div>

                        <m.div
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                            className="cursor-default rounded-xl px-2 py-2 transition-colors hover:bg-[#FFFFFF]/55"
                        >
                            <p className="font-serif text-2xl font-bold text-[#16233B] sm:text-3xl">
                                {settings?.hero_stat_2_value || '120+'}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-[#1E2430]/80 sm:text-sm">
                                {settings?.hero_stat_2_label ||
                                    'Mitra Korporat'}
                            </p>
                        </m.div>

                        <m.div
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                            className="cursor-default rounded-xl px-2 py-2 transition-colors hover:bg-[#FFFFFF]/55"
                        >
                            <div className="flex items-center justify-center gap-1">
                                <span className="font-serif text-2xl font-bold text-[#16233B] sm:text-3xl">
                                    {settings?.hero_stat_3_value || '4.9'}
                                </span>
                                <div className="flex text-[#A88B54]">
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                            </div>
                            <p className="mt-0.5 text-xs font-medium text-[#1E2430]/80 sm:text-sm">
                                {settings?.hero_stat_3_label ||
                                    'Kepuasan Klien'}
                            </p>
                        </m.div>
                    </div>

                    {/* Floating Hamper Showcase Pair on Mobile */}
                    <div className="mx-auto mt-8 grid w-full max-w-[290px] grid-cols-2 gap-4 md:hidden">
                        {floatingHampers.map((hamper) => (
                            <m.div
                                key={hamper.side}
                                animate={
                                    prefersReducedMotion
                                        ? undefined
                                        : {
                                              y:
                                                  hamper.side === 'left'
                                                      ? [-4, 4, -4]
                                                      : [4, -4, 4],
                                          }
                                }
                                transition={
                                    prefersReducedMotion
                                        ? undefined
                                        : {
                                              duration: hamper.duration,
                                              repeat: Infinity,
                                              ease: 'easeInOut',
                                          }
                                }
                                className={`${hamper.mobileRotateClass} shadow-luxury rounded-2xl border border-[#A88B54]/45 bg-[#FFFFFF]/92 p-1 will-change-transform`}
                            >
                                <img
                                    src={hamper.src}
                                    alt={hamper.alt}
                                    width={440}
                                    height={440}
                                    className="aspect-square w-full rounded-xl object-cover"
                                    loading="eager"
                                    decoding="async"
                                />
                            </m.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
