'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { putUser } from '@/lib/prisma/apiPrisma';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AccountPage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState(session?.user?.username ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [password, setPassword] = useState('');

  const handleUpdate = async () => {
    try {
      const newUser = await putUser({ username, email, password });
      if (session && session.user) {
        session.user.username = newUser.data.username;
      }

      toast.success('Akun berhasil diperbarui');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Gagal memperbarui akun');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Akun ⚙️</h1>

      {/* Username */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Username
        </label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Email
        </label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Password Baru (Opsional)
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button onClick={handleUpdate}>Simpan Perubahan</Button>
    </div>
  );
}
