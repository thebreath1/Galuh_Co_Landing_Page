import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarSectionProps {
    whatsappNumber: string;
}

export const NavbarSection: React.FC<NavbarSectionProps> = ({ whatsappNumber }) => {
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

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#F2EBDC]/95 backdrop-blur-md shadow-sm border-b border-[#D8CEBA]/80 py-2.5'
                    : 'bg-[#F2EBDC]/70 backdrop-blur-xs py-3 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
