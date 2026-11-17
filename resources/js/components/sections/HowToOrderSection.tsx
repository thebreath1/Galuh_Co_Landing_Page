import React from 'react';
import { motion } from 'motion/react';
import { Search, MessageSquareHeart, CreditCard, Truck } from 'lucide-react';
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/motion';

export const HowToOrderSection: React.FC = () => {
    const steps = [
        {
            number: '01',
            icon: Search,
            title: 'Pilih Koleksi',
            description:
                'Telusuri katalog hampers pilihan kami dan tentukan varian paket yang paling selaras dengan momen spesial Anda.',
        },
        {
            number: '02',
            icon: MessageSquareHeart,
            title: 'Konsultasi & Custom',
            description:
                'Diskusikan detail personalisasi, pilihan kartu ucapan kaligrafi, pita satin, hingga branding logo perusahaan Anda.',
        },
        {
            number: '03',
            icon: CreditCard,
            title: 'Konfirmasi & Pembayaran',
            description:
                'Setujui penawaran final atau invoice resmi, lalu lakukan pembayaran dengan berbagai opsi transfer bank terverifikasi.',
        },
        {
            number: '04',
            icon: Truck,
            title: 'Produksi & Pengiriman',
            description:
                'Tim kami merakit setiap kotak secara teliti dan mengirimkannya aman ke satu lokasi atau multi-alamat seluruh Indonesia.',
        },
    ];

    return (
        <section
            id="cara-pesan"
            aria-label="Cara Pemesanan"
            className="py-20 md:py-28 bg-[#FDFBF7] relative overflow-hidden"
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
                        Alur Pemesanan
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        Langkah Mudah Menghadirkan Kebahagiaan
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base">
                        Proses pemesanan yang terstruktur, transparan, dan terarah dari awal konsultasi hingga paket
                        sampai di tangan penerima.
                    </p>
                </motion.div>

                {/* Steps Grid with Progress Line */}
                <div className="relative">
                    {/* Connecting progress line on desktop */}
                    <div
                        aria-hidden="true"
                        className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#E8E2D5] -translate-y-8 -z-0"
                    />

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={staggerContainer}
                    >
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E8E2D5] shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col items-center text-center group"
                                >
                                    <div className="relative mb-6">
                                        <div className="w-16 h-16 rounded-full bg-[#F7F4EE] border-2 border-[#C8A951]/40 flex items-center justify-center text-[#1B382B] group-hover:bg-[#1B382B] group-hover:text-[#DFCA86] transition-colors duration-300">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#1B382B] text-[#DFCA86] text-xs font-serif font-bold flex items-center justify-center border border-[#C8A951]">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-lg font-bold text-[#1B382B] mb-2.5">
                                        {step.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-[#6E675F] leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
