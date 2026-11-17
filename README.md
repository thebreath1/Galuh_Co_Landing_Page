# GALUH & CO. — Premium Hampers & Corporate Gifting

Landing page resmi untuk **GALUH & CO.**, sebuah brand hampers premium dan corporate gifting mewah. Dirancang dengan estetika *quiet luxury*—hangat, tenang, elegan, dan eksklusif—merefleksikan pengalaman membuka kotak hadiah berkelas.

---

## 💎 Tech Stack & Architecture

- **Backend:** [Laravel 13](https://laravel.com), PHP 8.4 (Data dikirimkan langsung sebagai props Inertia dari Controller tanpa REST API terpisah).
- **Bridge & Frontend:** [Inertia.js v3](https://inertiajs.com), [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) dengan sistem Design Tokens warna & tipografi kustom.
- **Animasi:** `motion` (`motion/react`), varian terpusat di `resources/js/lib/motion.ts`, mengoptimalkan animasi berbasis GPU (`transform` dan `opacity` saja) serta mematuhi preferensi aksesibilitas `prefers-reduced-motion`.
- **Database:** SQLite (`database/database.sqlite`) agar mudah dijalankan lintas perangkat.
- **Build Tool:** Vite + Rolldown (`npm run build` lolos tanpa error TypeScript maupun bundling).

---

## 🎨 Brand Identity & Design Tokens

### Palet Warna (Design Tokens di `resources/css/app.css`):
- **Dasar (Warm Cream / Ivory):** `#FDFBF7` (latar utama), `#F7F4EE` (latar section alternatif).
- **Warna Utama (Deep Emerald Green):** `#1B382B` (primary), `#142E24` (primary dark), `#0C1E17` (footer).
- **Aksen Tunggal (Soft Gold):** `#C8A951` (gold accent), `#DFCA86` (gold soft), `#F7F2E4` (gold tint badge).
- **Teks & Garis:** `#2C2724` (charcoal), `#6E675F` (muted body), `#E8E2D5` (subtle border).

### Tipografi:
- **Judul / Headings:** `Playfair Display` (Serif elegan).
- **Teks Isi / Body:** `Plus Jakarta Sans` (Sans-serif bersih untuk legibilitas optimal).

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
- PHP 8.3 atau 8.4 dengan ekstensi `pdo_sqlite` aktif.
- Composer 2.x
- Node.js v20+ atau v22+ & npm

### 2. Kloning & Pengaturan Environment
```bash
# Masuk ke direktori proyek
cd Galuh_Co_Landing_Page

# Salin file konfigurasi environment
cp .env.example .env
```

Pastikan variabel berikut terisi di `.env`:
```ini
DB_CONNECTION=sqlite
WHATSAPP_NUMBER=6281234567890
MAIL_MAILER=log
```

### 3. Instalasi Dependensi Backend & Kunci Aplikasi
```bash
# Instal paket Composer
composer install

# Buat berkas database SQLite
touch database/database.sqlite

# Generate Application Key
php artisan key:generate
```

### 4. Migrasi & Seeder Database
Jalankan migrasi database dan pengisian seeder 10 katalog hampers mewah (`Lebaran`, `Natal`, `Corporate`, `Wedding`):
```bash
php artisan migrate:fresh --seed
```

### 5. Instalasi Dependensi Frontend & Build
```bash
# Pasang dependensi JavaScript & motion
npm install

# Build aset produksi (Verifikasi nol error)
npm run build
```

### 6. Menjalankan Server Lokal
Jalankan aplikasi dengan salah satu cara berikut:

**Opsi A (Artisan Serve + Vite Dev Server untuk pengembangan aktif):**
```bash
# Terminal 1: Backend Server
php artisan serve

# Terminal 2: Vite Hot Reload
npm run dev
```

Akses landing page di peramban Anda melalui: `http://localhost:8000`

---

## 🏛️ Struktur 10 Section Modular

Seluruh section berada di `resources/js/components/sections/`:
1. `NavbarSection.tsx` — Sticky navbar, transisi blur on scroll, menu smooth scroll, mobile drawer, dan CTA *"Pesan Sekarang"*.
2. `HeroSection.tsx` — Single `<h1>`, animasi word-reveal cepat (< 1 detik), 2 CTA, indikator trust, dan visual hampers dengan soft floating effect.
3. `AboutSection.tsx` — Kisah filosofi berbagi & 3 pilar nilai brand (*Kurasi Terbaik*, *Packaging Premium*, *Sentuhan Personal*).
4. `CollectionSection.tsx` — Filter kategori interaktif (*Semua, Lebaran, Natal, Corporate, Wedding*) dengan layout animation, kartu produk, dan link order langsung ke WhatsApp dengan prefilled pesan.
5. `WhyChooseUsSection.tsx` — 4 keunggulan layanan dengan ikon Lucide dan animasi angka count-up saat masuk viewport.
6. `HowToOrderSection.tsx` — 4 langkah pemesanan sistematis dengan visual garis progres.
7. `CorporateGiftingSection.tsx` — Layanan B2B, marquee logo mitra korporat, dan **Form Inquiry Corporate 8-Field** lengkap dengan proteksi *honeypot* + *throttle*.
8. `TestimonialsSection.tsx` — Carousel ulasan klien korporat & personal yang dapat di-*drag* / di-*swipe* serta tombol navigasi.
9. `FaqSection.tsx` — Accordion interaktif berisi 7 pertanyaan umum mengenai MOQ, custom logo, ekspedisi multi-alamat, dan garansi.
10. `FooterCtaSection.tsx` — Banner penutup Deep Emerald dan footer komprehensif berisi jam operasional studio, alamat Jakarta & Surabaya, serta link sosial media.
- `FloatingWhatsApp.tsx` — Tombol mengambang di pojok kanan bawah yang selalu tampil sejak halaman pertama kali dimuat.

---

## 🧪 Pengujian Otomatis

Jalankan test suite menggunakan Pest / PHPUnit:
```bash
# Menjalankan seluruh pengujian fitur dan unit
php artisan test

# Menjalankan pengujian khusus Landing Page & Inquiry Form
php artisan test --filter=LandingPageTest
```

---

## 🛡️ Keamanan & Aksesibilitas
- Proteksi Spam Formulir: *Honeypot field* (`website`) yang divalidasi oleh `StoreInquiryRequest` dan pembatasan frekuensi pengiriman (`throttle:5,1`).
- Aksesibilitas: Semua gambar menyertakan atribut `alt` deskriptif, rasio kontras teks tinggi memenuhi standar WCAG AAA, navigasi keyboard penuh dengan focus ring yang jelas, dan implementasi `<MotionConfig reducedMotion="user">`.
