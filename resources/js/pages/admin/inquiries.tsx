import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Mail,
    MessageSquare,
    Package,
    Phone,
    Trash2,
    Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPaymentMethodLabel } from '@/lib/payment-methods';
import { dashboard } from '@/routes';
import {
    destroy as destroyInquiry,
    index as inquiriesIndex,
} from '@/routes/admin/inquiries';
import type { InquiryRecord } from '@/types/landing';

interface AdminInquiriesProps {
    inquiries: InquiryRecord[];
}

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};

export default function AdminInquiries({ inquiries }: AdminInquiriesProps) {
    const { flash } = usePage<FlashProps>().props;
    const [pendingDelete, setPendingDelete] = useState<InquiryRecord | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        router.delete(destroyInquiry.url(pendingDelete.id), {
            preserveScroll: true,
            onError: () =>
                toast.error('Gagal menghapus data inquiry. Silakan coba lagi.'),
            onFinish: () => {
                setIsDeleting(false);
                setPendingDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Inquiry Corporate Masuk" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="space-y-1.5 border-b border-border pb-5">
                    <div className="flex items-center gap-2">
                        <span
                            className="h-px w-6 bg-[#A88B54]"
                            aria-hidden="true"
                        />
                        <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                            Permintaan B2B
                        </span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                        Inquiry Corporate Gifting
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Daftar permintaan penawaran B2B yang dikirim melalui
                        formulir di landing page.
                    </p>
                </div>

                {inquiries.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            Belum ada inquiry corporate yang masuk.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {inquiries.map((inq) => (
                            <Card
                                key={inq.id}
                                className="hover:border-[#A88B54]/70"
                            >
                                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                                    <div className="space-y-1.5">
                                        <CardTitle className="flex flex-wrap items-center gap-2 font-serif text-lg">
                                            <span>{inq.name}</span>
                                            {inq.company && (
                                                <Badge
                                                    variant="default"
                                                    className="gap-1 font-sans"
                                                >
                                                    <Building2 className="size-3 text-[#C5AA74]" />
                                                    {inq.company}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                <Phone className="size-3.5 text-[#A88B54]" />
                                                {inq.whatsapp_number}
                                            </span>
                                            {inq.email && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Mail className="size-3.5 text-[#A88B54]" />
                                                    {inq.email}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1">
                                                <Package className="size-3.5 text-[#A88B54]" />
                                                {inq.estimated_quantity}
                                            </span>
                                            {inq.needed_date && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar className="size-3.5 text-[#A88B54]" />
                                                    Target:{' '}
                                                    {new Date(
                                                        inq.needed_date,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1 font-medium text-[#725C30] dark:text-[#C5AA74]">
                                                <Wallet className="size-3.5 text-[#A88B54]" />
                                                {formatPaymentMethodLabel(
                                                    inq.payment_method ??
                                                        'invoice_termin',
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {inq.budget_per_package && (
                                            <Badge
                                                variant="outline"
                                                className="text-[#725C30] dark:text-[#C5AA74]"
                                            >
                                                {inq.budget_per_package}
                                            </Badge>
                                        )}
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            title="Hapus inquiry"
                                            className="hover:border-destructive/60 hover:bg-destructive/10"
                                            onClick={() =>
                                                setPendingDelete(inq)
                                            }
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                {inq.notes && (
                                    <CardContent className="pt-0">
                                        <div className="flex items-start gap-2 rounded-xl border border-border bg-background/60 p-3.5 text-sm text-muted-foreground">
                                            <MessageSquare className="mt-0.5 size-4 shrink-0 text-[#A88B54]" />
                                            <p className="whitespace-pre-line">
                                                {inq.notes}
                                            </p>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDeleteDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Hapus Inquiry Corporate?"
                description={
                    pendingDelete
                        ? `Inquiry atas nama "${pendingDelete.name}"${pendingDelete.company ? ` (${pendingDelete.company})` : ''} akan dihapus permanen.`
                        : ''
                }
                processing={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

AdminInquiries.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inquiry Masuk', href: inquiriesIndex() },
    ],
};
