'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePage() {
  const session = useSession();
  return (
    <div className="max-w-3xl mx-auto mt-24 px-4">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-border">
          <Image
            src={session.data?.user.image ?? '/luffy.jpg'}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">@anamsadat</h1>
          <p className="text-muted-foreground">Laki-laki</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Bio</h2>
        <p className="text-muted-foreground">
          Seorang developer yang suka ngulik Next.js, AI, dan teknologi backend.
          Saat tidak ngoding, biasanya sibuk mikirin UI yang bagus atau nonton
          YouTube sambil makan cilok.
        </p>
      </div>

      {/* Info Lainnya */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Informasi Tambahan</h2>
        <ul className="text-muted-foreground list-disc list-inside space-y-1">
          <li>Nama Lengkap: Anam Sadat</li>
          <li>Email: anam@example.com</li>
          <li>Bergabung sejak: Januari 2024</li>
        </ul>
      </div>
    </div>
  );
}
