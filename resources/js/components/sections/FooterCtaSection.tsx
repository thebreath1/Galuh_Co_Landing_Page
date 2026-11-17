import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Mail, MapPin, Clock, Instagram, Sparkles, ArrowUp } from 'lucide-react';
import { fadeUp, viewportConfig } from '@/lib/motion';

interface FooterCtaSectionProps {
    whatsappNumber: string;
}

export const FooterCtaSection: React.FC<FooterCtaSectionProps> = ({ whatsappNumber }) => {
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya ingin berkonsultasi mengenai pemesanan hampers eksklusif.'
    )}`;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-[#0C1E17] text-[#FDFBF7] overflow-hidden">
            {/* Closing CTA Banner */}
            <div className="relative py-20 lg:py-24 border-b border-[#FFFFFF]/10 bg-gradient-to-b from-[#142E24] to-[#0C1E17]">
                <div
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C8A951]/10 rounded-full blur-3xl pointer-events-none"
                />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                        className="flex flex-col items-center"
                    >
                        {/* Gold Emblem Monogram */}
                        <div className="w-14 h-14 rounded-full bg-[#DFCA86]/10 border border-[#C8A951] flex items-center justify-center text-[#DFCA86] mb-6 shadow-lg">
                            <Sparkles className="w-6 h-6 text-[#DFCA86]" />
                        </div>

                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 max-w-3xl leading-tight">
                            Siap Menghadirkan Kesan Terbaik untuk Mereka yang Berharga?
                        </h2>

                        <p className="text-[#E8E2D5] text-base sm:text-lg max-w-2xl mb-9 leading-relaxed">
                            Percayakan setiap detail hantaran kepada spesialis gifting kami. Dari kurasi rasa hingga
                            pengemasan pita satin, kami wujudkan bingkisan yang tak terlupakan.
                        </p>

                        <motion.a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#C8A951] text-[#0C1E17] text-sm font-bold uppercase tracking-wider hover:bg-[#DFCA86] shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#C8A951]/40"
                        >
                            <MessageCircle className="w-5 h-5 text-[#0C1E17]" />
                            <span>Konsultasi via WhatsApp</span>
                        </motion.a>
                    </motion.div>
                </div>
            </div>

            {/* Main Footer Links & Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                    {/* Brand Info */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#FDFBF7]">
                            GALUH & CO.
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A951] mt-0.5 mb-4">
                            Hampers & Corporate Gifting
                        </span>
                        <p className="text-sm text-[#9C9489] leading-relaxed max-w-sm mb-6">
                            Menghidupkan seni tradisi berbagi melalui kurasi bingkisan mewah, kemasan puitis, dan
                            pengalaman personalisasi tanpa batas bagi momen istimewa dan relasi profesional Anda.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#E8E2D5]">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-[#1B382B] border border-[#FFFFFF]/15 flex items-center justify-center hover:text-[#DFCA86] hover:border-[#C8A951] transition-colors"
                                aria-label="Kunjungi Instagram GALUH & CO."
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-[#1B382B] border border-[#FFFFFF]/15 flex items-center justify-center hover:text-[#DFCA86] hover:border-[#C8A951] transition-colors"
                                aria-label="WhatsApp GALUH & CO."
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:hello@galuh.co.id"
                                className="w-9 h-9 rounded-full bg-[#1B382B] border border-[#FFFFFF]/15 flex items-center justify-center hover:text-[#DFCA86] hover:border-[#C8A951] transition-colors"
                                aria-label="Kirim Email ke GALUH & CO."
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#C8A951] font-semibold mb-4">
                            Navigasi
                        </p>
                        <ul className="space-y-2.5 text-sm text-[#E8E2D5]">
                            <li>
                                <a href="#hero" className="hover:text-white transition-colors">Beranda</a>
                            </li>
                            <li>
                                <a href="#tentang" className="hover:text-white transition-colors">Tentang Kami</a>
                            </li>
                            <li>
                                <a href="#koleksi" className="hover:text-white transition-colors">Katalog Hampers</a>
                            </li>
                            <li>
                                <a href="#keunggulan" className="hover:text-white transition-colors">Keunggulan</a>
                            </li>
                            <li>
                                <a href="#cara-pesan" className="hover:text-white transition-colors">Cara Pemesanan</a>
                            </li>
                            <li>
                                <a href="#corporate" className="hover:text-white transition-colors">Corporate Gifting</a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                            </li>
                        </ul>
                    </div>

                    {/* Jam Operasional & Layanan */}
                    <div className="lg:col-span-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#C8A951] font-semibold mb-4">
                            Layanan & Konsultasi
                        </p>
                        <div className="space-y-3.5 text-xs sm:text-sm text-[#E8E2D5]">
                            <div className="flex items-start gap-2.5">
                                <Clock className="w-4 h-4 text-[#C8A951] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-white">Jam Operasional Studio:</p>
                                    <p className="text-[#9C9489]">Senin – Sabtu: 08.00 – 20.00 WIB</p>
                                    <p className="text-[#9C9489]">Minggu / Hari Libur: By Appointment</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Mail className="w-4 h-4 text-[#C8A951] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-white">Email Resmi:</p>
                                    <a href="mailto:hello@galuh.co.id" className="text-[#9C9489] hover:text-white">
                                        hello@galuh.co.id
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alamat Studio */}
                    <div className="lg:col-span-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#C8A951] font-semibold mb-4">
                            Lokasi Studio
                        </p>
                        <div className="space-y-4 text-xs sm:text-sm text-[#E8E2D5]">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-[#C8A951] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-white">Studio Jakarta:</p>
                                    <p className="text-[#9C9489] leading-relaxed">
                                        Jl. Senopati No. 48, Kebayoran Baru, Jakarta Selatan 12190
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-[#C8A951] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-white">Studio Surabaya:</p>
                                    <p className="text-[#9C9489] leading-relaxed">
                                        Jl. Darmo Permai Timur No. 12, Surabaya Barat 60189
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar & Copyright */}
                <div className="mt-16 pt-8 border-t border-[#FFFFFF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9C9489]">
                    <p>
                        &copy; {new Date().getFullYear()} GALUH & CO. All rights reserved. Hampers Mewah & Corporate Gifting.
                    </p>
                    <div className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className="inline-flex items-center gap-1.5 text-[#E8E2D5] hover:text-[#C8A951] transition-colors focus:outline-none"
                        >
                            <span>Kembali ke Atas</span>
                            <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
