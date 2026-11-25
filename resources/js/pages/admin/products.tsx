import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    ImagePlus,
    Pencil,
    Plus,
    Search,
    Trash2,
    Upload,
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
    destroy as destroyProduct,
    index as productsIndex,
    store as storeProduct,
    toggle as toggleProduct,
    update as updateProduct,
} from '@/routes/admin/products';
import type { Product } from '@/types/landing';

interface ProductsPageProps {
    products: Product[];
    categories: string[];
}

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};

interface ProductFormState {
    name: string;
    category: string;
    short_description: string;
    contents: string[];
    price_from: string;
    sort_order: string;
    is_active: boolean;
    image_url: string;
    image_file: File | null;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export default function AdminProducts({
    products,
    categories,
}: ProductsPageProps) {
    const { flash } = usePage<FlashProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [contentsText, setContentsText] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm<ProductFormState>({
        name: '',
        category: categories[0] ?? 'Lebaran',
        short_description: '',
        contents: [],
        price_from: '500000',
        sort_order: '0',
        is_active: true,
        image_url: '',
        image_file: null,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const openCreateDialog = () => {
        clearErrors();
        reset();
        setEditingProduct(null);
        setContentsText('Kue Kering Artisan Pilihan\nKartu Ucapan Kaligrafi');
        setPreviewUrl(null);
        setDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        clearErrors();
        setEditingProduct(product);
        setData({
            name: product.name,
            category: product.category,
            short_description: product.short_description,
            contents: product.contents ?? [],
            price_from: String(product.price_from),
            sort_order: String(product.sort_order),
            is_active: product.is_active,
            image_url: product.image,
            image_file: null,
        });
        setContentsText((product.contents ?? []).join('\n'));
        setPreviewUrl(product.image);
        setDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image_file', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(data.image_url || editingProduct?.image || null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedContents = contentsText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

        transform((current) => ({
            ...current,
            contents: parsedContents,
            price_from: Number(current.price_from || 0),
            sort_order: Number(current.sort_order || 0),
        }));

        const targetUrl = editingProduct
            ? updateProduct.url(editingProduct.id)
            : storeProduct.url();

        post(targetUrl, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setDialogOpen(false);
                setEditingProduct(null);
            },
        });
    };

    const handleToggleVisibility = (product: Product) => {
        router.patch(
            toggleProduct.url(product.id),
            {},
            { preserveScroll: true },
        );
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        router.delete(destroyProduct.url(pendingDelete.id), {
            preserveScroll: true,
            onError: () => toast.error('Gagal menghapus produk hampers.'),
            onFinish: () => {
                setIsDeleting(false);
                setPendingDelete(null);
            },
        });
    };

    const filteredProducts = products.filter((item) => {
        const matchesCat =
            categoryFilter === 'Semua' ||
            item.category.toLowerCase() === categoryFilter.toLowerCase();
        const matchesSearch =
            searchQuery.trim() === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.short_description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <>
            <Head title="Kelola Katalog Hampers" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-px w-6 bg-[#A88B54]"
                                aria-hidden="true"
                            />
                            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                Koleksi Hampers
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Kelola Katalog &amp; Foto Produk
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Unggah atau ganti foto hampers, ubah harga, daftar
                            isi paket, dan visibilitas di landing page.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                        Tambah Hampers
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {['Semua', ...categories].map((cat) => (
                            <Button
                                key={cat}
                                type="button"
                                size="sm"
                                variant={
                                    categoryFilter === cat
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama hampers..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            Tidak ada produk yang sesuai filter saat ini.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="flex flex-col overflow-hidden hover:border-[#A88B54]/70"
                            >
                                <div className="relative aspect-[4/3] bg-secondary">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                                        <Badge>{product.category}</Badge>
                                        <Badge
                                            variant={
                                                product.is_active
                                                    ? 'secondary'
                                                    : 'destructive'
                                            }
                                        >
                                            {product.is_active
                                                ? 'Aktif'
                                                : 'Disembunyikan'}
                                        </Badge>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="absolute right-2.5 bottom-2.5 border-[#D8CEBA] bg-card/90 text-foreground backdrop-blur-xs"
                                    >
                                        Urutan #{product.sort_order}
                                    </Badge>
                                </div>

                                <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="font-serif text-lg leading-snug font-semibold text-foreground">
                                                {product.name}
                                            </h2>
                                        </div>
                                        <p className="mt-1 text-sm font-semibold text-[#725C30] dark:text-[#C5AA74]">
                                            {formatRupiah(product.price_from)}
                                        </p>
                                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                            {product.short_description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 border-t pt-3">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() =>
                                                openEditDialog(product)
                                            }
                                        >
                                            <Pencil className="size-3.5" />
                                            Edit / Foto
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            title={
                                                product.is_active
                                                    ? 'Sembunyikan'
                                                    : 'Tampilkan'
                                            }
                                            onClick={() =>
                                                handleToggleVisibility(product)
                                            }
                                        >
                                            {product.is_active ? (
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
                                            onClick={() =>
                                                setPendingDelete(product)
                                            }
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
                            {editingProduct
                                ? `Edit "${editingProduct.name}"`
                                : 'Tambah Produk Hampers Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Unggah foto langsung dari perangkat Anda atau tempel
                            URL gambar. Perubahan langsung tampil di katalog
                            utama.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Photo Preview & Upload */}
                        <div className="grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[140px_1fr]">
                            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border bg-muted">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview foto hampers"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <ImagePlus className="size-7 text-muted-foreground" />
                                )}
                            </div>
                            <div className="space-y-2.5">
                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="image_file"
                                        className="flex items-center gap-1.5"
                                    >
                                        <Upload className="size-3.5" />
                                        Upload Foto Baru (JPG/PNG/WebP, maks
                                        4MB)
                                    </Label>
                                    <Input
                                        id="image_file"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleFileChange}
                                    />
                                    <InputError message={errors.image_file} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="image_url">
                                        Atau URL Foto Gambar
                                    </Label>
                                    <Input
                                        id="image_url"
                                        value={data.image_url}
                                        onChange={(e) => {
                                            setData(
                                                'image_url',
                                                e.target.value,
                                            );
                                            if (!data.image_file) {
                                                setPreviewUrl(
                                                    e.target.value || null,
                                                );
                                            }
                                        }}
                                        placeholder="https://... atau /images/..."
                                    />
                                    <InputError message={errors.image_url} />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name">Nama Produk</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="The Royal Fitr"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="category">Kategori</Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(val) =>
                                        setData('category', val)
                                    }
                                >
                                    <SelectTrigger id="category">
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
                                <InputError message={errors.category} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="price_from">
                                    Harga Mulai (IDR)
                                </Label>
                                <Input
                                    id="price_from"
                                    type="number"
                                    min={0}
                                    value={data.price_from}
                                    onChange={(e) =>
                                        setData('price_from', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.price_from} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="sort_order">
                                    Urutan Tampil
                                </Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData('sort_order', e.target.value)
                                    }
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="short_description">
                                Deskripsi Singkat
                            </Label>
                            <textarea
                                id="short_description"
                                rows={2}
                                value={data.short_description}
                                onChange={(e) =>
                                    setData('short_description', e.target.value)
                                }
                                required
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            />
                            <InputError message={errors.short_description} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="contents">
                                Daftar Isi Paket (1 item per baris)
                            </Label>
                            <textarea
                                id="contents"
                                rows={4}
                                value={contentsText}
                                onChange={(e) =>
                                    setContentsText(e.target.value)
                                }
                                placeholder={
                                    'Nastar Gold Leaf Wysman\nKastengel Keju Edam Tua\nKartu Ucapan Kaligrafi'
                                }
                                required
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            />
                            <InputError message={errors.contents} />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', checked === true)
                                }
                            />
                            <Label
                                htmlFor="is_active"
                                className="cursor-pointer font-normal"
                            >
                                Tampilkan langsung di katalog publik
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
                                {processing
                                    ? 'Menyimpan...'
                                    : editingProduct
                                      ? 'Simpan Perubahan'
                                      : 'Tambah Produk'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDeleteDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Hapus Produk Katalog?"
                description={
                    pendingDelete
                        ? `Produk "${pendingDelete.name}" akan dihapus dari katalog landing page.`
                        : ''
                }
                processing={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

AdminProducts.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kelola Katalog', href: productsIndex() },
    ],
};
