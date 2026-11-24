export type OrderPaymentMethod =
    | 'transfer_bca'
    | 'transfer_mandiri'
    | 'qris'
    | 'ewallet'
    | 'cod';

export type CorporatePaymentMethod =
    | 'invoice_termin'
    | 'transfer_perusahaan'
    | 'po_net14'
    | 'qris';

export interface PaymentMethodOption<T extends string = string> {
    id: T;
    label: string;
    shortLabel: string;
    badge: string;
    description: string;
    instruction: string;
}

export const ORDER_PAYMENT_METHODS: readonly PaymentMethodOption<OrderPaymentMethod>[] = [
    {
        id: 'transfer_bca',
        label: 'Transfer Bank BCA',
        shortLabel: 'BCA',
        badge: 'Cepat',
        description: 'Verifikasi transfer cepat',
        instruction:
            'Rekening BCA GALUH & CO. (a.n. PT Galuh Hampers Nusantara) akan langsung dikirim admin ke WhatsApp Anda begitu pesanan di-ACC.',
    },
    {
        id: 'transfer_mandiri',
        label: 'Transfer Bank Mandiri',
        shortLabel: 'Mandiri',
        badge: 'Cepat',
        description: 'Bebas biaya sesama Mandiri',
        instruction:
            'Nomor rekening Mandiri resmi akan dikirimkan oleh admin setelah status stok & jadwal pengiriman Anda di-ACC.',
    },
    {
        id: 'qris',
        label: 'QRIS Instan',
        shortLabel: 'QRIS',
        badge: 'Instan',
        description: 'Scan Mobile Banking / E-Wallet',
        instruction:
            'Kode QRIS dinamis sesuai total tagihan akan dikirimkan langsung via WhatsApp setelah admin mengonfirmasi pesanan.',
    },
    {
        id: 'ewallet',
        label: 'E-Wallet / VA',
        shortLabel: 'E-Wallet',
        badge: 'Praktis',
        description: 'GoPay, OVO, DANA, ShopeePay',
        instruction:
            'Admin akan mengirimkan nomor Virtual Account atau tujuan e-wallet aktif untuk pembayaran cepat setelah ACC.',
    },
    {
        id: 'cod',
        label: 'Bayar di Studio / COD',
        shortLabel: 'COD / Studio',
        badge: 'Lokal',
        description: 'Khusus area Ciamis & sekitar',
        instruction:
            'Pembayaran dilakukan secara tunai atau QRIS saat kurir lokal tiba atau saat Anda mengambil hampers langsung di Studio Ciamis.',
    },
] as const;

export const CORPORATE_PAYMENT_METHODS: readonly PaymentMethodOption<CorporatePaymentMethod>[] = [
    {
        id: 'invoice_termin',
        label: 'Invoice & Termin (DP 50%)',
        shortLabel: 'Termin DP 50%',
        badge: 'Populer B2B',
        description: 'DP 50% produksi, 50% pelunasan',
        instruction:
            'Cocok untuk pengadaan korporat: DP 50% saat persetujuan mockup & pelunasan H-1 pengiriman.',
    },
    {
        id: 'transfer_perusahaan',
        label: 'Transfer Rekening Perusahaan',
        shortLabel: 'Transfer Bank',
        badge: 'Cepat',
        description: 'Pelunasan penuh via BCA / Mandiri',
        instruction:
            'Proses verifikasi paling cepat agar pesanan segera masuk antrean produksi prioritas.',
    },
    {
        id: 'po_net14',
        label: 'Purchase Order + Faktur Pajak',
        shortLabel: 'PO + Faktur Pajak',
        badge: 'Resmi PKP',
        description: 'Dukungan dokumen pengadaan & pajak',
        instruction:
            'Dilengkapi dokumen penawaran resmi, faktur pajak, dan termin pembayaran sesuai kebijakan perusahaan.',
    },
    {
        id: 'qris',
        label: 'QRIS Instan',
        shortLabel: 'QRIS',
        badge: 'Praktis',
        description: 'Cocok untuk pesanan cepat / sampel',
        instruction:
            'Scan QRIS resmi GALUH & CO. untuk pembayaran cepat paket sampel maupun batch kecil.',
    },
] as const;

const PAYMENT_LABEL_MAP: Record<string, string> = Object.fromEntries([
    ...ORDER_PAYMENT_METHODS.map((m) => [m.id, m.label]),
    ...CORPORATE_PAYMENT_METHODS.map((m) => [m.id, m.label]),
]);

export function formatPaymentMethodLabel(value: string | null | undefined): string {
    if (!value) return 'Transfer Bank BCA';
    return PAYMENT_LABEL_MAP[value] ?? value;
}
