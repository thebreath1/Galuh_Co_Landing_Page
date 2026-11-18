import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Check, Sparkles } from 'lucide-react';
import type { Product } from '@/types/landing';
import { fadeUp, viewportConfig } from '@/lib/motion';

interface CollectionSectionProps {
    products: Product[];
    whatsappNumber: string;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({ products, whatsappNumber }) => {
    const categories = ['Semua', 'Lebaran', 'Natal', 'Corporate', 'Wedding'];
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'Semua') {
            return products;
        }
        return products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }, [products, selectedCategory]);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');

    return (
        <section
            id="koleksi"
            aria-label="Koleksi Hampers Pilihan"
            className="py-20 md:py-28 bg-[#FDFBF7] relative"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C8A951] font-semibold mb-3">
                        Katalog Kami
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        Koleksi Hampers Pilihan
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base">
                        Temukan paduan sempurna rasa lezat dan estetika kemasan untuk setiap perayaan berharga Anda.
                    </p>
                </motion.div>

                {/* Category Filters */}
                <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-14">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`relative isolate px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A951] ${
                                    isActive
                                        ? 'text-[#FDFBF7] border border-transparent'
                                        : 'text-[#6E675F] bg-[#FFFFFF] border border-[#E8E2D5] hover:text-[#1B382B] hover:border-[#1B382B]/40'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCategoryPill"
                                        className="absolute inset-0 bg-[#1B382B] rounded-full z-0 shadow-sm"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => {
                            const waText = encodeURIComponent(
                                `Halo GALUH & CO., saya tertarik memesan hampers "${product.name}". Boleh minta info detail ketersediaan dan pengirimannya?`
                            );
                            const waLink = `https://wa.me/${cleanedNumber}?text=${waText}`;

                            return (
                                <motion.article
                                    layout
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.4 }}
                                    whileHover={{ y: -6 }}
                                    className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col group"
                                >
                                    {/* Product Image */}
                                    <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3.5 left-3.5">
                                            <span className="px-3 py-1 rounded-full bg-[#1B382B]/90 backdrop-blur-xs text-[#DFCA86] text-[11px] font-semibold tracking-wider uppercase border border-[#C8A951]/30">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-serif text-xl font-bold text-[#1B382B] mb-2 group-hover:text-[#C8A951] transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-[#6E675F] leading-relaxed mb-4">
                                                {product.short_description}
                                            </p>

                                            {/* Contents list chips */}
                                            {product.contents && product.contents.length > 0 && (
                                                <div className="mb-5 space-y-1.5 pt-3 border-t border-[#E8E2D5]/70">
                                                    <p className="text-[11px] font-semibold text-[#1B382B] uppercase tracking-wider flex items-center gap-1.5">
                                                        <Sparkles className="w-3 h-3 text-[#C8A951]" />
                                                        <span>Daftar Isi Paket:</span>
                                                    </p>
                                                    <ul className="text-xs text-[#6E675F] space-y-1 pl-1">
                                                        {product.contents.slice(0, 3).map((item, idx) => (
                                                            <li key={idx} className="flex items-center gap-2">
                                                                <Check className="w-3 h-3 text-[#C8A951] flex-shrink-0" />
                                                                <span className="truncate">{item}</span>
                                                            </li>
                                                        ))}
                                                        {product.contents.length > 3 && (
                                                            <li className="text-[11px] text-[#C8A951] font-medium pl-5">
                                                                + {product.contents.length - 3} item eksklusif lainnya
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price & CTA Button */}
                                        <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between gap-3">
                                            <div>
                                                <span className="text-[11px] text-[#9C9489] uppercase tracking-wider block">
                                                    Mulai Dari
                                                </span>
                                                <span className="font-serif text-base sm:text-lg font-bold text-[#1B382B]">
                                                    {formatRupiah(product.price_from)}
                                                </span>
                                            </div>

                                            <motion.a
                                                href={waLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1B382B] text-[#FDFBF7] text-xs font-semibold hover:bg-[#264E3D] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                                aria-label={`Pesan ${product.name} via WhatsApp`}
                                            >
                                                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                                                <span>Pesan via WA</span>
                                            </motion.a>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};
