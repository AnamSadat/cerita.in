# 🚀 Cerita.in

Website bercerita modern menggunakan **Next.js**, **Tailwind CSS**, dan **Google Cloud Storage** untuk mengunggah gambar.

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
