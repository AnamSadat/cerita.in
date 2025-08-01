'use client';

import { useSession } from 'next-auth/react';

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Informasi Akun ⚙️</h1>

      {/* Username */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Username
        </label>
        <p className="mt-1 text-base">{session?.user?.username || '-'}</p>
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Email
        </label>
        <p className="mt-1 text-base">{session?.user?.email || '-'}</p>
      </div>
    </div>
  );
}
