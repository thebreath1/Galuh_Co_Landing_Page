import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { fadeUp, viewportConfig } from '@/lib/motion';

export const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'Berapa minimal jumlah pemesanan (MOQ) untuk hampers corporate custom?',
            answer: 'Untuk kustomisasi penuh—meliputi custom logo hot-stamping foil emas pada hardbox, sleeve berlabel brand, dan kartu ucapan perusahaan—minimal order dimulai dari 25 paket. Sementara untuk katalog hampers reguler tanpa logo perusahaan, Anda dapat memesan satuan tanpa minimal pemesanan.',
        },
        {
            question: 'Apakah melayani pengiriman langsung ke banyak alamat penerima sekaligus?',
            answer: 'Tentu, kami memiliki layanan Multi-Destination Delivery. Anda cukup menyediakan data penerima melalui template spreadsheet yang kami sediakan, dan tim logistik kami akan mendistribusikan setiap paket door-to-door dengan resi pelacakan aktif ke seluruh wilayah Indonesia.',
        },
        {
            question: 'Berapa lama estimasi waktu pengerjaan pesanan hampers?',
            answer: 'Pesanan reguler siap dikirim dalam 1–3 hari kerja. Untuk pesanan korporat dalam volume besar (50 hingga 1.000+ paket), kami menyarankan konfirmasi dilakukan H-14 hingga H-30 sebelum hari H agar proses kurasi bahan, persetujuan sampel desain, dan perakitan berjalan prima.',
        },
        {
            question: 'Apakah produk makanan dan kue kering dijamin halal serta memiliki masa kedaluwarsa aman?',
            answer: 'Seluruh kudapan, kue mentega wysman, cokelat artisan, dan teh kurasi kami 100% berbahan halal, higienis, dan tanpa bahan pengawet berbahaya. Setiap toples memiliki segel kedap udara dengan tanggal kedaluwarsa aman (minimal 3–6 bulan sejak tanggal produksi).',
        },
        {
            question: 'Bisakah perusahaan kami meminta sampel fisik box sebelum konfirmasi pesanan besar?',
            answer: 'Bisa. Bagi klien korporat dengan proyeksi pemesanan di atas 100 paket, tim kami siap mengirimkan 1 paket mock-up sampel fisik lengkap dengan contoh grafir logo dan kartu ucapan untuk dipresentasikan kepada jajaran manajemen Anda.',
        },
        {
            question: 'Bagaimana prosedur penagihan, termin invoice, dan faktur pajak perusahaan?',
            answer: 'Kami menyediakan kelengkapan administrasi bisnis resmi: Surat Penawaran Harga (SPH), Purchase Order (PO), Invoice bertempo sesuai kesepakatan, kwitansi bertandatangan basah, serta Faktur Pajak PPN resmi atas nama badan usaha Anda.',
        },
        {
            question: 'Bagaimana jika terjadi kerusakan pada hampers selama proses pengiriman ekspedisi?',
            answer: 'Semua hampers kami dikemas menggunakan proteksi berlapis (hardbox tebal, bubble wrap premium, corner protector, dan segel tamper-evident). Apabila ditemukan kerusakan akibat handling kurir saat dibuka dengan video unboxing, kami memberikan garansi 100% kirim ulang paket pengganti baru.',
        },
    ];

    const toggleAccordion = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <section
            id="faq"
            aria-label="Pertanyaan yang Sering Diajukan"
            className="py-20 md:py-28 bg-[#F7F4EE] border-t border-[#E8E2D5] relative"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C8A951] font-semibold mb-3">
                        Tanya Jawab
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base">
                        Informasi lengkap seputar pemesanan, kustomisasi, sistem pengiriman, dan garansi layanan GALUH & CO.
                    </p>
                </motion.div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportConfig}
                                variants={fadeUp}
                                className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-xs transition-colors"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(idx)}
                                    aria-expanded={isOpen}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                >
                                    <span className="font-serif text-base sm:text-lg font-bold text-[#1B382B]">
                                        {faq.question}
                                    </span>
                                    <span className="w-8 h-8 rounded-full bg-[#F7F2E4] text-[#C8A951] flex items-center justify-center flex-shrink-0 transition-transform">
                                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeOut' }}
                                        >
                                            <div className="px-6 pb-6 pt-1 text-sm text-[#6E675F] leading-relaxed border-t border-[#F2ECE1]">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
