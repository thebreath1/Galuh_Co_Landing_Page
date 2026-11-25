import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Sparkles, Tag } from 'lucide-react';
import type { Product } from '@/types/landing';

interface NavbarSectionProps {
    whatsappNumber: string;
    products?: Product[];
}

export const NavbarSection: React.FC<NavbarSectionProps> = ({ whatsappNumber, products = [] }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '#hero' },
        { name: 'Tentang', href: '#tentang' },
        { name: 'Koleksi', href: '#koleksi' },
        { name: 'Keunggulan', href: '#keunggulan' },
        { name: 'Cara Pesan', href: '#cara-pesan' },
        { name: 'Corporate', href: '#corporate' },
        { name: 'FAQ', href: '#faq' },
    ];

    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waOrderUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya ingin melakukan pemesanan hampers.'
    )}`;

    const activePromo = products.reduce<Product['active_promo']>((best, item) => {
        if (!item.active_promo) return best;
        if (!best || item.active_promo.discount_percent > best.discount_percent) {
            return item.active_promo;
        }
        return best;
    }, null);

    const marqueeAnnouncements = [
        activePromo
            ? {
                  text: `PROMO AKTIF: ${activePromo.promo_name} — Hemat hingga ${activePromo.discount_percent}% otomatis di katalog`,
                  href: '#koleksi',
                  highlight: true,
              }
            : null,
        {
            text: 'Koleksi Hampers Artisanal GALUH & CO. • Studio Ciamis (Jl. Jend. Sudirman No. 175)',
            href: '#koleksi',
            highlight: false,
        },
        {
            text: 'Pemesanan Cepat & Praktis — Pembayaran via BCA, Mandiri, QRIS Instan, E-Wallet, atau COD Lokal',
            href: '#koleksi',
            highlight: false,
        },
        {
            text: 'Layanan Corporate Gifting B2B — Custom Logo Foil Emas, Faktur Pajak & Termin DP 50%',
            href: '#corporate',
            highlight: false,
        },
    ].filter((item): item is { text: string; href: string; highlight: boolean } => item !== null);

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#F2EBDC]/95 backdrop-blur-md shadow-sm'
                    : 'bg-[#F2EBDC]/85 backdrop-blur-xs'
            }`}
        >
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'py-2.5' : 'py-3'}`}>
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <a
                        href="#hero"
                        className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#A88B54] rounded-lg p-1 group"
                        aria-label="GALUH & CO. Beranda"
                    >
                        <img
                            src="/images/logo-gold.webp"
                            alt="Logo GALUH & CO."
                            width={120}
                            height={108}
                            loading="eager"
                            decoding="sync"
                            fetchPriority="high"
                            className="h-11 w-[49px] sm:h-12 sm:w-[53px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-7" aria-label="Navigasi Utama">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-[#1E2430]/80 hover:text-[#16233B] transition-colors relative py-1 focus:outline-none focus:ring-1 focus:ring-[#A88B54] rounded"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA Button */}
                    <div className="hidden sm:flex items-center gap-3">
                        <m.a
                            href="#koleksi"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#16233B] text-[#F2EBDC] text-xs font-semibold tracking-wider uppercase hover:bg-[#203252] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                        >
                            <span>Pesan Sekarang</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5AA74]" />
                        </m.a>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-[#16233B] hover:bg-[#EAE1CE] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Thin Sticky Marquee Announcement Banner Attached Directly Below Navbar */}
            <div
                aria-label="Informasi & Pengumuman Klien"
                className="relative w-full bg-[#16233B] text-[#F2EBDC] border-y border-[#A88B54]/40 overflow-hidden select-none"
            >
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#16233B] to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#16233B] to-transparent z-10" />

                <div className="animate-marquee items-center py-1.5">
                    {[
                        ...marqueeAnnouncements,
                        ...marqueeAnnouncements,
                        ...marqueeAnnouncements,
                        ...marqueeAnnouncements,
                    ].map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            className="inline-flex items-center gap-2 px-6 text-[11px] sm:text-xs font-medium tracking-wide whitespace-nowrap text-[#F2EBDC]/95 hover:text-[#C5AA74] transition-colors shrink-0"
                        >
                            {item.highlight ? (
                                <Tag className="w-3 h-3 text-[#C5AA74] shrink-0" />
                            ) : (
                                <Sparkles className="w-3 h-3 text-[#A88B54] shrink-0" />
                            )}
                            <span className={item.highlight ? 'font-semibold text-[#C5AA74]' : ''}>
                                {item.text}
                            </span>
                            <span className="ml-4 text-[#A88B54]/50" aria-hidden="true">
                                •
                            </span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-[#F2EBDC] border-b border-[#D8CEBA] px-4 pt-3 pb-6 shadow-xl"
                    >
                        <nav className="flex flex-col gap-3" aria-label="Navigasi Seluler">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-3 py-2 text-sm font-medium text-[#1E2430] hover:bg-[#EAE1CE] hover:text-[#16233B] rounded-lg transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-2 border-t border-[#D8CEBA] flex flex-col gap-2">
                                <a
                                    href="#koleksi"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center py-2.5 px-4 rounded-full bg-[#16233B] text-[#F2EBDC] text-xs font-semibold uppercase tracking-wider shadow-sm"
                                >
                                    Lihat Koleksi
                                </a>
                                <a
                                    href={waOrderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-center py-2.5 px-4 rounded-full border border-[#16233B] text-[#16233B] text-xs font-semibold uppercase tracking-wider hover:bg-[#EAE1CE]"
                                >
                                    Pesan via WhatsApp
                                </a>
                            </div>
                        </nav>
                    </m.div>
                )}
            </AnimatePresence>
        </header>
    );
};
