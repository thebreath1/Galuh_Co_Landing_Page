import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle, Star } from 'lucide-react';
import { fadeIn, fadeUp, wordReveal } from '@/lib/motion';

interface HeroSectionProps {
    whatsappNumber: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ whatsappNumber }) => {
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik memesan hampers untuk momen spesial.'
    )}`;

    const headlineWords = 'Hampers Eksklusif untuk Setiap Hantaran Berkesan'.split(' ');
    const subheadlineWords =
        'Selamat datang di GALUH & CO. — kurasi kotak hadiah & hampers premium untuk Lebaran, Natal, Corporate, dan Wedding dengan kudapan pilihan, kemasan mewah, serta sentuhan personal.'.split(
            ' '
        );

    return (
        <section
            id="hero"
            aria-label="Hero Section"
            className="relative min-h-[78vh] md:min-h-[84vh] flex items-center justify-center pt-12 pb-18 md:pt-16 md:pb-24 overflow-hidden bg-[#FDFBF7]"
        >
            {/* Full-bleed Hampers Background Image */}
            <div aria-hidden="true" className="absolute inset-0 z-0">
                <img
                    src="/images/hero-hampers-bg.jpg"
                    alt="Latar belakang koleksi hampers eksklusif GALUH & CO. dengan pita dan kudapan artisan"
                    className="w-full h-full object-cover object-center md:object-right"
                    loading="eager"
                    fetchPriority="high"
                />
                {/* Warm Ivory Atmospheric Scrim for High Readability & Luxury Tone */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/88 via-[#FDFBF7]/78 to-[#FDFBF7]/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(253,251,247,0.75)_0%,rgba(253,251,247,0.15)_75%)]" />
            </div>

            {/* Centered Hero Content - positioned slightly higher for optimal visual balance */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full -translate-y-2 sm:-translate-y-6">
                <motion.div
                    className="flex flex-col items-center text-center"
                    initial="hidden"
                    animate="visible"
                >
                    {/* Single H1 Headline — Word-by-Word Reveal */}
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
                        className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1B382B] font-bold leading-[1.18] tracking-tight mb-6 flex flex-wrap justify-center gap-x-3 gap-y-1.5 max-w-3xl"
                    >
                        {headlineWords.map((word, idx) => (
                            <motion.span
                                key={idx}
                                variants={wordReveal}
                                className={
                                    word === 'Hampers' || word === 'Eksklusif' || word === 'Berkesan'
                                        ? 'text-[#B2923B] italic font-normal'
                                        : ''
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
                        className="text-[#2C2724] text-base sm:text-lg leading-relaxed max-w-2xl mb-9 flex flex-wrap justify-center gap-x-1.5 gap-y-0.5 font-medium"
                    >
                        {subheadlineWords.map((word, idx) => (
                            <motion.span key={idx} variants={wordReveal}>
                                {word}
                            </motion.span>
                        ))}
                    </motion.p>

                    {/* 2 CTA Buttons */}
                    <motion.div
                        variants={fadeUp}
                        transition={{ delay: 0.45, duration: 0.45 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto mb-11"
                    >
                        <motion.a
                            href="#koleksi"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1B382B] text-[#FDFBF7] text-sm font-semibold tracking-wide uppercase hover:bg-[#264E3D] shadow-luxury hover:shadow-luxury-hover transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                        >
                            <span>Lihat Koleksi</span>
                            <ArrowRight className="w-4 h-4 text-[#DFCA86]" />
                        </motion.a>

                        <motion.a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FFFFFF]/95 backdrop-blur-xs text-[#1B382B] text-sm font-semibold tracking-wide uppercase border border-[#C8A951] hover:bg-[#F7F4EE] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                        >
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>Pesan via WhatsApp</span>
                        </motion.a>
                    </motion.div>

                    {/* Trust Metrics / Social Proof */}
                    <motion.div
                        variants={fadeIn}
                        transition={{ delay: 0.55, duration: 0.5 }}
                        className="pt-6 border-t border-[#1B382B]/15 w-full max-w-xl grid grid-cols-3 gap-4 sm:gap-8"
                    >
                        <div>
                            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">5.000+</p>
                            <p className="text-xs sm:text-sm text-[#2C2724]/80 font-medium mt-0.5">
                                Hampers Terkirim
                            </p>
                        </div>
                        <div>
                            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">120+</p>
                            <p className="text-xs sm:text-sm text-[#2C2724]/80 font-medium mt-0.5">
                                Mitra Korporat
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1">
                                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">4.9</span>
                                <div className="flex text-[#C8A951]">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-[#2C2724]/80 font-medium mt-0.5">
                                Kepuasan Klien
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
