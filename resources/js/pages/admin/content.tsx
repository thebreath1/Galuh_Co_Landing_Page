import { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ExternalLink, RotateCcw, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard, home } from '@/routes';
import { index as contentIndex, update as updateContent } from '@/routes/admin/content';
import type { SiteSettings } from '@/types/landing';

interface AdminContentProps {
    settings: SiteSettings;
    defaults: SiteSettings;
}

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};

type ContentFormData = SiteSettings & {
    hero_bg_image_file: File | null;
    hero_left_image_file: File | null;
    hero_right_image_file: File | null;
};

export default function AdminContent({ settings, defaults }: AdminContentProps) {
    const { flash } = usePage<FlashProps>().props;
    const [previews, setPreviews] = useState({
        bg: settings.hero_bg_image,
        left: settings.hero_left_image,
        right: settings.hero_right_image,
    });

    const { data, setData, post, processing, errors } = useForm<ContentFormData>({
        ...settings,
        hero_bg_image_file: null,
        hero_left_image_file: null,
        hero_right_image_file: null,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleImageFile = (
        fileField: 'hero_bg_image_file' | 'hero_left_image_file' | 'hero_right_image_file',
        previewKey: 'bg' | 'left' | 'right',
        urlField: 'hero_bg_image' | 'hero_left_image' | 'hero_right_image',
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] ?? null;
        setData(fileField, file);
        setPreviews((prev) => ({
            ...prev,
            [previewKey]: file ? URL.createObjectURL(file) : data[urlField],
        }));
    };

    const handleResetDefaults = () => {
        setData({
            ...defaults,
            hero_bg_image_file: null,
            hero_left_image_file: null,
            hero_right_image_file: null,
        });
        setPreviews({
            bg: defaults.hero_bg_image,
            left: defaults.hero_left_image,
            right: defaults.hero_right_image,
        });
        toast.info('Nilai form dikembalikan ke default. Klik "Simpan Perubahan" untuk menerapkan.');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(updateContent.url(), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const heroImageSlots = [
        {
            label: 'Foto Background Hero',
            urlKey: 'hero_bg_image' as const,
            fileKey: 'hero_bg_image_file' as const,
            previewKey: 'bg' as const,
            previewSrc: previews.bg,
        },
        {
            label: 'Foto Melayang Kiri Hero',
            urlKey: 'hero_left_image' as const,
            fileKey: 'hero_left_image_file' as const,
            previewKey: 'left' as const,
            previewSrc: previews.left,
        },
        {
            label: 'Foto Melayang Kanan Hero',
            urlKey: 'hero_right_image' as const,
            fileKey: 'hero_right_image_file' as const,
            previewKey: 'right' as const,
            previewSrc: previews.right,
        },
    ];

    return (
        <>
            <Head title="Editor Teks & Hero Section" />
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="h-px w-6 bg-[#A88B54]" aria-hidden="true" />
                            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                Kurasi Konten
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            Editor Teks &amp; Hero Section
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Ubah headline utama, subheadline, tombol CTA, statistik, foto hero, dan narasi halaman depan.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" variant="outline" onClick={handleResetDefaults}>
                            <RotateCcw className="size-4 text-[#725C30] dark:text-[#C5AA74]" />
                            Reset Default
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <a href={home.url()} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-4 text-[#725C30] dark:text-[#C5AA74]" />
                                Preview Web
                            </a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="size-4 text-[#C5AA74] dark:text-primary-foreground" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </div>

                {/* 1. Hero Section Texts & Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Teks Utama Hero Section</CardTitle>
                        <CardDescription>
                            Mengatur judul besar (H1), deskripsi pembuka, label tombol, dan metrik kepercayaan di atas lipatan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="hero_headline">Headline Utama (H1)</Label>
                            <Input
                                id="hero_headline"
                                value={data.hero_headline}
                                onChange={(e) => setData('hero_headline', e.target.value)}
                                required
                            />
                            <InputError message={errors.hero_headline} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="hero_subheadline">Subheadline Hero</Label>
                            <textarea
                                id="hero_subheadline"
                                rows={3}
                                value={data.hero_subheadline}
                                onChange={(e) => setData('hero_subheadline', e.target.value)}
                                required
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            />
                            <InputError message={errors.hero_subheadline} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="hero_primary_cta_label">Label Tombol Utama</Label>
                                <Input
                                    id="hero_primary_cta_label"
                                    value={data.hero_primary_cta_label}
                                    onChange={(e) => setData('hero_primary_cta_label', e.target.value)}
                                    required
                                />
                                <InputError message={errors.hero_primary_cta_label} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="hero_secondary_cta_label">Label Tombol WhatsApp</Label>
                                <Input
                                    id="hero_secondary_cta_label"
                                    value={data.hero_secondary_cta_label}
                                    onChange={(e) => setData('hero_secondary_cta_label', e.target.value)}
                                    required
                                />
                                <InputError message={errors.hero_secondary_cta_label} />
                            </div>
                        </div>

                        {/* 3 Hero Stats */}
                        <div className="grid gap-4 border-t pt-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="hero_stat_1_value">Statistik 1 (Angka &amp; Label)</Label>
                                <Input
                                    id="hero_stat_1_value"
                                    value={data.hero_stat_1_value}
                                    onChange={(e) => setData('hero_stat_1_value', e.target.value)}
                                    placeholder="5.000+"
                                    required
                                />
                                <Input
                                    value={data.hero_stat_1_label}
                                    onChange={(e) => setData('hero_stat_1_label', e.target.value)}
                                    placeholder="Hampers Terkirim"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hero_stat_2_value">Statistik 2 (Angka &amp; Label)</Label>
                                <Input
                                    id="hero_stat_2_value"
                                    value={data.hero_stat_2_value}
                                    onChange={(e) => setData('hero_stat_2_value', e.target.value)}
                                    placeholder="120+"
                                    required
                                />
                                <Input
                                    value={data.hero_stat_2_label}
                                    onChange={(e) => setData('hero_stat_2_label', e.target.value)}
                                    placeholder="Mitra Korporat"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hero_stat_3_value">Statistik 3 (Angka &amp; Label)</Label>
                                <Input
                                    id="hero_stat_3_value"
                                    value={data.hero_stat_3_value}
                                    onChange={(e) => setData('hero_stat_3_value', e.target.value)}
                                    placeholder="4.9"
                                    required
                                />
                                <Input
                                    value={data.hero_stat_3_label}
                                    onChange={(e) => setData('hero_stat_3_label', e.target.value)}
                                    placeholder="Kepuasan Klien"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Hero Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Foto Background &amp; Foto Melayang Hero</CardTitle>
                        <CardDescription>
                            Unggah foto pengganti atau atur path/URL gambar background serta dua foto hampers kiri dan kanan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        {heroImageSlots.map((slot) => (
                            <div key={slot.urlKey} className="space-y-3 rounded-lg border p-3">
                                <p className="text-sm font-medium">{slot.label}</p>
                                <div className="aspect-[4/3] overflow-hidden rounded-md border bg-muted">
                                    <img
                                        src={slot.previewSrc}
                                        alt={slot.label}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={slot.fileKey} className="flex items-center gap-1.5 text-xs">
                                        <Upload className="size-3.5" />
                                        Upload Foto Baru
                                    </Label>
                                    <Input
                                        id={slot.fileKey}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) =>
                                            handleImageFile(slot.fileKey, slot.previewKey, slot.urlKey, e)
                                        }
                                    />
                                    <InputError message={errors[slot.fileKey]} />

                                    <Label htmlFor={slot.urlKey} className="text-xs">
                                        Path / URL Gambar
                                    </Label>
                                    <Input
                                        id={slot.urlKey}
                                        value={data[slot.urlKey]}
                                        onChange={(e) => {
                                            setData(slot.urlKey, e.target.value);
                                            if (!data[slot.fileKey]) {
                                                setPreviews((prev) => ({
                                                    ...prev,
                                                    [slot.previewKey]: e.target.value,
                                                }));
                                            }
                                        }}
                                        required
                                    />
                                    <InputError message={errors[slot.urlKey]} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 3. About, Collection, Testimonials Headers & WhatsApp */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Teks Bagian Filosofi Kami</CardTitle>
                            <CardDescription>Pengantar di bawah Hero Section (#tentang)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="about_eyebrow">Label Kecil (Eyebrow)</Label>
                                <Input
                                    id="about_eyebrow"
                                    value={data.about_eyebrow}
                                    onChange={(e) => setData('about_eyebrow', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="about_title">Judul Section</Label>
                                <Input
                                    id="about_title"
                                    value={data.about_title}
                                    onChange={(e) => setData('about_title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="about_description">Deskripsi</Label>
                                <textarea
                                    id="about_description"
                                    rows={3}
                                    value={data.about_description}
                                    onChange={(e) => setData('about_description', e.target.value)}
                                    required
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Teks Bagian Katalog &amp; Kontak WhatsApp</CardTitle>
                            <CardDescription>Judul pengantar #koleksi &amp; nomor WA utama tombol pemesanan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="collection_eyebrow">Label Kecil Katalog</Label>
                                <Input
                                    id="collection_eyebrow"
                                    value={data.collection_eyebrow}
                                    onChange={(e) => setData('collection_eyebrow', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="collection_title">Judul Katalog</Label>
                                <Input
                                    id="collection_title"
                                    value={data.collection_title}
                                    onChange={(e) => setData('collection_title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="collection_description">Deskripsi Katalog</Label>
                                <Input
                                    id="collection_description"
                                    value={data.collection_description}
                                    onChange={(e) => setData('collection_description', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5 border-t pt-3">
                                <Label htmlFor="whatsapp_number">Nomor WhatsApp Admin (format 628...)</Label>
                                <Input
                                    id="whatsapp_number"
                                    value={data.whatsapp_number}
                                    onChange={(e) => setData('whatsapp_number', e.target.value)}
                                    placeholder="6281234567890"
                                    required
                                />
                                <InputError message={errors.whatsapp_number} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Teks Bagian Testimoni</CardTitle>
                            <CardDescription>Judul &amp; deskripsi pengantar #testimoni</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="testimonials_eyebrow">Label Kecil Testimoni</Label>
                                <Input
                                    id="testimonials_eyebrow"
                                    value={data.testimonials_eyebrow}
                                    onChange={(e) => setData('testimonials_eyebrow', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="testimonials_title">Judul Testimoni</Label>
                                <Input
                                    id="testimonials_title"
                                    value={data.testimonials_title}
                                    onChange={(e) => setData('testimonials_title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="testimonials_description">Deskripsi Testimoni</Label>
                                <textarea
                                    id="testimonials_description"
                                    rows={3}
                                    value={data.testimonials_description}
                                    onChange={(e) => setData('testimonials_description', e.target.value)}
                                    required
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={processing}>
                        <Save className="size-4" />
                        {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                    </Button>
                </div>
            </form>
        </>
    );
}

AdminContent.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Teks & Hero', href: contentIndex() },
    ],
};
