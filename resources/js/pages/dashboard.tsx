import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, ExternalLink, Inbox, MessageSquareQuote, Package, ShoppingBag, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPaymentMethodLabel } from '@/lib/payment-methods';
import { dashboard, home } from '@/routes';
import { index as contentIndex } from '@/routes/admin/content';
import { index as inquiriesIndex } from '@/routes/admin/inquiries';
import { index as ordersIndex } from '@/routes/admin/orders';
import { index as productsIndex } from '@/routes/admin/products';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import type { InquiryRecord, OrderRecord, Product } from '@/types/landing';

interface DashboardProps {
    stats: {
        pendingOrders: number;
        totalOrders: number;
        totalProducts: number;
        activeProducts: number;
        totalTestimonials: number;
        activeTestimonials: number;
        totalInquiries: number;
        categoriesCount: number;
    };
    recentOrders: OrderRecord[];
    recentProducts: Product[];
    recentInquiries: InquiryRecord[];
    heroHeadline: string;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export default function Dashboard({
    stats,
    recentOrders,
    recentProducts,
    recentInquiries,
    heroHeadline,
}: DashboardProps) {
    const statCards = [
        {
            label: 'Menunggu ACC',
            value: stats.pendingOrders,
            hint: `Dari total ${stats.totalOrders} pesanan masuk`,
            icon: ShoppingBag,
        },
        {
            label: 'Produk Aktif',
            value: stats.activeProducts,
            hint: `${stats.totalProducts} total produk (${stats.categoriesCount} kategori)`,
            icon: CheckCircle2,
        },
        {
            label: 'Testimoni Aktif',
            value: stats.activeTestimonials,
            hint: `Total ${stats.totalTestimonials} ulasan tersimpan`,
            icon: MessageSquareQuote,
        },
        {
            label: 'Inquiry Corporate',
            value: stats.totalInquiries,
            hint: 'Permintaan penawaran B2B masuk',
            icon: Inbox,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Header */}
                <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="h-px w-6 bg-[#A88B54]" aria-hidden="true" />
                            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                Atelier Workspace
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Panel Admin GALUH &amp; CO.
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola pesanan masuk, foto katalog hampers, teks hero section, serta inquiry corporate dari satu tempat.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <a href={home.url()} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-4 text-[#725C30] dark:text-[#C5AA74]" />
                                Lihat Landing Page
                            </a>
                        </Button>
                        <Button asChild>
                            <Link href={productsIndex()}>
                                <Package className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                                Kelola Katalog
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Summary Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.label} className="relative overflow-hidden border-border hover:border-[#A88B54]/70">
                                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#A88B54]/80 via-[#C5AA74] to-[#A88B54]/30" />
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardDescription className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        {item.label}
                                    </CardDescription>
                                    <div className="flex size-8 items-center justify-center rounded-lg border border-[#A88B54]/30 bg-secondary text-[#725C30] dark:text-[#C5AA74]">
                                        <Icon className="size-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-serif text-3xl font-bold text-foreground">{item.value}</div>
                                    <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="hover:border-[#A88B54]/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-serif text-lg">
                                <Package className="size-4 text-[#A88B54]" />
                                Foto &amp; Produk Katalog
                            </CardTitle>
                            <CardDescription>
                                Tambah paket hampers baru, unggah foto produk, atur harga, atau sembunyikan sementara.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={productsIndex()}>
                                    Buka Editor Katalog
                                    <ArrowRight className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-[#A88B54]/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-serif text-lg">
                                <Sparkles className="size-4 text-[#A88B54]" />
                                Teks &amp; Gambar Hero Section
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                                Headline aktif saat ini: &ldquo;{heroHeadline}&rdquo;
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" asChild>
                                <Link href={contentIndex()}>
                                    Edit Teks &amp; Hero
                                    <ArrowRight className="size-4 text-[#725C30] dark:text-[#C5AA74]" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-[#A88B54]/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-serif text-lg">
                                <MessageSquareQuote className="size-4 text-[#A88B54]" />
                                Testimoni Klien
                            </CardTitle>
                            <CardDescription>
                                Tambah ulasan pelanggan, edit kutipan, ubah rating bintang, dan atur urutan tampil.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" asChild>
                                <Link href={testimonialsIndex()}>
                                    Kelola Testimoni
                                    <ArrowRight className="size-4 text-[#725C30] dark:text-[#C5AA74]" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Previews */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
                            <div>
                                <CardTitle className="font-serif text-lg">Pesanan Masuk Terbaru</CardTitle>
                                <CardDescription>Pantau &amp; ACC pesanan manual</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-[#725C30] hover:text-foreground dark:text-[#C5AA74]">
                                <Link href={ordersIndex()}>Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-1">
                            {recentOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada pesanan masuk.</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {order.customer_name} — {order.product_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.order_code} • {order.quantity} paket • {formatRupiah(order.total_price)} •{' '}
                                                {formatPaymentMethodLabel(order.payment_method)}
                                            </p>
                                        </div>
                                        <Badge variant={order.status === 'pending' ? 'outline' : 'default'}>
                                            {order.status === 'pending'
                                                ? 'Pending'
                                                : order.status === 'approved'
                                                  ? 'Di-ACC'
                                                  : order.status === 'completed'
                                                    ? 'Selesai'
                                                    : 'Ditolak'}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
                            <div>
                                <CardTitle className="font-serif text-lg">Katalog Terbaru</CardTitle>
                                <CardDescription>Urutan hampers yang tampil di landing page</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-[#725C30] hover:text-foreground dark:text-[#C5AA74]">
                                <Link href={productsIndex()}>Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-1">
                            {recentProducts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada produk hampers.</p>
                            ) : (
                                recentProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-3 rounded-lg border border-border bg-background/60 p-2.5"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="size-12 shrink-0 rounded-md border border-border object-cover bg-muted"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {product.category} •{' '}
                                                <span className="font-medium text-[#725C30] dark:text-[#C5AA74]">
                                                    {formatRupiah(product.price_from)}
                                                </span>
                                            </p>
                                        </div>
                                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                            {product.is_active ? 'Aktif' : 'Draft'}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
                            <div>
                                <CardTitle className="font-serif text-lg">Inquiry Corporate Terbaru</CardTitle>
                                <CardDescription>Permintaan penawaran dari form B2B</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-[#725C30] hover:text-foreground dark:text-[#C5AA74]">
                                <Link href={inquiriesIndex()}>Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-1">
                            {recentInquiries.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada inquiry masuk.</p>
                            ) : (
                                recentInquiries.map((inq) => (
                                    <div
                                        key={inq.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {inq.name}
                                                {inq.company ? ` — ${inq.company}` : ''}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {inq.estimated_quantity} • {formatPaymentMethodLabel(inq.payment_method ?? 'invoice_termin')}
                                            </p>
                                        </div>
                                        <Badge variant="outline">{inq.budget_per_package || 'Custom'}</Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
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
