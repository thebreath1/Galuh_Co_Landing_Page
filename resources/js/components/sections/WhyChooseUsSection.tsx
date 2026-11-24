import React, { useEffect, useState, useRef } from 'react';
import { m, useInView, useReducedMotion } from 'motion/react';
import { ShieldCheck, Clock, Layers, Award } from 'lucide-react';
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/motion';

interface StatCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    isText?: boolean;
    textValue?: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ value, suffix = '', prefix = '', isText = false, textValue = '' }) => {
    const prefersReducedMotion = useReducedMotion();
    const [count, setCount] = useState(prefersReducedMotion ? value : 0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    useEffect(() => {
        if (!inView || isText) return;
        if (prefersReducedMotion) {
            setCount(value);
            return;
        }

        const end = value;
        const duration = 1500;
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const currentVal = Math.floor(progress * (2 - progress) * end);
            setCount(currentVal);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(step);
    }, [inView, value, isText, prefersReducedMotion]);

    if (isText) {
        return (
            <span
                ref={ref}
                className="font-serif text-4xl sm:text-[2.75rem] font-bold text-[#16233B] tracking-tight leading-none group-hover:text-[#725C30] transition-colors duration-300"
            >
                {textValue}
            </span>
        );
    }

    return (
        <span
            ref={ref}
            className="font-serif text-4xl sm:text-[2.75rem] font-bold text-[#16233B] tracking-tight leading-none group-hover:text-[#725C30] transition-colors duration-300"
        >
            {prefix}
            {count.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
};

export const WhyChooseUsSection: React.FC = () => {
    const stats = [
        {
            number: '01',
            icon: Award,
            isText: false,
            value: 100,
            suffix: '%',
            title: 'Bahan Premium Terpilih',
            description: 'Semua kudapan dan bahan bersertifikasi halal, higienis, dan terbuat dari resep warisan terbaik.',
        },
        {
            number: '02',
            icon: Clock,
            isText: true,
            textValue: '24/7',
            title: 'Konsultasi Responsif',
            description: 'Tim spesialis gifting kami siap membantu mencocokkan paket dengan tema momen dan anggaran Anda.',
        },
        {
            number: '03',
            icon: Layers,
            isText: false,
            value: 1000,
            suffix: '+',
            title: 'Kapasitas Produksi Masal',
            description: 'Didukung fasilitas perakitan profesional yang mampu menangani ribuan paket tepat waktu tanpa kompromi.',
        },
        {
            number: '04',
            icon: ShieldCheck,
            isText: true,
            textValue: 'Aman',
            title: 'Garansi Pengiriman',
            description: 'Proteksi packing berlapis dengan jaminan ganti baru apabila terdapat kerusakan selama di perjalanan.',
        },
    ];

    return (
        <section
            id="keunggulan"
            aria-label="Kenapa Memilih GALUH & CO."
            className="py-20 md:py-28 bg-[#EAE1CE] border-y border-[#D8CEBA] relative"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Editorial Intro & Atelier Assurance */}
                    <m.div
                        className="lg:col-span-5 lg:sticky lg:top-28"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-px bg-[#A88B54]" aria-hidden="true" />
                            <p className="text-xs uppercase tracking-[0.25em] text-[#725C30] font-semibold">
                                Keunggulan Kami
                            </p>
                        </div>

                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] text-[#16233B] font-bold tracking-tight leading-[1.15] mb-5">
                            Kemewahan yang Terasa di Setiap Detail
                        </h2>

                        <p className="text-[#6E675D] text-base leading-relaxed mb-8">
                            Komitmen kami terhadap kesempurnaan rasa, ketepatan waktu, dan pelayanan hangat menjadikan
                            GALUH &amp; CO. mitra hantaran terpercaya.
                        </p>

                        <blockquote className="border-l-2 border-[#A88B54] pl-4 py-1 text-sm italic font-serif text-[#16233B]/85 leading-relaxed">
                            &ldquo;Setiap bingkisan dirangkai dengan standar kualitas atelier—halal tersertifikasi,
                            tepat waktu dalam skala besar, dan terlindungi penuh hingga ke tangan penerima.&rdquo;
                        </blockquote>
                    </m.div>

                    {/* Right Column: Open Vertical Specification Ledger (No Boxes) */}
                    <m.div
                        className="lg:col-span-7 border-y border-[#A88B54]/35 divide-y divide-[#A88B54]/30"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={staggerContainer}
                    >
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <m.div
                                    key={stat.title}
                                    variants={fadeUp}
                                    className="py-7 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 group"
                                >
                                    <div className="sm:w-44 shrink-0 flex items-center justify-between sm:block">
                                        <div className="flex items-center gap-2 sm:mb-2 text-xs font-medium tracking-[0.2em] text-[#725C30] uppercase">
                                            <span>{stat.number}</span>
                                            <span aria-hidden="true" className="w-4 h-px bg-[#A88B54]/60" />
                                            <Icon className="w-3.5 h-3.5 text-[#725C30]" strokeWidth={1.75} />
                                        </div>

                                        <div>
                                            <StatCounter
                                                value={stat.value ?? 0}
                                                suffix={stat.suffix}
                                                isText={stat.isText}
                                                textValue={stat.textValue}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 transition-transform duration-300 ease-out group-hover:translate-x-1">
                                        <h3 className="font-serif text-xl font-bold text-[#16233B] mb-2">
                                            {stat.title}
                                        </h3>
                                        <p className="text-sm text-[#6E675D] leading-relaxed">
                                            {stat.description}
                                        </p>
                                    </div>
                                </m.div>
                            );
                        })}
                    </m.div>
                </div>
            </div>
        </section>
    );
};
