import React, { useRef, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'motion/react';
import { ArrowRight, ChevronDown, Gift, Sparkles, Star } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { fadeIn, fadeUp, wordReveal } from '@/lib/motion';

interface HeroSectionProps {
    whatsappNumber: string;
}

type MomentKey = 'Semua' | 'Lebaran' | 'Natal' | 'Corporate' | 'Wedding';

const MOMENT_HIGHLIGHTS: Record<MomentKey, { label: string; highlight: string }> = {
    Semua: {
        label: 'Semua Momen',
        highlight: 'Siap kirim ke seluruh Indonesia dengan garansi kemasan aman & kartu ucapan personal.',
    },
    Lebaran: {
        label: 'Lebaran',
        highlight: 'Koleksi Idul Fitri bernuansa zamrud & emas — Nastar Wisman, Kastengel Edam, & Kurma Medjool.',
    },
    Natal: {
        label: 'Natal',
        highlight: 'Kehangatan akhir tahun — Gingerbread Spice, Cokelat Artisan, & Lilin Aromaterapi Pinus.',
    },
    Corporate: {
        label: 'Corporate',
        highlight: 'Bingkisan B2B eksklusif — Custom logo foil emas, faktur pajak, & kirim multi-alamat.',
    },
    Wedding: {
        label: 'Wedding',
        highlight: 'Hantaran pernikahan & bridesmaid — Monogram inisial pasangan dengan pita sutra mewah.',
    },
};

export const HeroSection: React.FC<HeroSectionProps> = ({ whatsappNumber }) => {
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik memesan hampers untuk momen spesial.'
    )}`;

    const sectionRef = useRef<HTMLElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const [activeMoment, setActiveMoment] = useState<MomentKey>('Semua');

    // Mouse-driven depth parallax (GPU transform only)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 70, damping: 24 });
    const smoothY = useSpring(mouseY, { stiffness: 70, damping: 24 });

    const bgParallaxX = useTransform(smoothX, [-0.5, 0.5], [14, -14]);
    const bgParallaxY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
    const orbParallaxX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
    const orbParallaxY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

    // Scroll-linked subtle depth parallax
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const scrollBgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const scrollContentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (prefersReducedMotion || !sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(normX);
        mouseY.set(normY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const headlineWords = 'Hampers Eksklusif untuk Setiap Hantaran Berkesan'.split(' ');
    const subheadlineWords =
        'Selamat datang di GALUH & CO. — kurasi kotak hadiah & hampers premium untuk Lebaran, Natal, Corporate, dan Wedding dengan kudapan pilihan, kemasan mewah, serta sentuhan personal.'.split(
            ' '
        );

    return (
        <section
            ref={sectionRef}
            id="hero"
            aria-label="Hero Section"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-[82vh] md:min-h-[88vh] flex items-center justify-center pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden bg-[#FDFBF7]"
        >
            {/* Full-bleed Hampers Background Image with Interactive Parallax */}
            <motion.div
                aria-hidden="true"
                style={
                    prefersReducedMotion
                        ? undefined
                        : {
                              x: bgParallaxX,
                              y: bgParallaxY,
                              translateY: scrollBgY,
                          }
                }
                className="absolute -inset-6 z-0 will-change-transform"
            >
                <img
                    src="/images/hero-hampers-bg.jpg"
                    alt="Latar belakang koleksi hampers eksklusif GALUH & CO. dengan pita dan kudapan artisan"
                    className="w-full h-full object-cover object-center md:object-right scale-105"
                    loading="eager"
                    fetchPriority="high"
                />
            </motion.div>

            {/* Warm Ivory Atmospheric Scrim for High Readability & Luxury Tone */}
            <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/88 via-[#FDFBF7]/76 to-[#FDFBF7]/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(253,251,247,0.78)_0%,rgba(253,251,247,0.18)_75%)]" />
                {/* Soft interactive golden glow orb */}
                <motion.div
                    style={prefersReducedMotion ? undefined : { x: orbParallaxX, y: orbParallaxY }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#DFCA86]/15 blur-3xl"
                />
            </div>

            {/* Centered Hero Content */}
            <motion.div
                style={prefersReducedMotion ? undefined : { opacity: scrollContentOpacity }}
                className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full -translate-y-2 sm:-translate-y-4"
            >
                <motion.div
                    className="flex flex-col items-center text-center"
                    initial="hidden"
                    animate="visible"
                >
                    {/* Eyebrow Badge */}
                    <motion.div
                        variants={fadeUp}
                        whileHover={{ scale: 1.03 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDFBF7]/90 backdrop-blur-xs border border-[#C8A951]/50 text-[#1B382B] text-xs font-semibold tracking-wider uppercase mb-5 shadow-xs cursor-default"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A951]" />
                        <span>Spesialis Hampers Premium & Corporate Gifting</span>
                    </motion.div>

                    {/* Single H1 Headline — Word-by-Word Reveal + Subtle Hover Lift */}
                    <motion.h1
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.05,
                                },
                            },
                        }}
                        className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1B382B] font-bold leading-[1.18] tracking-tight mb-5 flex flex-wrap justify-center gap-x-3 gap-y-1.5 max-w-3xl"
                    >
                        {headlineWords.map((word, idx) => (
                            <motion.span
                                key={idx}
                                variants={wordReveal}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                                className={
                                    word === 'Hampers' || word === 'Eksklusif' || word === 'Berkesan'
                                        ? 'text-[#B2923B] italic font-normal cursor-default'
                                        : 'cursor-default'
                                }
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>

                    {/* Subheadline — Word-by-Word Reveal */}
                    <motion.p
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.02,
                                    delayChildren: 0.28,
                                },
                            },
                        }}
                        className="text-[#2C2724] text-base sm:text-lg leading-relaxed max-w-2xl mb-7 flex flex-wrap justify-center gap-x-1.5 gap-y-0.5 font-medium"
                    >
                        {subheadlineWords.map((word, idx) => (
                            <motion.span key={idx} variants={wordReveal}>
                                {word}
                            </motion.span>
                        ))}
                    </motion.p>

                    {/* Interactive Moment Explorer Pills */}
                    <motion.div
                        variants={fadeUp}
                        transition={{ delay: 0.38, duration: 0.4 }}
                        className="w-full max-w-2xl mb-8"
                    >
                        <div
                            role="tablist"
                            aria-label="Pilih momen hampers"
                            className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#FFFFFF]/85 backdrop-blur-xs border border-[#E8E2D5] shadow-xs"
                        >
                            {(Object.keys(MOMENT_HIGHLIGHTS) as MomentKey[]).map((key) => {
                                const isActive = activeMoment === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveMoment(key)}
                                        className={`relative isolate px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A951] ${
                                            isActive
                                                ? 'text-[#FDFBF7]'
                                                : 'text-[#6E675F] hover:text-[#1B382B]'
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="heroMomentPill"
                                                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                                className="absolute inset-0 rounded-full bg-[#1B382B] z-0"
                                            />
                                        )}
                                        <span className="relative z-10">{MOMENT_HIGHLIGHTS[key].label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Live Moment Highlight Preview */}
                        <div className="min-h-[2.25rem] mt-3 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeMoment}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.25 }}
                                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#1B382B] bg-[#F7F2E4]/85 px-4 py-1.5 rounded-full border border-[#C8A951]/30"
                                >
                                    <Gift className="w-3.5 h-3.5 text-[#C8A951] flex-shrink-0" />
                                    <span>{MOMENT_HIGHLIGHTS[activeMoment].highlight}</span>
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* 2 CTA Buttons (Unchanged Functions) */}
                    <motion.div
                        variants={fadeUp}
                        transition={{ delay: 0.45, duration: 0.45 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto mb-11"
                    >
                        <motion.a
                            href="#koleksi"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1B382B] text-[#FDFBF7] text-sm font-semibold tracking-wide uppercase hover:bg-[#264E3D] shadow-luxury hover:shadow-luxury-hover transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A951] group"
                        >
                            <span>Lihat Koleksi</span>
                            <ArrowRight className="w-4 h-4 text-[#DFCA86] group-hover:translate-x-1 transition-transform" />
                        </motion.a>

                        <motion.a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FFFFFF]/95 backdrop-blur-xs text-[#1B382B] text-sm font-semibold tracking-wide uppercase border border-[#C8A951] hover:bg-[#F7F4EE] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                        >
                            <WhatsAppIcon className="w-4 h-4 text-[#25D366] fill-current" />
                            <span>Pesan via WhatsApp</span>
                        </motion.a>
                    </motion.div>

                    {/* Interactive Trust Metrics / Social Proof */}
                    <motion.div
                        variants={fadeIn}
                        transition={{ delay: 0.55, duration: 0.5 }}
                        className="pt-6 border-t border-[#1B382B]/15 w-full max-w-xl grid grid-cols-3 gap-4 sm:gap-8"
                    >
                        <motion.div
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl py-2 px-2 hover:bg-[#FFFFFF]/55 transition-colors cursor-default"
                        >
                            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">5.000+</p>
                            <p className="text-xs sm:text-sm text-[#2C2724]/80 font-medium mt-0.5">
                                Hampers Terkirim
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl py-2 px-2 hover:bg-[#FFFFFF]/55 transition-colors cursor-default"
                        >
                            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">120+</p>
                            <p className="text-xs sm:text-sm text-[#2C2724]/80 font-medium mt-0.5">
                                Mitra Korporat
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl py-2 px-2 hover:bg-[#FFFFFF]/55 transition-colors cursor-default"
                        >
                            <div className="flex items-center justify-center gap-1">
                                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">4.9</span>
                                <div className="flex text-[#C8A951]">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-[#2C2724]/80 font-medium mt-0.5">
                                Kepuasan Klien
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Interactive Scroll-Down Cue */}
            <motion.a
                href="#tentang"
                aria-label="Gulir ke bagian Tentang Kami"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.4 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 inline-flex flex-col items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-[#6E675F] hover:text-[#1B382B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A951] rounded-full px-3 py-1"
            >
                <span>Jelajahi</span>
                <motion.span
                    animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-4 h-4 text-[#C8A951]" />
                </motion.span>
            </motion.a>
        </section>
    );
};
