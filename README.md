# 🚀 Cerita.in

**Ceritain** adalah platform berbasis web tempat pengguna bisa membagikan cerita, pengalaman, atau curahan hati, baik secara publik maupun pribadi. Cocok untuk yang suka menulis, membaca, atau hanya ingin mengekspresikan diri dengan aman.

## Introduction

### 🔑 Fitur Autentikasi

#### 1. Registrasi Manual

- Pengguna daftar dengan username, email, password

- Validasi form client dan server

- Password di-hash sebelum disimpan (via Prisma + bcrypt)

#### 2. Login Credential

- Login menggunakan email dan password

- Setelah login, diarahkan ke halaman utama

##### 🧑‍💻 Akun Uji Coba (Testing Account)

- `Email`: lumiere@gmail.com
  
- `Password`: Admin1234*

> ⚠️ Pastikan logout terlebih dahulu jika sebelumnya sudah login, agar sesi tidak bentrok.

#### 3. Session & Proteksi

- Menggunakan NextAuth (dengan strategi JWT)

- Middleware melindungi semua halaman dashboard dan fitur CRUD

- Hanya user yang sudah login bisa melihat, mengedit, atau menghapus ceritanya sendiri

### 📦 Fitur Utama CRUD

#### 1. 📖 Story (Cerita)

- Create: Menulis cerita baru dengan judul, deskripsi singkat, kategori, isi, dan gambar

- Read: Cerita bisa dilihat publik atau hanya oleh pemilik

- Update: Pemilik cerita bisa mengedit seluruh isi cerita

- Delete: Cerita bisa dihapus oleh pemilik

#### 2. 🔖 Bookmark

- Create: Simpan cerita orang lain sebagai bookmark dan notes (opsional)

- Read: Lihat daftar cerita yang telah dibookmark di halaman khusus

- Delete: Hapus bookmark dari daftar
- Update: Mengedit notes dari bookmark

### 🔎 Fitur Dashboard

- Menampilkan cerita milik user

- Menampilkan aktivitas user seperti cerita yang sudah di like atau di bookmark

- Fitur edit profil (nama, bio, gender, gambar)

- Manajemen cerita: edit, hapus

- Manajemen bookmark: edit, hapus

### 🧩 Teknologi yang Digunakan

- Next.js – Framework React untuk frontend dan backend (App Router)

- Tailwind CSS – Utility-first CSS untuk styling responsif dan modern

- Prisma ORM – ORM untuk akses database yang efisien dan typesafe

- Neon PostgreSQL – Database PostgreSQL berbasis cloud dengan support serverless & branching

- NextAuth.js – Autentikasi berbasis credential (tanpa OAuth)

- TypeScript – Supaya aman dan terstruktur saat ngoding

### 🛡️ Keamanan

- Semua operasi CRUD (story dan bookmark) hanya dapat diakses oleh pengguna yang telah autentikasi (login).

- Authorization diterapkan: pengguna hanya dapat mengakses dan mengelola resource miliknya sendiri (berdasarkan session ID).

- Input dari user divalidasi secara ketat menggunakan Zod (termasuk tipe data, panjang teks, dan format yang diperbolehkan).

- Sistem autentikasi menggunakan email dan password dengan pendekatan credential-based login, tanpa integrasi pihak ketiga (OAuth).

- Gambar (misalnya avatar atau cover cerita) disimpan di Google Cloud Storage (GCS).

- Akses gambar dilakukan melalui URL langsung dari GCS yang telah disimpan di database.

- Upload hanya diperbolehkan oleh user yang valid dan dilakukan via API yang aman (auth protected).

### Structure Project

```markdown
📁 cerita-in
├── docs/                  # Dokumentasi teknis dan markdown
├── prisma/                # Skema dan migrasi database
├── public/                # Aset statis
├── src/                   # Sumber utama aplikasi
│   ├── app/               # Routing (Next.js App Router)
│   ├── components/        # UI dan section
│   ├── lib/               # Logic seperti GCS, Prisma
│   ├── scripts/           # Script CLI internal
│   ├── types/             # Tipe global
│   └── auth.ts            # Konfigurasi NextAuth
├── .env.example
├── package.json
└── README.md
```

### 🌐 Documentation API

#### Ringkasan Endpoint Utama

| Metode | Path                      | Deskripsi                                                  | Autentikasi |
| ------ | ------------------------- | ---------------------------------------------------------- | ----------- |
| POST   | `/api/auth/signup`        | Mendaftarkan pengguna baru.                                | ❌ Tidak    |
| POST   | `/api/auth/[...nextauth]` | Autentikasi login menggunakan email & password (NextAuth). | ❌ Tidak    |
| GET    | `/api/account`            | Mengambil data akun pengguna yang sedang login.            | ✅ Ya       |
| PUT    | `/api/account`            | Memperbarui data akun pengguna.                            | ✅ Ya       |
| POST   | `/api/add-story`          | Menambahkan cerita baru.                                   | ✅ Ya       |
| GET    | `/api/bookmark`           | Mengambil semua bookmark milik pengguna.                   | ✅ Ya       |
| POST   | `/api/bookmark`           | Menambahkan bookmark ke cerita tertentu.                   | ✅ Ya       |
| PUT    | `/api/bookmark`           | Mengedit catatan bookmark.                                 | ✅ Ya       |
| DELETE | `/api/bookmark`           | Menghapus bookmark dari cerita tertentu.                   | ✅ Ya       |
| GET    | `/api/category`           | Mengambil daftar kategori cerita.                          | ❌ Tidak    |
| GET    | `/api/like`               | Mengambil semua like ke milik pengguna.                    | ✅ Ya       |
| POST   | `/api/like`               | Menambahkan like ke cerita tertentu.                       | ✅ Ya       |
| DELETE | `/api/like/[id]`          | Menghapus like dari cerita tertentu.                       | ✅ Ya       |
| GET    | `/api/profile/[username]` | Mengambil profil pengguna berdasarkan username.            | ✅ Ya       |
| POST   | `/api/profile/[username]` | Membuat profil pengguna berdasarkan username.              | ✅ Ya       |
| PUT    | `/api/profile/[username]` | Memperbarui profil pengguna.                               | ✅ Ya       |
| GET    | `/api/story`              | Mengambil semua cerita (filter: publik, kategori, dsb).    | ❌ Tidak    |
| PUT    | `/api/story`              | Memperbarui Cerita.                                        | ✅ Ya       |
| GET    | `/api/story/[slug]`       | Mengambil detail cerita berdasarkan slug.                  | ❌ Tidak    |
| DELETE | `/api/story/delete`       | Menghapus cerita yang dimiliki oleh pengguna.              | ✅ Ya       |

## 🛠️ Getting Started (Development)

### 1. 🔁 Clone Repository

```bash
git clone https://github.com/AnamSadat/cerita.in.git
cd cerita.in
```

### 2. 📦 Install Depedencies

Kami menyarankan menggunakan pnpm (lebih cepat & efisien):

```bash
# install pnpm jika belum
npm install -g pnpm

# lalu install dependency
pnpm install

```

### 3. 🔐 Setup `.env`

Buat file .env di root project dan isi dengan setup kamu:

```bash
DATABASE_URL=postgres://...
NEXT_PUBLIC_STORY_API=http://localhost:3000/api
NEXTAUTH_SECRET=your_generated_secret
```

**Generate Secret:**

```bash
openssl rand -base64 32
# atau
pnpm generate:ssl
```

**Test Connect Database:**

```bash
pnpm test:db
```

**Running Seed:**

```bash
pnpm seed
```

### 4. ☁️ Setup Google Cloud Storage (Untuk upload gambar)

#### 1. Buat Project dan Bucket

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat Project baru (atau gunakan yang sudah ada)
3. Masuk ke **Cloud Storage > Bucket**
4. Klik **Create Bucket**
   - Nama: `ceritain-images`
   - Region: asia-southeast1 (atau sesuai preferensi)
   - Default Storage Class: Standard
   - Access control: Uniform
   - Public Access: unchecker (nanti diatur manual)

#### 🔑 Aktifkan `Cloud Storage API`

Sebelum lanjut, aktifkan API-nya terlebih dahulu:

1. Buka [Cloud Storage API](https://console.cloud.google.com/apis/library/storage-component.googleapis.com)

2. Pilih project kamu lalu klik **Enable**.

#### 2. Izin Akses Publik (allUser)

1. Klik Bucket yang sudah dibuat `ceritain-images`
2. Buka tab **Permission** pada bucket
3. Klik **Grant Access**
4. Lalu Isi:
   - **New principals**: `allUser`
   - **Role**: `Storage Object Viewer`
5. Klik **Save**

Sekarang file yang diunggah dapat diakses melalui URL publik:

```bash
https://storage.googleapis.com/ceritain-images/namafile.jpg
```

#### 3. Buat Service Accounts dan Unduh Key

1. Buka [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Masuk ke **IAM & Admin > Service Accounts**
3. Klik **Create Service Account**
   - Name: `ceritain-images`
   - Role: `Storage Admin`
4. Setelah dibuat, buka **Service Account** tersebut
5. Klik tab **Keys**, lalu klik **Add Key > JSON**
6. Simpan file `key.json` ke root project

#### ⚠️ **JANGAN** lupa manambahkan `key.json` ke `.gitignore`

```bash
# .gitignore
key.json
```

### 5. Konfigurasi Credential Google Cloud Storage via `.env` untuk **Production**

#### 1. Ubah `key.json` jadi 1 line (JSON string)

Di terminal, jalankan perintah:

```bash
node -e "console.log(JSON.stringify(require('./key.json')))"
# atau
pnpm parse:keyjson
```

Contoh outputnya:

```bash
{"type":"service_account","project_id":"your-project-id","private_key_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n", ...}
```

Lalu copy output-nya.

#### 2. Tambahkan ke file `.env`

```env
GOOGLE_CLOUD_KEY={"type":"service_account", ...}
```

> ⚠️ Pastikan bagian `private_key` menggunakan \\\n (dua backslash), bukan newline beneran.

#### 3. Konfigurasi `Code`

Ubah inisialisasi Google Cloud Storage dari `key.json` ke `.env`

**Sebelumnya:** Menggunakan `key.json` (kurang aman untuk production)

```ts
// src/lib/gcsUploader.ts

const keyPath = path.join(process.cwd(), 'key.json');

if (!fs.existsSync(keyPath)) {
  throw new Error(
    '❌ key.json is missing. Please provide the service account key file.'
  );
}

const storage = new Storage({
  keyFilename: keyPath,
});
```

**Sekarang:** Menggunakan `.env` (rekomendasi untuk production)

```ts
// src/lib/gcsUploader.ts

const serviceAccount = process.env.GOOGLE_CLOUD_KEY;

if (!serviceAccount) {
  throw new Error(
    '❌ GOOGLE_CLOUD_KEY is missing. Please set the service account key in your environment variables.'
  );
}

const storage = new Storage({
  credentials: JSON.parse(serviceAccount),
});
```

### ▶️ Running Application

```bash
pnpm run dev
# atau
pnpm dev
```
