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

## 🌿 Manajemen Branch & Riwayat Fitur (Git Workflow)

Pengembangan proyek ini mengikuti standar *Git Feature Branch Workflow* sesuai panduan pada brief: satu branch terpisah untuk setiap fitur dan section, dengan pesan commit deskriptif yang kemudian digabungkan ke branch utama (`main`):

| Branch | Cakupan Fitur & Section | Pesan Commit Deskriptif |
| :--- | :--- | :--- |
| **`feat/database-and-backend`** | Migrasi database `products` & `inquiries`, Model Eloquent, `ProductSeeder` (10 hampers, 4 kategori), Controller, FormRequest (honeypot), Mailable, dan Automated Tests. | `feat: arsitektur database, model produk & inquiry, seeder 10 hampers, dan controller` |
| **`feat/design-tokens-and-motion`** | Design tokens Tailwind CSS v4 (Warm Ivory, Deep Emerald, Soft Gold), Google Fonts pair (`Playfair Display` & `Plus Jakarta Sans`), sentralisasi varian animasi GPU di `resources/js/lib/motion.ts`, dan tipe TypeScript. | `feat: design tokens tailwind v4, tipografi playfair display, dan sentralisasi animasi motion.ts` |
| **`feat/section-navbar-and-hero`** | `NavbarSection.tsx` (sticky blur, smooth scroll menu, CTA), `HeroSection.tsx` (single `<h1>`, animasi word-reveal, trust metrics, visual hampers floating), dan `FloatingWhatsApp.tsx`. | `feat: section navbar sticky, hero dengan word-reveal, dan floating button whatsapp` |
| **`feat/section-about-and-why-choose-us`** | `AboutSection.tsx` (kisah filosofi brand & 3 pilar nilai dengan aksen emas) dan `WhyChooseUsSection.tsx` (4 pilar keunggulan dengan animasi angka count-up). | `feat: section tentang filosofi brand dan kenapa memilih kami dengan count-up animasi` |
| **`feat/section-katalog-koleksi`** | `CollectionSection.tsx` (katalog hampers dengan layout spring animation filter kategori `Semua`, `Lebaran`, `Natal`, `Corporate`, `Wedding`, hover zoom kartu, dan order langsung via WhatsApp). | `feat: section koleksi hampers pilihan dengan filter kategori dan direct order whatsapp` |
| **`feat/section-cara-pesan-and-corporate`** | `HowToOrderSection.tsx` (alur 4 langkah pemesanan bergaris progres) dan `CorporateGiftingSection.tsx` (B2B highlights, marquee logo korporat, dan Formulir Corporate Inquiry 8 field). | `feat: section cara pesan 4 langkah dan corporate gifting dengan form inquiry 8 field` |
| **`feat/section-testimoni-faq-footer`** | `TestimonialsSection.tsx` (carousel review swipe/drag + tombol panah), `FaqSection.tsx` (accordion buka-tutup halus), `FooterCtaSection.tsx` (banner CTA Deep Emerald & footer informasi), perakitan `welcome.tsx`, dan `README.md`. | `feat: section testimoni carousel, faq accordion, footer cta banner, dan integrasi welcome.tsx` |
| **`main`** | Branch utama produksi yang menggabungkan seluruh branch fitur secara utuh dan siap dideploy. | *Production Ready* |

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
