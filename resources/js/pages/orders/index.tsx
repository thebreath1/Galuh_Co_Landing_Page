import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Box,
    Calendar,
    CheckCircle2,
    Clock,
    LogOut,
    MapPin,
    MessageSquareText,
    PackageCheck,
    Phone,
    Settings,
    ShoppingBag,
    Tag,
    Truck,
    Wallet,
    XCircle,
} from 'lucide-react';
import { formatPaymentMethodLabel } from '@/lib/payment-methods';
import { home, logout } from '@/routes';
import { edit as profileEdit } from '@/routes/profile';
import type { User } from '@/types';
import type {
    FulfillmentStage,
    OrderRecord,
    OrderStatus,
} from '@/types/landing';

interface CustomerOrdersPageProps {
    orders: OrderRecord[];
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const STATUS_META: Record<
    OrderStatus,
    { label: string; badgeClass: string; icon: typeof Clock }
> = {
    pending: {
        label: 'Menunggu ACC Admin',
        badgeClass: 'border-[#A88B54]/60 bg-[#EAE1CE] text-[#725C30]',
        icon: Clock,
    },
    approved: {
        label: 'Di-ACC & Diproses',
        badgeClass: 'border-[#16233B] bg-[#16233B] text-[#F2EBDC]',
        icon: PackageCheck,
    },
    completed: {
        label: 'Pesanan Selesai',
        badgeClass: 'border-emerald-700/30 bg-emerald-50 text-emerald-800',
        icon: CheckCircle2,
    },
    rejected: {
        label: 'Ditolak Admin',
        badgeClass: 'border-red-300 bg-red-50 text-red-700',
        icon: XCircle,
    },
};

const FULFILLMENT_STEPS: { key: FulfillmentStage; label: string }[] = [
    { key: 'curating', label: 'Perakitan' },
    { key: 'packed', label: 'Siap Kirim' },
    { key: 'shipped', label: 'Dikirim' },
    { key: 'delivered', label: 'Sampai' },
];

export default function CustomerOrdersPage({
    orders,
}: CustomerOrdersPageProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    return (
        <div className="min-h-screen bg-[#F2EBDC] font-sans text-[#1E2430] antialiased">
            <Head title="Pesanan Saya | GALUH & CO." />

            <header className="sticky top-0 z-30 border-b border-[#D8CEBA] bg-[#F2EBDC]/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2 rounded-full border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#16233B] transition-colors hover:bg-[#EAE1CE]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 text-[#725C30]" />
                            <span>Kembali ke Katalog</span>
                        </Link>
                        <div className="hidden h-5 w-px bg-[#D8CEBA] sm:block" />
                        <div className="hidden sm:block">
                            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#725C30] uppercase">
                                Akun Pelanggan
                            </p>
                            <p className="text-xs font-semibold text-[#16233B]">
                                {auth.user.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={profileEdit()}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CEBA] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#16233B] transition-colors hover:bg-[#EAE1CE]"
                        >
                            <Settings className="h-3.5 w-3.5 text-[#725C30]" />
                            <span>Profil</span>
                        </Link>
                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D8CEBA] px-3.5 py-1.5 text-xs font-semibold text-[#6E675D] transition-colors hover:bg-[#EAE1CE] hover:text-[#16233B]"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Keluar</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-[#725C30] uppercase">
                            Riwayat & Pelacakan
                        </p>
                        <h1 className="font-serif text-3xl font-bold text-[#16233B]">
                            Pesanan Hampers Saya
                        </h1>
                        <p className="mt-1 text-sm text-[#6E675D]">
                            Pantau status persetujuan admin, nomor resi, dan
                            progres pengiriman paket Anda.
                        </p>
                    </div>
                    <Link
                        href="/#koleksi"
                        className="inline-flex items-center gap-2 rounded-full bg-[#16233B] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#F2EBDC] uppercase shadow-sm transition-colors hover:bg-[#203252]"
                    >
                        <ShoppingBag className="h-3.5 w-3.5 text-[#C5AA74]" />
                        <span>Pesan Hampers Lagi</span>
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="space-y-4 rounded-2xl border border-[#D8CEBA] bg-[#FFFFFF] p-10 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAE1CE] text-[#725C30]">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="font-serif text-xl font-bold text-[#16233B]">
                                Belum Ada Pesanan
                            </h2>
                            <p className="mx-auto max-w-md text-sm text-[#6E675D]">
                                Anda belum melakukan pemesanan hampers. Jelajahi
                                koleksi GALUH &amp; CO. dan pilih bingkisan
                                terbaik Anda.
                            </p>
                        </div>
                        <Link
                            href="/#koleksi"
                            className="inline-flex items-center gap-2 rounded-full bg-[#16233B] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#F2EBDC] uppercase hover:bg-[#203252]"
                        >
                            <span>Lihat Koleksi Hampers</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => {
                            const statusMeta =
                                STATUS_META[order.status] ??
                                STATUS_META.pending;
                            const StatusIcon = statusMeta.icon;
                            const showTracking =
                                order.status === 'approved' ||
                                order.status === 'completed';
                            const currentStage: FulfillmentStage =
                                order.fulfillment_stage ??
                                (order.status === 'completed'
                                    ? 'delivered'
                                    : 'curating');
                            const currentStageIndex =
                                FULFILLMENT_STEPS.findIndex(
                                    (s) => s.key === currentStage,
                                );

                            return (
                                <article
                                    key={order.id}
                                    className="space-y-5 rounded-2xl border border-[#D8CEBA] bg-[#FFFFFF] p-5 shadow-xs sm:p-6"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EAE1CE] pb-4">
                                        <div className="flex items-center gap-4">
                                            {order.product?.image ? (
                                                <img
                                                    src={order.product.image}
                                                    alt={order.product_name}
                                                    className="h-16 w-16 shrink-0 rounded-xl bg-[#EAE1CE] object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#EAE1CE]">
                                                    <Box className="h-6 w-6 text-[#725C30]" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-[#725C30]">
                                                        {order.order_code}
                                                    </span>
                                                    <span className="text-[11px] text-[#6E675D]">
                                                        •{' '}
                                                        {new Date(
                                                            order.created_at,
                                                        ).toLocaleDateString(
                                                            'id-ID',
                                                            {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                                <h2 className="font-serif text-lg font-bold text-[#16233B]">
                                                    {order.product_name}
                                                </h2>
                                                <p className="text-xs text-[#6E675D]">
                                                    {order.quantity} paket ×{' '}
                                                    {formatRupiah(
                                                        order.unit_price,
                                                    )}
                                                    {order.promo_name && (
                                                        <span className="ml-2 inline-flex items-center gap-1 font-semibold text-[#725C30]">
                                                            <Tag className="h-3 w-3" />
                                                            {order.promo_name}{' '}
                                                            (-
                                                            {
                                                                order.discount_percent
                                                            }
                                                            %)
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start gap-1.5 sm:items-end">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                <span>{statusMeta.label}</span>
                                            </span>
                                            <p className="font-serif text-lg font-bold text-[#16233B]">
                                                {formatRupiah(
                                                    order.total_price,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 text-xs text-[#6E675D] md:grid-cols-2">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#725C30]" />
                                            <span>
                                                <strong className="text-[#16233B]">
                                                    Alamat:
                                                </strong>{' '}
                                                {order.shipping_address}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-4 w-4 shrink-0 text-[#725C30]" />
                                                <span>
                                                    <strong className="text-[#16233B]">
                                                        Pembayaran:
                                                    </strong>{' '}
                                                    {formatPaymentMethodLabel(
                                                        order.payment_method,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 shrink-0 text-[#725C30]" />
                                                <span>
                                                    <strong className="text-[#16233B]">
                                                        WhatsApp:
                                                    </strong>{' '}
                                                    {order.customer_whatsapp}
                                                </span>
                                            </div>
                                            {order.delivery_date && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 shrink-0 text-[#725C30]" />
                                                    <span>
                                                        <strong className="text-[#16233B]">
                                                            Target Kirim:
                                                        </strong>{' '}
                                                        {order.delivery_date}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {order.greeting_card_note && (
                                        <div className="flex items-start gap-2 rounded-xl border border-[#EAE1CE] bg-[#F2EBDC]/45 px-3.5 py-2.5 text-xs text-[#6E675D]">
                                            <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-[#725C30]" />
                                            <span>
                                                <strong className="text-[#16233B]">
                                                    Kartu Ucapan:
                                                </strong>{' '}
                                                {order.greeting_card_note}
                                            </span>
                                        </div>
                                    )}

                                    {order.admin_note && (
                                        <div className="rounded-xl border border-[#A88B54]/40 bg-[#EAE1CE]/60 px-3.5 py-2.5 text-xs text-[#16233B]">
                                            <strong>Catatan Admin:</strong>{' '}
                                            {order.admin_note}
                                        </div>
                                    )}

                                    {showTracking && (
                                        <div className="space-y-4 rounded-xl border border-[#D8CEBA] bg-[#F2EBDC]/35 p-4">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-[#16233B]">
                                                    <Truck className="h-4 w-4 text-[#725C30]" />
                                                    <span>
                                                        Progres Pengiriman Paket
                                                    </span>
                                                </div>
                                                {(order.courier_name ||
                                                    order.tracking_number) && (
                                                    <div className="text-xs text-[#6E675D]">
                                                        {order.courier_name && (
                                                            <span className="font-semibold text-[#16233B]">
                                                                {
                                                                    order.courier_name
                                                                }
                                                            </span>
                                                        )}
                                                        {order.tracking_number && (
                                                            <span className="ml-2 rounded border border-[#D8CEBA] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[#16233B]">
                                                                Resi:{' '}
                                                                {
                                                                    order.tracking_number
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                {FULFILLMENT_STEPS.map(
                                                    (step, idx) => {
                                                        const reached =
                                                            idx <=
                                                            currentStageIndex;
                                                        return (
                                                            <div
                                                                key={step.key}
                                                                className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-colors ${
                                                                    reached
                                                                        ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC]'
                                                                        : 'border-[#D8CEBA] bg-[#FFFFFF] text-[#6E675D]'
                                                                }`}
                                                            >
                                                                {step.label}
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>

                                            {order.tracking_history &&
                                                order.tracking_history.length >
                                                    0 && (
                                                    <div className="space-y-2 border-t border-[#D8CEBA]/70 pt-3">
                                                        <p className="text-[11px] font-semibold tracking-wider text-[#725C30] uppercase">
                                                            Riwayat Pelacakan
                                                        </p>
                                                        <ul className="space-y-2">
                                                            {[
                                                                ...order.tracking_history,
                                                            ]
                                                                .reverse()
                                                                .map(
                                                                    (
                                                                        entry,
                                                                        idx,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="flex items-start justify-between gap-3 text-xs"
                                                                        >
                                                                            <div>
                                                                                <p className="font-semibold text-[#16233B]">
                                                                                    {
                                                                                        entry.label
                                                                                    }
                                                                                </p>
                                                                                <p className="text-[#6E675D]">
                                                                                    {
                                                                                        entry.note
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            <span className="shrink-0 text-[11px] text-[#6E675D]">
                                                                                {new Date(
                                                                                    entry.timestamp,
                                                                                ).toLocaleString(
                                                                                    'id-ID',
                                                                                    {
                                                                                        day: 'numeric',
                                                                                        month: 'short',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    },
                                                                                )}
                                                                            </span>
                                                                        </li>
                                                                    ),
                                                                )}
                                                        </ul>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
