import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { LazyMotion, MotionConfig, m } from 'motion/react';
import {
    ArrowRight,
    ArrowUpRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    Eye,
    EyeOff,
    Inbox,
    Mail,
    MapPin,
    MessageSquareQuote,
    MessageSquareText,
    Package,
    PackageCheck,
    Percent,
    Phone,
    RefreshCw,
    Search,
    ShoppingBag,
    Sparkles,
    Tag,
    TrendingUp,
    Truck,
    Wallet,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatPaymentMethodLabel } from '@/lib/payment-methods';
import { dashboard, home } from '@/routes';
import { index as contentIndex } from '@/routes/admin/content';
import { index as inquiriesIndex } from '@/routes/admin/inquiries';
import { index as ordersIndex, updateStatus as updateOrderStatus } from '@/routes/admin/orders';
import { index as productsIndex, toggle as toggleProduct } from '@/routes/admin/products';
import { index as promosIndex } from '@/routes/admin/promos';
import { index as shipmentsIndex } from '@/routes/admin/shipments';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import type { InquiryRecord, OrderRecord, OrderStatus, Product } from '@/types/landing';

const loadMotionFeatures = () => import('@/lib/motion-features').then((res) => res.default);

interface ActivityPoint {
    date: string;
    label: string;
    fullDate: string;
    orders: number;
    inquiries: number;
    revenue: number;
}

interface CategoryBreakdownItem {
    category: string;
    total: number;
    active: number;
}

interface DashboardProps {
    stats: {
        pendingOrders: number;
        approvedOrders: number;
        completedOrders: number;
        rejectedOrders: number;
        totalOrders: number;
        confirmedRevenue: number;
        pendingRevenue: number;
        totalProducts: number;
        activeProducts: number;
        totalTestimonials: number;
        activeTestimonials: number;
        totalInquiries: number;
        categoriesCount: number;
    };
    activitySeries: ActivityPoint[];
    categoryBreakdown: CategoryBreakdownItem[];
    recentOrders: OrderRecord[];
    recentProducts: Product[];
    recentInquiries: InquiryRecord[];
    heroHeadline: string;
}

type FeedTab = 'overview' | 'pending' | 'products' | 'inquiries';
type ChartMetric = 'orders' | 'revenue' | 'inquiries';

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatCompactRupiah = (amount: number) => {
    if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
    if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
    if (amount >= 1_000) return `Rp ${Math.round(amount / 1_000)}rb`;
    return formatRupiah(amount);
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
};

const ORDER_STATUS_STYLE: Record<
    OrderStatus,
    { label: string; badgeClass: string }
> = {
    pending: {
        label: 'Pending',
        badgeClass: 'border-[#A88B54]/60 bg-[#EAE1CE]/85 text-[#725C30] dark:bg-[#203252] dark:text-[#C5AA74]',
    },
    approved: {
        label: 'Di-ACC',
        badgeClass: 'border-transparent bg-[#16233B] text-[#F2EBDC]',
    },
    completed: {
        label: 'Selesai',
        badgeClass: 'border-emerald-700/25 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    rejected: {
        label: 'Ditolak',
        badgeClass: 'border-destructive/30 bg-destructive/15 text-destructive',
    },
};

export default function Dashboard({
    stats,
    activitySeries,
    categoryBreakdown,
    recentOrders,
    recentProducts,
    recentInquiries,
    heroHeadline,
}: DashboardProps) {
    const [activeTab, setActiveTab] = useState<FeedTab>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [chartMetric, setChartMetric] = useState<ChartMetric>('orders');
    const [hoveredDayIndex, setHoveredDayIndex] = useState<number>(Math.max(0, activitySeries.length - 1));
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
    const [busyProductId, setBusyProductId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
    const [orderAdminNote, setOrderAdminNote] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
                toast.success('Data dashboard diperbarui.');
            },
        });
    };

    const handleQuickOrderStatus = (
        order: OrderRecord,
        status: OrderStatus,
        customNote?: string
    ) => {
        setBusyOrderId(order.id);
        router.patch(
            updateOrderStatus.url(order.id),
            {
                status,
                admin_note: customNote !== undefined ? customNote : (order.admin_note ?? ''),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedOrder?.id === order.id) {
                        setSelectedOrder(null);
                    }
                },
                onError: () => toast.error('Gagal memperbarui status pesanan.'),
                onFinish: () => setBusyOrderId(null),
            }
        );
    };

    const handleQuickToggleProduct = (product: Product) => {
        setBusyProductId(product.id);
        router.patch(
            toggleProduct.url(product.id),
            {},
            {
                preserveScroll: true,
                onError: () => toast.error('Gagal mengubah visibilitas produk.'),
                onFinish: () => setBusyProductId(null),
            }
        );
    };

    const openOrderDetail = (order: OrderRecord) => {
        setSelectedOrder(order);
        setOrderAdminNote(order.admin_note ?? '');
    };

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredOrders = useMemo(() => {
        return recentOrders.filter((o) => {
            if (activeTab === 'pending' && o.status !== 'pending') return false;
            if (!normalizedQuery) return true;
            return (
                o.order_code.toLowerCase().includes(normalizedQuery) ||
                o.customer_name.toLowerCase().includes(normalizedQuery) ||
                o.product_name.toLowerCase().includes(normalizedQuery) ||
                o.customer_whatsapp.toLowerCase().includes(normalizedQuery)
            );
        });
    }, [recentOrders, activeTab, normalizedQuery]);

    const filteredProducts = useMemo(() => {
        if (!normalizedQuery) return recentProducts;
        return recentProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(normalizedQuery) ||
                p.category.toLowerCase().includes(normalizedQuery)
        );
    }, [recentProducts, normalizedQuery]);

    const filteredInquiries = useMemo(() => {
        if (!normalizedQuery) return recentInquiries;
        return recentInquiries.filter(
            (inq) =>
                inq.name.toLowerCase().includes(normalizedQuery) ||
                (inq.company ?? '').toLowerCase().includes(normalizedQuery) ||
                inq.whatsapp_number.toLowerCase().includes(normalizedQuery)
        );
    }, [recentInquiries, normalizedQuery]);

    const maxMetricValue = useMemo(() => {
        const values = activitySeries.map((pt) => pt[chartMetric]);
        return Math.max(1, ...values);
    }, [activitySeries, chartMetric]);

    const focusedDay = activitySeries[hoveredDayIndex] ?? activitySeries[activitySeries.length - 1];
    const activeProductPercent =
        stats.totalProducts > 0 ? Math.round((stats.activeProducts / stats.totalProducts) * 100) : 0;

    const pipelineSegments = [
        {
            key: 'pending',
            label: 'Menunggu ACC',
            count: stats.pendingOrders,
            colorClass: 'bg-[#A88B54]',
            dotClass: 'bg-[#A88B54]',
        },
        {
            key: 'approved',
            label: 'Di-ACC',
            count: stats.approvedOrders,
            colorClass: 'bg-[#16233B] dark:bg-[#C5AA74]',
            dotClass: 'bg-[#16233B] dark:bg-[#C5AA74]',
        },
        {
            key: 'completed',
            label: 'Selesai',
            count: stats.completedOrders,
            colorClass: 'bg-emerald-600/80 dark:bg-emerald-500/80',
            dotClass: 'bg-emerald-600 dark:bg-emerald-400',
        },
        {
            key: 'rejected',
            label: 'Ditolak',
            count: stats.rejectedOrders,
            colorClass: 'bg-destructive/75',
            dotClass: 'bg-destructive',
        },
    ];

    const workspaceTabs: { key: FeedTab; label: string; badge?: number }[] = [
        { key: 'overview', label: 'Semua Aktivitas' },
        { key: 'pending', label: 'Antrean ACC', badge: stats.pendingOrders },
        { key: 'products', label: 'Katalog Cepat', badge: stats.activeProducts },
        { key: 'inquiries', label: 'Inquiry B2B', badge: stats.totalInquiries },
    ];

    return (
        <LazyMotion features={loadMotionFeatures}>
            <MotionConfig reducedMotion="user">
                <Head title="Admin Dashboard" />
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    {/* Executive Welcome Header */}
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_-15px_rgba(22,35,59,0.08)] sm:flex-row sm:items-center sm:justify-between md:p-6"
                    >
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="h-px w-6 bg-[#A88B54]" aria-hidden="true" />
                                <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                    Atelier Command Center
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A88B54]/35 bg-secondary/80 px-2.5 py-0.5 text-[10px] font-semibold text-foreground">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Sync
                                </span>
                            </div>
                            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {getGreeting()}, Tim GALUH &amp; CO.
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Pantau omzet terkonfirmasi, ACC pesanan masuk lebih cepat, dan kelola etalase katalog dalam satu layar.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw
                                    className={`size-3.5 text-[#725C30] dark:text-[#C5AA74] ${isRefreshing ? 'animate-spin' : ''}`}
                                />
                                Refresh
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href={home.url()} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                    Landing Page
                                </a>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={productsIndex()}>
                                    <Package className="size-3.5 text-[#C5AA74] dark:text-primary-foreground" />
                                    Kelola Katalog
                                </Link>
                            </Button>
                        </div>
                    </m.div>

                    {/* Interactive KPI Bento Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <m.button
                            type="button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.visit(ordersIndex.url())}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 text-left shadow-[0_10px_30px_-15px_rgba(22,35,59,0.08)] transition-colors hover:border-[#A88B54] cursor-pointer"
                        >
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#A88B54] via-[#C5AA74] to-transparent" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Omzet Ter-ACC
                                </span>
                                <div className="flex size-8 items-center justify-center rounded-lg border border-[#A88B54]/30 bg-secondary text-[#725C30] dark:text-[#C5AA74]">
                                    <TrendingUp className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                                    {formatCompactRupiah(stats.confirmedRevenue)}
                                </div>
                                <p className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Potensi pending: {formatCompactRupiah(stats.pendingRevenue)}</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#A88B54]" />
                                </p>
                            </div>
                        </m.button>

                        <m.button
                            type="button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setActiveTab('pending')}
                            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 text-left shadow-[0_10px_30px_-15px_rgba(22,35,59,0.08)] transition-colors cursor-pointer ${
                                activeTab === 'pending'
                                    ? 'border-[#A88B54] bg-card ring-1 ring-[#A88B54]/40'
                                    : 'border-border bg-card hover:border-[#A88B54]'
                            }`}
                        >
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#A88B54] via-[#C5AA74] to-transparent" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Menunggu ACC
                                    {stats.pendingOrders > 0 && (
                                        <span className="size-2 rounded-full bg-[#A88B54] animate-pulse" />
                                    )}
                                </span>
                                <div className="flex size-8 items-center justify-center rounded-lg border border-[#A88B54]/30 bg-secondary text-[#725C30] dark:text-[#C5AA74]">
                                    <ShoppingBag className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-serif text-3xl font-bold text-foreground">
                                    {stats.pendingOrders}
                                </div>
                                <p className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Dari total {stats.totalOrders} pesanan masuk</span>
                                    <span className="font-medium text-[#725C30] dark:text-[#C5AA74] group-hover:underline">
                                        Filter antrean →
                                    </span>
                                </p>
                            </div>
                        </m.button>

                        <m.button
                            type="button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setActiveTab('products')}
                            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 text-left shadow-[0_10px_30px_-15px_rgba(22,35,59,0.08)] transition-colors cursor-pointer ${
                                activeTab === 'products'
                                    ? 'border-[#A88B54] bg-card ring-1 ring-[#A88B54]/40'
                                    : 'border-border bg-card hover:border-[#A88B54]'
                            }`}
                        >
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#A88B54] via-[#C5AA74] to-transparent" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Produk Aktif
                                </span>
                                <div className="flex size-8 items-center justify-center rounded-lg border border-[#A88B54]/30 bg-secondary text-[#725C30] dark:text-[#C5AA74]">
                                    <CheckCircle2 className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-3xl font-bold text-foreground">
                                        {stats.activeProducts}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        / {stats.totalProducts} paket ({stats.categoriesCount} kategori)
                                    </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                    <div
                                        className="h-full rounded-full bg-[#A88B54] transition-all duration-500"
                                        style={{ width: `${activeProductPercent}%` }}
                                    />
                                </div>
                            </div>
                        </m.button>

                        <m.button
                            type="button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setActiveTab('inquiries')}
                            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 text-left shadow-[0_10px_30px_-15px_rgba(22,35,59,0.08)] transition-colors cursor-pointer ${
                                activeTab === 'inquiries'
                                    ? 'border-[#A88B54] bg-card ring-1 ring-[#A88B54]/40'
                                    : 'border-border bg-card hover:border-[#A88B54]'
                            }`}
                        >
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#A88B54] via-[#C5AA74] to-transparent" />
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Inquiry Corporate
                                </span>
                                <div className="flex size-8 items-center justify-center rounded-lg border border-[#A88B54]/30 bg-secondary text-[#725C30] dark:text-[#C5AA74]">
                                    <Inbox className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-serif text-3xl font-bold text-foreground">
                                    {stats.totalInquiries}
                                </div>
                                <p className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Permintaan B2B tersimpan</span>
                                    <span className="font-medium text-[#725C30] dark:text-[#C5AA74] group-hover:underline">
                                        Buka B2B →
                                    </span>
                                </p>
                            </div>
                        </m.button>
                    </div>

                    {/* Interactive Analytics Bento Row */}
                    <div className="grid gap-4 lg:grid-cols-12">
                        {/* 7-Day Activity Chart */}
                        <Card className="lg:col-span-7">
                            <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="font-serif text-lg">Aktivitas 7 Hari Terakhir</CardTitle>
                                    <CardDescription>
                                        {focusedDay
                                            ? `${focusedDay.label}, ${focusedDay.fullDate}: ${focusedDay.orders} pesanan • ${formatRupiah(focusedDay.revenue)} • ${focusedDay.inquiries} inquiry`
                                            : 'Arahkan kursor atau tap batang grafik untuk melihat detail harian.'}
                                    </CardDescription>
                                </div>

                                <div className="inline-flex rounded-lg border border-border bg-secondary/70 p-1">
                                    {(
                                        [
                                            { key: 'orders', label: 'Pesanan' },
                                            { key: 'revenue', label: 'Omzet' },
                                            { key: 'inquiries', label: 'Inquiry' },
                                        ] as const
                                    ).map((mOption) => (
                                        <button
                                            key={mOption.key}
                                            type="button"
                                            onClick={() => setChartMetric(mOption.key)}
                                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                                                chartMetric === mOption.key
                                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {mOption.label}
                                        </button>
                                    ))}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-2">
                                <div className="grid grid-cols-7 items-end gap-2 sm:gap-3 h-44 pt-4">
                                    {activitySeries.map((day, idx) => {
                                        const val = day[chartMetric];
                                        const heightPct = val === 0 ? 8 : Math.max(14, Math.round((val / maxMetricValue) * 100));
                                        const isFocused = idx === hoveredDayIndex;
                                        const displayVal =
                                            chartMetric === 'revenue'
                                                ? val > 0
                                                    ? formatCompactRupiah(val)
                                                    : '0'
                                                : String(val);

                                        return (
                                            <button
                                                key={day.date}
                                                type="button"
                                                onMouseEnter={() => setHoveredDayIndex(idx)}
                                                onFocus={() => setHoveredDayIndex(idx)}
                                                onClick={() => setHoveredDayIndex(idx)}
                                                className="group flex h-full flex-col items-center justify-end gap-2 focus:outline-none cursor-pointer"
                                            >
                                                <span
                                                    className={`text-[10px] font-semibold transition-opacity ${
                                                        isFocused
                                                            ? 'opacity-100 text-[#725C30] dark:text-[#C5AA74]'
                                                            : 'opacity-0 group-hover:opacity-100 text-muted-foreground'
                                                    }`}
                                                >
                                                    {displayVal}
                                                </span>
                                                <div className="relative flex w-full flex-1 items-end justify-center rounded-lg bg-secondary/45 p-1">
                                                    <div
                                                        className={`w-full rounded-md transition-all duration-300 ${
                                                            isFocused
                                                                ? 'bg-primary ring-2 ring-[#A88B54]/60'
                                                                : 'bg-[#A88B54]/65 group-hover:bg-[#A88B54]'
                                                        }`}
                                                        style={{ height: `${heightPct}%` }}
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <p
                                                        className={`text-[11px] font-semibold ${
                                                            isFocused ? 'text-foreground' : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {day.label}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground hidden sm:block">
                                                        {day.fullDate}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Pipeline & Category Breakdown */}
                        <Card className="lg:col-span-5 flex flex-col justify-between">
                            <CardHeader className="border-b border-border/60 pb-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <CardTitle className="font-serif text-lg">Distribusi Pipeline</CardTitle>
                                        <CardDescription>Status pesanan &amp; sebaran kategori</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild className="text-[#725C30] dark:text-[#C5AA74]">
                                        <Link href={ordersIndex()}>Detail Pesanan</Link>
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5 pt-2">
                                {/* Stacked Pipeline Bar */}
                                <div className="space-y-2.5">
                                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
                                        {stats.totalOrders === 0 ? (
                                            <div className="h-full w-full bg-secondary" />
                                        ) : (
                                            pipelineSegments.map((seg) => {
                                                const width = (seg.count / stats.totalOrders) * 100;
                                                if (width === 0) return null;
                                                return (
                                                    <div
                                                        key={seg.key}
                                                        title={`${seg.label}: ${seg.count}`}
                                                        className={`h-full transition-all duration-500 ${seg.colorClass}`}
                                                        style={{ width: `${width}%` }}
                                                    />
                                                );
                                            })
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {pipelineSegments.map((seg) => (
                                            <button
                                                key={seg.key}
                                                type="button"
                                                onClick={() =>
                                                    seg.key === 'pending'
                                                        ? setActiveTab('pending')
                                                        : router.visit(ordersIndex.url())
                                                }
                                                className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs hover:border-[#A88B54] transition-colors cursor-pointer"
                                            >
                                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                                    <span className={`size-2 rounded-full ${seg.dotClass}`} />
                                                    {seg.label}
                                                </span>
                                                <span className="font-semibold text-foreground">{seg.count}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Breakdown */}
                                <div className="space-y-2 border-t border-border/60 pt-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold tracking-wider text-muted-foreground uppercase">
                                            Etalase per Kategori
                                        </span>
                                        <Link
                                            href={productsIndex()}
                                            className="font-medium text-[#725C30] hover:underline dark:text-[#C5AA74]"
                                        >
                                            Kelola →
                                        </Link>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryBreakdown.length === 0 ? (
                                            <span className="text-xs text-muted-foreground">Belum ada kategori.</span>
                                        ) : (
                                            categoryBreakdown.map((cat) => (
                                                <Link
                                                    key={cat.category}
                                                    href={productsIndex()}
                                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs hover:border-[#A88B54] transition-colors"
                                                >
                                                    <span className="font-medium text-foreground">{cat.category}</span>
                                                    <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                                        {cat.active}/{cat.total}
                                                    </span>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Interactive Operations Hub */}
                    <Card>
                        <CardHeader className="flex flex-col gap-4 border-b border-border/60 pb-4 lg:flex-row lg:items-center lg:justify-between">
                            {/* Animated Tabs */}
                            <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-secondary/70 p-1">
                                {workspaceTabs.map((tab) => {
                                    const isActive = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                                isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {isActive && (
                                                <m.span
                                                    layoutId="dashboardTabPill"
                                                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                                    className="absolute inset-0 rounded-lg bg-primary shadow-xs"
                                                />
                                            )}
                                            <span className="relative z-10">{tab.label}</span>
                                            {typeof tab.badge === 'number' && (
                                                <span
                                                    className={`relative z-10 rounded-full px-1.5 py-0.5 text-[10px] ${
                                                        isActive
                                                            ? 'bg-[#A88B54]/30 text-[#F2EBDC]'
                                                            : 'bg-background text-[#725C30] dark:text-[#C5AA74]'
                                                    }`}
                                                >
                                                    {tab.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Live Search Bar */}
                            <div className="relative w-full lg:w-72">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari pesanan, hampers, atau PT..."
                                    className="pl-9"
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="pt-2">
                            {(activeTab === 'overview' || activeTab === 'pending') && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            {activeTab === 'pending'
                                                ? 'Antrean Pesanan Menunggu ACC (Klik baris untuk detail)'
                                                : 'Pesanan Terbaru & Aksi Cepat ACC'}
                                        </p>
                                        <Link
                                            href={ordersIndex()}
                                            className="text-xs font-semibold text-[#725C30] hover:underline dark:text-[#C5AA74]"
                                        >
                                            Kelola Semua Pesanan →
                                        </Link>
                                    </div>

                                    {filteredOrders.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-border bg-background/50 py-10 text-center text-sm text-muted-foreground">
                                            {activeTab === 'pending'
                                                ? 'Tidak ada pesanan yang menunggu ACC saat ini.'
                                                : 'Belum ada pesanan yang cocok dengan pencarian.'}
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 md:grid-cols-2">
                                            {filteredOrders.map((order) => {
                                                const st = ORDER_STATUS_STYLE[order.status] ?? ORDER_STATUS_STYLE.pending;
                                                const isBusy = busyOrderId === order.id;

                                                return (
                                                    <div
                                                        key={order.id}
                                                        className="group flex flex-col justify-between gap-3 rounded-xl border border-border bg-background/60 p-4 transition-all hover:border-[#A88B54]/80"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => openOrderDetail(order)}
                                                            className="w-full text-left focus:outline-none cursor-pointer"
                                                        >
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                                                        {order.order_code}
                                                                    </span>
                                                                    <Badge variant="outline" className={st.badgeClass}>
                                                                        {st.label}
                                                                    </Badge>
                                                                </div>
                                                                <span className="font-serif text-base font-bold text-[#725C30] dark:text-[#C5AA74]">
                                                                    {formatRupiah(order.total_price)}
                                                                </span>
                                                            </div>

                                                            <p className="mt-2 font-serif text-base font-semibold text-foreground group-hover:text-[#725C30] dark:group-hover:text-[#C5AA74] transition-colors">
                                                                {order.customer_name} — {order.product_name}
                                                            </p>
                                                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                                <span>{order.quantity} paket</span>
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Wallet className="size-3 text-[#A88B54]" />
                                                                    {formatPaymentMethodLabel(order.payment_method)}
                                                                </span>
                                                                {order.discount_percent && order.discount_percent > 0 ? (
                                                                    <span className="inline-flex items-center gap-1 font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                                                        <Tag className="size-3 text-[#A88B54]" />
                                                                        -{order.discount_percent}%
                                                                    </span>
                                                                ) : null}
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Clock className="size-3 text-[#A88B54]" />
                                                                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                                                                </span>
                                                            </div>
                                                        </button>

                                                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2.5">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openOrderDetail(order)}
                                                                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                                            >
                                                                Detail &amp; Alamat
                                                            </Button>

                                                            <div className="flex items-center gap-1.5">
                                                                {order.status === 'pending' && (
                                                                    <>
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            disabled={isBusy}
                                                                            onClick={() =>
                                                                                handleQuickOrderStatus(order, 'approved')
                                                                            }
                                                                            className="h-7 px-2.5 text-xs"
                                                                        >
                                                                            <CheckCircle2 className="size-3.5 text-[#C5AA74] dark:text-primary-foreground" />
                                                                            {isBusy ? 'Proses...' : 'ACC'}
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant="outline"
                                                                            disabled={isBusy}
                                                                            onClick={() =>
                                                                                handleQuickOrderStatus(order, 'rejected')
                                                                            }
                                                                            className="h-7 px-2 text-xs hover:border-destructive/60"
                                                                        >
                                                                            <XCircle className="size-3.5 text-destructive" />
                                                                            Tolak
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {(order.status === 'approved' ||
                                                                    order.status === 'completed') && (
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="outline"
                                                                        asChild
                                                                        className="h-7 px-2.5 text-xs"
                                                                    >
                                                                        <Link href={shipmentsIndex()}>
                                                                            <Truck className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                                                            Lacak
                                                                        </Link>
                                                                    </Button>
                                                                )}
                                                                {order.status === 'approved' && (
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        disabled={isBusy}
                                                                        onClick={() =>
                                                                            handleQuickOrderStatus(order, 'completed')
                                                                        }
                                                                        className="h-7 px-2.5 text-xs"
                                                                    >
                                                                        <PackageCheck className="size-3.5" />
                                                                        Selesai
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(activeTab === 'overview' || activeTab === 'products') && (
                                <div className={activeTab === 'overview' ? 'mt-7 border-t border-border/60 pt-6' : ''}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Kontrol Cepat Etalase Hampers (Toggle Aktif / Sembunyikan)
                                        </p>
                                        <Link
                                            href={productsIndex()}
                                            className="text-xs font-semibold text-[#725C30] hover:underline dark:text-[#C5AA74]"
                                        >
                                            Editor Katalog →
                                        </Link>
                                    </div>

                                    {filteredProducts.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-border bg-background/50 py-10 text-center text-sm text-muted-foreground">
                                            Belum ada produk hampers yang sesuai.
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {filteredProducts.map((product) => {
                                                const isBusy = busyProductId === product.id;
                                                return (
                                                    <div
                                                        key={product.id}
                                                        className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 transition-colors hover:border-[#A88B54]/80"
                                                    >
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="size-14 shrink-0 rounded-lg border border-border object-cover bg-muted"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-serif text-sm font-semibold text-foreground">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {product.category} •{' '}
                                                                <span className="font-medium text-[#725C30] dark:text-[#C5AA74]">
                                                                    {formatRupiah(product.price_from)}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant={product.is_active ? 'outline' : 'secondary'}
                                                            disabled={isBusy}
                                                            title={product.is_active ? 'Aktif (Klik untuk sembunyikan)' : 'Disembunyikan (Klik untuk tampilkan)'}
                                                            onClick={() => handleQuickToggleProduct(product)}
                                                        >
                                                            {product.is_active ? (
                                                                <Eye className="size-4 text-[#725C30] dark:text-[#C5AA74]" />
                                                            ) : (
                                                                <EyeOff className="size-4 text-muted-foreground" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(activeTab === 'overview' || activeTab === 'inquiries') && (
                                <div className={activeTab === 'overview' ? 'mt-7 border-t border-border/60 pt-6' : ''}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Inquiry Corporate B2B (Klik kartu untuk kontak &amp; catatan)
                                        </p>
                                        <Link
                                            href={inquiriesIndex()}
                                            className="text-xs font-semibold text-[#725C30] hover:underline dark:text-[#C5AA74]"
                                        >
                                            Semua Inquiry →
                                        </Link>
                                    </div>

                                    {filteredInquiries.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-border bg-background/50 py-10 text-center text-sm text-muted-foreground">
                                            Belum ada inquiry corporate yang cocok.
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                            {filteredInquiries.map((inq) => (
                                                <button
                                                    key={inq.id}
                                                    type="button"
                                                    onClick={() => setSelectedInquiry(inq)}
                                                    className="flex flex-col justify-between gap-2 rounded-xl border border-border bg-background/60 p-4 text-left transition-colors hover:border-[#A88B54] cursor-pointer"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p className="truncate font-serif text-base font-semibold text-foreground">
                                                                {inq.name}
                                                            </p>
                                                            {inq.company && (
                                                                <p className="inline-flex items-center gap-1 text-xs font-medium text-[#725C30] dark:text-[#C5AA74]">
                                                                    <Building2 className="size-3" />
                                                                    {inq.company}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className="shrink-0 text-[10px]">
                                                            {inq.budget_per_package || 'Custom'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {inq.estimated_quantity} •{' '}
                                                        {formatPaymentMethodLabel(inq.payment_method ?? 'invoice_termin')}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Editorial Content Shortcuts */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="hover:border-[#A88B54]/70">
                            <CardHeader className="flex flex-row items-center justify-between gap-2">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 font-serif text-lg">
                                        <Percent className="size-4 text-[#A88B54]" />
                                        Promo &amp; Diskon
                                    </CardTitle>
                                    <CardDescription className="line-clamp-1">
                                        Atur diskon otomatis terjadwal
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={promosIndex()}>
                                        Kelola
                                        <ArrowRight className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                    </Link>
                                </Button>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-[#A88B54]/70">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 font-serif text-lg">
                                        <Sparkles className="size-4 text-[#A88B54]" />
                                        Teks &amp; Gambar Hero Section
                                    </CardTitle>
                                    <CardDescription className="line-clamp-1">
                                        Headline aktif: &ldquo;{heroHeadline}&rdquo;
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={contentIndex()}>
                                        Edit Hero
                                        <ArrowRight className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                    </Link>
                                </Button>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-[#A88B54]/70">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 font-serif text-lg">
                                        <MessageSquareQuote className="size-4 text-[#A88B54]" />
                                        Testimoni Pelanggan
                                    </CardTitle>
                                    <CardDescription>
                                        {stats.activeTestimonials} ulasan aktif dari {stats.totalTestimonials} tersimpan
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={testimonialsIndex()}>
                                        Kelola Ulasan
                                        <ArrowRight className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                    </Link>
                                </Button>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                {/* Order Quick-View & ACC Modal */}
                <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                    <DialogContent className="sm:max-w-lg">
                        {selectedOrder && (
                            <>
                                <DialogHeader>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                            {selectedOrder.order_code}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={
                                                (ORDER_STATUS_STYLE[selectedOrder.status] ?? ORDER_STATUS_STYLE.pending)
                                                    .badgeClass
                                            }
                                        >
                                            {(ORDER_STATUS_STYLE[selectedOrder.status] ?? ORDER_STATUS_STYLE.pending).label}
                                        </Badge>
                                    </div>
                                    <DialogTitle className="font-serif text-xl">
                                        {selectedOrder.product_name} × {selectedOrder.quantity} paket
                                    </DialogTitle>
                                    <DialogDescription>
                                        Estimasi total:{' '}
                                        <span className="font-semibold text-foreground">
                                            {formatRupiah(selectedOrder.total_price)}
                                        </span>{' '}
                                        • {formatPaymentMethodLabel(selectedOrder.payment_method)}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-3 rounded-xl border border-border bg-background/70 p-4 text-xs text-muted-foreground">
                                    <p className="text-sm font-semibold text-foreground">{selectedOrder.customer_name}</p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone className="size-3.5 text-[#A88B54]" />
                                            {selectedOrder.customer_whatsapp}
                                        </span>
                                        {selectedOrder.customer_email && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="size-3.5 text-[#A88B54]" />
                                                {selectedOrder.customer_email}
                                            </span>
                                        )}
                                        {selectedOrder.delivery_date && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-[#A88B54]" />
                                                Target: {new Date(selectedOrder.delivery_date).toLocaleDateString('id-ID')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="flex items-start gap-1.5 pt-1">
                                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                        <span>{selectedOrder.shipping_address}</span>
                                    </p>
                                    {selectedOrder.greeting_card_note && (
                                        <p className="flex items-start gap-1.5 rounded-lg bg-secondary/70 p-2.5 text-foreground">
                                            <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                            <span>&ldquo;{selectedOrder.greeting_card_note}&rdquo;</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">
                                        Catatan Admin / Info Rekening (Opsional)
                                    </label>
                                    <Input
                                        value={orderAdminNote}
                                        onChange={(e) => setOrderAdminNote(e.target.value)}
                                        placeholder="Misal: Stok siap, rekening BCA sudah dikonfirmasi..."
                                    />
                                </div>

                                <DialogFooter className="flex-wrap gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={`https://wa.me/${selectedOrder.customer_whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                                                `Halo ${selectedOrder.customer_name}, kami dari GALUH & CO. mengonfirmasi pesanan ${selectedOrder.order_code} (${selectedOrder.product_name} × ${selectedOrder.quantity}).`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            WhatsApp Pemesan
                                            <ExternalLink className="size-3.5" />
                                        </a>
                                    </Button>

                                    {selectedOrder.status !== 'approved' && selectedOrder.status !== 'completed' && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            disabled={busyOrderId === selectedOrder.id}
                                            onClick={() =>
                                                handleQuickOrderStatus(selectedOrder, 'approved', orderAdminNote)
                                            }
                                        >
                                            <CheckCircle2 className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                                            ACC Pesanan
                                        </Button>
                                    )}

                                    {selectedOrder.status === 'approved' && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            disabled={busyOrderId === selectedOrder.id}
                                            onClick={() =>
                                                handleQuickOrderStatus(selectedOrder, 'completed', orderAdminNote)
                                            }
                                        >
                                            <PackageCheck className="size-4" />
                                            Tandai Selesai
                                        </Button>
                                    )}

                                    {(selectedOrder.status === 'pending' || selectedOrder.status === 'approved') && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            disabled={busyOrderId === selectedOrder.id}
                                            onClick={() =>
                                                handleQuickOrderStatus(selectedOrder, 'rejected', orderAdminNote)
                                            }
                                        >
                                            <XCircle className="size-4" />
                                            Tolak
                                        </Button>
                                    )}
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Inquiry Quick-View Modal */}
                <Dialog open={selectedInquiry !== null} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
                    <DialogContent className="sm:max-w-lg">
                        {selectedInquiry && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="font-serif text-xl">
                                        {selectedInquiry.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {selectedInquiry.company || 'Klien Korporat'} •{' '}
                                        {selectedInquiry.estimated_quantity} •{' '}
                                        {selectedInquiry.budget_per_package || 'Budget Custom'}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-3 rounded-xl border border-border bg-background/70 p-4 text-xs text-muted-foreground">
                                    <div className="flex flex-wrap gap-3">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone className="size-3.5 text-[#A88B54]" />
                                            {selectedInquiry.whatsapp_number}
                                        </span>
                                        {selectedInquiry.email && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="size-3.5 text-[#A88B54]" />
                                                {selectedInquiry.email}
                                            </span>
                                        )}
                                        {selectedInquiry.needed_date && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-[#A88B54]" />
                                                Target: {new Date(selectedInquiry.needed_date).toLocaleDateString('id-ID')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="inline-flex items-center gap-1.5 font-medium text-[#725C30] dark:text-[#C5AA74]">
                                        <Wallet className="size-3.5 text-[#A88B54]" />
                                        {formatPaymentMethodLabel(selectedInquiry.payment_method ?? 'invoice_termin')}
                                    </p>
                                    {selectedInquiry.notes && (
                                        <div className="rounded-lg bg-secondary/70 p-3 text-sm text-foreground whitespace-pre-line">
                                            {selectedInquiry.notes}
                                        </div>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
                                        Tutup
                                    </Button>
                                    <Button asChild>
                                        <a
                                            href={`https://wa.me/${selectedInquiry.whatsapp_number.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                                                `Halo ${selectedInquiry.name}${selectedInquiry.company ? ` dari ${selectedInquiry.company}` : ''}, kami dari tim corporate GALUH & CO. menindaklanjuti permintaan penawaran (${selectedInquiry.estimated_quantity}).`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Hubungi via WhatsApp
                                            <ExternalLink className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                                        </a>
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </MotionConfig>
        </LazyMotion>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
