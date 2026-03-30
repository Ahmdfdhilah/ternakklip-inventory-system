# TernakKlip - Inventory Management System

Sistem manajemen inventaris modern yang dibangun dengan React, TypeScript, Tailwind CSS, dan Supabase. Sistem ini dirancang untuk memantau stok merchandise secara real-time dengan antarmuka yang bersih dan data-driven.

##  Struktur Codebase (src)

Berikut adalah penjelasan singkat mengenai folder utama di dalam direktori `src`:

- **`assets/`**: Menyimpan aset statis seperti logo, gambar, dan ikon.
- **`components/`**: Komponen UI yang dapat digunakan kembali.
  - `common/`: Komponen umum seperti `PageHeader`, `SortableHeader`, dan `TopographyBackground`.
  - `layouts/`: Komponen layout utama seperti `Sidebar`, `TopNav`, dan `PageBreadcrumb`.
  - `ui/`: Komponen dasar dari Shadcn UI.
- **`constants/`**: Penyimpanan pusat untuk semua nilai konstanta (Chart colors, Role labels, Pagination defaults).
- **`hooks/`**: Custom React hooks, termasuk `useUsers` dan `useURLFilters`.
- **`lib/`**: Konfigurasi library eksternal, seperti `supabase.ts` untuk klien database.
- **`pages/`**: Komponen halaman utama aplikasi (Dashboard, Inventory, Settings).
- **`services/`**: Layer abstraksi API untuk berkomunikasi dengan Supabase (Auth, Products, Users).
- **`stores/`**: Manajemen state global menggunakan **Zustand** (AuthStore, LayoutStore).
- **`utils/`**: Fungsi pembantu (helper) untuk pemformatan angka (`numberUtils.ts`) dan tanggal (`dateUtils.ts`).

## Akun Dummy (Testing)

Gunakan akun berikut untuk mencoba fitur aplikasi:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@admin.com` | `password123` |
| **User** | `user@user.com` | `password123` |

> [!NOTE]
> Akun di atas adalah akun demo standar. Pastikan data tersebut sudah terdaftar di Supabase Auth proyek Anda.

## Supabase & Real-time

Proyek ini menggunakan **Supabase** sebagai backend:
- **Database**: PostgreSQL dengan Row Level Security (RLS).
- **Authentication**: Email/Password login.
- **Real-time**: Fitur Realtime diaktifkan pada tabel `products`, `inventory_logs`, dan `notifications` untuk update dashboard instan tanpa refresh.

## Perubahan Skema Database

Saya melakukan modernisasi skema database dari versi awal untuk mendukung fitur yang lebih kompleks:

### Skema Database Baru:
1.  **`categories`**: Ditambahkan untuk mengelompokkan produk secara terorganisir.
2.  **`products`**:
    - Menambah `min_stock_level`: Untuk sistem alert stok rendah.
    - Menambah `category_id`: Menghubungkan produk dengan kategorinya.
    - Menambah `sku`, `price`, dan `image_url`: Untuk detail produk yang lebih profesional.

### Alasan Perubahan:
Skema awal (hanya tabel `products` minimalis) tidak mendukung visualisasi data yang kaya dan sistem peringatan stok. Dengan skema baru, operasional tim menjadi lebih efisien karena dapat melihat distribusi stok per kategori dan mendapatkan notifikasi otomatis saat stok mendekati batas minimum.

## Penggunaan AI dalam Workflow

Saya menggunakan **Claude Code** (AI assistant dari Anthropic) sebagai alat bantu utama selama pengembangan proyek ini.

Yang membedakan workflow saya adalah penggunaan **custom agent rules** — sekumpulan instruksi dan konteks yang saya simpan di folder `agents/` (masuk ke git ignore) dan saya terapkan secara konsisten ke setiap sesi kerja. Rules ini mendefinisikan bagaimana AI harus berperilaku: mulai dari konvensi penamaan, struktur folder, cara menulis komponen React, hingga pola service layer yang konsisten dengan codebase.

**Cara kerjanya:**
1. Sebelum memulai task, saya load rules yang relevan ke dalam konteks AI — misalnya rules untuk arsitektur service layer, atau rules untuk komponen UI.
2. AI lalu generate atau memodifikasi kode mengikuti pola yang sudah saya tetapkan, bukan pola generik.
3. Hasilnya adalah kode yang terasa konsisten dan "punya suara yang sama" dari awal hingga akhir, karena AI selalu mengacu pada rules yang sama.

Pendekatan ini menghemat waktu signifikan karena saya tidak perlu menjelaskan ulang konteks di setiap percakapan baru — rules sudah menjadi "memori jangka panjang" yang portable dan reusable lintas project.
