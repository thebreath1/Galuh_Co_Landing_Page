import React, { useEffect, useRef, useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { m, AnimatePresence, type Variants } from 'motion/react';
import {
    Check,
    CheckCircle2,
    ExternalLink,
    Loader2,
    LocateFixed,
    Lock,
    LogIn,
    MapPin,
    Percent,
    Radio,
    ShoppingBag,
    Sparkles,
    Tag,
    UserCheck,
    UserPlus,
    Wallet,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { EmailQuickDomains } from '@/components/EmailQuickDomains';
import { InteractiveMapPicker } from '@/components/InteractiveMapPicker';
import { MAX_PHONE_DIGITS, sanitizePhoneInput } from '@/lib/input-helpers';
import {
    ORDER_PAYMENT_METHODS,
    formatPaymentMethodLabel,
} from '@/lib/payment-methods';
import { haversineMeters, reverseGeocodeCoords } from '@/lib/reverse-geocode';
import { login, register } from '@/routes';
import { mine as ordersMine, store as storeOrder } from '@/routes/orders';
import type { User } from '@/types';
import type { Product, SiteSettings } from '@/types/landing';
import { fadeUp, viewportConfig, smoothEase } from '@/lib/motion';

const PENDING_ORDER_STORAGE_KEY = 'galuh_pending_order_product_id';

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

export const CollectionSection: React.FC<CollectionSectionProps> = ({
    products,
    settings,
}) => {
    const { auth } = usePage<{ auth?: { user?: User | null } }>().props;
    const user = auth?.user ?? null;
    const categories = ['Semua', 'Lebaran', 'Natal', 'Corporate', 'Wedding'];
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [submittedMessage, setSubmittedMessage] = useState<string | null>(
        null,
    );
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

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm({
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
            : products.filter(
                  (p) =>
                      p.category.trim().toLowerCase() ===
                      selectedCategory.toLowerCase(),
              );

    const highlightedPromo = products.reduce<Product['active_promo']>(
        (best, item) => {
            if (!item.active_promo) return best;
            if (
                !best ||
                item.active_promo.discount_percent > best.discount_percent
            ) {
                return item.active_promo;
            }
            return best;
        },
        null,
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
        if (
            watchIdRef.current !== null &&
            typeof navigator !== 'undefined' &&
            'geolocation' in navigator
        ) {
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
            if (
                watchIdRef.current !== null &&
                typeof navigator !== 'undefined' &&
                'geolocation' in navigator
            ) {
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
                        lon,
                    ) >= 15;
                const accuracyImproved =
                    lastAccuracyRef.current === null ||
                    accuracy < lastAccuracyRef.current * 0.7;

                if (!movedEnough && !accuracyImproved) return;

                const isFirstFix = !lastGeocodedRef.current;
                lastGeocodedRef.current = { lat, lon };
                lastAccuracyRef.current = accuracy;

                geocodeAbortRef.current?.abort();
                const controller = new AbortController();
                geocodeAbortRef.current = controller;

                try {
                    setIsResolvingAddress(true);
                    const resolvedAddress = await reverseGeocodeCoords(
                        lat,
                        lon,
                        controller.signal,
                    );
                    if (controller.signal.aborted) return;

                    if (!manualAddressEditedRef.current) {
                        setData('shipping_address', resolvedAddress);
                        if (isFirstFix) {
                            if (accuracy > 250) {
                                toast.info(
                                    `Perkiraan lokasi jaringan (±${accuracy}m). Geser pin di peta atau cari nama jalan agar presisi.`,
                                );
                            } else {
                                toast.success(
                                    'Alamat berhasil diisi otomatis dari lokasi real-time Anda.',
                                );
                            }
                        }
                    }
                } catch (err) {
                    if ((err as DOMException)?.name !== 'AbortError') {
                        toast.error(
                            'Gagal menerjemahkan koordinat. Silakan pilih titik di peta atau ketik manual.',
                        );
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
            },
        );
    };

    const handleSelectMapLocation = async (
        lat: number,
        lon: number,
        prefilledAddress?: string,
    ) => {
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
            const resolvedAddress = await reverseGeocodeCoords(
                lat,
                lon,
                controller.signal,
            );
            if (controller.signal.aborted) return;
            setData('shipping_address', resolvedAddress);
            toast.success('Alamat diperbarui sesuai pin peta.');
        } catch (err) {
            if ((err as DOMException)?.name !== 'AbortError') {
                toast.error(
                    'Gagal mengambil nama jalan untuk titik ini. Silakan lengkapi alamat manual.',
                );
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsResolvingAddress(false);
            }
        }
    };

    useEffect(() => {
        if (!user || typeof window === 'undefined') return;
        const pendingId = window.sessionStorage.getItem(
            PENDING_ORDER_STORAGE_KEY,
        );
        if (!pendingId) return;

        window.sessionStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
        const matched = products.find((item) => item.id === Number(pendingId));
        if (matched) {
            setSelectedProduct(matched);
            setSubmittedMessage(null);
            setData({
                product_id: matched.id,
                customer_name: user.name ?? '',
                customer_whatsapp: '',
                customer_email: user.email ?? '',
                quantity: '1',
                delivery_date: '',
                shipping_address: '',
                greeting_card_note: '',
                payment_method: 'transfer_bca',
                website: '',
            });
        }
    }, [user, products, setData]);

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
            customer_name: user?.name ?? '',
            customer_whatsapp: '',
            customer_email: user?.email ?? '',
            quantity: '1',
            delivery_date: '',
            shipping_address: '',
            greeting_card_note: '',
            payment_method: 'transfer_bca',
            website: '',
        });
    };

    const redirectToAuthForOrder = (targetUrl: string) => {
        if (selectedProduct && typeof window !== 'undefined') {
            window.sessionStorage.setItem(
                PENDING_ORDER_STORAGE_KEY,
                String(selectedProduct.id),
            );
        }
        router.visit(targetUrl);
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

        const chosenPaymentLabel = formatPaymentMethodLabel(
            data.payment_method,
        );

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
            className="relative bg-[#F2EBDC] py-20 md:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <m.div
                    className="mx-auto mb-12 max-w-2xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#725C30] uppercase">
                        {eyebrow}
                    </p>
                    <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#16233B] sm:text-4xl">
                        {title}
                    </h2>
                    <div className="mx-auto mb-5 h-0.5 w-12 bg-[#A88B54]" />
                    <p className="text-base text-[#6E675D]">{description}</p>
                </m.div>

                {highlightedPromo && (
                    <div className="mb-8 flex justify-center">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-[#A88B54]/45 bg-[#16233B] px-5 py-2 text-xs text-[#F2EBDC] shadow-sm">
                            <span className="inline-flex items-center gap-1 font-semibold text-[#C5AA74]">
                                <Tag className="h-3.5 w-3.5" />
                                Promo Otomatis Aktif:
                            </span>
                            <span className="font-semibold">
                                {highlightedPromo.promo_name}
                            </span>
                            <span className="rounded-full bg-[#A88B54]/25 px-2 py-0.5 text-[11px] font-bold text-[#C5AA74]">
                                Diskon s/d {highlightedPromo.discount_percent}%
                            </span>
                            <span className="text-[11px] text-[#D8CEBA]">
                                s/d{' '}
                                {new Date(
                                    highlightedPromo.ends_at,
                                ).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                )}

                {/* Category Filters */}
                <div className="mb-14 flex justify-center">
                    <div
                        role="tablist"
                        aria-label="Filter kategori hampers"
                        className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#D8CEBA] bg-[#FFFFFF]/85 p-1.5 shadow-xs backdrop-blur-xs"
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
                                    className={`relative cursor-pointer rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] sm:px-5 sm:text-sm ${
                                        isActive
                                            ? 'bg-[#16233B] text-[#F2EBDC] shadow-sm'
                                            : 'text-[#6E675D] hover:bg-[#EAE1CE]/70 hover:text-[#16233B]'
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
                            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredProducts.map((product) => {
                                return (
                                    <m.article
                                        key={product.id}
                                        variants={cardItemVariants}
                                        whileHover={{
                                            y: -8,
                                            transition: {
                                                duration: 0.25,
                                                ease: smoothEase,
                                            },
                                        }}
                                        className="shadow-luxury hover:shadow-luxury-hover group flex flex-col overflow-hidden rounded-2xl border border-[#D8CEBA] bg-[#FFFFFF] transition-shadow duration-300 will-change-transform"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE1CE]">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                width={800}
                                                height={600}
                                                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                            <div className="absolute top-3.5 left-3.5">
                                                <span className="rounded-full border border-[#A88B54]/30 bg-[#16233B]/90 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#C5AA74] uppercase backdrop-blur-xs">
                                                    {product.category}
                                                </span>
                                            </div>
                                            {product.active_promo && (
                                                <div className="absolute top-3.5 right-3.5">
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#A88B54] bg-[#16233B] px-2.5 py-1 text-[11px] font-bold text-[#F2EBDC] shadow-md">
                                                        <Percent className="h-3 w-3 text-[#C5AA74]" />
                                                        <span>
                                                            -
                                                            {
                                                                product
                                                                    .active_promo
                                                                    .discount_percent
                                                            }
                                                            %
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Content */}
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div>
                                                <h3 className="mb-2 font-serif text-xl font-bold text-[#16233B] transition-colors duration-300 group-hover:text-[#725C30]">
                                                    {product.name}
                                                </h3>
                                                <p className="mb-4 text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                                                    {product.short_description}
                                                </p>

                                                {/* Contents list chips */}
                                                {product.contents &&
                                                    product.contents.length >
                                                        0 && (
                                                        <div className="mb-5 space-y-1.5 border-t border-[#D8CEBA]/70 pt-3">
                                                            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#16233B] uppercase">
                                                                <Sparkles className="h-3 w-3 text-[#A88B54]" />
                                                                <span>
                                                                    Daftar Isi
                                                                    Paket:
                                                                </span>
                                                            </p>
                                                            <ul className="space-y-1 pl-1 text-xs text-[#6E675D]">
                                                                {product.contents
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (
                                                                            item,
                                                                            idx,
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <Check className="h-3 w-3 flex-shrink-0 text-[#A88B54]" />
                                                                                <span className="truncate">
                                                                                    {
                                                                                        item
                                                                                    }
                                                                                </span>
                                                                            </li>
                                                                        ),
                                                                    )}
                                                                {product
                                                                    .contents
                                                                    .length >
                                                                    3 && (
                                                                    <li className="pl-5 text-[11px] font-medium text-[#725C30]">
                                                                        +{' '}
                                                                        {product
                                                                            .contents
                                                                            .length -
                                                                            3}{' '}
                                                                        item
                                                                        eksklusif
                                                                        lainnya
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                            </div>

                                            {/* Price & CTA Button */}
                                            <div className="flex items-center justify-between gap-3 border-t border-[#D8CEBA] pt-4">
                                                <div>
                                                    <span className="block text-[11px] tracking-wider text-[#6E675D] uppercase">
                                                        {product.active_promo
                                                            ? product
                                                                  .active_promo
                                                                  .promo_name
                                                            : 'Mulai Dari'}
                                                    </span>
                                                    {product.active_promo ? (
                                                        <div className="flex flex-wrap items-baseline gap-1.5">
                                                            <span className="font-serif text-base font-bold text-[#725C30] sm:text-lg">
                                                                {formatRupiah(
                                                                    product
                                                                        .active_promo
                                                                        .discounted_price,
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-[#6E675D] line-through">
                                                                {formatRupiah(
                                                                    product.price_from,
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-serif text-base font-bold text-[#16233B] sm:text-lg">
                                                            {formatRupiah(
                                                                product.price_from,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                <m.button
                                                    type="button"
                                                    onClick={() =>
                                                        openOrderModal(product)
                                                    }
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: smoothEase,
                                                    }}
                                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#16233B] px-4 py-2.5 text-xs font-semibold text-[#F2EBDC] shadow-xs transition-all hover:bg-[#203252] hover:shadow-md focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                                    aria-label={`Pesan ${product.name}`}
                                                >
                                                    <ShoppingBag className="h-3.5 w-3.5 flex-shrink-0 text-[#C5AA74]" />
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
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0B1322]/65 p-4 backdrop-blur-xs"
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
                            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#D8CEBA] bg-[#F2EBDC] text-[#1E2430] shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between gap-4 bg-[#16233B] px-6 py-4 text-[#F2EBDC]">
                                <div>
                                    <p className="text-[11px] font-semibold tracking-[0.2em] text-[#C5AA74] uppercase">
                                        Form Pemesanan Manual
                                    </p>
                                    <h3 className="font-serif text-lg font-bold sm:text-xl">
                                        {selectedProduct.name}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeOrderModal}
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FFFFFF]/10 text-[#F2EBDC] transition-colors hover:bg-[#FFFFFF]/20"
                                    aria-label="Tutup form pemesanan"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="max-h-[80vh] overflow-y-auto p-6">
                                {/* Selected Product Summary */}
                                {(() => {
                                    const promo = selectedProduct.active_promo;
                                    const effectiveUnit = promo
                                        ? promo.discounted_price
                                        : selectedProduct.price_from;
                                    const qty = Math.max(
                                        1,
                                        Number(data.quantity || 1),
                                    );
                                    const effectiveTotal = effectiveUnit * qty;
                                    const originalTotal =
                                        selectedProduct.price_from * qty;
                                    const savingsTotal = Math.max(
                                        0,
                                        originalTotal - effectiveTotal,
                                    );

                                    return (
                                        <div className="mb-5 space-y-2">
                                            <div className="flex items-center gap-4 rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] p-3.5">
                                                <img
                                                    src={selectedProduct.image}
                                                    alt={selectedProduct.name}
                                                    className="h-16 w-16 shrink-0 rounded-lg bg-[#EAE1CE] object-cover"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="text-[11px] font-semibold tracking-wider text-[#725C30] uppercase">
                                                            {
                                                                selectedProduct.category
                                                            }
                                                        </span>
                                                        {promo && (
                                                            <span className="rounded-full bg-[#16233B] px-2 py-0.5 text-[10px] font-bold text-[#C5AA74]">
                                                                -
                                                                {
                                                                    promo.discount_percent
                                                                }
                                                                %
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="truncate font-serif font-bold text-[#16233B]">
                                                        {selectedProduct.name}
                                                    </p>
                                                    <p className="text-xs text-[#6E675D]">
                                                        Harga satuan:{' '}
                                                        {promo ? (
                                                            <>
                                                                <span className="font-semibold text-[#725C30]">
                                                                    {formatRupiah(
                                                                        effectiveUnit,
                                                                    )}
                                                                </span>{' '}
                                                                <span className="line-through">
                                                                    {formatRupiah(
                                                                        selectedProduct.price_from,
                                                                    )}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            formatRupiah(
                                                                selectedProduct.price_from,
                                                            )
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <span className="block text-[11px] text-[#6E675D]">
                                                        Estimasi Total
                                                    </span>
                                                    {promo && (
                                                        <span className="block text-[11px] text-[#6E675D] line-through">
                                                            {formatRupiah(
                                                                originalTotal,
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="font-serif text-base font-bold text-[#16233B]">
                                                        {formatRupiah(
                                                            effectiveTotal,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {promo && savingsTotal > 0 && (
                                                <div className="flex items-center justify-between gap-2 rounded-lg border border-[#A88B54]/45 bg-[#EAE1CE]/75 px-3 py-1.5 text-[11px] text-[#16233B]">
                                                    <span className="inline-flex items-center gap-1.5 font-medium">
                                                        <Tag className="h-3 w-3 text-[#725C30]" />
                                                        Promo otomatis:{' '}
                                                        <strong>
                                                            {promo.promo_name}
                                                        </strong>
                                                    </span>
                                                    <span className="font-semibold text-[#725C30]">
                                                        Hemat{' '}
                                                        {formatRupiah(
                                                            savingsTotal,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {!user ? (
                                    <div className="space-y-4 rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] p-6 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#16233B] text-[#C5AA74] shadow-sm">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <h4 className="font-serif text-lg font-bold text-[#16233B]">
                                                Masuk Terlebih Dahulu untuk
                                                Memesan
                                            </h4>
                                            <p className="mx-auto max-w-md text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                                                Untuk keamanan transaksi,
                                                riwayat pesanan, dan pelacakan
                                                status pengiriman paket hampers
                                                Anda, silakan masuk atau daftar
                                                akun terlebih dahulu.
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-2.5 pt-1 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    redirectToAuthForOrder(
                                                        login.url(),
                                                    )
                                                }
                                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#16233B] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#F2EBDC] uppercase shadow-sm transition-colors hover:bg-[#203252] sm:w-auto"
                                            >
                                                <LogIn className="h-3.5 w-3.5 text-[#C5AA74]" />
                                                <span>Masuk ke Akun</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    redirectToAuthForOrder(
                                                        register.url(),
                                                    )
                                                }
                                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#A88B54] bg-[#F2EBDC]/60 px-6 py-2.5 text-xs font-semibold tracking-wider text-[#16233B] uppercase transition-colors hover:bg-[#EAE1CE] sm:w-auto"
                                            >
                                                <UserPlus className="h-3.5 w-3.5 text-[#725C30]" />
                                                <span>Daftar Akun Baru</span>
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeOrderModal}
                                            className="cursor-pointer text-xs text-[#6E675D] underline hover:text-[#16233B]"
                                        >
                                            Kembali ke Katalog
                                        </button>
                                    </div>
                                ) : submittedMessage ? (
                                    <div className="space-y-3 rounded-xl border border-[#16233B]/20 bg-[#16233B]/5 p-5 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#16233B] text-[#C5AA74]">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-serif text-lg font-bold text-[#16233B]">
                                            Pesanan Terkirim!
                                        </h4>
                                        <p className="text-sm leading-relaxed text-[#6E675D]">
                                            {submittedMessage}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                                            <Link
                                                href={ordersMine()}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-[#16233B] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#F2EBDC] uppercase hover:bg-[#203252]"
                                            >
                                                <ShoppingBag className="h-3.5 w-3.5 text-[#C5AA74]" />
                                                <span>Lihat Pesanan Saya</span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={closeOrderModal}
                                                className="cursor-pointer rounded-full border border-[#D8CEBA] px-5 py-2.5 text-xs font-semibold text-[#16233B] hover:bg-[#EAE1CE]"
                                            >
                                                Selesai
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleOrderSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#6E675D]">
                                            <span className="inline-flex items-center gap-1.5 truncate">
                                                <UserCheck className="h-3.5 w-3.5 shrink-0 text-[#725C30]" />
                                                <span className="truncate">
                                                    Memesan sebagai{' '}
                                                    <strong className="text-[#16233B]">
                                                        {user.name}
                                                    </strong>{' '}
                                                    ({user.email})
                                                </span>
                                            </span>
                                            <Link
                                                href={ordersMine()}
                                                className="shrink-0 font-semibold text-[#725C30] underline hover:text-[#16233B]"
                                            >
                                                Pesanan Saya
                                            </Link>
                                        </div>
                                        {/* Honeypot */}
                                        <div
                                            className="hidden"
                                            aria-hidden="true"
                                        >
                                            <input
                                                type="text"
                                                name="website"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={data.website}
                                                onChange={(e) =>
                                                    setData(
                                                        'website',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="order_customer_name"
                                                    className="mb-1.5 block text-xs font-semibold text-[#16233B]"
                                                >
                                                    Nama Lengkap *
                                                </label>
                                                <input
                                                    id="order_customer_name"
                                                    type="text"
                                                    required
                                                    value={data.customer_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'customer_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Ibu Rina Wijaya"
                                                    className="w-full rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                                />
                                                {errors.customer_name && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {errors.customer_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                                    <label
                                                        htmlFor="order_customer_whatsapp"
                                                        className="block text-xs font-semibold text-[#16233B]"
                                                    >
                                                        Nomor WhatsApp / Telepon
                                                        *
                                                    </label>
                                                    <span className="text-[11px] font-medium text-[#6E675D]">
                                                        {
                                                            data
                                                                .customer_whatsapp
                                                                .length
                                                        }
                                                        /{MAX_PHONE_DIGITS}{' '}
                                                        digit
                                                    </span>
                                                </div>
                                                <input
                                                    id="order_customer_whatsapp"
                                                    type="tel"
                                                    inputMode="numeric"
                                                    maxLength={MAX_PHONE_DIGITS}
                                                    required
                                                    value={
                                                        data.customer_whatsapp
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'customer_whatsapp',
                                                            sanitizePhoneInput(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="0812xxxxxxxx (maks. 12 angka)"
                                                    className="w-full rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                                />
                                                {errors.customer_whatsapp && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {
                                                            errors.customer_whatsapp
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="order_quantity"
                                                    className="mb-1.5 block text-xs font-semibold text-[#16233B]"
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
                                                    onChange={(e) =>
                                                        setData(
                                                            'quantity',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                                />
                                                {errors.quantity && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {errors.quantity}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="order_delivery_date"
                                                    className="mb-1.5 block text-xs font-semibold text-[#16233B]"
                                                >
                                                    Tanggal Kirim
                                                </label>
                                                <input
                                                    id="order_delivery_date"
                                                    type="date"
                                                    value={data.delivery_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'delivery_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                                />
                                                {errors.delivery_date && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {errors.delivery_date}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="order_customer_email"
                                                className="mb-1.5 block text-xs font-semibold text-[#16233B]"
                                            >
                                                Email (Opsional)
                                            </label>
                                            <input
                                                ref={emailInputRef}
                                                id="order_customer_email"
                                                type="email"
                                                value={data.customer_email}
                                                onChange={(e) =>
                                                    setData(
                                                        'customer_email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Ketik nama lalu pilih akhiran email di bawah..."
                                                className="w-full rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                            />
                                            <EmailQuickDomains
                                                value={data.customer_email}
                                                inputRef={emailInputRef}
                                                onSelect={(nextEmail) =>
                                                    setData(
                                                        'customer_email',
                                                        nextEmail,
                                                    )
                                                }
                                            />
                                            {errors.customer_email && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.customer_email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                                                <label
                                                    htmlFor="order_shipping_address"
                                                    className="block text-xs font-semibold text-[#16233B]"
                                                >
                                                    Alamat Pengiriman Lengkap *
                                                </label>

                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {locationState.status ===
                                                    'locating' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                stopLocationTracking(
                                                                    false,
                                                                )
                                                            }
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#16233B]/10 px-2.5 py-1 text-[11px] font-semibold text-[#16233B]"
                                                        >
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                            <span>
                                                                Mencari GPS...
                                                            </span>
                                                        </button>
                                                    ) : locationState.status ===
                                                      'tracking' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                stopLocationTracking(
                                                                    false,
                                                                )
                                                            }
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#16233B] px-2.5 py-1 text-[11px] font-semibold text-[#F2EBDC] hover:bg-[#203252]"
                                                        >
                                                            <Radio className="h-3 w-3 animate-pulse text-[#C5AA74]" />
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
                                                            onClick={
                                                                startRealTimeLocation
                                                            }
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D8CEBA] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-semibold text-[#16233B] transition-colors hover:border-[#A88B54] hover:bg-[#EAE1CE]/60"
                                                        >
                                                            <LocateFixed className="h-3 w-3 text-[#725C30]" />
                                                            <span>
                                                                Lokasi Saat Ini
                                                            </span>
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowMapPicker(
                                                                (prev) => !prev,
                                                            )
                                                        }
                                                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                                            showMapPicker
                                                                ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC]'
                                                                : 'border-[#D8CEBA] bg-[#FFFFFF] text-[#16233B] hover:border-[#A88B54] hover:bg-[#EAE1CE]/60'
                                                        }`}
                                                    >
                                                        <MapPin
                                                            className={`h-3 w-3 ${
                                                                showMapPicker
                                                                    ? 'text-[#C5AA74]'
                                                                    : 'text-[#725C30]'
                                                            }`}
                                                        />
                                                        <span>
                                                            {showMapPicker
                                                                ? 'Tutup Peta'
                                                                : 'Pilih di Peta'}
                                                        </span>
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
                                                    setData(
                                                        'shipping_address',
                                                        e.target.value,
                                                    );
                                                }}
                                                placeholder="Nama jalan, nomor rumah, kecamatan, kota, dan kode pos"
                                                className="w-full rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                            />
                                            {errors.shipping_address && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.shipping_address}
                                                </p>
                                            )}
                                            {locationState.error && (
                                                <p className="mt-1 text-[11px] text-red-600">
                                                    {locationState.error}
                                                </p>
                                            )}
                                            {locationState.coords && (
                                                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#D8CEBA] bg-[#EAE1CE]/65 px-3 py-1.5 text-[11px] text-[#6E675D]">
                                                    <span>
                                                        Koordinat:{' '}
                                                        {locationState.coords.lat.toFixed(
                                                            5,
                                                        )}
                                                        ,{' '}
                                                        {locationState.coords.lon.toFixed(
                                                            5,
                                                        )}{' '}
                                                        (akurasi ±
                                                        {
                                                            locationState.coords
                                                                .accuracy
                                                        }
                                                        m)
                                                    </span>
                                                    <a
                                                        href={`https://www.google.com/maps?q=${locationState.coords.lat},${locationState.coords.lon}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 font-semibold text-[#16233B] underline hover:text-[#725C30]"
                                                    >
                                                        <span>
                                                            Buka Google Maps
                                                        </span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            )}
                                            {showMapPicker && (
                                                <div className="mt-2.5">
                                                    <InteractiveMapPicker
                                                        lat={
                                                            locationState.coords
                                                                ?.lat ??
                                                            DEFAULT_STUDIO_COORDS.lat
                                                        }
                                                        lon={
                                                            locationState.coords
                                                                ?.lon ??
                                                            DEFAULT_STUDIO_COORDS.lon
                                                        }
                                                        accuracy={
                                                            locationState.coords
                                                                ?.accuracy
                                                        }
                                                        isLoadingAddress={
                                                            isResolvingAddress
                                                        }
                                                        onSelectLocation={
                                                            handleSelectMapLocation
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                                <label
                                                    htmlFor="order_greeting_card_note"
                                                    className="block text-xs font-semibold text-[#16233B]"
                                                >
                                                    Pesan Kartu Ucapan / Catatan
                                                    Khusus
                                                </label>
                                                {data.greeting_card_note && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                'greeting_card_note',
                                                                '',
                                                            )
                                                        }
                                                        className="cursor-pointer text-[11px] font-medium text-[#725C30] underline hover:text-[#16233B]"
                                                    >
                                                        Kosongkan
                                                    </button>
                                                )}
                                            </div>
                                            <textarea
                                                id="order_greeting_card_note"
                                                rows={3}
                                                value={data.greeting_card_note}
                                                onChange={(e) =>
                                                    setData(
                                                        'greeting_card_note',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Tuliskan ucapan untuk penerima atau pilih template cepat di bawah..."
                                                className="w-full rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1E2430] placeholder:text-[#6E675D] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                            />
                                            {errors.greeting_card_note && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.greeting_card_note}
                                                </p>
                                            )}

                                            {/* Quick Greeting Templates */}
                                            <div className="mt-2.5">
                                                <p className="mb-1.5 text-[11px] text-[#6E675D]">
                                                    Template cepat (klik untuk
                                                    langsung mengisi):
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
                                                            return (
                                                                Number(bMatch) -
                                                                Number(aMatch)
                                                            );
                                                        })
                                                        .map((tpl) => {
                                                            const isSelected =
                                                                data.greeting_card_note ===
                                                                tpl.text;
                                                            return (
                                                                <button
                                                                    key={
                                                                        tpl.label
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setData(
                                                                            'greeting_card_note',
                                                                            tpl.text,
                                                                        )
                                                                    }
                                                                    className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] ${
                                                                        isSelected
                                                                            ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC]'
                                                                            : 'border-[#D8CEBA] bg-[#FFFFFF] text-[#16233B] hover:border-[#A88B54] hover:bg-[#EAE1CE]/60'
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
                                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#16233B]">
                                                    <Wallet className="h-3.5 w-3.5 text-[#725C30]" />
                                                    <span>
                                                        Metode Pembayaran *
                                                    </span>
                                                </label>
                                                <span className="text-[11px] text-[#6E675D]">
                                                    Dibayar setelah di-ACC admin
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                {ORDER_PAYMENT_METHODS.map(
                                                    (method) => {
                                                        const active =
                                                            data.payment_method ===
                                                            method.id;
                                                        return (
                                                            <button
                                                                key={method.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        'payment_method',
                                                                        method.id,
                                                                    )
                                                                }
                                                                className={`cursor-pointer rounded-xl border px-3 py-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] ${
                                                                    active
                                                                        ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC] shadow-xs'
                                                                        : 'border-[#D8CEBA] bg-[#FFFFFF] text-[#16233B] hover:border-[#A88B54] hover:bg-[#EAE1CE]/50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between gap-1.5">
                                                                    <span className="truncate text-xs font-semibold">
                                                                        {
                                                                            method.shortLabel
                                                                        }
                                                                    </span>
                                                                    <span
                                                                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                                                            active
                                                                                ? 'bg-[#A88B54]/25 text-[#C5AA74]'
                                                                                : 'bg-[#EAE1CE] text-[#725C30]'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            method.badge
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <p
                                                                    className={`mt-0.5 truncate text-[10px] ${
                                                                        active
                                                                            ? 'text-[#D8CEBA]'
                                                                            : 'text-[#6E675D]'
                                                                    }`}
                                                                >
                                                                    {
                                                                        method.description
                                                                    }
                                                                </p>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                            {(() => {
                                                const currentMethod =
                                                    ORDER_PAYMENT_METHODS.find(
                                                        (m) =>
                                                            m.id ===
                                                            data.payment_method,
                                                    );
                                                if (!currentMethod) return null;
                                                return (
                                                    <p className="mt-2 rounded-lg border border-[#D8CEBA] bg-[#EAE1CE]/65 px-3 py-2 text-[11px] leading-relaxed text-[#6E675D]">
                                                        <span className="font-semibold text-[#16233B]">
                                                            {
                                                                currentMethod.label
                                                            }
                                                            :{' '}
                                                        </span>
                                                        {
                                                            currentMethod.instruction
                                                        }
                                                    </p>
                                                );
                                            })()}
                                            {errors.payment_method && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.payment_method}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={closeOrderModal}
                                                className="cursor-pointer rounded-full border border-[#D8CEBA] px-5 py-2.5 text-xs font-semibold text-[#6E675D] hover:bg-[#EAE1CE] hover:text-[#16233B]"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#16233B] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#F2EBDC] uppercase shadow-sm transition-colors hover:bg-[#203252] disabled:opacity-60"
                                            >
                                                <ShoppingBag className="h-3.5 w-3.5 text-[#C5AA74]" />
                                                <span>
                                                    {processing
                                                        ? 'Mengirim...'
                                                        : 'Kirim Pesanan'}
                                                </span>
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
