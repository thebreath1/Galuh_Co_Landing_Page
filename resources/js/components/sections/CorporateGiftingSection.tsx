import React, { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { m } from 'motion/react';
import {
    CheckCircle2,
    Send,
    Loader2,
    PhoneCall,
    ExternalLink,
    Wallet,
} from 'lucide-react';
import { EmailQuickDomains } from '@/components/EmailQuickDomains';
import { MAX_PHONE_DIGITS, sanitizePhoneInput } from '@/lib/input-helpers';
import type { InquiryFormData } from '@/types/landing';
import { CORPORATE_PAYMENT_METHODS } from '@/lib/payment-methods';
import { fadeUp, viewportConfig } from '@/lib/motion';

interface CorporateGiftingSectionProps {
    whatsappNumber: string;
    flash?: {
        success?: string;
        error?: string;
    };
}

export const CorporateGiftingSection: React.FC<
    CorporateGiftingSectionProps
> = ({ whatsappNumber, flash }) => {
    const corporateEmailRef = useRef<HTMLInputElement | null>(null);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm<InquiryFormData>({
        name: '',
        company: '',
        email: '',
        whatsapp_number: '',
        estimated_quantity: '50 - 100 paket',
        budget_per_package: 'Rp 350.000 - Rp 500.000',
        payment_method: 'invoice_termin',
        needed_date: '',
        notes: '',
        website: '', // honeypot
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inquiries', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const clientLogos = [
        {
            name: 'Bank Mandiri Prioritas',
            logo: '/images/partners/mandiri.svg',
            url: 'https://www.bankmandiri.co.id/web/prioritas',
        },
        {
            name: 'Telkom Indonesia',
            logo: '/images/partners/telkom.png',
            url: 'https://www.telkom.co.id',
        },
        {
            name: 'Astra International',
            logo: '/images/partners/astra.svg',
            url: 'https://www.astra.co.id',
        },
        {
            name: 'Unilever Indonesia',
            logo: '/images/partners/unilever.png',
            url: 'https://www.unilever.co.id',
        },
        {
            name: 'BCA Solitaire',
            logo: '/images/partners/bca.svg',
            url: 'https://prioritas.bca.co.id',
        },
        {
            name: 'Pertamina',
            logo: '/images/partners/pertamina.svg',
            url: 'https://www.pertamina.com',
        },
        {
            name: 'Tokopedia Enterprise',
            logo: '/images/partners/tokopedia.png',
            url: 'https://www.tokopedia.com',
        },
        {
            name: 'Schlumberger Indonesia',
            logo: '/images/partners/slb.png',
            url: 'https://www.slb.com',
        },
    ];

    const corporateFeatures = [
        'Custom Logo Emboss / Hot-Stamping Foil Emas pada Hardbox',
        'Kartu Ucapan Korporat dengan Desain & Kaligrafi Khusus',
        'Layanan Pengiriman Terjadwal ke Ratusan Alamat Berbeda',
        'Dedicated Gifting Consultant & Sampel Fisik Mockup',
        'Faktur Pajak & Termin Pembayaran Resmi Perusahaan',
    ];

    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waCorporateUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., kami dari divisi korporat ingin berkonsultasi mengenai pemesanan hampers dalam jumlah besar.',
    )}`;

    return (
        <section
            id="corporate"
            aria-label="Corporate Gifting & B2B"
            className="relative overflow-hidden border-y border-[#D8CEBA] bg-[#EAE1CE] py-20 md:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <m.div
                    className="mx-auto mb-14 max-w-3xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#725C30] uppercase">
                        Layanan B2B Eksklusif
                    </p>
                    <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#16233B] sm:text-4xl">
                        Solusi Hampers Eksklusif untuk Rekan & Klien Bisnis
                    </h2>
                    <div className="mx-auto mb-5 h-0.5 w-12 bg-[#A88B54]" />
                    <p className="text-base leading-relaxed text-[#6E675D]">
                        Perkuat reputasi dan jalinan kemitraan strategis
                        perusahaan Anda melalui bingkisan berkelas tinggi yang
                        dirancang secara kustom dengan identitas korporat Anda.
                    </p>
                </m.div>

                {/* Client Logo Marquee */}
                <div className="relative mb-16 overflow-hidden border-y border-[#D8CEBA]/70 py-7 select-none">
                    {/* Gradient Fade Masks on Left & Right so items never look abruptly cut off */}
                    <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-[#EAE1CE] via-[#EAE1CE]/90 to-transparent sm:w-32" />
                    <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-[#EAE1CE] via-[#EAE1CE]/90 to-transparent sm:w-32" />

                    <p className="mb-5 text-center text-xs font-semibold tracking-[0.2em] text-[#6E675D] uppercase">
                        Dipercaya oleh 120+ Perusahaan & Institusi Ternama
                    </p>
                    <div className="animate-marquee gap-6 py-1 sm:gap-8">
                        {[
                            ...clientLogos,
                            ...clientLogos,
                            ...clientLogos,
                            ...clientLogos,
                        ].map((client, idx) => (
                            <a
                                key={idx}
                                href={client.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Kunjungi situs resmi ${client.name} (buka di tab baru)`}
                                aria-label={`Kunjungi situs resmi ${client.name} (buka di tab baru)`}
                                className="group flex flex-shrink-0 cursor-pointer items-center gap-2.5 rounded-full border border-[#D8CEBA] bg-[#FFFFFF] px-5 py-2.5 font-serif text-xs font-semibold tracking-wider whitespace-nowrap text-[#16233B] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A88B54] hover:text-[#725C30] hover:shadow-md focus:ring-2 focus:ring-[#A88B54]/40 focus:outline-none sm:text-sm"
                            >
                                <img
                                    src={client.logo}
                                    alt={`Logo ${client.name}`}
                                    width={24}
                                    height={20}
                                    className="h-4 w-auto max-w-[48px] flex-shrink-0 rounded-xs object-contain transition-transform duration-300 group-hover:scale-105 sm:h-5"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span className="transition-colors duration-200 group-hover:text-[#725C30]">
                                    {client.name}
                                </span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0 text-[#6E675D] opacity-40 transition-all duration-200 group-hover:text-[#A88B54] group-hover:opacity-100" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Main Content: Left Info + Right Form */}
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
                    {/* Left Column: Corporate Highlights */}
                    <m.div
                        className="lg:col-span-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-[#16233B] p-8 text-[#F2EBDC] shadow-2xl sm:p-10">
                            {/* Decorative Gold Accent */}
                            <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-[#A88B54]/10 blur-2xl" />

                            <h3 className="mb-4 font-serif text-2xl leading-tight font-bold text-white sm:text-3xl">
                                Kustomisasi Menyeluruh Sesuai Karakter Brand
                                Anda
                            </h3>

                            <p className="mb-8 text-sm leading-relaxed text-[#D8CEBA]">
                                Dari pemilihan warna pita satin senada corporate
                                color hingga pencetakan pesan personal direksi,
                                kami memastikan setiap paket mencerminkan
                                profesionalitas tertinggi.
                            </p>

                            <ul className="mb-8 space-y-4">
                                {corporateFeatures.map((feat, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-xs text-[#F2EBDC] sm:text-sm"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C5AA74]" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col gap-3 border-t border-[#FFFFFF]/15 pt-6">
                                <p className="text-xs text-[#D8CEBA]">
                                    Butuh penawaran mendesak atau proposal hari
                                    ini?
                                </p>
                                <a
                                    href={waCorporateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FFFFFF] px-6 py-3 text-xs font-semibold tracking-wider text-[#16233B] uppercase shadow-md transition-colors hover:bg-[#F2EBDC]"
                                >
                                    <PhoneCall className="h-4 w-4 text-[#16233B]" />
                                    <span>Hubungi Hotline Corporate</span>
                                </a>
                            </div>
                        </div>
                    </m.div>

                    {/* Right Column: 8-field Inquiry Form */}
                    <m.div
                        className="lg:col-span-7"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                    >
                        <div className="shadow-luxury rounded-3xl border border-[#D8CEBA] bg-[#FFFFFF] p-8 sm:p-10">
                            <h3 className="mb-2 font-serif text-2xl font-bold text-[#16233B]">
                                Formulir Permintaan Penawaran
                            </h3>
                            <p className="mb-6 text-xs text-[#6E675D] sm:text-sm">
                                Lengkapi formulir di bawah ini untuk menerima
                                penawaran harga resmi dan katalog kustomisasi
                                dari tim kami.
                            </p>

                            {/* Flash Success Notification */}
                            {(recentlySuccessful || flash?.success) && (
                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#16233B]/30 bg-[#16233B]/10 p-4">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#16233B]" />
                                    <p className="text-xs leading-relaxed font-medium text-[#16233B] sm:text-sm">
                                        {flash?.success ||
                                            'Permintaan penawaran Anda berhasil terkirim! Tim konsultan gifting GALUH & CO. akan menghubungi Anda dalam 1x24 jam.'}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Honeypot input - hidden from real users */}
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="website">
                                        Jangan isi field ini:
                                    </label>
                                    <input
                                        type="text"
                                        id="website"
                                        name="website"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData('website', e.target.value)
                                        }
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* 1. Nama Lengkap */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-1.5 block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                        >
                                            Nama Lengkap{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Contoh: Rian Anggoro"
                                            className={`w-full rounded-xl border bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none ${
                                                errors.name
                                                    ? 'border-red-500'
                                                    : 'border-[#D8CEBA]'
                                            }`}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* 2. Perusahaan */}
                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="mb-1.5 block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                        >
                                            Perusahaan / Instansi{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            value={data.company}
                                            onChange={(e) =>
                                                setData(
                                                    'company',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: PT Tri Mandiri Sejahtera"
                                            className={`w-full rounded-xl border bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none ${
                                                errors.company
                                                    ? 'border-red-500'
                                                    : 'border-[#D8CEBA]'
                                            }`}
                                            required
                                        />
                                        {errors.company && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.company}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* 3. Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-1.5 block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                        >
                                            Email Bisnis{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            ref={corporateEmailRef}
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="nama@gmail.com atau email kantor"
                                            className={`w-full rounded-xl border bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none ${
                                                errors.email
                                                    ? 'border-red-500'
                                                    : 'border-[#D8CEBA]'
                                            }`}
                                            required
                                        />
                                        <EmailQuickDomains
                                            value={data.email}
                                            inputRef={corporateEmailRef}
                                            onSelect={(nextEmail) =>
                                                setData('email', nextEmail)
                                            }
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* 4. WhatsApp Number */}
                                    <div>
                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                            <label
                                                htmlFor="whatsapp_number"
                                                className="block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                            >
                                                Nomor WhatsApp{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <span className="text-[10px] font-medium text-[#6E675D]">
                                                {data.whatsapp_number.length}/
                                                {MAX_PHONE_DIGITS} digit
                                            </span>
                                        </div>
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            maxLength={MAX_PHONE_DIGITS}
                                            id="whatsapp_number"
                                            value={data.whatsapp_number}
                                            onChange={(e) =>
                                                setData(
                                                    'whatsapp_number',
                                                    sanitizePhoneInput(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
                                            placeholder="0812xxxxxxxx (maks. 12 angka)"
                                            className={`w-full rounded-xl border bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none ${
                                                errors.whatsapp_number
                                                    ? 'border-red-500'
                                                    : 'border-[#D8CEBA]'
                                            }`}
                                            required
                                        />
                                        {errors.whatsapp_number && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.whatsapp_number}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* 5. Jumlah Paket */}
                                    <div>
                                        <label
                                            htmlFor="estimated_quantity"
                                            className="mb-1.5 block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                        >
                                            Perkiraan Jumlah Paket{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="estimated_quantity"
                                            value={data.estimated_quantity}
                                            onChange={(e) =>
                                                setData(
                                                    'estimated_quantity',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#D8CEBA] bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                            required
                                        >
                                            <option value="25 - 50 paket">
                                                25 - 50 paket
                                            </option>
                                            <option value="50 - 100 paket">
                                                50 - 100 paket
                                            </option>
                                            <option value="101 - 250 paket">
                                                101 - 250 paket
                                            </option>
                                            <option value="250 - 500 paket">
                                                250 - 500 paket
                                            </option>
                                            <option value="500+ paket">
                                                Lebih dari 500 paket
                                            </option>
                                        </select>
                                        {errors.estimated_quantity && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.estimated_quantity}
                                            </p>
                                        )}
                                    </div>

                                    {/* 6. Budget per Paket */}
                                    <div>
                                        <label
                                            htmlFor="budget_per_package"
                                            className="mb-1.5 block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                        >
                                            Alokasi Budget per Paket{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="budget_per_package"
                                            value={data.budget_per_package}
                                            onChange={(e) =>
                                                setData(
                                                    'budget_per_package',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#D8CEBA] bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                            required
                                        >
                                            <option value="< Rp 350.000">
                                                &lt; Rp 350.000
                                            </option>
                                            <option value="Rp 350.000 - Rp 500.000">
                                                Rp 350.000 - Rp 500.000
                                            </option>
                                            <option value="Rp 500.000 - Rp 850.000">
                                                Rp 500.000 - Rp 850.000
                                            </option>
                                            <option value="Rp 850.000 - Rp 1.500.000">
                                                Rp 850.000 - Rp 1.500.000
                                            </option>
                                            <option value="> Rp 1.500.000">
                                                &gt; Rp 1.500.000 (VIP Bespoke)
                                            </option>
                                        </select>
                                        {errors.budget_per_package && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.budget_per_package}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 7. Tanggal Kebutuhan */}
                                <div>
                                    <label
                                        htmlFor="needed_date"
                                        className="mb-1.5 block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                    >
                                        Target Tanggal Kebutuhan / Pengiriman{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="needed_date"
                                        value={data.needed_date}
                                        onChange={(e) =>
                                            setData(
                                                'needed_date',
                                                e.target.value,
                                            )
                                        }
                                        className={`w-full rounded-xl border bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none ${
                                            errors.needed_date
                                                ? 'border-red-500'
                                                : 'border-[#D8CEBA]'
                                        }`}
                                        required
                                    />
                                    {errors.needed_date && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.needed_date}
                                        </p>
                                    )}
                                </div>

                                {/* 8. Preferensi Metode Pembayaran */}
                                <div>
                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#16233B] uppercase">
                                            <Wallet className="h-3.5 w-3.5 text-[#725C30]" />
                                            <span>
                                                Preferensi Metode Pembayaran
                                            </span>
                                        </label>
                                        <span className="text-[11px] text-[#6E675D]">
                                            Pilih cepat (1 klik)
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {CORPORATE_PAYMENT_METHODS.map(
                                            (method) => {
                                                const active =
                                                    data.payment_method ===
                                                    method.id;
                                                return (
                                                    <button
                                                        key={method.id}
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                'payment_method',
                                                                method.id,
                                                            )
                                                        }
                                                        className={`cursor-pointer rounded-xl border px-3.5 py-2.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] ${
                                                            active
                                                                ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC] shadow-sm'
                                                                : 'border-[#D8CEBA] bg-[#F2EBDC] text-[#1E2430] hover:border-[#A88B54] hover:bg-[#EAE1CE]'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="truncate text-xs font-semibold">
                                                                {method.label}
                                                            </span>
                                                            <span
                                                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                    active
                                                                        ? 'bg-[#A88B54]/25 text-[#C5AA74]'
                                                                        : 'border border-[#D8CEBA] bg-[#FFFFFF] text-[#725C30]'
                                                                }`}
                                                            >
                                                                {method.badge}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className={`mt-1 text-[11px] ${
                                                                active
                                                                    ? 'text-[#D8CEBA]'
                                                                    : 'text-[#6E675D]'
                                                            }`}
                                                        >
                                                            {method.description}
                                                        </p>
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                    {(() => {
                                        const currentMethod =
                                            CORPORATE_PAYMENT_METHODS.find(
                                                (m) =>
                                                    m.id ===
                                                    data.payment_method,
                                            );
                                        if (!currentMethod) return null;
                                        return (
                                            <p className="mt-2 rounded-xl border border-[#D8CEBA] bg-[#F2EBDC]/75 px-3.5 py-2 text-[11px] text-[#6E675D]">
                                                <span className="font-semibold text-[#16233B]">
                                                    Info Pembayaran:{' '}
                                                </span>
                                                {currentMethod.instruction}
                                            </p>
                                        );
                                    })()}
                                    {errors.payment_method && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.payment_method}
                                        </p>
                                    )}
                                </div>

                                {/* 9. Catatan Khusus */}
                                <div>
                                    <label
                                        htmlFor="notes"
                                        className="mb-1.5 block text-xs font-semibold tracking-wider text-[#16233B] uppercase"
                                    >
                                        Catatan / Kebutuhan Khusus{' '}
                                        <span className="text-xs font-normal text-[#6E675D] lowercase">
                                            (opsional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        placeholder="Tuliskan tema acara, preferensi isi kue/teh, atau kebutuhan logo perusahaan..."
                                        className="w-full rounded-xl border border-[#D8CEBA] bg-[#F2EBDC] px-4 py-2.5 text-sm text-[#1E2430] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <m.button
                                        type="submit"
                                        disabled={processing}
                                        whileHover={
                                            processing ? {} : { scale: 1.02 }
                                        }
                                        whileTap={
                                            processing ? {} : { scale: 0.98 }
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16233B] px-6 py-3.5 text-xs font-semibold tracking-wider text-[#F2EBDC] uppercase shadow-md transition-all hover:bg-[#203252] focus:ring-2 focus:ring-[#A88B54] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin text-[#C5AA74]" />
                                                <span>
                                                    Mengirim Permintaan...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 text-[#C5AA74]" />
                                                <span>
                                                    Kirim Permintaan Penawaran
                                                </span>
                                            </>
                                        )}
                                    </m.button>
                                </div>

                                <p className="pt-1 text-center text-[11px] text-[#6E675D]">
                                    Kerahasiaan data perusahaan Anda terjamin
                                    aman. Kami tidak pernah membagikan kontak
                                    Anda ke pihak ketiga.
                                </p>
                            </form>
                        </div>
                    </m.div>
                </div>
            </div>
        </section>
    );
};
