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
| POST   | `/api/like`               | Menambahkan like ke cerita tertentu.                       | ✅ Ya       |
| DELETE | `/api/like/[id]`          | Menghapus like dari cerita tertentu.                       | ✅ Ya       |
| GET    | `/api/profile/[username]` | Mengambil profil pengguna berdasarkan username.            | ❌ Tidak    |
| PUT    | `/api/profile/[username]` | Memperbarui profil pengguna.                               | ✅ Ya       |
| GET    | `/api/story`              | Mengambil semua cerita (filter: publik, kategori, dsb).    | ❌ Tidak    |
| POST   | `/api/story`              | Membuat cerita baru.                                       | ✅ Ya       |
| GET    | `/api/story/[slug]`       | Mengambil detail cerita berdasarkan slug.                  | ❌ Tidak    |
| DELETE | `/api/story/delete`       | Menghapus cerita yang dimiliki oleh pengguna.              | ✅ Ya       |
