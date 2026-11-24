import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    MessageSquareText,
    PackageCheck,
    Phone,
    Search,
    ShoppingBag,
    Trash2,
    Wallet,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatPaymentMethodLabel } from '@/lib/payment-methods';
import { dashboard } from '@/routes';
import {
    destroy as destroyOrder,
    index as ordersIndex,
    updateStatus as updateOrderStatus,
} from '@/routes/admin/orders';
import type { OrderRecord, OrderStatus } from '@/types/landing';

interface AdminOrdersProps {
    orders: OrderRecord[];
}

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const STATUS_META: Record<
    OrderStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }
> = {
    pending: {
        label: 'Menunggu ACC',
        variant: 'outline',
        className: 'border-[#A88B54]/60 bg-[#EAE1CE]/85 text-[#725C30] dark:bg-[#203252] dark:text-[#C5AA74]',
    },
    approved: {
        label: 'Di-ACC Admin',
        variant: 'default',
        className: 'bg-[#16233B] text-[#F2EBDC] border-transparent',
    },
    completed: {
        label: 'Selesai',
        variant: 'secondary',
        className: 'border-emerald-700/25 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    rejected: {
        label: 'Ditolak',
        variant: 'destructive',
    },
};

export default function AdminOrders({ orders }: AdminOrdersProps) {
    const { flash } = usePage<FlashProps>().props;
    const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notesById, setNotesById] = useState<Record<number, string>>(() =>
        Object.fromEntries(orders.map((o) => [o.id, o.admin_note ?? '']))
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleStatusChange = (order: OrderRecord, status: OrderStatus) => {
        router.patch(
            updateOrderStatus.url(order.id),
            {
                status,
                admin_note: notesById[order.id] ?? order.admin_note ?? '',
            },
            { preserveScroll: true }
        );
    };

    const handleDelete = (order: OrderRecord) => {
        if (!window.confirm(`Hapus pesanan ${order.order_code} atas nama "${order.customer_name}"?`)) {
            return;
        }
        router.delete(destroyOrder.url(order.id), { preserveScroll: true });
    };

    const counts = {
        all: orders.length,
        pending: orders.filter((o) => o.status === 'pending').length,
        approved: orders.filter((o) => o.status === 'approved').length,
        completed: orders.filter((o) => o.status === 'completed').length,
        rejected: orders.filter((o) => o.status === 'rejected').length,
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
            q === '' ||
            order.order_code.toLowerCase().includes(q) ||
            order.customer_name.toLowerCase().includes(q) ||
            order.product_name.toLowerCase().includes(q) ||
            order.customer_whatsapp.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const filterTabs: { key: 'all' | OrderStatus; label: string }[] = [
        { key: 'all', label: `Semua (${counts.all})` },
        { key: 'pending', label: `Menunggu ACC (${counts.pending})` },
        { key: 'approved', label: `Di-ACC (${counts.approved})` },
        { key: 'completed', label: `Selesai (${counts.completed})` },
        { key: 'rejected', label: `Ditolak (${counts.rejected})` },
    ];

    return (
        <>
            <Head title="Kelola & ACC Pesanan Masuk" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="space-y-1.5 border-b border-border pb-5">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-6 bg-[#A88B54]" aria-hidden="true" />
                        <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                            Pesanan Manual
                        </span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                        Pesanan Hampers Masuk
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pantau pesanan manual dari katalog landing page, berikan catatan internal, lalu ACC atau tolak.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {filterTabs.map((tab) => (
                            <Button
                                key={tab.key}
                                type="button"
                                size="sm"
                                variant={statusFilter === tab.key ? 'default' : 'outline'}
                                onClick={() => setStatusFilter(tab.key)}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kode, nama pemesan, atau produk..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            Belum ada pesanan yang sesuai filter saat ini.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredOrders.map((order) => {
                            const statusMeta = STATUS_META[order.status] ?? STATUS_META.pending;
                            return (
                                <Card key={order.id} className="hover:border-[#A88B54]/70">
                                    <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                                    {order.order_code}
                                                </span>
                                                <Badge variant={statusMeta.variant} className={statusMeta.className}>
                                                    {statusMeta.label}
                                                </Badge>
                                                <Badge variant="outline" className="gap-1 border-border bg-card text-foreground">
                                                    <Wallet className="size-3 text-[#725C30] dark:text-[#C5AA74]" />
                                                    {formatPaymentMethodLabel(order.payment_method)}
                                                </Badge>
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="size-3 text-[#A88B54]" />
                                                    {new Date(order.created_at).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <CardTitle className="flex flex-wrap items-center gap-2 font-serif text-lg">
                                                <ShoppingBag className="size-4 text-[#A88B54]" />
                                                <span>{order.product_name}</span>
                                                <span className="font-sans text-sm font-normal text-muted-foreground">
                                                    × {order.quantity} paket
                                                </span>
                                            </CardTitle>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                Total Estimasi
                                            </p>
                                            <p className="font-serif text-xl font-bold text-[#725C30] dark:text-[#C5AA74]">
                                                {formatRupiah(order.total_price)}
                                            </p>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="grid gap-3 rounded-xl border border-border bg-background/60 p-3.5 text-sm md:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <p className="font-semibold text-foreground">{order.customer_name}</p>
                                                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Phone className="size-3.5 text-[#A88B54]" />
                                                    {order.customer_whatsapp}
                                                </p>
                                                {order.customer_email && (
                                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Mail className="size-3.5 text-[#A88B54]" />
                                                        {order.customer_email}
                                                    </p>
                                                )}
                                                {order.delivery_date && (
                                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Calendar className="size-3.5 text-[#A88B54]" />
                                                        Target Kirim:{' '}
                                                        {new Date(order.delivery_date).toLocaleDateString('id-ID')}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2 text-xs text-muted-foreground">
                                                <p className="flex items-start gap-1.5">
                                                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                                    <span>{order.shipping_address}</span>
                                                </p>
                                                {order.greeting_card_note && (
                                                    <p className="flex items-start gap-1.5">
                                                        <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                                        <span>Kartu Ucapan: &ldquo;{order.greeting_card_note}&rdquo;</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Admin Note & ACC Controls */}
                                        <div className="flex flex-col gap-3 border-t pt-3 md:flex-row md:items-center md:justify-between">
                                            <Input
                                                value={notesById[order.id] ?? ''}
                                                onChange={(e) =>
                                                    setNotesById((prev) => ({
                                                        ...prev,
                                                        [order.id]: e.target.value,
                                                    }))
                                                }
                                                placeholder="Catatan admin / alasan ACC atau tolak (opsional)..."
                                                className="md:max-w-sm"
                                            />

                                            <div className="flex flex-wrap items-center gap-2">
                                                {order.status !== 'approved' && order.status !== 'completed' && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => handleStatusChange(order, 'approved')}
                                                    >
                                                        <CheckCircle2 className="size-4" />
                                                        ACC Pesanan
                                                    </Button>
                                                )}
                                                {order.status === 'approved' && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => handleStatusChange(order, 'completed')}
                                                    >
                                                        <PackageCheck className="size-4" />
                                                        Tandai Selesai
                                                    </Button>
                                                )}
                                                {(order.status === 'pending' || order.status === 'approved') && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusChange(order, 'rejected')}
                                                    >
                                                        <XCircle className="size-4 text-destructive" />
                                                        Tolak
                                                    </Button>
                                                )}
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    title="Hapus pesanan"
                                                    onClick={() => handleDelete(order)}
                                                >
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

AdminOrders.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pesanan Masuk', href: ordersIndex() },
    ],
};
