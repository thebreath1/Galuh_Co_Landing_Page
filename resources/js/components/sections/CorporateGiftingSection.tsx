import React from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Building2, CheckCircle2, Send, Loader2, Sparkles, PhoneCall, ShieldCheck, Mail } from 'lucide-react';
import type { InquiryFormData } from '@/types/landing';
import { fadeUp, viewportConfig } from '@/lib/motion';

interface CorporateGiftingSectionProps {
    whatsappNumber: string;
    flash?: {
        success?: string;
        error?: string;
    };
}

export const CorporateGiftingSection: React.FC<CorporateGiftingSectionProps> = ({ whatsappNumber, flash }) => {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm<InquiryFormData>({
        name: '',
        company: '',
        email: '',
        whatsapp_number: '',
        estimated_quantity: '50 - 100 paket',
        budget_per_package: 'Rp 350.000 - Rp 500.000',
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
        'Bank Mandiri Prioritas',
        'Telkom Indonesia',
        'Astra International',
        'Unilever Indonesia',
        'BCA Solitaire',
        'Pertamina',
        'Tokopedia Enterprise',
        'Schlumberger Indonesia',
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
        'Halo GALUH & CO., kami dari divisi korporat ingin berkonsultasi mengenai pemesanan hampers dalam jumlah besar.'
    )}`;

    return (
        <section
            id="corporate"
            aria-label="Corporate Gifting & B2B"
            className="py-20 md:py-28 bg-[#F7F4EE] border-y border-[#E8E2D5] relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-14"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C8A951] font-semibold mb-3">
                        Layanan B2B Eksklusif
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        Solusi Hampers Eksklusif untuk Rekan & Klien Bisnis
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base leading-relaxed">
                        Perkuat reputasi dan jalinan kemitraan strategis perusahaan Anda melalui bingkisan berkelas tinggi
                        yang dirancang secara kustom dengan identitas korporat Anda.
                    </p>
                </motion.div>

                {/* Client Logo Marquee */}
                <div className="mb-16 py-7 border-y border-[#E8E2D5]/70 overflow-hidden relative select-none">
                    {/* Gradient Fade Masks on Left & Right so items never look abruptly cut off */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F7F4EE] via-[#F7F4EE]/90 to-transparent z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F7F4EE] via-[#F7F4EE]/90 to-transparent z-10" />

                    <p className="text-center text-xs uppercase tracking-[0.2em] text-[#9C9489] mb-5 font-semibold">
                        Dipercaya oleh 120+ Perusahaan & Institusi Ternama
                    </p>
                    <div className="animate-marquee gap-6 sm:gap-8 py-1">
                        {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((client, idx) => (
                            <div
                                key={idx}
                                className="px-5 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E8E2D5] hover:border-[#C8A951]/60 text-[#1B382B] font-serif text-xs sm:text-sm font-semibold tracking-wider whitespace-nowrap shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-2.5 flex-shrink-0 cursor-default"
                            >
                                <Building2 className="w-3.5 h-3.5 text-[#C8A951] flex-shrink-0" />
                                <span>{client}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content: Left Info + Right Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Corporate Highlights */}
                    <motion.div
                        className="lg:col-span-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                    >
                        <div className="bg-[#1B382B] text-[#FDFBF7] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                            {/* Decorative Gold Accent */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#C8A951]/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFCA86]/20 border border-[#DFCA86]/40 text-[#DFCA86] text-xs font-semibold uppercase tracking-wider mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Layanan Prioritas B2B</span>
                            </div>

                            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-4 leading-tight text-white">
                                Kustomisasi Menyeluruh Sesuai Karakter Brand Anda
                            </h3>

                            <p className="text-sm text-[#E8E2D5] leading-relaxed mb-8">
                                Dari pemilihan warna pita satin senada corporate color hingga pencetakan pesan personal
                                direksi, kami memastikan setiap paket mencerminkan profesionalitas tertinggi.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {corporateFeatures.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#FDFBF7]">
                                        <CheckCircle2 className="w-4 h-4 text-[#DFCA86] flex-shrink-0 mt-0.5" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-6 border-t border-[#FFFFFF]/15 flex flex-col gap-3">
                                <p className="text-xs text-[#E8E2D5]">Butuh penawaran mendesak atau proposal hari ini?</p>
                                <a
                                    href={waCorporateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#FFFFFF] text-[#1B382B] text-xs font-semibold uppercase tracking-wider hover:bg-[#FDFBF7] shadow-md transition-colors"
                                >
                                    <PhoneCall className="w-4 h-4 text-[#1B382B]" />
                                    <span>Hubungi Hotline Corporate</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: 8-field Inquiry Form */}
                    <motion.div
                        className="lg:col-span-7"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        variants={fadeUp}
                    >
                        <div className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#E8E2D5] shadow-luxury">
                            <h3 className="font-serif text-2xl font-bold text-[#1B382B] mb-2">
                                Formulir Permintaan Penawaran
                            </h3>
                            <p className="text-xs sm:text-sm text-[#6E675F] mb-6">
                                Lengkapi formulir di bawah ini untuk menerima penawaran harga resmi dan katalog
                                kustomisasi dari tim kami.
                            </p>

                            {/* Flash Success Notification */}
                            {(recentlySuccessful || flash?.success) && (
                                <div className="mb-6 p-4 rounded-xl bg-[#1B382B]/10 border border-[#1B382B]/30 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#1B382B] flex-shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm text-[#1B382B] font-medium leading-relaxed">
                                        {flash?.success ||
                                            'Permintaan penawaran Anda berhasil terkirim! Tim konsultan gifting GALUH & CO. akan menghubungi Anda dalam 1x24 jam.'}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Honeypot input - hidden from real users */}
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="website">Jangan isi field ini:</label>
                                    <input
                                        type="text"
                                        id="website"
                                        name="website"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 1. Nama Lengkap */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                        >
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: Rian Anggoro"
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951] ${
                                                errors.name ? 'border-red-500' : 'border-[#E8E2D5]'
                                            }`}
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* 2. Perusahaan */}
                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                        >
                                            Perusahaan / Instansi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="Contoh: PT Tri Mandiri Sejahtera"
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951] ${
                                                errors.company ? 'border-red-500' : 'border-[#E8E2D5]'
                                            }`}
                                            required
                                        />
                                        {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 3. Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                        >
                                            Email Bisnis <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="rian@company.co.id"
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951] ${
                                                errors.email ? 'border-red-500' : 'border-[#E8E2D5]'
                                            }`}
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* 4. WhatsApp Number */}
                                    <div>
                                        <label
                                            htmlFor="whatsapp_number"
                                            className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                        >
                                            Nomor WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="whatsapp_number"
                                            value={data.whatsapp_number}
                                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                                            placeholder="081234567890"
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951] ${
                                                errors.whatsapp_number ? 'border-red-500' : 'border-[#E8E2D5]'
                                            }`}
                                            required
                                        />
                                        {errors.whatsapp_number && (
                                            <p className="text-red-500 text-xs mt-1">{errors.whatsapp_number}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 5. Jumlah Paket */}
                                    <div>
                                        <label
                                            htmlFor="estimated_quantity"
                                            className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                        >
                                            Perkiraan Jumlah Paket <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="estimated_quantity"
                                            value={data.estimated_quantity}
                                            onChange={(e) => setData('estimated_quantity', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                            required
                                        >
                                            <option value="25 - 50 paket">25 - 50 paket</option>
                                            <option value="50 - 100 paket">50 - 100 paket</option>
                                            <option value="101 - 250 paket">101 - 250 paket</option>
                                            <option value="250 - 500 paket">250 - 500 paket</option>
                                            <option value="500+ paket">Lebih dari 500 paket</option>
                                        </select>
                                        {errors.estimated_quantity && (
                                            <p className="text-red-500 text-xs mt-1">{errors.estimated_quantity}</p>
                                        )}
                                    </div>

                                    {/* 6. Budget per Paket */}
                                    <div>
                                        <label
                                            htmlFor="budget_per_package"
                                            className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                        >
                                            Alokasi Budget per Paket <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="budget_per_package"
                                            value={data.budget_per_package}
                                            onChange={(e) => setData('budget_per_package', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                            required
                                        >
                                            <option value="< Rp 350.000">&lt; Rp 350.000</option>
                                            <option value="Rp 350.000 - Rp 500.000">Rp 350.000 - Rp 500.000</option>
                                            <option value="Rp 500.000 - Rp 850.000">Rp 500.000 - Rp 850.000</option>
                                            <option value="Rp 850.000 - Rp 1.500.000">Rp 850.000 - Rp 1.500.000</option>
                                            <option value="> Rp 1.500.000">&gt; Rp 1.500.000 (VIP Bespoke)</option>
                                        </select>
                                        {errors.budget_per_package && (
                                            <p className="text-red-500 text-xs mt-1">{errors.budget_per_package}</p>
                                        )}
                                    </div>
                                </div>

                                {/* 7. Tanggal Kebutuhan */}
                                <div>
                                    <label
                                        htmlFor="needed_date"
                                        className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                    >
                                        Target Tanggal Kebutuhan / Pengiriman <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="needed_date"
                                        value={data.needed_date}
                                        onChange={(e) => setData('needed_date', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951] ${
                                            errors.needed_date ? 'border-red-500' : 'border-[#E8E2D5]'
                                        }`}
                                        required
                                    />
                                    {errors.needed_date && (
                                        <p className="text-red-500 text-xs mt-1">{errors.needed_date}</p>
                                    )}
                                </div>

                                {/* 8. Catatan Khusus */}
                                <div>
                                    <label
                                        htmlFor="notes"
                                        className="block text-xs font-semibold text-[#1B382B] uppercase tracking-wider mb-1.5"
                                    >
                                        Catatan / Kebutuhan Khusus <span className="text-xs text-[#9C9489] lowercase font-normal">(opsional)</span>
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Tuliskan tema acara, preferensi isi kue/teh, atau kebutuhan logo perusahaan..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-sm text-[#2C2724] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                                    />
                                    {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <motion.button
                                        type="submit"
                                        disabled={processing}
                                        whileHover={processing ? {} : { scale: 1.02 }}
                                        whileTap={processing ? {} : { scale: 0.98 }}
                                        className="w-full py-3.5 px-6 rounded-full bg-[#1B382B] text-[#FDFBF7] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#264E3D] shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#C8A951] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-[#DFCA86]" />
                                                <span>Mengirim Permintaan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 text-[#DFCA86]" />
                                                <span>Kirim Permintaan Penawaran</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                <p className="text-[11px] text-[#9C9489] text-center pt-1">
                                    Kerahasiaan data perusahaan Anda terjamin aman. Kami tidak pernah membagikan kontak Anda ke pihak ketiga.
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
