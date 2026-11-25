import { useEffect, useMemo, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Box,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    History,
    Mail,
    MapPin,
    MessageSquareText,
    Package,
    PackageCheck,
    Phone,
    Search,
    Send,
    Sparkles,
    Tag,
    Trash2,
    Truck,
    UserCheck,
    Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    AdminViewModeToggle,
    useAdminViewMode,
} from '@/components/admin-view-mode-toggle';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatPaymentMethodLabel } from '@/lib/payment-methods';
import { dashboard } from '@/routes';
import { destroy as destroyOrder } from '@/routes/admin/orders';
import {
    index as shipmentsIndex,
    update as updateShipment,
} from '@/routes/admin/shipments';
import type { FulfillmentStage, OrderRecord } from '@/types/landing';

interface AdminShipmentsProps {
    shipments: OrderRecord[];
}

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};

interface StageMeta {
    key: FulfillmentStage;
    label: string;
    shortLabel: string;
    description: string;
    nextStage?: FulfillmentStage;
    nextButtonLabel?: string;
    badgeClass: string;
}

const STAGES: StageMeta[] = [
    {
        key: 'curating',
        label: 'Perakitan & Kurasi',
        shortLabel: 'Perakitan',
        description: 'Pesanan di-ACC & sedang dirakit di studio',
        nextStage: 'packed',
        nextButtonLabel: 'Tandai Siap Kirim',
        badgeClass:
            'border-[#A88B54]/60 bg-[#EAE1CE]/85 text-[#725C30] dark:bg-[#203252] dark:text-[#C5AA74]',
    },
    {
        key: 'packed',
        label: 'Dikemas Siap Kirim',
        shortLabel: 'Siap Kirim',
        description: 'Hardbox tersegel & menunggu penjemputan kurir',
        nextStage: 'shipped',
        nextButtonLabel: 'Kirim Paket Sekarang',
        badgeClass:
            'border-[#16233B]/30 bg-[#16233B]/10 text-[#16233B] dark:border-[#C5AA74]/40 dark:bg-[#203252] dark:text-[#F2EBDC]',
    },
    {
        key: 'shipped',
        label: 'Dalam Pengiriman',
        shortLabel: 'Dikirim',
        description: 'Kurir sedang dalam perjalanan ke alamat penerima',
        nextStage: 'delivered',
        nextButtonLabel: 'Konfirmasi Sudah Sampai',
        badgeClass: 'border-[#A88B54] bg-[#16233B] text-[#F2EBDC]',
    },
    {
        key: 'delivered',
        label: 'Paket Sudah Sampai',
        shortLabel: 'Sudah Sampai',
        description: 'Paket telah diterima di alamat tujuan',
        badgeClass:
            'border-emerald-700/25 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
];

const STAGE_MAP: Record<FulfillmentStage, StageMeta> = {
    curating: STAGES[0],
    packed: STAGES[1],
    shipped: STAGES[2],
    delivered: STAGES[3],
};

const COURIER_PRESETS = [
    'Kurir Studio Galuh',
    'Paxel',
    'JNE Express',
    'J&T Express',
    'GrabExpress',
    'Lalamove',
];

const POSITION_NOTE_PRESETS = [
    'Sedang dirakit & dicek kelengkapan kue di Studio Ciamis',
    'Hardbox selesai disegel, siap diserahkan ke kurir',
    'Kurir dalam perjalanan menuju lokasi pengiriman',
    'Paket sudah sampai & diterima di lokasi tujuan',
];

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

function resolveStage(order: OrderRecord): FulfillmentStage {
    const candidate = order.fulfillment_stage;
    if (candidate && candidate in STAGE_MAP) {
        return candidate;
    }
    return order.status === 'completed' ? 'delivered' : 'curating';
}

export default function AdminShipments({ shipments }: AdminShipmentsProps) {
    const { flash } = usePage<FlashProps>().props;
    const [viewMode, setViewMode] = useAdminViewMode(
        'galuh_admin_shipments_view',
        'detail',
    );
    const [stageFilter, setStageFilter] = useState<'all' | FulfillmentStage>(
        'all',
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
    const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
    const [pendingDelete, setPendingDelete] = useState<OrderRecord | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, patch, processing, errors, clearErrors } = useForm<{
        fulfillment_stage: FulfillmentStage;
        courier_name: string;
        tracking_number: string;
        recipient_name: string;
        shipping_notes: string;
    }>({
        fulfillment_stage: 'curating',
        courier_name: '',
        tracking_number: '',
        recipient_name: '',
        shipping_notes: '',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const openTrackingModal = (
        order: OrderRecord,
        overrideStage?: FulfillmentStage,
    ) => {
        clearErrors();
        setActiveOrder(order);
        setData({
            fulfillment_stage: overrideStage ?? resolveStage(order),
            courier_name: order.courier_name ?? '',
            tracking_number: order.tracking_number ?? '',
            recipient_name: order.recipient_name ?? '',
            shipping_notes: order.shipping_notes ?? '',
        });
    };

    const handleQuickAdvance = (
        order: OrderRecord,
        nextStage: FulfillmentStage,
    ) => {
        if (nextStage === 'delivered' || nextStage === 'shipped') {
            // Open quick modal pre-set to the next stage so admin can confirm courier/resi or recipient name cleanly!
            openTrackingModal(order, nextStage);
            return;
        }

        setBusyOrderId(order.id);
        router.patch(
            updateShipment.url(order.id),
            {
                fulfillment_stage: nextStage,
                courier_name: order.courier_name ?? '',
                tracking_number: order.tracking_number ?? '',
                recipient_name: order.recipient_name ?? '',
                shipping_notes: order.shipping_notes ?? '',
            },
            {
                preserveScroll: true,
                onError: () => toast.error('Gagal memperbarui tahap paket.'),
                onFinish: () => setBusyOrderId(null),
            },
        );
    };

    const handleSubmitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeOrder) return;

        patch(updateShipment.url(activeOrder.id), {
            preserveScroll: true,
            onSuccess: () => {
                setActiveOrder(null);
            },
        });
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        router.delete(destroyOrder.url(pendingDelete.id), {
            preserveScroll: true,
            onError: () => toast.error('Gagal menghapus data pengiriman.'),
            onFinish: () => {
                setIsDeleting(false);
                setPendingDelete(null);
            },
        });
    };

    const counts = useMemo(() => {
        return {
            all: shipments.length,
            curating: shipments.filter((s) => resolveStage(s) === 'curating')
                .length,
            packed: shipments.filter((s) => resolveStage(s) === 'packed')
                .length,
            shipped: shipments.filter((s) => resolveStage(s) === 'shipped')
                .length,
            delivered: shipments.filter((s) => resolveStage(s) === 'delivered')
                .length,
        };
    }, [shipments]);

    const filteredShipments = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return shipments.filter((order) => {
            const stage = resolveStage(order);
            const matchesStage = stageFilter === 'all' || stage === stageFilter;
            const matchesSearch =
                q === '' ||
                order.order_code.toLowerCase().includes(q) ||
                order.customer_name.toLowerCase().includes(q) ||
                order.product_name.toLowerCase().includes(q) ||
                (order.courier_name ?? '').toLowerCase().includes(q) ||
                (order.tracking_number ?? '').toLowerCase().includes(q) ||
                (order.shipping_address ?? '').toLowerCase().includes(q);
            return matchesStage && matchesSearch;
        });
    }, [shipments, stageFilter, searchQuery]);

    const buildWhatsappShareUrl = (order: OrderRecord) => {
        const stage = STAGE_MAP[resolveStage(order)];
        const cleanedPhone = order.customer_whatsapp
            .replace(/[^0-9]/g, '')
            .replace(/^0/, '62');
        const lines = [
            `Halo ${order.customer_name}, kami menginformasikan update paket hampers *${order.order_code}* (${order.product_name} × ${order.quantity}):`,
            `• Status Terkini: *${stage.label}*`,
            order.courier_name ? `• Kurir: ${order.courier_name}` : null,
            order.tracking_number
                ? `• No. Resi / ID: ${order.tracking_number}`
                : null,
            order.shipping_notes
                ? `• Posisi / Catatan: ${order.shipping_notes}`
                : null,
            order.recipient_name
                ? `• Diterima oleh: ${order.recipient_name}`
                : null,
        ].filter(Boolean);

        return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
    };

    const getMapsUrl = (address: string) => {
        const gpsMatch = address.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
        if (gpsMatch) {
            return `https://www.google.com/maps?q=${gpsMatch[1]},${gpsMatch[2]}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    };

    return (
        <>
            <Head title="Pelacakan Paket & Pengiriman" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-px w-6 bg-[#A88B54]"
                                aria-hidden="true"
                            />
                            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                Logistik &amp; Fulfillment
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Pelacakan Paket Ter-ACC
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pantau proses perakitan hampers, lokasi pengiriman
                            kurir, nomor resi, isi paket, hingga konfirmasi
                            paket sampai tujuan.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A88B54]/40 bg-card px-3 py-1.5 font-semibold text-foreground">
                            <Truck className="size-3.5 text-[#A88B54]" />
                            {counts.shipped} Dalam Perjalanan
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <PackageCheck className="size-3.5" />
                            {counts.delivered} Sudah Sampai
                        </span>
                    </div>
                </div>

                {/* Filters, View Mode Toggle & Search */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {(
                            [
                                { key: 'all', label: `Semua (${counts.all})` },
                                {
                                    key: 'curating',
                                    label: `Perakitan (${counts.curating})`,
                                },
                                {
                                    key: 'packed',
                                    label: `Siap Kirim (${counts.packed})`,
                                },
                                {
                                    key: 'shipped',
                                    label: `Dalam Pengiriman (${counts.shipped})`,
                                },
                                {
                                    key: 'delivered',
                                    label: `Sudah Sampai (${counts.delivered})`,
                                },
                            ] as const
                        ).map((tab) => (
                            <Button
                                key={tab.key}
                                type="button"
                                size="sm"
                                variant={
                                    stageFilter === tab.key
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setStageFilter(tab.key)}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <AdminViewModeToggle
                            value={viewMode}
                            onChange={setViewMode}
                        />
                        <div className="relative w-full sm:w-64">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari kode, pemesan, kurir, resi..."
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>

                {/* Shipments List */}
                {filteredShipments.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            Belum ada paket di tahap ini. Pesanan yang Anda ACC
                            di menu <strong>Pesanan Masuk</strong> akan otomatis
                            muncul di sini.
                        </CardContent>
                    </Card>
                ) : (
                    <div
                        className={
                            viewMode === 'minimal'
                                ? 'grid gap-2.5'
                                : 'grid gap-5'
                        }
                    >
                        {filteredShipments.map((order) => {
                            const stageKey = resolveStage(order);
                            const stageMeta = STAGE_MAP[stageKey];
                            const stageIndex = STAGES.findIndex(
                                (s) => s.key === stageKey,
                            );
                            const isBusy = busyOrderId === order.id;

                            if (viewMode === 'minimal') {
                                return (
                                    <div
                                        key={order.id}
                                        className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-xs transition-colors hover:border-[#A88B54]/70 lg:flex-row lg:items-center lg:justify-between"
                                    >
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                                    {order.order_code}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        stageMeta.badgeClass
                                                    }
                                                >
                                                    {stageMeta.shortLabel}
                                                </Badge>
                                                {/* Compact 4-dot progress indicator */}
                                                <div
                                                    className="inline-flex items-center gap-1"
                                                    title={`Tahap ${stageIndex + 1}/4: ${stageMeta.label}`}
                                                >
                                                    {STAGES.map((st, idx) => (
                                                        <span
                                                            key={st.key}
                                                            className={`size-1.5 rounded-full ${
                                                                idx <=
                                                                stageIndex
                                                                    ? 'bg-[#A88B54]'
                                                                    : 'bg-secondary'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-serif text-sm font-bold text-[#725C30] dark:text-[#C5AA74]">
                                                    {formatRupiah(
                                                        order.total_price,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                                <span className="font-serif text-sm font-semibold text-foreground">
                                                    {order.product_name} ×{' '}
                                                    {order.quantity}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    Pemesan:{' '}
                                                    <strong className="text-foreground">
                                                        {order.customer_name}
                                                    </strong>
                                                </span>
                                                {(order.courier_name ||
                                                    order.tracking_number) && (
                                                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                        <Truck className="size-3 text-[#A88B54]" />
                                                        {order.courier_name ||
                                                            'Kurir'}
                                                        {order.tracking_number
                                                            ? ` (${order.tracking_number})`
                                                            : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openTrackingModal(order)
                                                }
                                                className="h-8 px-2.5 text-xs"
                                            >
                                                Detail &amp; Update
                                            </Button>

                                            {stageMeta.nextStage &&
                                                stageMeta.nextButtonLabel && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        disabled={isBusy}
                                                        onClick={() =>
                                                            handleQuickAdvance(
                                                                order,
                                                                stageMeta.nextStage!,
                                                            )
                                                        }
                                                        className="h-8 px-2.5 text-xs"
                                                    >
                                                        <span>
                                                            {isBusy
                                                                ? '...'
                                                                : stageMeta.nextButtonLabel}
                                                        </span>
                                                        <ArrowRight className="size-3 text-[#C5AA74] dark:text-primary-foreground" />
                                                    </Button>
                                                )}

                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                title="Kirim Update ke WA"
                                                className="size-8"
                                                asChild
                                            >
                                                <a
                                                    href={buildWhatsappShareUrl(
                                                        order,
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Send className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                                </a>
                                            </Button>

                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                title="Hapus pesanan"
                                                className="size-8 hover:border-destructive/60 hover:bg-destructive/10"
                                                onClick={() =>
                                                    setPendingDelete(order)
                                                }
                                            >
                                                <Trash2 className="size-3.5 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Card
                                    key={order.id}
                                    className="hover:border-[#A88B54]/70"
                                >
                                    <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                                    {order.order_code}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        stageMeta.badgeClass
                                                    }
                                                >
                                                    {stageKey === 'shipped' && (
                                                        <span className="size-1.5 animate-pulse rounded-full bg-[#C5AA74]" />
                                                    )}
                                                    {stageMeta.label}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1 border-border bg-card text-foreground"
                                                >
                                                    <Wallet className="size-3 text-[#725C30] dark:text-[#C5AA74]" />
                                                    {formatPaymentMethodLabel(
                                                        order.payment_method,
                                                    )}
                                                </Badge>
                                                {order.discount_percent &&
                                                order.discount_percent > 0 ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 border-[#A88B54]/60 bg-[#EAE1CE]/85 text-[#725C30] dark:bg-[#203252] dark:text-[#C5AA74]"
                                                    >
                                                        <Tag className="size-3" />
                                                        {order.promo_name ||
                                                            'Promo'}{' '}
                                                        (-
                                                        {order.discount_percent}
                                                        %)
                                                    </Badge>
                                                ) : null}
                                            </div>

                                            <CardTitle className="flex flex-wrap items-center gap-2 font-serif text-xl">
                                                <Package className="size-4 text-[#A88B54]" />
                                                <span>
                                                    {order.product_name}
                                                </span>
                                                <span className="font-sans text-sm font-normal text-muted-foreground">
                                                    × {order.quantity} paket
                                                </span>
                                            </CardTitle>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                Total Pesanan
                                            </p>
                                            <p className="font-serif text-xl font-bold text-[#725C30] dark:text-[#C5AA74]">
                                                {formatRupiah(
                                                    order.total_price,
                                                )}
                                            </p>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 pt-1">
                                        {/* 4-Stage Visual Progress Stepper */}
                                        <div className="rounded-xl border border-border bg-background/70 p-4">
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                {STAGES.map((step, idx) => {
                                                    const reached =
                                                        idx <= stageIndex;
                                                    const isCurrent =
                                                        idx === stageIndex;
                                                    return (
                                                        <div
                                                            key={step.key}
                                                            className="relative flex flex-col gap-1.5"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors ${
                                                                        reached
                                                                            ? 'border-[#A88B54] bg-[#16233B] text-[#C5AA74]'
                                                                            : 'border-border bg-card text-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {reached &&
                                                                    idx <
                                                                        stageIndex ? (
                                                                        <CheckCircle2 className="size-3.5" />
                                                                    ) : (
                                                                        idx + 1
                                                                    )}
                                                                </div>
                                                                <span
                                                                    className={`text-xs font-semibold ${
                                                                        isCurrent
                                                                            ? 'text-foreground'
                                                                            : reached
                                                                              ? 'text-foreground/80'
                                                                              : 'text-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {
                                                                        step.shortLabel
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                                                                <div
                                                                    className={`h-full transition-all duration-500 ${
                                                                        reached
                                                                            ? 'bg-[#A88B54]'
                                                                            : 'bg-transparent'
                                                                    }`}
                                                                    style={{
                                                                        width: reached
                                                                            ? '100%'
                                                                            : '0%',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="mt-2.5 text-xs text-muted-foreground">
                                                <strong className="text-foreground">
                                                    Posisi Saat Ini:
                                                </strong>{' '}
                                                {order.shipping_notes ||
                                                    stageMeta.description}
                                            </p>
                                        </div>

                                        {/* Info Grid: Package + Courier + Recipient */}
                                        <div className="grid gap-3 rounded-xl border border-border bg-background/50 p-4 text-xs md:grid-cols-3">
                                            {/* Col 1: Pemesan & Alamat */}
                                            <div className="space-y-1.5 text-muted-foreground">
                                                <p className="text-[11px] font-semibold tracking-wider text-foreground uppercase">
                                                    Penerima &amp; Alamat
                                                </p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {order.customer_name}
                                                </p>
                                                <p className="flex items-center gap-1.5">
                                                    <Phone className="size-3.5 text-[#A88B54]" />
                                                    {order.customer_whatsapp}
                                                </p>
                                                {order.customer_email && (
                                                    <p className="flex items-center gap-1.5">
                                                        <Mail className="size-3.5 text-[#A88B54]" />
                                                        {order.customer_email}
                                                    </p>
                                                )}
                                                <p className="flex items-start gap-1.5">
                                                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                                    <span>
                                                        {order.shipping_address}
                                                    </span>
                                                </p>
                                                <a
                                                    href={getMapsUrl(
                                                        order.shipping_address,
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 font-semibold text-[#725C30] hover:underline dark:text-[#C5AA74]"
                                                >
                                                    <span>
                                                        Buka di Google Maps
                                                    </span>
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            </div>

                                            {/* Col 2: Informasi Paket */}
                                            <div className="space-y-1.5 text-muted-foreground">
                                                <p className="text-[11px] font-semibold tracking-wider text-foreground uppercase">
                                                    Informasi Paket
                                                </p>
                                                {order.product?.contents &&
                                                    order.product.contents
                                                        .length > 0 && (
                                                        <div className="flex flex-wrap gap-1 pt-0.5">
                                                            {order.product.contents.map(
                                                                (item, idx) => (
                                                                    <span
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-foreground"
                                                                    >
                                                                        <Sparkles className="size-2.5 text-[#A88B54]" />
                                                                        {item}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                {order.delivery_date && (
                                                    <p className="flex items-center gap-1.5 pt-1">
                                                        <Calendar className="size-3.5 text-[#A88B54]" />
                                                        Target Kirim:{' '}
                                                        <span className="font-medium text-foreground">
                                                            {new Date(
                                                                order.delivery_date,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                            )}
                                                        </span>
                                                    </p>
                                                )}
                                                {order.greeting_card_note && (
                                                    <p className="flex items-start gap-1.5 rounded-lg bg-secondary/60 p-2 text-foreground">
                                                        <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                                        <span>
                                                            &ldquo;
                                                            {
                                                                order.greeting_card_note
                                                            }
                                                            &rdquo;
                                                        </span>
                                                    </p>
                                                )}
                                                {order.admin_note && (
                                                    <p className="text-[11px] italic">
                                                        Catatan ACC:{' '}
                                                        {order.admin_note}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Col 3: Logistik & Penerimaan */}
                                            <div className="space-y-1.5 text-muted-foreground">
                                                <p className="text-[11px] font-semibold tracking-wider text-foreground uppercase">
                                                    Status Kurir &amp; Sampai
                                                </p>
                                                <p className="flex items-center gap-1.5">
                                                    <Truck className="size-3.5 text-[#A88B54]" />
                                                    Kurir:{' '}
                                                    <span className="font-semibold text-foreground">
                                                        {order.courier_name ||
                                                            'Belum ditentukan'}
                                                    </span>
                                                </p>
                                                <p className="flex items-center gap-1.5">
                                                    <Box className="size-3.5 text-[#A88B54]" />
                                                    No. Resi:{' '}
                                                    <span className="font-mono font-semibold text-foreground">
                                                        {order.tracking_number ||
                                                            '-'}
                                                    </span>
                                                </p>
                                                {order.shipped_at && (
                                                    <p className="flex items-center gap-1.5">
                                                        <Clock className="size-3.5 text-[#A88B54]" />
                                                        Dikirim:{' '}
                                                        {new Date(
                                                            order.shipped_at,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </p>
                                                )}
                                                {order.delivered_at && (
                                                    <p className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                                                        <UserCheck className="size-3.5" />
                                                        Sampai:{' '}
                                                        {new Date(
                                                            order.delivered_at,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                        {order.recipient_name
                                                            ? ` (${order.recipient_name})`
                                                            : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openTrackingModal(order)
                                                    }
                                                >
                                                    <History className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                                    Update Posisi &amp; Kurir
                                                </Button>

                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <a
                                                        href={buildWhatsappShareUrl(
                                                            order,
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Send className="size-3.5 text-[#725C30] dark:text-[#C5AA74]" />
                                                        Kirim Update ke WA
                                                    </a>
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {stageMeta.nextStage &&
                                                    stageMeta.nextButtonLabel && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            disabled={isBusy}
                                                            onClick={() =>
                                                                handleQuickAdvance(
                                                                    order,
                                                                    stageMeta.nextStage!,
                                                                )
                                                            }
                                                        >
                                                            <span>
                                                                {isBusy
                                                                    ? 'Menyimpan...'
                                                                    : stageMeta.nextButtonLabel}
                                                            </span>
                                                            <ArrowRight className="size-3.5 text-[#C5AA74] dark:text-primary-foreground" />
                                                        </Button>
                                                    )}

                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    title="Hapus pesanan"
                                                    className="hover:border-destructive/60 hover:bg-destructive/10"
                                                    onClick={() =>
                                                        setPendingDelete(order)
                                                    }
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

            {/* Tracking & Timeline Update Modal */}
            <Dialog
                open={activeOrder !== null}
                onOpenChange={(open) => !open && setActiveOrder(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    {activeOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 font-serif text-xl">
                                    <Truck className="size-4 text-[#A88B54]" />
                                    Update Pelacakan {activeOrder.order_code}
                                </DialogTitle>
                                <DialogDescription>
                                    {activeOrder.product_name} ×{' '}
                                    {activeOrder.quantity} paket — Pemesan:{' '}
                                    <strong className="text-foreground">
                                        {activeOrder.customer_name}
                                    </strong>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-1.5 rounded-xl border border-border bg-background/60 p-3 text-xs text-muted-foreground">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Phone className="size-3.5 text-[#A88B54]" />
                                        {activeOrder.customer_whatsapp}
                                    </span>
                                    <a
                                        href={getMapsUrl(
                                            activeOrder.shipping_address,
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-semibold text-[#725C30] hover:underline dark:text-[#C5AA74]"
                                    >
                                        <span>Buka Maps</span>
                                        <ExternalLink className="size-3" />
                                    </a>
                                </div>
                                <p className="flex items-start gap-1.5">
                                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                    <span>{activeOrder.shipping_address}</span>
                                </p>
                                {activeOrder.greeting_card_note && (
                                    <p className="flex items-start gap-1.5 text-foreground">
                                        <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                        <span>
                                            &ldquo;
                                            {activeOrder.greeting_card_note}
                                            &rdquo;
                                        </span>
                                    </p>
                                )}
                            </div>

                            <form
                                onSubmit={handleSubmitUpdate}
                                className="space-y-4"
                            >
                                <div className="grid gap-1.5">
                                    <Label htmlFor="fulfillment_stage">
                                        Tahap Proses Paket *
                                    </Label>
                                    <Select
                                        value={data.fulfillment_stage}
                                        onValueChange={(
                                            val: FulfillmentStage,
                                        ) => setData('fulfillment_stage', val)}
                                    >
                                        <SelectTrigger id="fulfillment_stage">
                                            <SelectValue placeholder="Pilih tahap paket" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STAGES.map((st) => (
                                                <SelectItem
                                                    key={st.key}
                                                    value={st.key}
                                                >
                                                    {st.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.fulfillment_stage}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="courier_name">
                                            Kurir / Ekspedisi
                                        </Label>
                                        <Input
                                            id="courier_name"
                                            value={data.courier_name}
                                            onChange={(e) =>
                                                setData(
                                                    'courier_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Kurir Studio / Paxel / JNE"
                                        />
                                        <div className="flex flex-wrap gap-1 pt-0.5">
                                            {COURIER_PRESETS.map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            'courier_name',
                                                            preset,
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                                        data.courier_name ===
                                                        preset
                                                            ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC]'
                                                            : 'border-border bg-background text-foreground hover:border-[#A88B54]'
                                                    }`}
                                                >
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>
                                        <InputError
                                            message={errors.courier_name}
                                        />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="tracking_number">
                                            Nomor Resi / ID Pengiriman
                                        </Label>
                                        <Input
                                            id="tracking_number"
                                            value={data.tracking_number}
                                            onChange={(e) =>
                                                setData(
                                                    'tracking_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: PX-20261125-8821"
                                        />
                                        <InputError
                                            message={errors.tracking_number}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="shipping_notes">
                                        Catatan Posisi / Proses Terkini
                                    </Label>
                                    <Input
                                        id="shipping_notes"
                                        value={data.shipping_notes}
                                        onChange={(e) =>
                                            setData(
                                                'shipping_notes',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Misal: Kurir sudah berangkat dari Studio Ciamis menuju tujuan..."
                                    />
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                        {POSITION_NOTE_PRESETS.map((note) => (
                                            <button
                                                key={note}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'shipping_notes',
                                                        note,
                                                    )
                                                }
                                                className="cursor-pointer rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground hover:border-[#A88B54] hover:text-foreground"
                                            >
                                                {note}
                                            </button>
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.shipping_notes}
                                    />
                                </div>

                                {data.fulfillment_stage === 'delivered' && (
                                    <div className="grid gap-1.5 rounded-xl border border-emerald-700/25 bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
                                        <Label htmlFor="recipient_name">
                                            Nama Penerima di Lokasi (Opsional)
                                        </Label>
                                        <Input
                                            id="recipient_name"
                                            value={data.recipient_name}
                                            onChange={(e) =>
                                                setData(
                                                    'recipient_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Diterima langsung oleh Ibu Rina / Resepsionis"
                                        />
                                        <InputError
                                            message={errors.recipient_name}
                                        />
                                    </div>
                                )}

                                {/* Timeline Log Preview */}
                                {activeOrder.tracking_history &&
                                    activeOrder.tracking_history.length > 0 && (
                                        <div className="space-y-2 rounded-xl border border-border bg-background/60 p-3.5">
                                            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Riwayat Perjalanan Paket
                                            </p>
                                            <div className="max-h-40 space-y-2.5 overflow-y-auto pr-1">
                                                {[
                                                    ...activeOrder.tracking_history,
                                                ]
                                                    .reverse()
                                                    .map((entry, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start gap-2.5 text-xs"
                                                        >
                                                            <span className="mt-1 size-2 shrink-0 rounded-full bg-[#A88B54]" />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-semibold text-foreground">
                                                                    {
                                                                        entry.label
                                                                    }
                                                                </p>
                                                                <p className="text-muted-foreground">
                                                                    {entry.note}
                                                                </p>
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    {new Date(
                                                                        entry.timestamp,
                                                                    ).toLocaleString(
                                                                        'id-ID',
                                                                    )}{' '}
                                                                    •{' '}
                                                                    {
                                                                        entry.actor
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setActiveOrder(null)}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Update Paket'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDeleteDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Hapus Data Paket?"
                description={
                    pendingDelete
                        ? `Pesanan ${pendingDelete.order_code} atas nama "${pendingDelete.customer_name}" akan dihapus permanen.`
                        : ''
                }
                processing={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

AdminShipments.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pelacakan Paket', href: shipmentsIndex() },
    ],
};
