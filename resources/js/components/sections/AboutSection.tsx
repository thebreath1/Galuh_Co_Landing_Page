import React, { useState } from 'react';
import { m } from 'motion/react';
import { Gem, Gift, Feather } from 'lucide-react';
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/motion';
import {
    RetroEasterEggDialog,
    type RetroEasterEggContent,
} from '@/components/RetroEasterEggDialog';

import type { SiteSettings } from '@/types/landing';

interface AboutSectionProps {
    settings?: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
    const [activeDialog, setActiveDialog] = useState<RetroEasterEggContent | null>(null);
    const eyebrow = settings?.about_eyebrow || 'Filosofi Kami';
    const title = settings?.about_title || 'Menghadirkan Keindahan dalam Tradisi Berbagi';
    const description =
        settings?.about_description ||
        'Di GALUH & CO., kami meyakini bahwa sebuah hadiah bukan sekadar bingkisan, melainkan jembatan rasa dan wujud penghormatan tulus. Kami merajut kehangatan melalui detail estetika paripurna yang menghidupkan setiap momen istimewa Anda.';

    const pillars = [
        {
            icon: Gem,
            title: 'Kurasi Terbaik',
            description:
                'Setiap butir kue, teh artisan, dan camilan premium dipilih secara teliti melalui uji rasa ketat dengan standar kualitas dan bahan terbaik.',
            easterEggLines: [
                'HEI! KAMU MENEKAN KARTU KURASI!',
                '[DIALOG PLACEHOLDER 1]',
                'DI BALIK LAYAR, SEMUA KUDAPAN',
                'DIUJI RASA SATU PER SATU!',
            ],
        },
        {
            icon: Gift,
            title: 'Packaging Premium',
            description:
                'Kotak rigid eksklusif berpita satin sutra, aksen stempel lilin (wax seal) klasik, dan foil emas timbul yang memberikan pengalaman unboxing mewah.',
            easterEggLines: [
                'EITS! HATI-HATI DENGAN KOTAKNYA!',
                '[DIALOG PLACEHOLDER 2]',
                'PITA SUTRA & WAX SEAL INI',
                'DIRANGKAI PENUH KETELITIAN!',
            ],
        },
        {
            icon: Feather,
            title: 'Sentuhan Personal',
            description:
                'Kartu ucapan kaligrafi dengan pesan khusus yang hangat, serta integrasi identitas perusahaan untuk hantaran korporat yang berkesan.',
            easterEggLines: [
                'WHOA! KAMU MENEMUKAN PESAN RAHASIA!',
                '[DIALOG PLACEHOLDER 3]',
                'KATA-KATA KALIGRAFI KHUSUS',
                'SIAP DISIAPKAN UNTUKMU!',
            ],
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
                <m.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={staggerContainer}
                >
                    <m.p
                        variants={fadeUp}
                        className="text-xs uppercase tracking-[0.25em] text-[#9A7D2E] font-semibold mb-3"
                    >
                        {eyebrow}
                    </m.p>
                    <m.h2
                        variants={fadeUp}
                        className="font-serif text-3xl sm:text-4xl lg:text-4xl text-[#1B382B] font-bold tracking-tight mb-5"
                    >
                        {title}
                    </m.h2>
                    <m.div variants={fadeUp} className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-6" />
                    <m.p variants={fadeUp} className="text-[#6E675F] text-base leading-relaxed">
                        {description}
                    </m.p>
                </m.div>

                {/* 3 Pillars Grid */}
                <m.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={staggerContainer}
                >
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <m.div key={pillar.title} variants={fadeUp} className="h-full">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveDialog({
                                            title: pillar.title,
                                            lines: pillar.easterEggLines,
                                        })
                                    }
                                    className="w-full h-full bg-[#FFFFFF] rounded-2xl p-8 border border-[#E8E2D5] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1.5 transition-[transform,box-shadow] duration-300 ease-out transform-gpu text-center flex flex-col items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A951]"
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
                                </button>
                            </m.div>
                        );
                    })}
                </m.div>
            </div>

            <RetroEasterEggDialog
                content={activeDialog}
                onClose={() => setActiveDialog(null)}
            />
        </section>
    );
};
