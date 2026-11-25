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

const StatCounter: React.FC<StatCounterProps> = ({
    value,
    suffix = '',
    prefix = '',
    isText = false,
    textValue = '',
}) => {
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
                className="font-serif text-4xl leading-none font-bold tracking-tight text-[#16233B] transition-colors duration-300 group-hover:text-[#725C30] sm:text-[2.75rem]"
            >
                {textValue}
            </span>
        );
    }

    return (
        <span
            ref={ref}
            className="font-serif text-4xl leading-none font-bold tracking-tight text-[#16233B] transition-colors duration-300 group-hover:text-[#725C30] sm:text-[2.75rem]"
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
            description:
                'Semua kudapan dan bahan bersertifikasi halal, higienis, dan terbuat dari resep warisan terbaik.',
        },
        {
            number: '02',
            icon: Clock,
            isText: true,
            textValue: '24/7',
            title: 'Konsultasi Responsif',
            description:
                'Tim spesialis gifting kami siap membantu mencocokkan paket dengan tema momen dan anggaran Anda.',
        },
        {
            number: '03',
            icon: Layers,
            isText: false,
            value: 1000,
            suffix: '+',
            title: 'Kapasitas Produksi Masal',
            description:
                'Didukung fasilitas perakitan profesional yang mampu menangani ribuan paket tepat waktu tanpa kompromi.',
        },
        {
            number: '04',
            icon: ShieldCheck,
            isText: true,
            textValue: 'Aman',
            title: 'Garansi Pengiriman',
            description:
                'Proteksi packing berlapis dengan jaminan ganti baru apabila terdapat kerusakan selama di perjalanan.',
        },
    ];

    return (
        <section
            id="keunggulan"
            aria-label="Kenapa Memilih GALUH & CO."
            className="relative border-y border-[#D8CEBA] bg-[#EAE1CE] py-20 md:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left Column: Editorial Intro & Atelier Assurance */}
                    <m.div
                        className="lg:sticky lg:top-28 lg:col-span-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <span
                                className="h-px w-8 bg-[#A88B54]"
                                aria-hidden="true"
                            />
                            <p className="text-xs font-semibold tracking-[0.25em] text-[#725C30] uppercase">
                                Keunggulan Kami
                            </p>
                        </div>

                        <h2 className="mb-5 font-serif text-3xl leading-[1.15] font-bold tracking-tight text-[#16233B] sm:text-4xl lg:text-[2.6rem]">
                            Kemewahan yang Terasa di Setiap Detail
                        </h2>

                        <p className="mb-8 text-base leading-relaxed text-[#6E675D]">
                            Komitmen kami terhadap kesempurnaan rasa, ketepatan
                            waktu, dan pelayanan hangat menjadikan GALUH &amp;
                            CO. mitra hantaran terpercaya.
                        </p>

                        <blockquote className="border-l-2 border-[#A88B54] py-1 pl-4 font-serif text-sm leading-relaxed text-[#16233B]/85 italic">
                            &ldquo;Setiap bingkisan dirangkai dengan standar
                            kualitas atelier—halal tersertifikasi, tepat waktu
                            dalam skala besar, dan terlindungi penuh hingga ke
                            tangan penerima.&rdquo;
                        </blockquote>
                    </m.div>

                    {/* Right Column: Open Vertical Specification Ledger (No Boxes) */}
                    <m.div
                        className="divide-y divide-[#A88B54]/30 border-y border-[#A88B54]/35 lg:col-span-7"
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
                                    className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:gap-8 sm:py-8"
                                >
                                    <div className="flex shrink-0 items-center justify-between sm:block sm:w-44">
                                        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-[#725C30] uppercase sm:mb-2">
                                            <span>{stat.number}</span>
                                            <span
                                                aria-hidden="true"
                                                className="h-px w-4 bg-[#A88B54]/60"
                                            />
                                            <Icon
                                                className="h-3.5 w-3.5 text-[#725C30]"
                                                strokeWidth={1.75}
                                            />
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

                                    <div className="min-w-0 flex-1 transition-transform duration-300 ease-out group-hover:translate-x-1">
                                        <h3 className="mb-2 font-serif text-xl font-bold text-[#16233B]">
                                            {stat.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#6E675D]">
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
