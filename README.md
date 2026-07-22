# Automated Personal Portfolio Website (50% Milestone)

Platform portofolio pribadi otomatis (self-updating) yang dirancang untuk Software Developer & Cybersecurity Enthusiast (CTF Player). Proyek ini dibangun di atas infrastruktur Cloudflare (Pages & Workers) dengan performa tinggi dan biaya operasional $0 (free tier).

Cakupan pekerjaan pada repositori ini adalah 50% dari total proyek, difokuskan pada fondasi arsitektur, konfigurasi proyek, skema database, mock API, dan layout halaman utama beserta komponen visual yang dapat digunakan kembali.

## Tech Stack
- **Frontend**: [Astro](https://astro.build/) (Static Site / SSR) + [TypeScript](https://www.typescriptlang.org/)
- **Style**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: React Components (ThemeToggle, Cards, Layouts)
- **Backend API**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite Edge Database)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

---

## Struktur Folder Proyek
```
D:\project libur\proto page\
├── drizzle/                     # File migrasi database SQL Drizzle
│   └── migrations/
├── src/                         # Kode sumber Frontend (Astro + React)
│   ├── components/              # Komponen UI reusable (Hero, About, Cards, dsb)
│   │   ├── ThemeToggle.tsx
│   │   ├── ProjectCard.tsx
│   │   └── AchievementCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Timeline.tsx
│   │   └── Contact.tsx
│   ├── db/                      # Definisi skema database Drizzle ORM
│   │   └── schema.ts
│   ├── layouts/                 # Master Layout Astro (Theme detection, styles)
│   │   └── Layout.astro
│   ├── lib/                     # Modul core (API Client, Logger wrapper)
│   │   ├── api.ts
│   │   └── logger.ts
│   ├── pages/                   # Astro Pages & Routing (/projects, /achievements, dsb)
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── achievements.astro
│   │   ├── about.astro
│   │   └── 404.astro
│   ├── services/                # Skeleton layanan integrasi API eksternal
│   │   ├── github.ts
│   │   └── ctftime.ts
│   ├── styles/                  # File styling CSS global Tailwind
│   │   └── global.css
│   ├── types/                   # Definisi Type & Interface TypeScript global
│   │   └── index.ts
│   ├── utils/                   # Fungsi utilitas (Date formatter)
│   │   └── date.ts
│   └── env.d.ts
├── worker/                      # Kode sumber Backend (Cloudflare Worker API)
│   └── index.ts
├── drizzle.config.ts            # Konfigurasi Drizzle ORM
├── env.example                  # Contoh file environment
├── package.json                 # Node.js dependencies & scripts
├── tailwind.config.mjs          # Konfigurasi TailwindCSS
├── tsconfig.json                # Konfigurasi compiler TypeScript
└── wrangler.toml                # Konfigurasi Cloudflare Workers & D1 Bindings
```

---

## Pengembangan Lokal & Cara Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) v18 atau versi lebih baru.
- Wrangler CLI terinstall (opsional global, sudah disediakan lokal lewat `devDependencies`):
  ```bash
  npm install -g wrangler
  ```

### 1. Instalasi Proyek
Kloning repositori ini dan pasang seluruh dependensi:
```bash
npm install
```

### 2. Migrasi Database Lokal (D1 Drizzle)
Jalankan perintah berikut untuk menerapkan migrasi skema database SQLite lokal di dalam direktori state Wrangler:
```bash
# Generate file SQL migrasi dari skema TS
npm run db:generate

# Terapkan migrasi ke database D1 lokal
npm run db:migrate:local
```

### 3. Menjalankan Backend API lokal
Jalankan Cloudflare Workers lokal menggunakan Wrangler Dev:
```bash
npm run dev:backend
```
Backend API akan berjalan pada `http://localhost:8787` dengan endpoint:
- `GET /api/projects` - Mengembalikan daftar proyek (D1 database / fallback Mock).
- `GET /api/achievements` - Mengembalikan daftar pencapaian CTF (D1 database / fallback Mock).
- `GET /api/stats` - Mengembalikan total ringkasan statistik portofolio.
- `POST /api/sync/github` - Placeholder trigger sinkronisasi GitHub.
- `POST /api/sync/ctftime` - Placeholder trigger sinkronisasi CTFtime.

### 4. Menjalankan Frontend Astro
Jalankan environment Astro lokal di terminal terpisah:
```bash
npm run dev:frontend
```
Buka `http://localhost:4321` pada browser untuk melihat portofolio Anda. Halaman web akan membaca data dari API backend lokal secara asinkron atau menggunakan cadangan mock jika backend belum menyala.

---

## Deployment ke Cloudflare

### 1. Login ke Cloudflare Account
```bash
wrangler login
```

### 2. Membuat Database Cloudflare D1
Buat database D1 baru melalui terminal:
```bash
wrangler d1 create portfolio-db
```
Salin output `database_id` dari terminal lalu sesuaikan nilai `database_id` di dalam file `wrangler.toml`.

### 3. Terapkan Migrasi ke Database Cloudflare D1 Remote
```bash
npm run db:migrate:remote
```

### 4. Menyimpan API Token (Secrets) ke Cloudflare Workers
Masukkan secret key GitHub API secara aman:
```bash
wrangler secret put GITHUB_TOKEN
```

### 5. Deploy Backend Workers
```bash
npm run deploy:backend
```

### 6. Deploy Frontend ke Cloudflare Pages
1. Masuk ke dashboard Cloudflare > **Workers & Pages** > **Create application** > **Pages** > Hubungkan dengan repositori GitHub Anda.
2. Konfigurasi build:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build:frontend`
   - **Build output directory**: `dist`
3. Tekan **Save and Deploy**.

---

## Rincian Implementasi & Status Fitur (50% Scope)

### Komponen Reusable (`src/components/`):
- `ThemeToggle`: React component menggunakan localStorage dan manipulasi kelas `dark` pada dokumen HTML untuk pergantian tema responsif bebas FOUC.
- `Navbar` & `Footer`: Bar navigasi dan footer responsif dengan link menu dinamis.
- `Hero`: Header interaktif yang memadukan identitas Developer & CTF player.
- `About`: Menampilkan perkenalan diri dan visualisasi tech stack yang dikelompokkan secara terstruktur.
- `ProjectCard`: Card repositori menampilkan nama, deskripsi, bahasa, bintang, fork, topik, dan link langsung ke GitHub.
- `AchievementCard`: Card event menampilkan nama event, tanggal, peringkat, poin, dan nama tim yang disinkronkan.
- `Timeline`: Alur perjalanan karir profesional, akademis, dan turnamen CTF.
- `Contact`: Tombol penghubung surat elektronik dan akun sosial media.

### API Endpoints (`worker/index.ts`):
- Rute-rute API dikonfigurasi dengan headers CORS lengkap agar dapat dikonsumsi dengan aman oleh domain frontend.
- Integrasi Drizzle ORM telah disiapkan untuk melakukan query data dari database Cloudflare D1 saat tabel telah terisi.

### Penanganan Fitur Masa Depan (TODOs):
Beberapa modul telah disiapkan sebagai antarmuka skeleton dengan tanda komentar `TODO:` dan alasan teknis mengapa implementasi lanjutan ditunda hingga fase berikutnya:
1. **GitHub API integration** (`src/services/github.ts`): Membutuhkan modul GraphQL client dan otentikasi token untuk membaca pinnedItems.
2. **CTFtime scraping engine** (`src/services/ctftime.ts`): Memerlukan modul parser HTML untuk menarik peringkat tim karena keterbatasan API resmi JSON CTFtime.
3. **Automated Cron Jobs** (`worker/index.ts`): Memerlukan Cloudflare Cron Trigger untuk sinkronisasi terjadwal di latar belakang.
