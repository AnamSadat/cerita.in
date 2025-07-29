'use client';

import FormRegister from '@/components/view/auth/FormRegister';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto">
      <div className="justify-center flex mx-auto">
        <FormRegister />
      </div>
      <p className="text-center">
        Sudah punya akun?{' '}
        <Link href={'/login'} className="underline underline-offset-1">
          Login
        </Link>{' '}
        aja
      </p>
    </div>
  );
}
