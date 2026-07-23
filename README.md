# Personal Portfolio Website (Developer & CTF Player)

Platform portofolio pribadi otomatis (*self-updating*) yang dirancang untuk memadukan identitas sebagai **Software Developer** dan **Cybersecurity Enthusiast (CTF Player)**. Platform ini berjalan sepenuhnya di atas ekosistem serverless Cloudflare untuk efisiensi tinggi, latency rendah, dan biaya operasional $0 (*free tier*).

## Fitur Utama

- **Self-Updating Projects**: Otomatis melakukan sinkronisasi dengan GitHub API untuk memperbarui daftar repositori publik serta proyek-proyek yang di-pin secara periodik.
- **CTF Performance Tracker**: Integrasi dengan platform CTFtime untuk menampilkan pencapaian turnamen (peringkat, skor, nama tim) dan grafik historis skor tahunan secara otomatis.
- **Interactive Timeline**: Visualisasi interaktif perjalanan karir profesional, pencapaian akademis, dan histori kompetisi siber.
- **Admin Control Center**: Halaman manajemen internal terproteksi untuk melakukan *force sync* data dan menyembunyikan (*hide*) proyek atau *achievement* tertentu agar tidak tampil di halaman publik.

---

## Arsitektur & Keamanan Sistem

Sistem ini didesain dengan memisahkan *Frontend* dan *Backend* secara tegas guna meminimalkan risiko keamanan serta menjaga performa pemuatan halaman:

```
[ Pengunjung ] ---> ( Cloudflare Pages / Astro Frontend )
                             |
                             v
                 ( Cloudflare Workers API ) <---> [ Cloudflare D1 (SQLite) ]
                             |
                             +---> [ API Eksternal (GitHub / CTFtime) ]
```

1. **Pemisahan API Token & Kunci Rahasia**:
   - Seluruh token otentikasi (seperti `GITHUB_TOKEN`) disimpan menggunakan Cloudflare Worker Secrets (`wrangler secret put`).
   - Token rahasia **tidak pernah** diekspos ke sisi klien (*frontend*) maupun disimpan dalam repositori kode publik.
2. **Perlindungan Terhadap Kebocoran Data Backend**:
   - Halaman publik *frontend* membaca data teragregasi melalui rute API publik tertentu yang hanya mengembalikan data dengan status `isHidden = false`.
   - Tidak ada akses langsung dari *frontend* ke struktur database D1 orisinil.
3. **CORS Restrictions & Rate Limiting**:
   - Rute-rute API backend dibatasi dengan konfigurasi CORS ketat untuk mencegah penyalahgunaan dari domain luar yang tidak dikenal.
   - Endpoint sinkronisasi manual dilindungi oleh otentikasi serta dilengkapi pembatasan *cooldown* guna menghindari serangan eksploitasi API eksternal (*rate-limit abuse*).
4. **Proteksi Dashboard Admin**:
   - Jalur dashboard admin dilindungi oleh solusi Zero Trust (seperti Cloudflare Access) guna memastikan hanya pemilik sah yang memiliki akses masuk.

---

## Pengembangan Lokal

### Prasyarat
- Node.js v18+
- Wrangler CLI

### Setup & Migrasi Database Lokal
1. Instal dependensi:
   ```bash
   npm install
   ```
2. Buat file `.env` berdasarkan `env.example` untuk variabel lokal Anda.
3. Lakukan migrasi database D1 lokal:
   ```bash
   npm run db:generate
   npm run db:migrate:local
   ```

### Menjalankan Environment Pengembangan
Jalankan backend API dan frontend secara terpisah:
- **Backend (Port 8787)**: `npm run dev:backend`
- **Frontend (Port 4321)**: `npm run dev:frontend`
