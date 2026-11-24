import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { m, AnimatePresence, type Variants } from 'motion/react';
import { Check, CheckCircle2, ShoppingBag, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { store as storeOrder } from '@/routes/orders';
import type { Product, SiteSettings } from '@/types/landing';
import { fadeUp, viewportConfig, smoothEase } from '@/lib/motion';

interface CollectionSectionProps {
    products: Product[];
    whatsappNumber?: string;
    settings?: SiteSettings;
}

const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const cardItemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 28,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            ease: smoothEase,
        },
    },
};

export const CollectionSection: React.FC<CollectionSectionProps> = ({ products, settings }) => {
    const categories = ['Semua', 'Lebaran', 'Natal', 'Corporate', 'Wedding'];
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        product_id: 0,
        customer_name: '',
        customer_whatsapp: '',
        customer_email: '',
        quantity: '1',
        delivery_date: '',
        shipping_address: '',
        greeting_card_note: '',
        website: '',
    });

    const eyebrow = settings?.collection_eyebrow || 'Katalog Kami';
    const title = settings?.collection_title || 'Koleksi Hampers Pilihan';
    const description =
        settings?.collection_description ||
        'Temukan paduan sempurna rasa lezat dan estetika kemasan untuk setiap perayaan berharga Anda.';

    const filteredProducts =
        selectedCategory === 'Semua'
            ? products
            : products.filter((p) => p.category.trim().toLowerCase() === selectedCategory.toLowerCase());

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const openOrderModal = (product: Product) => {
        clearErrors();
        setSubmittedMessage(null);
        setSelectedProduct(product);
        setData({
            product_id: product.id,
            customer_name: '',
            customer_whatsapp: '',
            customer_email: '',
            quantity: '1',
            delivery_date: '',
            shipping_address: '',
            greeting_card_note: '',
            website: '',
        });
    };

    const closeOrderModal = () => {
        setSelectedProduct(null);
        setSubmittedMessage(null);
        clearErrors();
    };

    const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        transform((current) => ({
            ...current,
            product_id: selectedProduct.id,
            quantity: Math.max(1, Number(current.quantity || 1)),
        }));

        post(storeOrder.url(), {
            preserveScroll: true,
            onSuccess: () => {
                const msg = `Pesanan untuk "${selectedProduct.name}" berhasil dikirim dan sedang menunggu ACC dari admin.`;
                setSubmittedMessage(msg);
                toast.success(msg);
                reset();
            },
            onError: () => {
                toast.error('Mohon periksa kembali data pemesanan Anda.');
            },
        });
    };

    return (
        <section
            id="koleksi"
            aria-label="Koleksi Hampers Pilihan"
            className="py-20 md:py-28 bg-[#FDFBF7] relative"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <m.div
                    className="text-center max-w-2xl mx-auto mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#9A7D2E] font-semibold mb-3">
                        {eyebrow}
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        {title}
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base">
                        {description}
                    </p>
                </m.div>

                {/* Category Filters */}
                <div className="flex justify-center mb-14">
                    <div
                        role="tablist"
                        aria-label="Filter kategori hampers"
                        className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#FFFFFF]/85 backdrop-blur-xs border border-[#E8E2D5] shadow-xs"
                    >
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A951] cursor-pointer ${
                                        isActive
                                            ? 'bg-[#1B382B] text-[#FDFBF7] shadow-sm'
                                            : 'text-[#6E675F] hover:text-[#1B382B] hover:bg-[#F7F4EE]/70'
                                    }`}
                                >
                                    <span>{cat}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Animated Product Grid Container */}
                <div className="w-full">
                    <AnimatePresence mode="wait" initial={false}>
                        <m.div
                            key={selectedCategory}
                            variants={gridContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredProducts.map((product) => {
                                return (
                                    <m.article
                                        key={product.id}
                                        variants={cardItemVariants}
                                        whileHover={{ y: -8, transition: { duration: 0.25, ease: smoothEase } }}
                                        className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-luxury hover:shadow-luxury-hover transition-shadow duration-300 flex flex-col group will-change-transform"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                width={800}
                                                height={600}
                                                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                                                loading="lazy"
                                                decoding="async"
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
                                                <h3 className="font-serif text-xl font-bold text-[#1B382B] mb-2 group-hover:text-[#C8A951] transition-colors duration-300">
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

                                                <m.button
                                                    type="button"
                                                    onClick={() => openOrderModal(product)}
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    transition={{ duration: 0.2, ease: smoothEase }}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1B382B] hover:bg-[#264E3D] text-[#FDFBF7] text-xs font-semibold shadow-xs hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A951] cursor-pointer"
                                                    aria-label={`Pesan ${product.name}`}
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5 text-[#DFCA86] flex-shrink-0" />
                                                    <span>Pesan Sekarang</span>
                                                </m.button>
                                            </div>
                                        </div>
                                    </m.article>
                                );
                            })}
                        </m.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Manual Product Order Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeOrderModal}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1E17]/65 backdrop-blur-xs overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Form pemesanan ${selectedProduct.name}`}
                    >
                        <m.div
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.97 }}
                            transition={{ duration: 0.22, ease: smoothEase }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl rounded-2xl bg-[#FDFBF7] text-[#2C2724] border border-[#E8E2D5] shadow-2xl overflow-hidden my-auto"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 bg-[#1B382B] text-[#FDFBF7] flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#DFCA86] font-semibold">
                                        Form Pemesanan Manual
                                    </p>
                                    <h3 className="font-serif text-lg sm:text-xl font-bold">
                                        {selectedProduct.name}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeOrderModal}
                                    className="w-8 h-8 rounded-full bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FDFBF7] flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Tutup form pemesanan"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                {/* Selected Product Summary */}
                                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] mb-5">
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#F7F4EE]"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9A7D2E]">
                                            {selectedProduct.category}
                                        </span>
                                        <p className="font-serif font-bold text-[#1B382B] truncate">
                                            {selectedProduct.name}
                                        </p>
                                        <p className="text-xs text-[#6E675F]">
                                            Harga satuan: {formatRupiah(selectedProduct.price_from)}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[11px] text-[#6E675F] block">Estimasi Total</span>
                                        <span className="font-serif text-base font-bold text-[#1B382B]">
                                            {formatRupiah(
                                                selectedProduct.price_from *
                                                    Math.max(1, Number(data.quantity || 1))
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {submittedMessage ? (
                                    <div className="p-5 rounded-xl bg-[#1B382B]/5 border border-[#1B382B]/20 text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-[#1B382B] text-[#DFCA86] mx-auto flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-serif text-lg font-bold text-[#1B382B]">
                                            Pesanan Terkirim!
                                        </h4>
                                        <p className="text-sm text-[#6E675F] leading-relaxed">
                                            {submittedMessage}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={closeOrderModal}
                                            className="px-6 py-2.5 rounded-full bg-[#1B382B] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider hover:bg-[#264E3D] cursor-pointer"
                                        >
                                            Selesai
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                                        {/* Honeypot */}
                                        <div className="hidden" aria-hidden="true">
                                            <input
                                                type="text"
                                                name="website"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={data.website}
                                                onChange={(e) => setData('website', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="order_customer_name"
                                                    className="block text-xs font-semibold text-[#1B382B] mb-1.5"
                                                >
                                                    Nama Lengkap *
                                                </label>
                                                <input
                                                    id="order_customer_name"
                                                    type="text"
                                                    required
                                                    value={data.customer_name}
                                                    onChange={(e) => setData('customer_name', e.target.value)}
                                                    placeholder="Contoh: Ibu Rina Wijaya"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] text-sm text-[#2C2724] placeholder:text-[#9C9489] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                                />
                                                {errors.customer_name && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.customer_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="order_customer_whatsapp"
                                                    className="block text-xs font-semibold text-[#1B382B] mb-1.5"
                                                >
                                                    Nomor WhatsApp / Telepon *
                                                </label>
                                                <input
                                                    id="order_customer_whatsapp"
                                                    type="tel"
                                                    required
                                                    value={data.customer_whatsapp}
                                                    onChange={(e) => setData('customer_whatsapp', e.target.value)}
                                                    placeholder="0812xxxxxxxx"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] text-sm text-[#2C2724] placeholder:text-[#9C9489] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                                />
                                                {errors.customer_whatsapp && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.customer_whatsapp}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="order_quantity"
                                                    className="block text-xs font-semibold text-[#1B382B] mb-1.5"
                                                >
                                                    Jumlah Paket *
                                                </label>
                                                <input
                                                    id="order_quantity"
                                                    type="number"
                                                    min={1}
                                                    max={10000}
                                                    required
                                                    value={data.quantity}
                                                    onChange={(e) => setData('quantity', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] text-sm text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                                />
                                                {errors.quantity && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="order_delivery_date"
                                                    className="block text-xs font-semibold text-[#1B382B] mb-1.5"
                                                >
                                                    Tanggal Kirim
                                                </label>
                                                <input
                                                    id="order_delivery_date"
                                                    type="date"
                                                    value={data.delivery_date}
                                                    onChange={(e) => setData('delivery_date', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] text-sm text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                                />
                                                {errors.delivery_date && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.delivery_date}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="order_customer_email"
                                                    className="block text-xs font-semibold text-[#1B382B] mb-1.5"
                                                >
                                                    Email (Opsional)
                                                </label>
                                                <input
                                                    id="order_customer_email"
                                                    type="email"
                                                    value={data.customer_email}
                                                    onChange={(e) => setData('customer_email', e.target.value)}
                                                    placeholder="nama@email.com"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] text-sm text-[#2C2724] placeholder:text-[#9C9489] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                                />
                                                {errors.customer_email && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.customer_email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="order_shipping_address"
                                                className="block text-xs font-semibold text-[#1B382B] mb-1.5"
                                            >
                                                Alamat Pengiriman Lengkap *
                                            </label>
                                            <textarea
                                                id="order_shipping_address"
                                                rows={2}
                                                required
                                                value={data.shipping_address}
                                                onChange={(e) => setData('shipping_address', e.target.value)}
                                                placeholder="Nama jalan, nomor rumah, kecamatan, kota, dan kode pos"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] text-sm text-[#2C2724] placeholder:text-[#9C9489] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                            />
                                            {errors.shipping_address && (
                                                <p className="text-xs text-red-600 mt-1">{errors.shipping_address}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="order_greeting_card_note"
                                                className="block text-xs font-semibold text-[#1B382B] mb-1.5"
                                            >
                                                Pesan Kartu Ucapan / Catatan Khusus
                                            </label>
                                            <textarea
                                                id="order_greeting_card_note"
                                                rows={2}
                                                value={data.greeting_card_note}
                                                onChange={(e) => setData('greeting_card_note', e.target.value)}
                                                placeholder="Tuliskan ucapan untuk penerima atau permintaan pita/kemasan..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] text-sm text-[#2C2724] placeholder:text-[#9C9489] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                            />
                                            {errors.greeting_card_note && (
                                                <p className="text-xs text-red-600 mt-1">{errors.greeting_card_note}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={closeOrderModal}
                                                className="px-5 py-2.5 rounded-full border border-[#E8E2D5] text-xs font-semibold text-[#6E675F] hover:text-[#1B382B] hover:bg-[#F7F4EE] cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1B382B] hover:bg-[#264E3D] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5 text-[#DFCA86]" />
                                                <span>{processing ? 'Mengirim...' : 'Kirim Pesanan'}</span>
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </section>
    );
};
