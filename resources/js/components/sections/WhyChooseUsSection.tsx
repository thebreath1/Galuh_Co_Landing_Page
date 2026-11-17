import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
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
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    useEffect(() => {
        if (!inView || isText) return;

        let start = 0;
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
    }, [inView, value, isText]);

    if (isText) {
        return (
            <span ref={ref} className="font-serif text-3xl sm:text-4xl font-bold text-[#1B382B]">
                {textValue}
            </span>
        );
    }

    return (
        <span ref={ref} className="font-serif text-3xl sm:text-4xl font-bold text-[#1B382B]">
            {prefix}
            {count.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
};

export const WhyChooseUsSection: React.FC = () => {
    const stats = [
        {
            icon: Award,
            isText: false,
            value: 100,
            suffix: '%',
            title: 'Bahan Premium Terpilih',
            description: 'Semua kudapan dan bahan bersertifikasi halal, higienis, dan terbuat dari resep warisan terbaik.',
        },
        {
            icon: Clock,
            isText: true,
            textValue: '24/7',
            title: 'Konsultasi Responsif',
            description: 'Tim spesialis gifting kami siap membantu mencocokkan paket dengan tema momen dan anggaran Anda.',
        },
        {
            icon: Layers,
            isText: false,
            value: 1000,
            suffix: '+',
            title: 'Kapasitas Produksi Masal',
            description: 'Didukung fasilitas perakitan profesional yang mampu menangani ribuan paket tepat waktu tanpa kompromi.',
        },
        {
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
            className="py-20 md:py-28 bg-[#F7F4EE] border-y border-[#E8E2D5] relative"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C8A951] font-semibold mb-3">
                        Keunggulan Kami
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        Kemewahan yang Terasa di Setiap Detail
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base">
                        Komitmen kami terhadap kesempurnaan rasa, ketepatan waktu, dan pelayanan hangat menjadikan
                        GALUH & CO. mitra hantaran terpercaya.
                    </p>
                </motion.div>

                {/* Grid 4 Cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={staggerContainer}
                >
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E8E2D5] shadow-luxury hover:shadow-luxury-hover transition-all text-center flex flex-col items-center group"
                            >
                                <div className="w-14 h-14 rounded-full bg-[#F7F2E4] border border-[#C8A951]/40 flex items-center justify-center text-[#C8A951] mb-5 group-hover:bg-[#1B382B] group-hover:text-[#DFCA86] transition-colors duration-300">
                                    <Icon className="w-6 h-6" />
                                </div>

                                <div className="mb-2">
                                    <StatCounter
                                        value={stat.value ?? 0}
                                        suffix={stat.suffix}
                                        isText={stat.isText}
                                        textValue={stat.textValue}
                                    />
                                </div>

                                <h3 className="font-serif text-lg font-bold text-[#1B382B] mb-2.5">
                                    {stat.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-[#6E675F] leading-relaxed">
                                    {stat.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};
