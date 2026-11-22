import React, { useRef } from 'react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { fadeIn, smoothEase, wordReveal } from '@/lib/motion';

interface HeroSectionProps {
    whatsappNumber: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ whatsappNumber }) => {
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik memesan hampers untuk momen spesial.'
    )}`;

    const sectionRef = useRef<HTMLElement>(null);
    const prefersReducedMotion = useReducedMotion();

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

    return (
        <section
            ref={sectionRef}
            id="hero"
            aria-label="Hero Section"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center justify-center py-14 sm:py-16 md:py-20 overflow-hidden bg-[#FDFBF7]"
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
                    width={1024}
                    height={434}
                    className="w-full h-full object-cover object-center md:object-right scale-105"
                    loading="eager"
                    decoding="sync"
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
                className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
            >
                <motion.div
                    className="flex flex-col items-center text-center"
                    initial="hidden"
                    animate="visible"
                >
                    {/* Single H1 Headline — Word-by-Word Reveal + Subtle Hover Lift */}
                    <motion.h1
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.04,
                                    delayChildren: 0.02,
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

                    {/* Subheadline — Fast Single-Block Reveal (< 1s readable) */}
                    <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.4, ease: smoothEase }}
                        className="text-[#2C2724] text-base sm:text-lg leading-relaxed max-w-2xl mb-7 font-medium"
                    >
                        Selamat datang di GALUH &amp; CO. — kurasi kotak hadiah &amp; hampers premium untuk Lebaran,
                        Natal, Corporate, dan Wedding dengan kudapan pilihan, kemasan mewah, serta sentuhan personal.
                    </motion.p>

                    {/* 2 CTA Buttons (Unchanged Functions) */}
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.4, ease: smoothEase }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto mb-9"
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
        </section>
    );
};
