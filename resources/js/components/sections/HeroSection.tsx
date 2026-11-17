import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle, Sparkles, Star, Award, ShieldCheck } from 'lucide-react';
import { fadeUp, fadeIn, wordReveal } from '@/lib/motion';

interface HeroSectionProps {
    whatsappNumber: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ whatsappNumber }) => {
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik memesan hampers untuk momen spesial.'
    )}`;

    const words = 'Merangkai Kehangatan di Setiap Hantaran Berkesan'.split(' ');

    return (
        <section
            id="hero"
            aria-label="Hero Section"
            className="relative pt-6 pb-20 md:py-24 lg:py-28 overflow-hidden bg-paper-texture"
        >
            {/* Subtle decorative background gradient blobs */}
            <div
                aria-hidden="true"
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#DFCA86]/10 rounded-full blur-3xl pointer-events-none -z-10"
            />
            <div
                aria-hidden="true"
                className="absolute top-10 right-10 w-96 h-96 bg-[#1B382B]/5 rounded-full blur-3xl pointer-events-none -z-10"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Headlines & CTAs */}
                    <motion.div
                        className="lg:col-span-7 flex flex-col items-start"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.08,
                                },
                            },
                        }}
                    >
                        {/* Eyebrow Badge */}
                        <motion.div
                            variants={fadeUp}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B382B]/5 border border-[#C8A951]/40 text-[#1B382B] text-xs font-semibold tracking-wider uppercase mb-5"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[#C8A951]" />
                            <span>Hampers Mewah & Corporate Gifting</span>
                        </motion.div>

                        {/* Single H1 Headline with Fast Word Reveal */}
                        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1B382B] font-bold leading-[1.18] tracking-tight mb-6 flex flex-wrap gap-x-3 gap-y-1">
                            {words.map((word, idx) => (
                                <motion.span
                                    key={idx}
                                    variants={wordReveal}
                                    className={
                                        word === 'Hantaran' || word === 'Berkesan'
                                            ? 'text-[#C8A951] italic font-normal'
                                            : ''
                                    }
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeUp}
                            className="text-[#6E675F] text-base sm:text-lg leading-relaxed max-w-xl mb-8"
                        >
                            Hadirkan kesan mendalam bagi keluarga, sahabat, maupun rekan bisnis melalui kurasi delikasi
                            pilihan, kemasan eksklusif berpita satin, dan sentuhan kartu ucapan personal yang elegan.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeUp}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12"
                        >
                            <motion.a
                                href="#koleksi"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1B382B] text-[#FDFBF7] text-sm font-semibold tracking-wide uppercase hover:bg-[#264E3D] shadow-luxury hover:shadow-luxury-hover transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
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
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#FFFFFF] text-[#1B382B] text-sm font-semibold tracking-wide uppercase border border-[#C8A951] hover:bg-[#F7F4EE] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                            >
                                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                <span>Pesan via WhatsApp</span>
                            </motion.a>
                        </motion.div>

                        {/* Trust Metrics / Social Proof */}
                        <motion.div
                            variants={fadeIn}
                            className="pt-6 border-t border-[#E8E2D5] w-full grid grid-cols-3 gap-4 sm:gap-8"
                        >
                            <div>
                                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">5.000+</p>
                                <p className="text-xs sm:text-sm text-[#6E675F] mt-0.5">Hampers Terkirim</p>
                            </div>
                            <div>
                                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">120+</p>
                                <p className="text-xs sm:text-sm text-[#6E675F] mt-0.5">Mitra Korporat</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B382B]">4.9</span>
                                    <div className="flex text-[#C8A951]">
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                                <p className="text-xs sm:text-sm text-[#6E675F] mt-0.5">Kepuasan Klien</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Luxury Visual / Box Mockup */}
                    <motion.div
                        className="lg:col-span-5 relative"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            {/* Decorative Gold Frame */}
                            <div className="absolute -inset-3 rounded-3xl border border-[#C8A951]/30 -z-10 translate-x-2 translate-y-2 pointer-events-none" />

                            {/* Main Hamper Image with soft float */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#E8E2D5] bg-[#FFFFFF] aspect-[4/5]"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=900&auto=format&fit=crop"
                                    alt="Kotak hampers mewah GALUH & CO. dengan pita satin dan ornamen eksklusif"
                                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                                    loading="eager"
                                />

                                {/* Subtle Gradient Shade */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1B382B]/60 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-5 left-5 right-5 text-white">
                                    <span className="text-[10px] uppercase tracking-widest text-[#DFCA86] font-semibold">
                                        Signature Collection
                                    </span>
                                    <p className="font-serif text-lg font-bold">The Royal Fitr Hampers</p>
                                </div>
                            </motion.div>

                            {/* Floating Badge Detail */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#FFFFFF] rounded-xl p-3.5 shadow-xl border border-[#E8E2D5] flex items-center gap-3 max-w-[240px]"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#F7F2E4] flex items-center justify-center flex-shrink-0 text-[#C8A951]">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#1B382B]">Pita Satin & Wax Seal</p>
                                    <p className="text-[11px] text-[#6E675F]">Sentuhan akhir berkelas</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="absolute -top-4 -right-4 sm:-right-6 bg-[#1B382B] text-[#FDFBF7] rounded-xl p-3 shadow-xl border border-[#C8A951]/40 flex items-center gap-2.5"
                            >
                                <ShieldCheck className="w-5 h-5 text-[#DFCA86]" />
                                <span className="text-xs font-semibold tracking-wide">100% Garansi Aman</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
