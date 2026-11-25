import React, { useState } from 'react';
import { m } from 'motion/react';
import { fadeUp, viewportConfig } from '@/lib/motion';

export const FaqSection: React.FC = () => {
    const [openIndices, setOpenIndices] = useState<number[]>([0]);

    const faqs = [
        {
            question:
                'Berapa minimal jumlah pemesanan (MOQ) untuk hampers corporate custom?',
            answer: 'Untuk kustomisasi penuh—meliputi custom logo hot-stamping foil emas pada hardbox, sleeve berlabel brand, dan kartu ucapan perusahaan—minimal order dimulai dari 25 paket. Sementara untuk katalog hampers reguler tanpa logo perusahaan, Anda dapat memesan satuan tanpa minimal pemesanan.',
        },
        {
            question:
                'Apakah melayani pengiriman langsung ke banyak alamat penerima sekaligus?',
            answer: 'Tentu, kami memiliki layanan Multi-Destination Delivery. Anda cukup menyediakan data penerima melalui template spreadsheet yang kami sediakan, dan tim logistik kami akan mendistribusikan setiap paket door-to-door dengan resi pelacakan aktif ke seluruh wilayah Indonesia.',
        },
        {
            question: 'Berapa lama estimasi waktu pengerjaan pesanan hampers?',
            answer: 'Pesanan reguler siap dikirim dalam 1–3 hari kerja. Untuk pesanan korporat dalam volume besar (50 hingga 1.000+ paket), kami menyarankan konfirmasi dilakukan H-14 hingga H-30 sebelum hari H agar proses kurasi bahan, persetujuan sampel desain, dan perakitan berjalan prima.',
        },
        {
            question:
                'Apakah produk makanan dan kue kering dijamin halal serta memiliki masa kedaluwarsa aman?',
            answer: 'Seluruh kudapan, kue mentega wysman, cokelat artisan, dan teh kurasi kami 100% berbahan halal, higienis, dan tanpa bahan pengawet berbahaya. Setiap toples memiliki segel kedap udara dengan tanggal kedaluwarsa aman (minimal 3–6 bulan sejak tanggal produksi).',
        },
        {
            question:
                'Bisakah perusahaan kami meminta sampel fisik box sebelum konfirmasi pesanan besar?',
            answer: 'Bisa. Bagi klien korporat dengan proyeksi pemesanan di atas 100 paket, tim kami siap mengirimkan 1 paket mock-up sampel fisik lengkap dengan contoh grafir logo dan kartu ucapan untuk dipresentasikan kepada jajaran manajemen Anda.',
        },
        {
            question:
                'Bagaimana prosedur penagihan, termin invoice, dan faktur pajak perusahaan?',
            answer: 'Kami menyediakan kelengkapan administrasi bisnis resmi: Surat Penawaran Harga (SPH), Purchase Order (PO), Invoice bertempo sesuai kesepakatan, kwitansi bertandatangan basah, serta Faktur Pajak PPN resmi atas nama badan usaha Anda.',
        },
        {
            question:
                'Bagaimana jika terjadi kerusakan pada hampers selama proses pengiriman ekspedisi?',
            answer: 'Semua hampers kami dikemas menggunakan proteksi berlapis (hardbox tebal, bubble wrap premium, corner protector, dan segel tamper-evident). Apabila ditemukan kerusakan akibat handling kurir saat dibuka dengan video unboxing, kami memberikan garansi 100% kirim ulang paket pengganti baru.',
        },
    ];

    const toggleAccordion = (idx: number) => {
        setOpenIndices((prev) =>
            prev.includes(idx)
                ? prev.filter((item) => item !== idx)
                : [...prev, idx],
        );
    };

    return (
        <section
            id="faq"
            aria-label="Pertanyaan yang Sering Diajukan"
            className="relative border-t border-[#D8CEBA] bg-[#EAE1CE] py-20 md:py-28"
        >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <m.div
                    className="mx-auto mb-16 max-w-2xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#725C30] uppercase">
                        Tanya Jawab
                    </p>
                    <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#16233B] sm:text-4xl">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <div className="mx-auto mb-5 h-0.5 w-12 bg-[#A88B54]" />
                    <p className="text-base text-[#6E675D]">
                        Informasi lengkap seputar pemesanan, kustomisasi, sistem
                        pengiriman, dan garansi layanan GALUH & CO.
                    </p>
                </m.div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndices.includes(idx);
                        return (
                            <m.div
                                key={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportConfig}
                                variants={fadeUp}
                                className="overflow-hidden rounded-2xl border border-[#D8CEBA] bg-[#FFFFFF] shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-[#A88B54]/45"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(idx)}
                                    aria-expanded={isOpen}
                                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] focus-visible:ring-inset"
                                >
                                    <span className="font-serif text-base font-bold text-[#16233B] sm:text-lg">
                                        {faq.question}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                                            isOpen
                                                ? 'bg-[#16233B] text-[#C5AA74]'
                                                : 'bg-[#EFE6D2] text-[#A88B54]'
                                        }`}
                                    >
                                        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                                            <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                                            <span
                                                className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                                                    isOpen
                                                        ? 'scale-y-0 rotate-90 opacity-0'
                                                        : 'scale-y-100 rotate-0 opacity-100'
                                                }`}
                                            />
                                        </span>
                                    </span>
                                </button>

                                <div
                                    aria-hidden={!isOpen}
                                    className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                                        isOpen
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div
                                            className={`border-t border-[#E6DEC9] px-6 pt-1 pb-6 text-sm leading-relaxed text-[#6E675D] transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                                                isOpen
                                                    ? 'translate-y-0'
                                                    : '-translate-y-1.5'
                                            }`}
                                        >
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
