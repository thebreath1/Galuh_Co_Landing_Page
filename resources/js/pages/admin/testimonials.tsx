import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, MessageSquareQuote, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { dashboard } from '@/routes';
import {
    destroy as destroyTestimonial,
    index as testimonialsIndex,
    store as storeTestimonial,
    toggle as toggleTestimonial,
    update as updateTestimonial,
} from '@/routes/admin/testimonials';
import type { TestimonialRecord } from '@/types/landing';

interface AdminTestimonialsProps {
    testimonials: TestimonialRecord[];
}

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};

interface TestimonialFormState {
    name: string;
    initials: string;
    role: string;
    content: string;
    product_tag: string;
    rating: string;
    sort_order: string;
    is_active: boolean;
}

export default function AdminTestimonials({ testimonials }: AdminTestimonialsProps) {
    const { flash } = usePage<FlashProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TestimonialRecord | null>(null);
    const [pendingDelete, setPendingDelete] = useState<TestimonialRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } =
        useForm<TestimonialFormState>({
            name: '',
            initials: '',
            role: '',
            content: '',
            product_tag: '',
            rating: '5',
            sort_order: '0',
            is_active: true,
        });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const openCreateDialog = () => {
        clearErrors();
        reset();
        setEditingItem(null);
        setDialogOpen(true);
    };

    const openEditDialog = (item: TestimonialRecord) => {
        clearErrors();
        setEditingItem(item);
        setData({
            name: item.name,
            initials: item.initials,
            role: item.role,
            content: item.content,
            product_tag: item.product_tag,
            rating: String(item.rating),
            sort_order: String(item.sort_order),
            is_active: item.is_active,
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((current) => ({
            ...current,
            rating: Number(current.rating || 5),
            sort_order: Number(current.sort_order || 0),
        }));

        if (editingItem) {
            put(updateTestimonial.url(editingItem.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDialogOpen(false);
                    setEditingItem(null);
                },
            });
            return;
        }

        post(storeTestimonial.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setDialogOpen(false);
            },
        });
    };

    const handleToggleVisibility = (item: TestimonialRecord) => {
        router.patch(toggleTestimonial.url(item.id), {}, { preserveScroll: true });
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        router.delete(destroyTestimonial.url(pendingDelete.id), {
            preserveScroll: true,
            onError: () => toast.error('Gagal menghapus testimoni.'),
            onFinish: () => {
                setIsDeleting(false);
                setPendingDelete(null);
            },
        });
    };

    const filtered = testimonials.filter((item) => {
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && item.is_active) ||
            (statusFilter === 'hidden' && !item.is_active);
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
            query === '' ||
            item.name.toLowerCase().includes(query) ||
            item.role.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query) ||
            item.product_tag.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
    });

    return (
        <>
            <Head title="Kelola Testimoni Klien" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="h-px w-6 bg-[#A88B54]" aria-hidden="true" />
                            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                Suara Pelanggan
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Kelola Testimoni Klien
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Tambah, ubah kutipan, rating bintang, tag produk, dan visibilitas testimoni di landing page.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                        Tambah Testimoni
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            { key: 'all' as const, label: 'Semua' },
                            { key: 'active' as const, label: 'Aktif' },
                            { key: 'hidden' as const, label: 'Disembunyikan' },
                        ].map((tab) => (
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
                            placeholder="Cari nama, jabatan, atau kutipan..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Testimonials Grid */}
                {filtered.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            Tidak ada testimoni yang sesuai filter saat ini.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filtered.map((item) => (
                            <Card key={item.id} className="flex flex-col justify-between hover:border-[#A88B54]/70">
                                <CardContent className="space-y-4 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#A88B54]/50 bg-[#16233B] font-serif text-sm font-bold text-[#F2EBDC]">
                                                {item.initials}
                                            </div>
                                            <div>
                                                <h2 className="font-serif text-base font-semibold leading-snug text-foreground">
                                                    {item.name}
                                                </h2>
                                                <p className="text-xs text-muted-foreground">{item.role}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                                {item.is_active ? 'Aktif' : 'Disembunyikan'}
                                            </Badge>
                                            <Badge variant="outline">#{item.sort_order}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-[#A88B54]">
                                        {Array.from({ length: item.rating }).map((_, idx) => (
                                            <Star key={idx} className="size-4 fill-current" />
                                        ))}
                                    </div>

                                    <blockquote className="font-serif text-base leading-relaxed italic text-foreground/90">
                                        &ldquo;{item.content}&rdquo;
                                    </blockquote>

                                    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-[#725C30] dark:text-[#C5AA74]">
                                        <MessageSquareQuote className="size-3.5 text-[#A88B54]" />
                                        <span>{item.product_tag}</span>
                                    </div>

                                    <div className="flex items-center gap-2 border-t pt-3">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => openEditDialog(item)}
                                        >
                                            <Pencil className="size-3.5" />
                                            Edit Testimoni
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            title={item.is_active ? 'Sembunyikan' : 'Tampilkan'}
                                            onClick={() => handleToggleVisibility(item)}
                                        >
                                            {item.is_active ? (
                                                <Eye className="size-4" />
                                            ) : (
                                                <EyeOff className="size-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            title="Hapus"
                                            className="hover:border-destructive/60 hover:bg-destructive/10"
                                            onClick={() => setPendingDelete(item)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? `Edit Testimoni "${editingItem.name}"` : 'Tambah Testimoni Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Isi profil klien, rating bintang, dan teks ulasan untuk ditampilkan pada carousel testimoni.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-[1fr_110px]">
                            <div className="grid gap-1.5">
                                <Label htmlFor="t_name">Nama Klien</Label>
                                <Input
                                    id="t_name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Dian Sastrawati"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="t_initials">Inisial (Opsional)</Label>
                                <Input
                                    id="t_initials"
                                    value={data.initials}
                                    maxLength={4}
                                    onChange={(e) => setData('initials', e.target.value.toUpperCase())}
                                    placeholder="Auto"
                                />
                                <InputError message={errors.initials} />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="t_role">Jabatan / Perusahaan / Kota</Label>
                            <Input
                                id="t_role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                placeholder="VP Human Capital, PT Astra Financial"
                                required
                            />
                            <InputError message={errors.role} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="t_rating">Rating Bintang</Label>
                                <Select
                                    value={data.rating}
                                    onValueChange={(val) => setData('rating', val)}
                                >
                                    <SelectTrigger id="t_rating">
                                        <SelectValue placeholder="Pilih rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[5, 4, 3, 2, 1].map((num) => (
                                            <SelectItem key={num} value={String(num)}>
                                                {num} Bintang
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.rating} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="t_sort_order">Urutan Tampil</Label>
                                <Input
                                    id="t_sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="t_product_tag">Tag Produk / Konteks Pesanan</Label>
                            <Input
                                id="t_product_tag"
                                value={data.product_tag}
                                onChange={(e) => setData('product_tag', e.target.value)}
                                placeholder="Synergy Grand Hamper • Corporate Order"
                                required
                            />
                            <InputError message={errors.product_tag} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="t_content">Isi Kutipan Testimoni</Label>
                            <textarea
                                id="t_content"
                                rows={4}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Tuliskan ulasan klien..."
                                required
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            />
                            <InputError message={errors.content} />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="t_is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked === true)}
                            />
                            <Label htmlFor="t_is_active" className="cursor-pointer font-normal">
                                Tampilkan langsung di carousel testimoni website
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Testimoni'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDeleteDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Hapus Testimoni Klien?"
                description={
                    pendingDelete
                        ? `Testimoni dari "${pendingDelete.name}" akan dihapus permanen.`
                        : ''
                }
                processing={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

AdminTestimonials.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Testimoni', href: testimonialsIndex() },
    ],
};
