# Product Requirements Document (PRD)
## Automated Personal Portfolio Website

| | |
|---|---|
| **Dokumen** | PRD v1.0 |
| **Tanggal** | 22 Juli 2026 |
| **Disusun oleh** | Senior Product Manager & Technical Architect |
| **Status** | Draft untuk Review |

---

## 1. Executive Summary & Objectives

### 1.1 Ringkasan Eksekutif

Automated Personal Portfolio Website adalah sebuah platform portofolio pribadi yang **self-updating**, dirancang untuk menampilkan identitas profesional pemilik sebagai **Software Developer** sekaligus **Cybersecurity Enthusiast (CTF Player)**. Perbedaan utama proyek ini dibanding portofolio statis pada umumnya adalah adanya lapisan otomasi (automation layer) yang secara berkala menarik data dari sumber eksternal — **GitHub API** dan **CTFtime** — lalu memperbarui konten situs tanpa campur tangan manual.

Tujuan inti dari sistem ini adalah menghilangkan "maintenance tax": developer sering memiliki portofolio yang usang karena malas meng-update manual setiap ada proyek baru atau pencapaian CTF baru. Dengan mengotomasi proses sinkronisasi, portofolio akan selalu mencerminkan aktivitas terbaru pemilik dengan intervensi minimal.

### 1.2 Objectives (Tujuan Produk)

| Kode | Objective | Ukuran Keberhasilan |
|---|---|---|
| O1 | Portofolio selalu up-to-date secara otomatis tanpa input manual rutin | 100% proyek GitHub baru & event CTF baru muncul di situs dalam 1 siklus sinkronisasi |
| O2 | Meminimalkan biaya operasional (infrastruktur nyaris gratis) | Total biaya bulanan < $5 (idealnya $0 dengan free tier) |
| O3 | Memberikan kontrol penuh kepada admin (pemilik) atas data yang ditampilkan | Admin dapat sync manual & menyembunyikan data kapan saja |
| O4 | Menyajikan citra profesional ganda (developer + CTF player) secara kredibel | Recruiter/tim CTF dapat memverifikasi klaim skill dalam < 2 menit browsing |
| O5 | Sistem tangguh terhadap perubahan/downtime API pihak ketiga | Tidak ada data hilang/corrupt meski GitHub API atau CTFtime API gagal merespons |

---

## 2. Target Audience / User Personas

### 2.1 Persona 1 — "Rian, Technical Recruiter / Hiring Manager"
- **Tujuan**: Memverifikasi kemampuan teknis kandidat secara cepat sebelum wawancara.
- **Kebutuhan**: Melihat proyek nyata (bukan template), commit history yang aktif, dan bukti kemampuan problem-solving.
- **Frustrasi**: Portofolio yang terakhir di-update 2 tahun lalu, proyek fiktif ("Todo List App #47").

### 2.2 Persona 2 — "Dinda, Sesama CTF Player / Team Lead CTF"
- **Tujuan**: Mengevaluasi kandidat untuk direkrut ke tim CTF, atau sekadar melihat rank & spesialisasi kategori (pwn, crypto, web, dsb).
- **Kebutuhan**: Statistik rating CTFtime, event yang pernah diikuti, writeup jika ada.
- **Frustrasi**: Klaim "jago CTF" tanpa data rating/rank yang bisa diverifikasi.

### 2.3 Persona 3 — "Pemilik Situs (Admin/Owner)" — *Anda sendiri*
- **Tujuan**: Memiliki portofolio yang "hidup" tanpa harus repot update manual setiap minggu.
- **Kebutuhan**: Dashboard sederhana untuk override otomasi bila API pihak ketiga salah menampilkan data, atau ada proyek privat yang tidak ingin ditampilkan.
- **Frustrasi**: Waktu terbuang untuk hal administratif yang seharusnya bisa diotomasi.

---

## 3. User Stories

### 3.1 Sisi Pengunjung (Recruiter/Sesama CTF Player)
- Sebagai **recruiter**, saya ingin melihat daftar proyek open-source terbaru pemilik situs, agar saya bisa menilai kualitas kode dan konsistensi kontribusinya.
- Sebagai **recruiter**, saya ingin melihat tech stack yang digunakan di tiap proyek, agar saya bisa mencocokkan dengan kebutuhan posisi yang saya buka.
- Sebagai **sesama CTF player**, saya ingin melihat rating CTFtime dan event terakhir yang diikuti, agar saya bisa menilai level kompetitif pemilik situs.
- Sebagai **pengunjung umum**, saya ingin situs memuat cepat dan mobile-friendly, agar saya tidak perlu menunggu lama untuk mendapat informasi.

### 3.2 Sisi Admin (Pemilik Sistem)
- Sebagai **admin**, saya ingin sistem otomatis menarik data GitHub setiap bulan, agar proyek baru muncul tanpa saya input manual.
- Sebagai **admin**, saya ingin sistem otomatis menarik data CTFtime setiap minggu, agar pencapaian CTF terbaru langsung tercermin.
- Sebagai **admin**, saya ingin login ke halaman admin rahasia, agar hanya saya yang bisa mengubah konfigurasi.
- Sebagai **admin**, saya ingin menekan tombol "Sync Now" untuk memicu sinkronisasi manual, agar saya tidak perlu menunggu jadwal cron ketika ada update mendesak (misal: baru saja menang CTF).
- Sebagai **admin**, saya ingin bisa menyembunyikan (hide) repository atau event tertentu, agar proyek eksperimen/gagal tidak tampil ke publik.
- Sebagai **admin**, saya ingin melihat log/riwayat sinkronisasi terakhir (sukses/gagal, timestamp), agar saya tahu jika ada error dari API pihak ketiga.
- Sebagai **admin**, saya ingin mendapat notifikasi (opsional, misal via email/webhook) jika sinkronisasi otomatis gagal berturut-turut, agar saya bisa menindaklanjuti sebelum data terlalu usang.

---

## 4. Functional Requirements

### 4.1 FR-1: Automated GitHub Integration (Cron Bulanan)

**Trigger**: Cloudflare Cron Trigger, dijadwalkan `0 0 1 * *` (setiap tanggal 1, jam 00:00 UTC).

**Alur Kerja**:
1. Worker terbangun sesuai jadwal cron, memanggil **GitHub REST API** (`/users/{username}/repos` dan `/users/{username}/pinned` — catatan: pinned repos tidak tersedia via REST resmi, sehingga direkomendasikan menggunakan **GitHub GraphQL API** `pinnedItems` untuk data ini).
2. Sistem mengambil field relevan per repo: nama, deskripsi, bahasa utama, topics/tags, stargazer count, fork count, URL, tanggal `pushed_at` terakhir, dan status pinned.
3. Sistem melakukan **diffing**: membandingkan data baru dengan data tersimpan di database (berdasarkan `repo_id` unik dari GitHub).
   - Jika repo baru ditemukan → insert sebagai entry baru dengan status `pending_review` atau `auto_published` (dapat dikonfigurasi admin).
   - Jika repo pinned berubah (repo lama unpin, repo baru pinned) → update flag `is_pinned`.
   - Jika ada kontribusi signifikan (didefinisikan sebagai: repo non-milik-sendiri dengan jumlah commit dari user > threshold tertentu dalam periode berjalan, diambil dari GitHub Events API `/users/{username}/events/public`) → dicatat sebagai entry kontribusi terpisah.
4. Data yang sudah diproses disimpan ke database (lihat Bagian 6) dengan flag `last_synced_at`.
5. Halaman "Projects" merender data langsung dari database — bukan memanggil API GitHub secara real-time saat pengunjung mengakses situs (demi performa & menghindari rate limit).

**Aturan Bisnis**:
- Repository yang di-fork tanpa modifikasi signifikan (0 commit tambahan dari user) **tidak** otomatis ditampilkan.
- Repository dengan visibility `private` tidak pernah diproses (GitHub API token yang digunakan sebaiknya read-only public scope, atau jika perlu akses private repo untuk keperluan lain, filter eksplisit `private === false` diterapkan di kode).
- Admin dapat mengubah mode dari `auto_publish` menjadi `manual_review` di dashboard, sehingga repo baru masuk status "draft" dan menunggu approval admin sebelum tampil publik.

### 4.2 FR-2: Automated CTFtime Integration (Cron Mingguan)

**Trigger**: Cloudflare Cron Trigger, dijadwalkan `0 0 * * 1` (setiap Senin, jam 00:00 UTC).

**Catatan Teknis Penting**: CTFtime **tidak memiliki API resmi yang didukung penuh**. Yang tersedia adalah:
- Endpoint tidak resmi seperti `https://ctftime.org/api/v1/teams/{team_id}/` yang mengembalikan data rating historis per tahun.
- Untuk data event partisipasi/skor per event, umumnya diperlukan **scraping halaman profil tim/user** karena tidak semua data tersedia di endpoint JSON resmi.

**Alur Kerja**:
1. Worker memanggil endpoint `teams/{team_id}/` (jika kompetisi dilakukan atas nama tim) atau melakukan fetch + parse HTML dari halaman profil publik CTFtime jika data individual diperlukan.
2. Sistem mem-parsing: nama event, tanggal event, rank tim/individu di event tersebut, poin yang diperoleh, dan rating points tahunan.
3. Diffing dilakukan berdasarkan `event_id` unik: event yang belum ada di database akan diinsert sebagai partisipasi baru.
4. Perubahan rating tahunan dicatat sebagai snapshot historis (bukan overwrite), sehingga grafik tren rating dari waktu ke waktu dapat ditampilkan di halaman "Achievements".
5. Jika parsing HTML gagal (struktur halaman CTFtime berubah — risiko nyata karena bergantung pada scraping), sistem harus **fail gracefully**: mencatat error ke log, mengirim notifikasi ke admin, dan **tidak** menghapus/merusak data lama yang sudah tersimpan.

**Aturan Bisnis**:
- Karena sifatnya scraping (bukan API resmi terdokumentasi), interval mingguan dipilih untuk mengurangi beban ke server CTFtime dan risiko diblokir (rate limiting/IP block).
- Disarankan menambahkan **User-Agent yang sopan** dan jeda antar-request jika perlu mengambil multiple halaman.
- Fallback: jika sync otomatis gagal 2 minggu berturut-turut, sistem mengunci status "last known good data" dan menampilkan badge kecil "data mungkin belum terbaru" di halaman publik (opsional, untuk transparansi).

### 4.3 FR-3: Manual Override & Admin Dashboard

**Akses**: Halaman di path tersembunyi (misal `/admin-x7k2`, bukan `/admin`), dilindungi autentikasi (lihat NFR Keamanan).

**Fitur Dashboard**:
1. **Tombol "Sync GitHub Now"** dan **"Sync CTFtime Now"** — memanggil endpoint internal yang men-trigger fungsi sinkronisasi yang sama dengan yang dipakai cron job, dengan rate-limit internal (misal: maksimal 1x per 10 menit) untuk mencegah penyalahgunaan/API abuse.
2. **Daftar item tersinkron** (repos & CTF events) dengan toggle **Show/Hide** — item yang di-hide tetap tersimpan di database (soft delete) tapi tidak dirender di halaman publik.
3. **Riwayat Sinkronisasi (Sync Log)**: timestamp, sumber (GitHub/CTFtime), status (sukses/gagal), jumlah item baru ditemukan, pesan error jika ada.
4. **Edit manual ringan**: kemampuan menambahkan catatan/deskripsi custom di atas data otomatis (misal menambahkan konteks "Proyek ini digunakan di produksi oleh X pengguna" pada sebuah repo).

---

## 5. Non-Functional Requirements

### 5.1 Performa
- **Time to First Byte (TTFB)** halaman publik < 200ms (dicapai dengan Cloudflare edge caching + rendering dari database, bukan live API call).
- Halaman publik **tidak pernah** memanggil GitHub/CTFtime API secara langsung saat diakses pengunjung — semua data sudah di-pre-fetch oleh cron worker dan disimpan di storage edge.
- Lighthouse Performance Score target ≥ 90 untuk halaman utama dan halaman Projects/Achievements.

### 5.2 Limitasi API & Rate Limiting
- **GitHub REST API**: limit 5.000 request/jam untuk authenticated request (menggunakan Personal Access Token). Dengan sinkronisasi bulanan, penggunaan sangat jauh di bawah limit — namun tetap perlu exponential backoff jika terjadi `403`/rate-limit response.
- **GitHub GraphQL API**: memiliki sistem "point cost" berbeda; query pinned items perlu diperhitungkan agar tidak melebihi 5.000 poin/jam (praktis tidak masalah untuk 1x/bulan).
- **CTFtime**: tidak ada dokumentasi rate limit resmi karena bukan API publik yang didukung — sistem harus defensif: retry dengan backoff, timeout wajar (misal 10 detik), dan tidak melakukan polling agresif.
- Manual sync dari dashboard admin dibatasi **cooldown** (misal 1x/10 menit per sumber) untuk mencegah admin sendiri (atau serangan) memicu spam request ke API eksternal.

### 5.3 Keamanan
- Endpoint admin **wajib** dilindungi autentikasi (minimal: Cloudflare Access untuk zero-trust auth berbasis email, atau JWT + password hash jika ingin custom auth).
- API token GitHub (Personal Access Token) dan kredensial lain disimpan sebagai **Cloudflare Worker Secrets** (`wrangler secret put`), **tidak pernah** di-hardcode di source code atau ter-commit ke repository.
- Endpoint trigger manual sync harus tervalidasi bahwa request datang dari sesi admin yang sah (bukan endpoint publik yang bisa dipanggil siapa saja).
- Rate limiting pada level Cloudflare (WAF/Rate Limiting Rules) untuk mencegah abuse pada endpoint publik maupun admin.
- Path halaman admin sebaiknya tidak predictable (`/admin`, `/dashboard`) dan dikombinasikan dengan proper auth — security-by-obscurity saja tidak cukup, tapi mengurangi noise dari bot scanning.
- Karena pemilik situs adalah praktisi keamanan (CTF player), sistem juga menjadi "showcase" — disarankan menerapkan security headers standar (CSP, HSTS, X-Frame-Options) sebagai bagian dari kredibilitas teknis situs.

### 5.4 Reliabilitas & Observability
- Setiap eksekusi cron job dicatat ke tabel `sync_logs` (lihat FR-3) agar admin punya audit trail.
- Idempotency: menjalankan sync job dua kali berturut-turut (misal karena admin klik manual sync tepat setelah cron jalan) tidak boleh menghasilkan data duplikat — gunakan upsert berdasarkan unique ID eksternal (`repo_id`, `event_id`).
- Graceful degradation: jika salah satu sumber data (GitHub atau CTFtime) down, halaman terkait tetap menampilkan data terakhir yang berhasil disinkron, bukan error page kosong.

---

## 6. Proposed Technical Architecture

### 6.1 Ringkasan Stack (Dioptimalkan untuk Budget Gratis/Murah)

| Layer | Rekomendasi | Alasan |
|---|---|---|
| **Compute / Scheduling** | **Cloudflare Workers + Cron Triggers** | Serverless, free tier generous (100.000 request/hari), cron trigger native tanpa perlu server terpisah |
| **Frontend Hosting** | **Cloudflare Pages** | Terintegrasi native dengan Workers, gratis, edge caching otomatis, cocok untuk static/SSR site |
| **Framework Frontend** | **Astro** atau **Next.js (edge runtime)** | Astro sangat cocok untuk situs konten-berat dengan sedikit interaktivitas (portofolio); Next.js jika ingin lebih banyak fitur dashboard interaktif |
| **Database** | **Cloudflare D1** (SQLite berbasis edge) | Gratis untuk skala kecil (5GB storage, 5 juta baris baca/hari di free tier), terintegrasi langsung dengan Workers, cocok untuk data terstruktur (repos, events, sync logs) |
| **Object/Blob Storage (opsional)** | **Cloudflare R2** | Jika ingin menyimpan screenshot proyek atau writeup CTF sebagai file, gratis hingga 10GB |
| **Auth Admin** | **Cloudflare Access (Zero Trust)** | Gratis untuk hingga 50 user, tidak perlu membangun sistem login sendiri — cukup batasi akses `/admin-*` ke email tertentu |
| **CMS (opsional)** | Tidak diperlukan Headless CMS terpisah — **D1 + Admin Dashboard custom** lebih murah dan lebih terkontrol dibanding CMS pihak ketiga (Contentful/Sanity yang punya limit free tier ketat untuk use case ini) |
| **Secrets Management** | **Wrangler Secrets** (`wrangler secret put GITHUB_TOKEN`) | Native, aman, tidak perlu layanan tambahan |
| **Monitoring/Alerting** | **Cloudflare Workers Logs** + opsional webhook ke Discord/Telegram saat sync gagal | Gratis, cukup untuk skala personal project |

### 6.2 Diagram Alur Sistem (Deskriptif)

1. **Cloudflare Cron Trigger (Bulanan)** → memicu **Worker: `sync-github`** → memanggil GitHub REST/GraphQL API → parsing & diffing → upsert ke **D1 Database** (tabel `projects`).
2. **Cloudflare Cron Trigger (Mingguan)** → memicu **Worker: `sync-ctftime`** → memanggil/scrape CTFtime → parsing & diffing → upsert ke **D1 Database** (tabel `ctf_achievements`, `ctf_rating_history`).
3. **Cloudflare Pages (Frontend)** → saat build/request, membaca data dari **D1** via Worker API (`GET /api/projects`, `GET /api/achievements`) → merender halaman publik dengan edge caching.
4. **Admin Dashboard** (`/admin-x7k2`, dilindungi Cloudflare Access) → memanggil **Worker API** (`POST /api/sync/trigger`, `PATCH /api/projects/:id/hide`) → langsung berinteraksi dengan D1 dan/atau memicu ulang Worker sync di atas.
5. **Sync Logs** dicatat di setiap eksekusi (baik cron maupun manual) ke tabel `sync_logs` untuk observability.

### 6.3 Skema Database (D1 — Contoh Struktur Tabel)

```sql
-- Tabel proyek dari GitHub
CREATE TABLE projects (
  id TEXT PRIMARY KEY,          -- github repo_id
  name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  topics TEXT,                  -- JSON array as string
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  url TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  admin_note TEXT,
  last_pushed_at DATETIME,
  last_synced_at DATETIME
);

-- Tabel pencapaian CTF
CREATE TABLE ctf_achievements (
  id TEXT PRIMARY KEY,          -- event_id dari CTFtime
  event_name TEXT NOT NULL,
  event_date DATETIME,
  rank INTEGER,
  points REAL,
  team_name TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  last_synced_at DATETIME
);

-- Histori rating tahunan (untuk grafik tren)
CREATE TABLE ctf_rating_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER,
  rating_points REAL,
  country_rank INTEGER,
  recorded_at DATETIME
);

-- Log sinkronisasi
CREATE TABLE sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,         -- 'github' | 'ctftime'
  trigger_type TEXT NOT NULL,   -- 'cron' | 'manual'
  status TEXT NOT NULL,         -- 'success' | 'failed'
  new_items_count INTEGER DEFAULT 0,
  error_message TEXT,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 6.4 Estimasi Biaya

Dengan trafik personal portfolio (low-moderate), seluruh stack di atas **kemungkinan besar tetap berada di free tier Cloudflare** ($0/bulan):
- Workers: 100.000 request/hari gratis (jauh melebihi kebutuhan cron 2x + traffic pengunjung wajar).
- D1: 5GB storage & 5 juta baris baca/hari gratis — lebih dari cukup untuk data portofolio personal.
- Pages: unlimited request gratis untuk static/edge hosting.
- Cloudflare Access: gratis hingga 50 user terautentikasi.

Domain custom (opsional, ~$10–15/tahun) menjadi satu-satunya biaya realistis jika ingin domain sendiri alih-alih subdomain `*.pages.dev`.

---

## 7. Success Metrics

| Metrik | Target | Cara Ukur |
|---|---|---|
| **Sync Success Rate** | ≥ 98% eksekusi cron berhasil tanpa error | Analisis tabel `sync_logs` |
| **Data Freshness** | Proyek GitHub baru tampil ≤ 1 bulan sejak dibuat; event CTF baru tampil ≤ 1 minggu sejak selesai | Selisih `created_at` sumber vs `last_synced_at` |
| **Page Performance** | TTFB < 200ms, Lighthouse ≥ 90 | Cloudflare Analytics / Lighthouse CI |
| **Admin Effort** | < 5 menit/bulan waktu maintenance manual (di luar sync otomatis) | Self-tracking / anekdotal |
| **Infrastructure Cost** | $0–$5/bulan | Cloudflare billing dashboard |
| **Engagement (opsional)** | Rata-rata waktu di halaman Projects/Achievements > 60 detik | Cloudflare Web Analytics (privacy-friendly, tanpa cookie) |
| **Zero Data Loss Incidents** | 0 insiden kehilangan/corrupt data akibat kegagalan sync | Review manual `sync_logs` + backup D1 berkala |

---

## 8. Risiko & Mitigasi (Tambahan)

| Risiko | Dampak | Mitigasi |
|---|---|---|
| CTFtime mengubah struktur HTML (karena scraping, bukan API resmi) | Sync mingguan gagal parsing | Fail gracefully + alert admin + retain data lama; monitor komunitas CTFtime untuk API resmi jika dirilis |
| GitHub API token expired/revoked | Sync bulanan gagal total | Gunakan Fine-grained PAT dengan masa berlaku panjang + reminder kalender untuk rotasi token |
| Worker cron tidak jalan (Cloudflare outage) | Data usang sementara | Halaman publik tetap tampilkan data terakhir (graceful degradation), bukan error |
| Admin dashboard bocor/diakses tanpa izin | Data dimanipulasi pihak tidak berwenang | Cloudflare Access + audit log setiap perubahan manual |

---

*Dokumen ini adalah draft awal dan terbuka untuk revisi berdasarkan diskusi lebih lanjut mengenai prioritas fitur, terutama terkait keputusan build-vs-buy untuk komponen CMS/dashboard.*
