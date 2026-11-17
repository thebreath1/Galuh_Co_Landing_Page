import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
                    ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D5]/80 py-3.5'
                    : 'bg-[#FDFBF7]/60 backdrop-blur-xs py-5 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <a
                        href="#hero"
                        className="flex flex-col focus:outline-none focus:ring-2 focus:ring-[#C8A951] rounded-lg p-1 group"
                        aria-label="GALUH & CO. Beranda"
                    >
                        <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#1B382B] group-hover:text-[#C8A951] transition-colors">
                            GALUH & CO.
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#6E675F] -mt-0.5">
                            Hampers & Gifting
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-7" aria-label="Navigasi Utama">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-[#2C2724]/80 hover:text-[#1B382B] transition-colors relative py-1 focus:outline-none focus:ring-1 focus:ring-[#C8A951] rounded"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA Button */}
                    <div className="hidden sm:flex items-center gap-3">
                        <motion.a
                            href="#koleksi"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B382B] text-[#FDFBF7] text-xs font-semibold tracking-wider uppercase hover:bg-[#264E3D] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                        >
                            <span>Pesan Sekarang</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#DFCA86]" />
                        </motion.a>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-[#1B382B] hover:bg-[#F7F4EE] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
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
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-[#FDFBF7] border-b border-[#E8E2D5] px-4 pt-3 pb-6 shadow-xl"
                    >
                        <nav className="flex flex-col gap-3" aria-label="Navigasi Seluler">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-3 py-2 text-sm font-medium text-[#2C2724] hover:bg-[#F7F4EE] hover:text-[#1B382B] rounded-lg transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-2 border-t border-[#E8E2D5] flex flex-col gap-2">
                                <a
                                    href="#koleksi"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center py-2.5 px-4 rounded-full bg-[#1B382B] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider shadow-sm"
                                >
                                    Lihat Koleksi
                                </a>
                                <a
                                    href={waOrderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-center py-2.5 px-4 rounded-full border border-[#1B382B] text-[#1B382B] text-xs font-semibold uppercase tracking-wider hover:bg-[#F7F4EE]"
                                >
                                    Pesan via WhatsApp
                                </a>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
