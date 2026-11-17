import React from 'react';
import { motion } from 'motion/react';
import { Gem, Gift, Feather } from 'lucide-react';
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/motion';

export const AboutSection: React.FC = () => {
    const pillars = [
        {
            icon: Gem,
            title: 'Kurasi Terbaik',
            description:
                'Setiap butir kue, teh artisan, dan camilan premium dipilih secara teliti melalui uji rasa ketat dengan standar kualitas dan bahan terbaik.',
        },
        {
            icon: Gift,
            title: 'Packaging Premium',
            description:
                'Kotak rigid eksklusif berpita satin sutra, aksen stempel lilin (wax seal) klasik, dan foil emas timbul yang memberikan pengalaman unboxing mewah.',
        },
        {
            icon: Feather,
            title: 'Sentuhan Personal',
            description:
                'Kartu ucapan kaligrafi dengan pesan khusus yang hangat, serta integrasi identitas perusahaan untuk hantaran korporat yang berkesan.',
        },
    ];

    return (
        <section
            id="tentang"
            aria-label="Tentang GALUH & CO."
            className="py-20 md:py-28 bg-[#F7F4EE] relative border-y border-[#E8E2D5]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={staggerContainer}
                >
                    <motion.p
                        variants={fadeUp}
                        className="text-xs uppercase tracking-[0.25em] text-[#C8A951] font-semibold mb-3"
                    >
                        Filosofi Kami
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        className="font-serif text-3xl sm:text-4xl lg:text-4xl text-[#1B382B] font-bold tracking-tight mb-5"
                    >
                        Menghadirkan Keindahan dalam Tradisi Berbagi
                    </motion.h2>
                    <motion.div variants={fadeUp} className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-6" />
                    <motion.p variants={fadeUp} className="text-[#6E675F] text-base leading-relaxed">
                        Di GALUH & CO., kami meyakini bahwa sebuah hadiah bukan sekadar bingkisan, melainkan jembatan
                        rasa dan wujud penghormatan tulus. Kami merajut kehangatan melalui detail estetika paripurna yang
                        menghidupkan setiap momen istimewa Anda.
                    </motion.p>
                </motion.div>

                {/* 3 Pillars Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={staggerContainer}
                >
                    {pillars.map((pillar, index) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#FFFFFF] rounded-2xl p-8 border border-[#E8E2D5] shadow-luxury hover:shadow-luxury-hover transition-shadow text-center flex flex-col items-center group"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#F7F2E4] border border-[#C8A951]/40 flex items-center justify-center text-[#C8A951] mb-6 group-hover:scale-110 group-hover:bg-[#1B382B] group-hover:text-[#DFCA86] transition-all duration-300">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-[#1B382B] mb-3">
                                    {pillar.title}
                                </h3>
                                <p className="text-sm text-[#6E675F] leading-relaxed">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};
