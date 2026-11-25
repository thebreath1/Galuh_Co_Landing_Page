import { useEffect, useMemo, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CalendarRange,
    Layers,
    Package,
    Pencil,
    Percent,
    Plus,
    Power,
    Search,
    Sparkles,
    Tag,
    Trash2,
} from 'lucide-react';
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
    destroy as destroyPromo,
    index as promosIndex,
    store as storePromo,
    toggle as togglePromo,
    update as updatePromo,
} from '@/routes/admin/promos';
import type { PromoRecord, PromoScope } from '@/types/landing';

interface PromoProductOption {
    id: number;
    name: string;
    category: string;
    price_from: number;
}

interface AdminPromosProps {
    promos: PromoRecord[];
    products: PromoProductOption[];
    categories: string[];
}

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};

interface PromoFormState {
    name: string;
    description: string;
    discount_percent: string;
    scope: PromoScope;
    target_category: string;
    product_id: string;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
}

type LifecycleKey = 'running' | 'scheduled' | 'ended' | 'inactive';

function toLocalInputValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isoToLocalInputValue(iso: string): string {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return '';
    return toLocalInputValue(parsed);
}

function localInputToIsoString(localValue: string): string {
    if (!localValue) return localValue;
    const parsed = new Date(localValue);
    return Number.isNaN(parsed.getTime()) ? localValue : parsed.toISOString();
}

function getPromoLifecycle(promo: PromoRecord): {
    key: LifecycleKey;
    label: string;
    badgeClass: string;
} {
    if (!promo.is_active) {
        return {
            key: 'inactive',
            label: 'Nonaktif',
            badgeClass: 'border-destructive/30 bg-destructive/15 text-destructive',
        };
    }

    const now = Date.now();
    const start = new Date(promo.starts_at).getTime();
    const end = new Date(promo.ends_at).getTime();

    if (now < start) {
        return {
            key: 'scheduled',
            label: 'Terjadwal',
            badgeClass: 'border-[#A88B54]/60 bg-[#EAE1CE]/85 text-[#725C30] dark:bg-[#203252] dark:text-[#C5AA74]',
        };
    }

    if (now > end) {
        return {
            key: 'ended',
            label: 'Berakhir',
            badgeClass: 'border-border bg-secondary text-muted-foreground',
        };
    }

    return {
        key: 'running',
        label: 'Sedang Berjalan',
        badgeClass: 'border-emerald-700/25 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    };
}

const DISCOUNT_PRESETS = [5, 10, 15, 20, 25, 30];

export default function AdminPromos({ promos, products, categories }: AdminPromosProps) {
    const { flash } = usePage<FlashProps>().props;
    const [statusFilter, setStatusFilter] = useState<'all' | LifecycleKey>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<PromoRecord | null>(null);
    const [pendingDelete, setPendingDelete] = useState<PromoRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, clearErrors, transform } =
        useForm<PromoFormState>({
            name: '',
            description: '',
            discount_percent: '15',
            scope: 'all',
            target_category: categories[0] ?? 'Lebaran',
            product_id: products[0] ? String(products[0].id) : '',
            starts_at: '',
            ends_at: '',
            is_active: true,
        });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const applyDurationPreset = (days: number) => {
        const start = new Date();
        const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
        setData((prev) => ({
            ...prev,
            starts_at: toLocalInputValue(start),
            ends_at: toLocalInputValue(end),
        }));
    };

    const openCreateDialog = () => {
        clearErrors();
        setEditingPromo(null);
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        setData({
            name: '',
            description: '',
            discount_percent: '15',
            scope: 'all',
            target_category: categories[0] ?? 'Lebaran',
            product_id: products[0] ? String(products[0].id) : '',
            starts_at: toLocalInputValue(now),
            ends_at: toLocalInputValue(nextWeek),
            is_active: true,
        });
        setDialogOpen(true);
    };

    const openEditDialog = (promo: PromoRecord) => {
        clearErrors();
        setEditingPromo(promo);
        setData({
            name: promo.name,
            description: promo.description ?? '',
            discount_percent: String(promo.discount_percent),
            scope: promo.scope,
            target_category: promo.target_category ?? (categories[0] ?? 'Lebaran'),
            product_id: promo.product_id ? String(promo.product_id) : (products[0] ? String(products[0].id) : ''),
            starts_at: isoToLocalInputValue(promo.starts_at),
            ends_at: isoToLocalInputValue(promo.ends_at),
            is_active: promo.is_active,
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((current) => ({
            ...current,
            discount_percent: Number(current.discount_percent || 0),
            target_category: current.scope === 'category' ? current.target_category : null,
            product_id: current.scope === 'product' && current.product_id ? Number(current.product_id) : null,
            starts_at: localInputToIsoString(current.starts_at),
            ends_at: localInputToIsoString(current.ends_at),
        }));

        if (editingPromo) {
            put(updatePromo.url(editingPromo.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDialogOpen(false);
                    setEditingPromo(null);
                },
            });
            return;
        }

        post(storePromo.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setDialogOpen(false);
            },
        });
    };

    const handleToggle = (promo: PromoRecord) => {
        router.patch(togglePromo.url(promo.id), {}, { preserveScroll: true });
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        router.delete(destroyPromo.url(pendingDelete.id), {
            preserveScroll: true,
            onError: () => toast.error('Gagal menghapus promo.'),
            onFinish: () => {
                setIsDeleting(false);
                setPendingDelete(null);
            },
        });
    };

    const enrichedPromos = useMemo(
        () => promos.map((p) => ({ promo: p, lifecycle: getPromoLifecycle(p) })),
        [promos]
    );

    const filteredPromos = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return enrichedPromos.filter(({ promo, lifecycle }) => {
            const matchesStatus = statusFilter === 'all' || lifecycle.key === statusFilter;
            const matchesSearch =
                q === '' ||
                promo.name.toLowerCase().includes(q) ||
                (promo.description ?? '').toLowerCase().includes(q) ||
                (promo.target_category ?? '').toLowerCase().includes(q) ||
                (promo.product?.name ?? '').toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [enrichedPromos, statusFilter, searchQuery]);

    const runningCount = enrichedPromos.filter((i) => i.lifecycle.key === 'running').length;
    const scheduledCount = enrichedPromos.filter((i) => i.lifecycle.key === 'scheduled').length;

    const formatScopeLabel = (promo: PromoRecord) => {
        if (promo.scope === 'all') return 'Semua Hampers';
        if (promo.scope === 'category') return `Kategori ${promo.target_category ?? '-'}`;
        return promo.product ? `Produk: ${promo.product.name}` : 'Produk Khusus';
    };

    return (
        <>
            <Head title="Promo & Diskon Terjadwal" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="h-px w-6 bg-[#A88B54]" aria-hidden="true" />
                            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                Campaign Otomatis
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Promo &amp; Diskon Terjadwal
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Atur diskon persentase otomatis sesuai rentang tanggal. Harga di katalog &amp; form pesanan terpotong otomatis saat jadwal aktif.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                        Buat Promo Baru
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {(
                            [
                                { key: 'all', label: `Semua (${promos.length})` },
                                { key: 'running', label: `Sedang Berjalan (${runningCount})` },
                                { key: 'scheduled', label: `Terjadwal (${scheduledCount})` },
                                { key: 'ended', label: 'Berakhir' },
                                { key: 'inactive', label: 'Nonaktif' },
                            ] as const
                        ).map((tab) => (
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
                            placeholder="Cari nama promo atau target..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Promos Grid */}
                {filteredPromos.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            Belum ada promo terjadwal yang sesuai filter. Klik &ldquo;Buat Promo Baru&rdquo; untuk membuat diskon otomatis.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredPromos.map(({ promo, lifecycle }) => (
                            <Card key={promo.id} className="hover:border-[#A88B54]/70">
                                <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="outline" className={lifecycle.badgeClass}>
                                                        {lifecycle.key === 'running' && (
                                                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        )}
                                                        {lifecycle.label}
                                                    </Badge>
                                                    <Badge variant="outline" className="gap-1">
                                                        {promo.scope === 'all' ? (
                                                            <Sparkles className="size-3 text-[#A88B54]" />
                                                        ) : promo.scope === 'category' ? (
                                                            <Layers className="size-3 text-[#A88B54]" />
                                                        ) : (
                                                            <Package className="size-3 text-[#A88B54]" />
                                                        )}
                                                        {formatScopeLabel(promo)}
                                                    </Badge>
                                                </div>
                                                <h2 className="font-serif text-xl font-bold text-foreground">
                                                    {promo.name}
                                                </h2>
                                            </div>

                                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#A88B54]/45 bg-[#16233B] px-3 py-2 text-center text-[#F2EBDC] shrink-0">
                                                <span className="font-serif text-xl font-bold leading-none text-[#C5AA74]">
                                                    -{promo.discount_percent}%
                                                </span>
                                                <span className="mt-0.5 text-[9px] uppercase tracking-wider text-[#D8CEBA]">
                                                    Diskon
                                                </span>
                                            </div>
                                        </div>

                                        {promo.description && (
                                            <p className="text-xs leading-relaxed text-muted-foreground">
                                                {promo.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                                            <CalendarRange className="size-3.5 text-[#A88B54] shrink-0" />
                                            <span>
                                                {new Date(promo.starts_at).toLocaleString('id-ID', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </span>
                                            <span>→</span>
                                            <span className="font-medium text-foreground">
                                                {new Date(promo.ends_at).toLocaleString('id-ID', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 border-t border-border pt-3">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => openEditDialog(promo)}
                                        >
                                            <Pencil className="size-3.5" />
                                            Edit Promo
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant={promo.is_active ? 'outline' : 'secondary'}
                                            title={promo.is_active ? 'Nonaktifkan promo' : 'Aktifkan promo'}
                                            onClick={() => handleToggle(promo)}
                                        >
                                            <Power
                                                className={`size-4 ${
                                                    promo.is_active
                                                        ? 'text-[#725C30] dark:text-[#C5AA74]'
                                                        : 'text-muted-foreground'
                                                }`}
                                            />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            title="Hapus promo"
                                            className="hover:border-destructive/60 hover:bg-destructive/10"
                                            onClick={() => setPendingDelete(promo)}
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

            {/* Create / Edit Promo Modal */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-serif text-xl">
                            <Tag className="size-4 text-[#A88B54]" />
                            {editingPromo ? `Edit "${editingPromo.name}"` : 'Buat Promo Diskon Terjadwal'}
                        </DialogTitle>
                        <DialogDescription>
                            Harga katalog &amp; total pemesanan akan otomatis terpotong selama periode tanggal yang Anda tentukan.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="promo_name">Nama Campaign Promo *</Label>
                            <Input
                                id="promo_name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Early Bird Lebaran 15%"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="discount_percent">Besar Diskon (%) *</Label>
                                <span className="text-[11px] text-muted-foreground">1% – 90%</span>
                            </div>
                            <div className="relative">
                                <Percent className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="discount_percent"
                                    type="number"
                                    min={1}
                                    max={90}
                                    value={data.discount_percent}
                                    onChange={(e) => setData('discount_percent', e.target.value)}
                                    className="pr-9"
                                    required
                                />
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {DISCOUNT_PRESETS.map((pct) => (
                                    <button
                                        key={pct}
                                        type="button"
                                        onClick={() => setData('discount_percent', String(pct))}
                                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                                            Number(data.discount_percent) === pct
                                                ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC]'
                                                : 'border-border bg-background text-foreground hover:border-[#A88B54]'
                                        }`}
                                    >
                                        {pct}%
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.discount_percent} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="promo_scope">Target Promo *</Label>
                                <Select
                                    value={data.scope}
                                    onValueChange={(val: PromoScope) => setData('scope', val)}
                                >
                                    <SelectTrigger id="promo_scope">
                                        <SelectValue placeholder="Pilih target" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Hampers di Katalog</SelectItem>
                                        <SelectItem value="category">Berdasarkan Kategori</SelectItem>
                                        <SelectItem value="product">Produk Hampers Tertentu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.scope} />
                            </div>

                            {data.scope === 'category' && (
                                <div className="grid gap-1.5">
                                    <Label htmlFor="target_category">Kategori Target *</Label>
                                    <Select
                                        value={data.target_category}
                                        onValueChange={(val) => setData('target_category', val)}
                                    >
                                        <SelectTrigger id="target_category">
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.target_category} />
                                </div>
                            )}

                            {data.scope === 'product' && (
                                <div className="grid gap-1.5">
                                    <Label htmlFor="target_product">Pilih Produk *</Label>
                                    <Select
                                        value={data.product_id}
                                        onValueChange={(val) => setData('product_id', val)}
                                    >
                                        <SelectTrigger id="target_product">
                                            <SelectValue placeholder="Pilih produk hampers" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((prod) => (
                                                <SelectItem key={prod.id} value={String(prod.id)}>
                                                    {prod.name} ({prod.category})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.product_id} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 rounded-xl border border-border bg-background/60 p-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-foreground">
                                    Jadwal Berlaku Otomatis
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {[
                                        { label: '24 Jam', days: 1 },
                                        { label: '3 Hari', days: 3 },
                                        { label: '7 Hari', days: 7 },
                                        { label: '30 Hari', days: 30 },
                                    ].map((preset) => (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={() => applyDurationPreset(preset.days)}
                                            className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-foreground hover:border-[#A88B54] cursor-pointer"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label htmlFor="starts_at" className="text-xs">
                                        Mulai Berlaku *
                                    </Label>
                                    <Input
                                        id="starts_at"
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.starts_at} />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="ends_at" className="text-xs">
                                        Berakhir Pada *
                                    </Label>
                                    <Input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={data.ends_at}
                                        onChange={(e) => setData('ends_at', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.ends_at} />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="promo_description">Keterangan Singkat (Opsional)</Label>
                            <Input
                                id="promo_description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Contoh: Berlaku otomatis untuk pemesanan hampers sebelum H-14 Lebaran"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="promo_is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked === true)}
                            />
                            <Label htmlFor="promo_is_active" className="cursor-pointer font-normal">
                                Aktifkan promo sesuai jadwal di atas
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : editingPromo ? 'Simpan Perubahan' : 'Buat Promo'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDeleteDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Hapus Campaign Promo?"
                description={
                    pendingDelete
                        ? `Promo "${pendingDelete.name}" (-${pendingDelete.discount_percent}%) akan dihapus permanen.`
                        : ''
                }
                processing={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

AdminPromos.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Promo & Diskon', href: promosIndex() },
    ],
};
