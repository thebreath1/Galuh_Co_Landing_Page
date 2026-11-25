import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { m, AnimatePresence, type Variants } from 'motion/react';
import {
    Check,
    CheckCircle2,
    ExternalLink,
    Loader2,
    LocateFixed,
    MapPin,
    Percent,
    Radio,
    ShoppingBag,
    Sparkles,
    Tag,
    Wallet,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { EmailQuickDomains } from '@/components/EmailQuickDomains';
import { InteractiveMapPicker } from '@/components/InteractiveMapPicker';
import { MAX_PHONE_DIGITS, sanitizePhoneInput } from '@/lib/input-helpers';
import { ORDER_PAYMENT_METHODS, formatPaymentMethodLabel } from '@/lib/payment-methods';
import { haversineMeters, reverseGeocodeCoords } from '@/lib/reverse-geocode';
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

const GREETING_TEMPLATES = [
    {
        label: 'Idul Fitri',
        category: 'Lebaran',
        text: 'Selamat Hari Raya Idul Fitri. Mohon maaf lahir dan batin, semoga kehangatan dan keberkahan senantiasa menyertai Anda beserta keluarga.',
    },
    {
        label: 'Natal & Tahun Baru',
        category: 'Natal',
        text: 'Merry Christmas & Happy New Year! Semoga damai, sukacita, dan kehangatan selalu hadir di tengah keluarga Anda.',
    },
    {
        label: 'Apresiasi Corporate',
        category: 'Corporate',
        text: 'Terima kasih atas kepercayaan dan kerja sama yang terjalin baik selama ini. Semoga kemitraan kita semakin sukses dan bertumbuh.',
    },
    {
        label: 'Pernikahan',
        category: 'Wedding',
        text: 'Selamat menempuh hidup baru! Semoga perjalanan cinta kalian selalu dipenuhi kebahagiaan, keharmonisan, dan berkah selamanya.',
    },
    {
        label: 'Ucapan Hangat',
        category: 'Umum',
        text: 'Bingkisan hangat sebagai wujud terima kasih dan penghormatan tulus. Semoga hari Anda selalu dipenuhi kebahagiaan.',
    },
    {
        label: 'Pita & Kemasan Rapi',
        category: 'Catatan',
        text: 'Mohon kemas rapi dengan pita satin khas GALUH & CO. dan sertakan kartu ucapan elegan.',
    },
] as const;

const DEFAULT_STUDIO_COORDS = {
    lat: -7.3257,
    lon: 108.3534,
};

export const CollectionSection: React.FC<CollectionSectionProps> = ({ products, settings }) => {
    const categories = ['Semua', 'Lebaran', 'Natal', 'Corporate', 'Wedding'];
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [isResolvingAddress, setIsResolvingAddress] = useState(false);
    const [locationState, setLocationState] = useState<{
        status: 'idle' | 'locating' | 'tracking' | 'error';
        coords?: { lat: number; lon: number; accuracy: number };
        error?: string;
    }>({ status: 'idle' });
    const watchIdRef = useRef<number | null>(null);
    const lastGeocodedRef = useRef<{ lat: number; lon: number } | null>(null);
    const lastAccuracyRef = useRef<number | null>(null);
    const manualAddressEditedRef = useRef<boolean>(false);
    const geocodeAbortRef = useRef<AbortController | null>(null);
    const emailInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        product_id: 0,
        customer_name: '',
        customer_whatsapp: '',
        customer_email: '',
        quantity: '1',
        delivery_date: '',
        shipping_address: '',
        greeting_card_note: '',
        payment_method: 'transfer_bca',
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

    const highlightedPromo = products.reduce<Product['active_promo']>(
        (best, item) => {
            if (!item.active_promo) return best;
            if (!best || item.active_promo.discount_percent > best.discount_percent) {
                return item.active_promo;
            }
            return best;
        },
        null
    );

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const stopLocationTracking = (resetCoords = false) => {
        if (watchIdRef.current !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        geocodeAbortRef.current?.abort();
        geocodeAbortRef.current = null;
        setLocationState((prev) => ({
            status: 'idle',
            coords: resetCoords ? undefined : prev.coords,
            error: undefined,
        }));
    };

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            geocodeAbortRef.current?.abort();
        };
    }, []);

    const startRealTimeLocation = () => {
        if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
            setLocationState({
                status: 'error',
                error: 'Browser tidak mendukung fitur deteksi lokasi GPS.',
            });
            return;
        }

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        manualAddressEditedRef.current = false;
        lastGeocodedRef.current = null;
        lastAccuracyRef.current = null;
        setLocationState({ status: 'locating' });

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const accuracy = Math.round(position.coords.accuracy);

                setLocationState({
                    status: 'tracking',
                    coords: { lat, lon, accuracy },
                });
                setShowMapPicker(true);

                const movedEnough =
                    !lastGeocodedRef.current ||
                    haversineMeters(
                        lastGeocodedRef.current.lat,
                        lastGeocodedRef.current.lon,
                        lat,
                        lon
                    ) >= 15;
                const accuracyImproved =
                    lastAccuracyRef.current === null || accuracy < lastAccuracyRef.current * 0.7;

                if (!movedEnough && !accuracyImproved) return;

                const isFirstFix = !lastGeocodedRef.current;
                lastGeocodedRef.current = { lat, lon };
                lastAccuracyRef.current = accuracy;

                geocodeAbortRef.current?.abort();
                const controller = new AbortController();
                geocodeAbortRef.current = controller;

                try {
                    setIsResolvingAddress(true);
                    const resolvedAddress = await reverseGeocodeCoords(lat, lon, controller.signal);
                    if (controller.signal.aborted) return;

                    if (!manualAddressEditedRef.current) {
                        setData('shipping_address', resolvedAddress);
                        if (isFirstFix) {
                            if (accuracy > 250) {
                                toast.info(
                                    `Perkiraan lokasi jaringan (±${accuracy}m). Geser pin di peta atau cari nama jalan agar presisi.`
                                );
                            } else {
                                toast.success('Alamat berhasil diisi otomatis dari lokasi real-time Anda.');
                            }
                        }
                    }
                } catch (err) {
                    if ((err as DOMException)?.name !== 'AbortError') {
                        toast.error('Gagal menerjemahkan koordinat. Silakan pilih titik di peta atau ketik manual.');
                    }
                } finally {
                    if (!controller.signal.aborted) {
                        setIsResolvingAddress(false);
                    }
                }
            },
            (err) => {
                stopLocationTracking(true);
                const message =
                    err.code === err.PERMISSION_DENIED
                        ? 'Izin lokasi ditolak. Aktifkan akses lokasi di browser untuk mengisi alamat otomatis.'
                        : err.code === err.TIMEOUT
                          ? 'Waktu pencarian GPS habis. Coba lagi atau ketik alamat secara manual.'
                          : 'Lokasi saat ini tidak tersedia. Pastikan GPS/Wi-Fi perangkat aktif.';
                setLocationState({ status: 'error', error: message });
                toast.error(message);
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0,
            }
        );
    };

    const handleSelectMapLocation = async (lat: number, lon: number, prefilledAddress?: string) => {
        stopLocationTracking(false);
        manualAddressEditedRef.current = false;
        lastGeocodedRef.current = { lat, lon };
        lastAccuracyRef.current = 5;
        setLocationState({
            status: 'idle',
            coords: { lat, lon, accuracy: 5 },
            error: undefined,
        });

        if (prefilledAddress) {
            setData('shipping_address', prefilledAddress);
            toast.success('Alamat dipilih dari hasil pencarian peta.');
            return;
        }

        geocodeAbortRef.current?.abort();
        const controller = new AbortController();
        geocodeAbortRef.current = controller;

        try {
            setIsResolvingAddress(true);
            const resolvedAddress = await reverseGeocodeCoords(lat, lon, controller.signal);
            if (controller.signal.aborted) return;
            setData('shipping_address', resolvedAddress);
            toast.success('Alamat diperbarui sesuai pin peta.');
        } catch (err) {
            if ((err as DOMException)?.name !== 'AbortError') {
                toast.error('Gagal mengambil nama jalan untuk titik ini. Silakan lengkapi alamat manual.');
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsResolvingAddress(false);
            }
        }
    };

    const openOrderModal = (product: Product) => {
        stopLocationTracking(true);
        manualAddressEditedRef.current = false;
        lastGeocodedRef.current = null;
        lastAccuracyRef.current = null;
        setShowMapPicker(false);
        setIsResolvingAddress(false);
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
            payment_method: 'transfer_bca',
            website: '',
        });
    };

    const closeOrderModal = () => {
        stopLocationTracking(true);
        setShowMapPicker(false);
        setIsResolvingAddress(false);
        lastAccuracyRef.current = null;
        setSelectedProduct(null);
        setSubmittedMessage(null);
        clearErrors();
    };

    const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        const chosenPaymentLabel = formatPaymentMethodLabel(data.payment_method);

        transform((current) => ({
            ...current,
            product_id: selectedProduct.id,
            quantity: Math.max(1, Number(current.quantity || 1)),
        }));

        post(storeOrder.url(), {
            preserveScroll: true,
            onSuccess: () => {
                stopLocationTracking(true);
                setShowMapPicker(false);
                setIsResolvingAddress(false);
                lastAccuracyRef.current = null;
                const msg = `Pesanan untuk "${selectedProduct.name}" (${chosenPaymentLabel}) berhasil dikirim dan sedang menunggu ACC dari admin.`;
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
            className="py-20 md:py-28 bg-[#F2EBDC] relative"
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
                    <p className="text-xs uppercase tracking-[0.25em] text-[#725C30] font-semibold mb-3">
                        {eyebrow}
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#16233B] font-bold tracking-tight mb-4">
                        {title}
                    </h2>
                    <div className="w-12 h-0.5 bg-[#A88B54] mx-auto mb-5" />
                    <p className="text-[#6E675D] text-base">
                        {description}
                    </p>
                </m.div>

                {highlightedPromo && (
                    <div className="mb-8 flex justify-center">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-[#A88B54]/45 bg-[#16233B] px-5 py-2 text-xs text-[#F2EBDC] shadow-sm">
                            <span className="inline-flex items-center gap-1 font-semibold text-[#C5AA74]">
                                <Tag className="w-3.5 h-3.5" />
                                Promo Otomatis Aktif:
                            </span>
                            <span className="font-semibold">{highlightedPromo.promo_name}</span>
                            <span className="rounded-full bg-[#A88B54]/25 px-2 py-0.5 text-[11px] font-bold text-[#C5AA74]">
                                Diskon s/d {highlightedPromo.discount_percent}%
                            </span>
                            <span className="text-[11px] text-[#D8CEBA]">
                                s/d{' '}
                                {new Date(highlightedPromo.ends_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                )}

                {/* Category Filters */}
                <div className="flex justify-center mb-14">
                    <div
                        role="tablist"
                        aria-label="Filter kategori hampers"
                        className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#FFFFFF]/85 backdrop-blur-xs border border-[#D8CEBA] shadow-xs"
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
                                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] cursor-pointer ${
                                        isActive
                                            ? 'bg-[#16233B] text-[#F2EBDC] shadow-sm'
                                            : 'text-[#6E675D] hover:text-[#16233B] hover:bg-[#EAE1CE]/70'
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
                                        className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#D8CEBA] shadow-luxury hover:shadow-luxury-hover transition-shadow duration-300 flex flex-col group will-change-transform"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-[4/3] bg-[#EAE1CE] overflow-hidden">
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
                                                <span className="px-3 py-1 rounded-full bg-[#16233B]/90 backdrop-blur-xs text-[#C5AA74] text-[11px] font-semibold tracking-wider uppercase border border-[#A88B54]/30">
                                                    {product.category}
                                                </span>
                                            </div>
                                            {product.active_promo && (
                                                <div className="absolute top-3.5 right-3.5">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#16233B] text-[#F2EBDC] text-[11px] font-bold border border-[#A88B54] shadow-md">
                                                        <Percent className="w-3 h-3 text-[#C5AA74]" />
                                                        <span>-{product.active_promo.discount_percent}%</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Content */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-serif text-xl font-bold text-[#16233B] mb-2 group-hover:text-[#725C30] transition-colors duration-300">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-[#6E675D] leading-relaxed mb-4">
                                                    {product.short_description}
                                                </p>

                                                {/* Contents list chips */}
                                                {product.contents && product.contents.length > 0 && (
                                                    <div className="mb-5 space-y-1.5 pt-3 border-t border-[#D8CEBA]/70">
                                                        <p className="text-[11px] font-semibold text-[#16233B] uppercase tracking-wider flex items-center gap-1.5">
                                                            <Sparkles className="w-3 h-3 text-[#A88B54]" />
                                                            <span>Daftar Isi Paket:</span>
                                                        </p>
                                                        <ul className="text-xs text-[#6E675D] space-y-1 pl-1">
                                                            {product.contents.slice(0, 3).map((item, idx) => (
                                                                <li key={idx} className="flex items-center gap-2">
                                                                    <Check className="w-3 h-3 text-[#A88B54] flex-shrink-0" />
                                                                    <span className="truncate">{item}</span>
                                                                </li>
                                                            ))}
                                                            {product.contents.length > 3 && (
                                                                <li className="text-[11px] text-[#725C30] font-medium pl-5">
                                                                    + {product.contents.length - 3} item eksklusif lainnya
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & CTA Button */}
                                            <div className="pt-4 border-t border-[#D8CEBA] flex items-center justify-between gap-3">
                                                <div>
                                                    <span className="text-[11px] text-[#6E675D] uppercase tracking-wider block">
                                                        {product.active_promo ? product.active_promo.promo_name : 'Mulai Dari'}
                                                    </span>
                                                    {product.active_promo ? (
                                                        <div className="flex flex-wrap items-baseline gap-1.5">
                                                            <span className="font-serif text-base sm:text-lg font-bold text-[#725C30]">
                                                                {formatRupiah(product.active_promo.discounted_price)}
                                                            </span>
                                                            <span className="text-xs text-[#6E675D] line-through">
                                                                {formatRupiah(product.price_from)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-serif text-base sm:text-lg font-bold text-[#16233B]">
                                                            {formatRupiah(product.price_from)}
                                                        </span>
                                                    )}
                                                </div>

                                                <m.button
                                                    type="button"
                                                    onClick={() => openOrderModal(product)}
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    transition={{ duration: 0.2, ease: smoothEase }}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#16233B] hover:bg-[#203252] text-[#F2EBDC] text-xs font-semibold shadow-xs hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#A88B54] cursor-pointer"
                                                    aria-label={`Pesan ${product.name}`}
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5 text-[#C5AA74] flex-shrink-0" />
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1322]/65 backdrop-blur-xs overflow-y-auto"
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
                            className="w-full max-w-xl rounded-2xl bg-[#F2EBDC] text-[#1E2430] border border-[#D8CEBA] shadow-2xl overflow-hidden my-auto"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 bg-[#16233B] text-[#F2EBDC] flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#C5AA74] font-semibold">
                                        Form Pemesanan Manual
                                    </p>
                                    <h3 className="font-serif text-lg sm:text-xl font-bold">
                                        {selectedProduct.name}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeOrderModal}
                                    className="w-8 h-8 rounded-full bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#F2EBDC] flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Tutup form pemesanan"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                {/* Selected Product Summary */}
                                {(() => {
                                    const promo = selectedProduct.active_promo;
                                    const effectiveUnit = promo ? promo.discounted_price : selectedProduct.price_from;
                                    const qty = Math.max(1, Number(data.quantity || 1));
                                    const effectiveTotal = effectiveUnit * qty;
                                    const originalTotal = selectedProduct.price_from * qty;
                                    const savingsTotal = Math.max(0, originalTotal - effectiveTotal);

                                    return (
                                        <div className="mb-5 space-y-2">
                                            <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA]">
                                                <img
                                                    src={selectedProduct.image}
                                                    alt={selectedProduct.name}
                                                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#EAE1CE]"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#725C30]">
                                                            {selectedProduct.category}
                                                        </span>
                                                        {promo && (
                                                            <span className="rounded-full bg-[#16233B] px-2 py-0.5 text-[10px] font-bold text-[#C5AA74]">
                                                                -{promo.discount_percent}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-serif font-bold text-[#16233B] truncate">
                                                        {selectedProduct.name}
                                                    </p>
                                                    <p className="text-xs text-[#6E675D]">
                                                        Harga satuan:{' '}
                                                        {promo ? (
                                                            <>
                                                                <span className="font-semibold text-[#725C30]">
                                                                    {formatRupiah(effectiveUnit)}
                                                                </span>{' '}
                                                                <span className="line-through">
                                                                    {formatRupiah(selectedProduct.price_from)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            formatRupiah(selectedProduct.price_from)
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-[11px] text-[#6E675D] block">Estimasi Total</span>
                                                    {promo && (
                                                        <span className="block text-[11px] text-[#6E675D] line-through">
                                                            {formatRupiah(originalTotal)}
                                                        </span>
                                                    )}
                                                    <span className="font-serif text-base font-bold text-[#16233B]">
                                                        {formatRupiah(effectiveTotal)}
                                                    </span>
                                                </div>
                                            </div>
                                            {promo && savingsTotal > 0 && (
                                                <div className="flex items-center justify-between gap-2 rounded-lg border border-[#A88B54]/45 bg-[#EAE1CE]/75 px-3 py-1.5 text-[11px] text-[#16233B]">
                                                    <span className="inline-flex items-center gap-1.5 font-medium">
                                                        <Tag className="w-3 h-3 text-[#725C30]" />
                                                        Promo otomatis: <strong>{promo.promo_name}</strong>
                                                    </span>
                                                    <span className="font-semibold text-[#725C30]">
                                                        Hemat {formatRupiah(savingsTotal)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {submittedMessage ? (
                                    <div className="p-5 rounded-xl bg-[#16233B]/5 border border-[#16233B]/20 text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-[#16233B] text-[#C5AA74] mx-auto flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-serif text-lg font-bold text-[#16233B]">
                                            Pesanan Terkirim!
                                        </h4>
                                        <p className="text-sm text-[#6E675D] leading-relaxed">
                                            {submittedMessage}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={closeOrderModal}
                                            className="px-6 py-2.5 rounded-full bg-[#16233B] text-[#F2EBDC] text-xs font-semibold uppercase tracking-wider hover:bg-[#203252] cursor-pointer"
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
                                                    className="block text-xs font-semibold text-[#16233B] mb-1.5"
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
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA] text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                                                />
                                                {errors.customer_name && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.customer_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                    <label
                                                        htmlFor="order_customer_whatsapp"
                                                        className="block text-xs font-semibold text-[#16233B]"
                                                    >
                                                        Nomor WhatsApp / Telepon *
                                                    </label>
                                                    <span className="text-[11px] font-medium text-[#6E675D]">
                                                        {data.customer_whatsapp.length}/{MAX_PHONE_DIGITS} digit
                                                    </span>
                                                </div>
                                                <input
                                                    id="order_customer_whatsapp"
                                                    type="tel"
                                                    inputMode="numeric"
                                                    maxLength={MAX_PHONE_DIGITS}
                                                    required
                                                    value={data.customer_whatsapp}
                                                    onChange={(e) =>
                                                        setData('customer_whatsapp', sanitizePhoneInput(e.target.value))
                                                    }
                                                    placeholder="0812xxxxxxxx (maks. 12 angka)"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA] text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                                                />
                                                {errors.customer_whatsapp && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.customer_whatsapp}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="order_quantity"
                                                    className="block text-xs font-semibold text-[#16233B] mb-1.5"
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
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA] text-sm text-[#1E2430] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                                                />
                                                {errors.quantity && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="order_delivery_date"
                                                    className="block text-xs font-semibold text-[#16233B] mb-1.5"
                                                >
                                                    Tanggal Kirim
                                                </label>
                                                <input
                                                    id="order_delivery_date"
                                                    type="date"
                                                    value={data.delivery_date}
                                                    onChange={(e) => setData('delivery_date', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA] text-sm text-[#1E2430] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                                                />
                                                {errors.delivery_date && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.delivery_date}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="order_customer_email"
                                                className="block text-xs font-semibold text-[#16233B] mb-1.5"
                                            >
                                                Email (Opsional)
                                            </label>
                                            <input
                                                ref={emailInputRef}
                                                id="order_customer_email"
                                                type="email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                placeholder="Ketik nama lalu pilih akhiran email di bawah..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA] text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                                            />
                                            <EmailQuickDomains
                                                value={data.customer_email}
                                                inputRef={emailInputRef}
                                                onSelect={(nextEmail) => setData('customer_email', nextEmail)}
                                            />
                                            {errors.customer_email && (
                                                <p className="text-xs text-red-600 mt-1">{errors.customer_email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                                <label
                                                    htmlFor="order_shipping_address"
                                                    className="block text-xs font-semibold text-[#16233B]"
                                                >
                                                    Alamat Pengiriman Lengkap *
                                                </label>

                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {locationState.status === 'locating' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => stopLocationTracking(false)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16233B]/10 text-[#16233B] text-[11px] font-semibold cursor-pointer"
                                                        >
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            <span>Mencari GPS...</span>
                                                        </button>
                                                    ) : locationState.status === 'tracking' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => stopLocationTracking(false)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16233B] text-[#F2EBDC] text-[11px] font-semibold cursor-pointer hover:bg-[#203252]"
                                                        >
                                                            <Radio className="w-3 h-3 text-[#C5AA74] animate-pulse" />
                                                            <span>
                                                                Real-Time Aktif
                                                                {locationState.coords
                                                                    ? ` (±${locationState.coords.accuracy}m)`
                                                                    : ''}{' '}
                                                                • Hentikan
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={startRealTimeLocation}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#D8CEBA] hover:border-[#A88B54] hover:bg-[#EAE1CE]/60 text-[#16233B] text-[11px] font-semibold transition-colors cursor-pointer"
                                                        >
                                                            <LocateFixed className="w-3 h-3 text-[#725C30]" />
                                                            <span>Lokasi Saat Ini</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowMapPicker((prev) => !prev)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer ${
                                                            showMapPicker
                                                                ? 'bg-[#16233B] border-[#16233B] text-[#F2EBDC]'
                                                                : 'bg-[#FFFFFF] border-[#D8CEBA] hover:border-[#A88B54] hover:bg-[#EAE1CE]/60 text-[#16233B]'
                                                        }`}
                                                    >
                                                        <MapPin
                                                            className={`w-3 h-3 ${
                                                                showMapPicker ? 'text-[#C5AA74]' : 'text-[#725C30]'
                                                            }`}
                                                        />
                                                        <span>{showMapPicker ? 'Tutup Peta' : 'Pilih di Peta'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea
                                                id="order_shipping_address"
                                                rows={2}
                                                required
                                                value={data.shipping_address}
                                                onChange={(e) => {
                                                    manualAddressEditedRef.current = true;
                                                    setData('shipping_address', e.target.value);
                                                }}
                                                placeholder="Nama jalan, nomor rumah, kecamatan, kota, dan kode pos"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA] text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                                            />
                                            {errors.shipping_address && (
                                                <p className="text-xs text-red-600 mt-1">{errors.shipping_address}</p>
                                            )}
                                            {locationState.error && (
                                                <p className="text-[11px] text-red-600 mt-1">{locationState.error}</p>
                                            )}
                                            {locationState.coords && (
                                                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#EAE1CE]/65 border border-[#D8CEBA] px-3 py-1.5 text-[11px] text-[#6E675D]">
                                                    <span>
                                                        Koordinat: {locationState.coords.lat.toFixed(5)},{' '}
                                                        {locationState.coords.lon.toFixed(5)} (akurasi ±
                                                        {locationState.coords.accuracy}m)
                                                    </span>
                                                    <a
                                                        href={`https://www.google.com/maps?q=${locationState.coords.lat},${locationState.coords.lon}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 font-semibold text-[#16233B] hover:text-[#725C30] underline"
                                                    >
                                                        <span>Buka Google Maps</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}
                                            {showMapPicker && (
                                                <div className="mt-2.5">
                                                    <InteractiveMapPicker
                                                        lat={locationState.coords?.lat ?? DEFAULT_STUDIO_COORDS.lat}
                                                        lon={locationState.coords?.lon ?? DEFAULT_STUDIO_COORDS.lon}
                                                        accuracy={locationState.coords?.accuracy}
                                                        isLoadingAddress={isResolvingAddress}
                                                        onSelectLocation={handleSelectMapLocation}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <label
                                                    htmlFor="order_greeting_card_note"
                                                    className="block text-xs font-semibold text-[#16233B]"
                                                >
                                                    Pesan Kartu Ucapan / Catatan Khusus
                                                </label>
                                                {data.greeting_card_note && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('greeting_card_note', '')}
                                                        className="text-[11px] font-medium text-[#725C30] hover:text-[#16233B] underline cursor-pointer"
                                                    >
                                                        Kosongkan
                                                    </button>
                                                )}
                                            </div>
                                            <textarea
                                                id="order_greeting_card_note"
                                                rows={3}
                                                value={data.greeting_card_note}
                                                onChange={(e) => setData('greeting_card_note', e.target.value)}
                                                placeholder="Tuliskan ucapan untuk penerima atau pilih template cepat di bawah..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8CEBA] text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                                            />
                                            {errors.greeting_card_note && (
                                                <p className="text-xs text-red-600 mt-1">{errors.greeting_card_note}</p>
                                            )}

                                            {/* Quick Greeting Templates */}
                                            <div className="mt-2.5">
                                                <p className="text-[11px] text-[#6E675D] mb-1.5">
                                                    Template cepat (klik untuk langsung mengisi):
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {[...GREETING_TEMPLATES]
                                                        .sort((a, b) => {
                                                            const aMatch =
                                                                a.category.toLowerCase() ===
                                                                selectedProduct.category.toLowerCase();
                                                            const bMatch =
                                                                b.category.toLowerCase() ===
                                                                selectedProduct.category.toLowerCase();
                                                            return Number(bMatch) - Number(aMatch);
                                                        })
                                                        .map((tpl) => {
                                                            const isSelected = data.greeting_card_note === tpl.text;
                                                            return (
                                                                <button
                                                                    key={tpl.label}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setData('greeting_card_note', tpl.text)
                                                                    }
                                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] ${
                                                                        isSelected
                                                                            ? 'bg-[#16233B] text-[#F2EBDC] border-[#16233B]'
                                                                            : 'bg-[#FFFFFF] text-[#16233B] border-[#D8CEBA] hover:border-[#A88B54] hover:bg-[#EAE1CE]/60'
                                                                    }`}
                                                                >
                                                                    {tpl.label}
                                                                </button>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fast 1-Click Payment Method Selector */}
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#16233B]">
                                                    <Wallet className="w-3.5 h-3.5 text-[#725C30]" />
                                                    <span>Metode Pembayaran *</span>
                                                </label>
                                                <span className="text-[11px] text-[#6E675D]">
                                                    Dibayar setelah di-ACC admin
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {ORDER_PAYMENT_METHODS.map((method) => {
                                                    const active = data.payment_method === method.id;
                                                    return (
                                                        <button
                                                            key={method.id}
                                                            type="button"
                                                            onClick={() => setData('payment_method', method.id)}
                                                            className={`text-left rounded-xl border px-3 py-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] ${
                                                                active
                                                                    ? 'bg-[#16233B] border-[#16233B] text-[#F2EBDC] shadow-xs'
                                                                    : 'bg-[#FFFFFF] border-[#D8CEBA] text-[#16233B] hover:border-[#A88B54] hover:bg-[#EAE1CE]/50'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-1.5">
                                                                <span className="text-xs font-semibold truncate">
                                                                    {method.shortLabel}
                                                                </span>
                                                                <span
                                                                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                                                                        active
                                                                            ? 'bg-[#A88B54]/25 text-[#C5AA74]'
                                                                            : 'bg-[#EAE1CE] text-[#725C30]'
                                                                    }`}
                                                                >
                                                                    {method.badge}
                                                                </span>
                                                            </div>
                                                            <p
                                                                className={`text-[10px] mt-0.5 truncate ${
                                                                    active ? 'text-[#D8CEBA]' : 'text-[#6E675D]'
                                                                }`}
                                                            >
                                                                {method.description}
                                                            </p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {(() => {
                                                const currentMethod = ORDER_PAYMENT_METHODS.find(
                                                    (m) => m.id === data.payment_method
                                                );
                                                if (!currentMethod) return null;
                                                return (
                                                    <p className="mt-2 rounded-lg border border-[#D8CEBA] bg-[#EAE1CE]/65 px-3 py-2 text-[11px] text-[#6E675D] leading-relaxed">
                                                        <span className="font-semibold text-[#16233B]">
                                                            {currentMethod.label}:{' '}
                                                        </span>
                                                        {currentMethod.instruction}
                                                    </p>
                                                );
                                            })()}
                                            {errors.payment_method && (
                                                <p className="text-xs text-red-600 mt-1">{errors.payment_method}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={closeOrderModal}
                                                className="px-5 py-2.5 rounded-full border border-[#D8CEBA] text-xs font-semibold text-[#6E675D] hover:text-[#16233B] hover:bg-[#EAE1CE] cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#16233B] hover:bg-[#203252] text-[#F2EBDC] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5 text-[#C5AA74]" />
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
