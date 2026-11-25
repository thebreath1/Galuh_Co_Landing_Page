import React from 'react';
import { m } from 'motion/react';
import { Mail, MapPin, Clock, Instagram, ArrowUp } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { fadeUp, viewportConfig } from '@/lib/motion';

interface FooterCtaSectionProps {
    whatsappNumber: string;
}

export const FooterCtaSection: React.FC<FooterCtaSectionProps> = ({
    whatsappNumber,
}) => {
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya ingin berkonsultasi mengenai pemesanan hampers eksklusif.',
    )}`;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative overflow-hidden bg-[#0B1322] text-[#F2EBDC]">
            {/* Closing CTA Banner */}
            <div className="relative border-b border-[#FFFFFF]/10 bg-gradient-to-b from-[#111C30] to-[#0B1322] py-20 lg:py-24">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A88B54]/10 blur-3xl"
                />

                <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                        className="flex flex-col items-center"
                    >
                        <h2 className="mb-5 max-w-3xl font-serif text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
                            Siap Menghadirkan Kesan Terbaik untuk Mereka yang
                            Berharga?
                        </h2>

                        <p className="mb-9 max-w-2xl text-base leading-relaxed text-[#D8CEBA] sm:text-lg">
                            Percayakan setiap detail hantaran kepada spesialis
                            gifting kami. Dari kurasi rasa hingga pengemasan
                            pita satin, kami wujudkan bingkisan yang tak
                            terlupakan.
                        </p>

                        <m.a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 rounded-full bg-[#A88B54] px-8 py-4 text-sm font-bold tracking-wider text-[#0B1322] uppercase shadow-xl transition-all hover:bg-[#C5AA74] focus:ring-4 focus:ring-[#A88B54]/40 focus:outline-none"
                        >
                            <WhatsAppIcon className="h-5 w-5 fill-current text-[#0B1322]" />
                            <span>Konsultasi via WhatsApp</span>
                        </m.a>
                    </m.div>
                </div>
            </div>

            {/* Main Footer Links & Info */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
                    {/* Brand Info */}
                    <div className="flex flex-col items-start lg:col-span-4">
                        <img
                            src="/images/logo-white.webp"
                            alt="Logo GALUH & CO. Hampers & Corporate Gifting"
                            width={214}
                            height={192}
                            className="mb-3 h-20 w-auto object-contain sm:h-24"
                            loading="lazy"
                            decoding="async"
                        />
                        <span className="mb-4 text-[10px] tracking-[0.3em] text-[#C5AA74] uppercase">
                            Hampers & Corporate Gifting
                        </span>
                        <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#B5ADA1]">
                            Menghidupkan seni tradisi berbagi melalui kurasi
                            bingkisan mewah, kemasan puitis, dan pengalaman
                            personalisasi tanpa batas bagi momen istimewa dan
                            relasi profesional Anda.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#D8CEBA]">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFFFFF]/15 bg-[#16233B] transition-colors hover:border-[#A88B54] hover:text-[#C5AA74]"
                                aria-label="Kunjungi Instagram GALUH & CO."
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFFFFF]/15 bg-[#16233B] transition-colors hover:border-[#A88B54] hover:text-[#C5AA74]"
                                aria-label="WhatsApp GALUH & CO."
                            >
                                <WhatsAppIcon className="h-4 w-4 fill-current" />
                            </a>
                            <a
                                href="mailto:hello@galuh.co.id"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFFFFF]/15 bg-[#16233B] transition-colors hover:border-[#A88B54] hover:text-[#C5AA74]"
                                aria-label="Kirim Email ke GALUH & CO."
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#C5AA74] uppercase">
                            Navigasi
                        </p>
                        <ul className="space-y-2.5 text-sm text-[#D8CEBA]">
                            <li>
                                <a
                                    href="#hero"
                                    className="transition-colors hover:text-white"
                                >
                                    Beranda
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#tentang"
                                    className="transition-colors hover:text-white"
                                >
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#koleksi"
                                    className="transition-colors hover:text-white"
                                >
                                    Katalog Hampers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#keunggulan"
                                    className="transition-colors hover:text-white"
                                >
                                    Keunggulan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#cara-pesan"
                                    className="transition-colors hover:text-white"
                                >
                                    Cara Pemesanan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#corporate"
                                    className="transition-colors hover:text-white"
                                >
                                    Corporate Gifting
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    className="transition-colors hover:text-white"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Jam Operasional & Layanan */}
                    <div className="lg:col-span-3">
                        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#C5AA74] uppercase">
                            Layanan & Konsultasi
                        </p>
                        <div className="space-y-3.5 text-xs text-[#D8CEBA] sm:text-sm">
                            <div className="flex items-start gap-2.5">
                                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#A88B54]" />
                                <div>
                                    <p className="font-semibold text-white">
                                        Jam Operasional Studio:
                                    </p>
                                    <p className="text-[#B5ADA1]">
                                        Senin – Sabtu: 08.00 – 20.00 WIB
                                    </p>
                                    <p className="text-[#B5ADA1]">
                                        Minggu / Hari Libur: By Appointment
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#A88B54]" />
                                <div>
                                    <p className="font-semibold text-white">
                                        Email Resmi:
                                    </p>
                                    <a
                                        href="mailto:hello@galuh.co.id"
                                        className="text-[#B5ADA1] hover:text-white"
                                    >
                                        hello@galuh.co.id
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alamat Studio */}
                    <div className="lg:col-span-3">
                        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#C5AA74] uppercase">
                            Lokasi Studio
                        </p>
                        <div className="space-y-4 text-xs text-[#D8CEBA] sm:text-sm">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#A88B54]" />
                                <div>
                                    <p className="font-semibold text-white">
                                        Studio Ciamis:
                                    </p>
                                    <p className="leading-relaxed text-[#B5ADA1]">
                                        Jl. Jend. Sudirman No. 175, Ciamis, Jawa
                                        Barat
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar & Copyright */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#FFFFFF]/10 pt-8 text-xs text-[#B5ADA1] sm:flex-row">
                    <p>
                        &copy; {new Date().getFullYear()} GALUH & CO. All rights
                        reserved. Hampers Mewah & Corporate Gifting.
                    </p>
                    <div className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className="inline-flex items-center gap-1.5 text-[#D8CEBA] transition-colors hover:text-[#A88B54] focus:outline-none"
                        >
                            <span>Kembali ke Atas</span>
                            <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
