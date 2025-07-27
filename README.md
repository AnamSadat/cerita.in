# 🚀 Cerita.in

Website bercerita modern menggunakan **Next.js**, **Tailwind CSS**, dan **Google Cloud Storage** untuk mengunggah gambar.

## 🛠️ Getting Started (Development)

### 1. Clone Repository

```bash
git clone https://github.com/AnamSadat/cerita.in.git
cd cerita.in
```

### 2. Install Depedencies

Kami menyarankan menggunakan pnpm (lebih cepat & efisien):

```bash
# install pnpm jika belum
npm install -g pnpm

# lalu install dependency
pnpm install

```

### 3. Setup `.env`

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

### 4. Setup Google Cloud Storage (Untuk upload gambar)

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

### 2. Izin Akses Publik (allUser)

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

### 3. Buat Service Accounts dan Unduh Key

1. Buka [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Masuk ke **IAM & Admin > Service Accounts**
3. Klik **Create Service Account**
   - Name: `ceritain-images`
   - Role: `Storage Admin`
4. Setelah dibuat, buka **Service Account** tersebut
5. Klik tab **Keys**, lalu klik **Add Key > JSON**
6. Simpan file `key.json` ke root project

#### ⚠️ **JANGAN** lupa manambahkan `key.json` ke `.gitignore`!

```bash
# .gitignore
key.json
```

### Running Application

```bash
pnpm run dev
# atau
pnpm dev
```
