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
    const [activeDialog, setActiveDialog] =
        useState<RetroEasterEggContent | null>(null);
    const eyebrow = settings?.about_eyebrow || 'Filosofi Kami';
    const title =
        settings?.about_title || 'Menghadirkan Keindahan dalam Tradisi Berbagi';
    const description =
        settings?.about_description ||
        'Di GALUH & CO., kami meyakini bahwa sebuah hadiah bukan sekadar bingkisan, melainkan jembatan rasa dan wujud penghormatan tulus. Kami merajut kehangatan melalui detail estetika paripurna yang menghidupkan setiap momen istimewa Anda.';

    const pillars = [
        {
            number: '01',
            tag: 'Artisanal Selection',
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
            number: '02',
            tag: 'Silk & Wax Seal',
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
            number: '03',
            tag: 'Bespoke Calligraphy',
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
            className="relative border-y border-[#D8CEBA] bg-[#EAE1CE] py-20 md:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Editorial Asymmetric Section Header */}
                <m.div
                    className="mb-12 grid grid-cols-1 items-end gap-6 border-b border-[#A88B54]/35 pb-12 lg:grid-cols-12 lg:gap-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={staggerContainer}
                >
                    <div className="lg:col-span-6">
                        <m.div
                            variants={fadeUp}
                            className="mb-3 flex items-center gap-3"
                        >
                            <span
                                className="h-px w-8 bg-[#A88B54]"
                                aria-hidden="true"
                            />
                            <p className="text-xs font-semibold tracking-[0.25em] text-[#725C30] uppercase">
                                {eyebrow}
                            </p>
                        </m.div>
                        <m.h2
                            variants={fadeUp}
                            className="font-serif text-3xl leading-[1.15] font-bold tracking-tight text-[#16233B] sm:text-4xl lg:text-[2.6rem]"
                        >
                            {title}
                        </m.h2>
                    </div>

                    <m.p
                        variants={fadeUp}
                        className="text-base leading-relaxed text-[#6E675D] lg:col-span-6 lg:pl-6"
                    >
                        {description}
                    </m.p>
                </m.div>

                {/* Open Architectural Editorial Pillars (No Boxes) */}
                <m.div
                    className="grid grid-cols-1 divide-y divide-[#A88B54]/25 md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-[#A88B54]/30"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={staggerContainer}
                >
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <m.div
                                key={pillar.title}
                                variants={fadeUp}
                                className="h-full py-8 first:pt-2 last:pb-2 md:px-8 md:py-2 md:first:pl-0 md:last:pr-0"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveDialog({
                                            title: pillar.title,
                                            lines: pillar.easterEggLines,
                                        })
                                    }
                                    className="group flex h-full w-full cursor-pointer flex-col justify-between rounded-lg text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54]"
                                >
                                    <div>
                                        <div className="mb-6 flex items-center justify-between">
                                            <span className="font-serif text-3xl text-[#A88B54] italic transition-colors duration-300 group-hover:text-[#16233B]">
                                                {pillar.number}
                                            </span>
                                            <Icon
                                                className="h-5 w-5 text-[#725C30] transition-all duration-300 group-hover:scale-110 group-hover:text-[#16233B]"
                                                strokeWidth={1.6}
                                            />
                                        </div>

                                        <h3 className="mb-3 font-serif text-2xl font-bold text-[#16233B]">
                                            {pillar.title}
                                        </h3>

                                        <div
                                            aria-hidden="true"
                                            className="mb-4 h-px w-10 bg-[#A88B54] transition-all duration-500 ease-out group-hover:w-20"
                                        />

                                        <p className="mb-6 text-sm leading-relaxed text-[#6E675D]">
                                            {pillar.description}
                                        </p>
                                    </div>

                                    <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase">
                                        {pillar.tag}
                                    </span>
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
