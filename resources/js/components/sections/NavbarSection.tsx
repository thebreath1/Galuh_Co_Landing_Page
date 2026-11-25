import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { m, AnimatePresence } from 'motion/react';
import {
    Menu,
    X,
    ArrowRight,
    Sparkles,
    Tag,
    LogIn,
    UserPlus,
    ShoppingBag,
    LayoutDashboard,
    LogOut,
} from 'lucide-react';
import { dashboard, login, logout, register } from '@/routes';
import { mine as ordersMine } from '@/routes/orders';
import type { User } from '@/types';
import type { ActivePromoBanner, Product } from '@/types/landing';

interface NavbarSectionProps {
    whatsappNumber: string;
    products?: Product[];
    activePromos?: ActivePromoBanner[];
}

export const NavbarSection: React.FC<NavbarSectionProps> = ({
    whatsappNumber,
    products = [],
    activePromos = [],
}) => {
    const { auth } = usePage<{ auth?: { user?: User | null } }>().props;
    const user = auth?.user ?? null;
    const isAdmin = user?.role === 'admin';
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
        'Halo GALUH & CO., saya ingin melakukan pemesanan hampers.',
    )}`;

    const formatPromoEndDate = (isoDate: string) =>
        new Date(isoDate).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const formatScopeInfo = (promo: ActivePromoBanner) => {
        if (promo.scope === 'category' && promo.target_category) {
            return `Berlaku untuk kategori ${promo.target_category}`;
        }
        if (promo.scope === 'product' && promo.product_name) {
            return `Khusus paket ${promo.product_name}`;
        }
        return 'Berlaku untuk seluruh koleksi hampers';
    };

    const resolvedPromos: ActivePromoBanner[] =
        activePromos.length > 0
            ? activePromos
            : Array.from(
                  products
                      .reduce<Map<number, ActivePromoBanner>>(
                          (map, product) => {
                              const p = product.active_promo;
                              if (p && !map.has(p.promo_id)) {
                                  map.set(p.promo_id, {
                                      id: p.promo_id,
                                      name: p.promo_name,
                                      description: p.description,
                                      discount_percent: p.discount_percent,
                                      scope: 'product',
                                      target_category: null,
                                      product_name: product.name,
                                      starts_at: p.ends_at,
                                      ends_at: p.ends_at,
                                  });
                              }
                              return map;
                          },
                          new Map(),
                      )
                      .values(),
              );

    const marqueeAnnouncements = resolvedPromos.flatMap((promo) => {
        const items: { text: string; href: string; highlight: boolean }[] = [
            {
                text: `PROMO BERLANGSUNG: ${promo.name} — Diskon ${promo.discount_percent}% otomatis di katalog`,
                href: '#koleksi',
                highlight: true,
            },
            {
                text: `${promo.name}: ${formatScopeInfo(promo)}`,
                href: '#koleksi',
                highlight: false,
            },
        ];

        if (promo.description?.trim()) {
            items.push({
                text: promo.description.trim(),
                href: '#koleksi',
                highlight: false,
            });
        }

        items.push({
            text: `Periode ${promo.name} berlaku s/d ${formatPromoEndDate(promo.ends_at)} WIB`,
            href: '#koleksi',
            highlight: true,
        });

        return items;
    });

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#F2EBDC]/95 shadow-sm backdrop-blur-md'
                    : 'bg-[#F2EBDC]/85 backdrop-blur-xs'
            }`}
        >
            <div
                className={`mx-auto max-w-7xl px-4 transition-all duration-300 sm:px-6 lg:px-8 ${scrolled ? 'py-2.5' : 'py-3'}`}
            >
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <a
                        href="#hero"
                        className="group flex items-center rounded-lg p-1 focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
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
                            className="h-11 w-[49px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-[53px]"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav
                        className="hidden items-center gap-6 lg:flex"
                        aria-label="Navigasi Utama"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative rounded py-1 text-sm font-medium whitespace-nowrap text-[#1E2430]/80 transition-colors hover:text-[#16233B] focus:ring-1 focus:ring-[#A88B54] focus:outline-none"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Auth & CTA Buttons */}
                    <div className="hidden items-center gap-2.5 sm:flex">
                        {user ? (
                            <>
                                <Link
                                    href={isAdmin ? dashboard() : ordersMine()}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#A88B54]/60 bg-[#FFFFFF]/80 px-4 py-2 text-xs font-semibold whitespace-nowrap text-[#16233B] transition-colors hover:bg-[#EAE1CE]"
                                >
                                    {isAdmin ? (
                                        <>
                                            <LayoutDashboard className="h-3.5 w-3.5 text-[#725C30]" />
                                            <span>Dashboard</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="h-3.5 w-3.5 text-[#725C30]" />
                                            <span>Pesanan Saya</span>
                                        </>
                                    )}
                                </Link>
                                <Link
                                    href={logout()}
                                    method="post"
                                    as="button"
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D8CEBA] px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-[#6E675D] transition-colors hover:bg-[#EAE1CE] hover:text-[#16233B]"
                                    title={`Keluar dari ${user.name}`}
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span className="hidden xl:inline">
                                        Keluar
                                    </span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#16233B]/30 px-4 py-2 text-xs font-semibold whitespace-nowrap text-[#16233B] transition-colors hover:bg-[#EAE1CE]"
                                >
                                    <LogIn className="h-3.5 w-3.5 text-[#725C30]" />
                                    <span>Masuk</span>
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#A88B54]/60 bg-[#FFFFFF]/85 px-4 py-2 text-xs font-semibold whitespace-nowrap text-[#16233B] transition-colors hover:bg-[#EAE1CE]"
                                >
                                    <UserPlus className="h-3.5 w-3.5 text-[#725C30]" />
                                    <span>Daftar</span>
                                </Link>
                            </>
                        )}
                        <m.a
                            href="#koleksi"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 rounded-full bg-[#16233B] px-5 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap text-[#F2EBDC] uppercase shadow-sm transition-colors hover:bg-[#203252] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                        >
                            <span>Pesan Sekarang</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[#C5AA74]" />
                        </m.a>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-2 text-[#16233B] hover:bg-[#EAE1CE] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Thin Sticky Marquee Announcement Banner — Only Shown During Active Promos */}
            {marqueeAnnouncements.length > 0 && (
                <div
                    aria-label="Pengumuman Promo Berlangsung"
                    className="relative w-full overflow-hidden border-y border-[#A88B54]/40 bg-[#16233B] text-[#F2EBDC] select-none"
                >
                    <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-[#16233B] to-transparent sm:w-16" />
                    <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[#16233B] to-transparent sm:w-16" />

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
                                className="inline-flex shrink-0 items-center gap-2 px-6 text-[11px] font-medium tracking-wide whitespace-nowrap text-[#F2EBDC]/95 transition-colors hover:text-[#C5AA74] sm:text-xs"
                            >
                                {item.highlight ? (
                                    <Tag className="h-3 w-3 shrink-0 text-[#C5AA74]" />
                                ) : (
                                    <Sparkles className="h-3 w-3 shrink-0 text-[#A88B54]" />
                                )}
                                <span
                                    className={
                                        item.highlight
                                            ? 'font-semibold text-[#C5AA74]'
                                            : ''
                                    }
                                >
                                    {item.text}
                                </span>
                                <span
                                    className="ml-4 text-[#A88B54]/50"
                                    aria-hidden="true"
                                >
                                    •
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-[#D8CEBA] bg-[#F2EBDC] px-4 pt-3 pb-6 shadow-xl lg:hidden"
                    >
                        <nav
                            className="flex flex-col gap-3"
                            aria-label="Navigasi Seluler"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-[#1E2430] transition-colors hover:bg-[#EAE1CE] hover:text-[#16233B]"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex flex-col gap-2 border-t border-[#D8CEBA] pt-2">
                                {user ? (
                                    <>
                                        <div className="px-3 py-1.5 text-xs text-[#6E675D]">
                                            Masuk sebagai{' '}
                                            <strong className="text-[#16233B]">
                                                {user.name}
                                            </strong>
                                        </div>
                                        <Link
                                            href={
                                                isAdmin
                                                    ? dashboard()
                                                    : ordersMine()
                                            }
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="w-full rounded-full border border-[#A88B54] bg-[#FFFFFF] px-4 py-2.5 text-center text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                        >
                                            {isAdmin
                                                ? 'Dashboard Admin'
                                                : 'Pesanan Saya'}
                                        </Link>
                                        <Link
                                            href={logout()}
                                            method="post"
                                            as="button"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="w-full cursor-pointer rounded-full border border-[#D8CEBA] px-4 py-2.5 text-center text-xs font-semibold tracking-wider text-[#6E675D] uppercase"
                                        >
                                            Keluar
                                        </Link>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href={login()}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="w-full rounded-full border border-[#16233B] px-4 py-2.5 text-center text-xs font-semibold tracking-wider text-[#16233B] uppercase hover:bg-[#EAE1CE]"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={register()}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="w-full rounded-full border border-[#A88B54] bg-[#FFFFFF] px-4 py-2.5 text-center text-xs font-semibold tracking-wider text-[#16233B] uppercase hover:bg-[#EAE1CE]"
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                                <a
                                    href="#koleksi"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full rounded-full bg-[#16233B] px-4 py-2.5 text-center text-xs font-semibold tracking-wider text-[#F2EBDC] uppercase shadow-sm"
                                >
                                    Lihat Koleksi
                                </a>
                                <a
                                    href={waOrderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full rounded-full border border-[#16233B] px-4 py-2.5 text-center text-xs font-semibold tracking-wider text-[#16233B] uppercase hover:bg-[#EAE1CE]"
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
