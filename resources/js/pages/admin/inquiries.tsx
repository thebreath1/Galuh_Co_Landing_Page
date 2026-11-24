import { useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Building2, Calendar, Mail, MessageSquare, Package, Phone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { destroy as destroyInquiry, index as inquiriesIndex } from '@/routes/admin/inquiries';
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

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleDelete = (inquiry: InquiryRecord) => {
        if (!window.confirm(`Hapus inquiry dari "${inquiry.name}"?`)) return;
        router.delete(destroyInquiry.url(inquiry.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Inquiry Corporate Masuk" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Inquiry Corporate Gifting</h1>
                    <p className="text-sm text-muted-foreground">
                        Daftar permintaan penawaran B2B yang dikirim melalui formulir di landing page.
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
                            <Card key={inq.id}>
                                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                                    <div className="space-y-1">
                                        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                                            <span>{inq.name}</span>
                                            {inq.company && (
                                                <Badge variant="secondary" className="gap-1">
                                                    <Building2 className="size-3" />
                                                    {inq.company}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                <Phone className="size-3.5" />
                                                {inq.whatsapp_number}
                                            </span>
                                            {inq.email && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Mail className="size-3.5" />
                                                    {inq.email}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1">
                                                <Package className="size-3.5" />
                                                {inq.estimated_quantity}
                                            </span>
                                            {inq.needed_date && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar className="size-3.5" />
                                                    Target: {new Date(inq.needed_date).toLocaleDateString('id-ID')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {inq.budget_per_package && (
                                            <Badge variant="outline">{inq.budget_per_package}</Badge>
                                        )}
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            title="Hapus inquiry"
                                            onClick={() => handleDelete(inq)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                {inq.notes && (
                                    <CardContent className="pt-0">
                                        <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                                            <MessageSquare className="mt-0.5 size-4 shrink-0" />
                                            <p className="whitespace-pre-line">{inq.notes}</p>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminInquiries.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inquiry Masuk', href: inquiriesIndex() },
    ],
};
