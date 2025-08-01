'use client';

import { LoaderOne } from '@/components/ui/loader';
import FormLogin from '@/components/view/auth/FormLogin';
import { Suspense } from 'react';

export default function Login() {
  return (
    <div className="min-h-screen flex px-5 mx-auto">
      {/* Kolom Kiri */}
      <div className="w-2/5 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex items-center justify-center mt-20">
              <LoaderOne />
            </div>
          }
        >
          <FormLogin />
        </Suspense>
      </div>

      {/* Kolom Kanan */}
      <div className="w-3/5 bg-[url('/gurun.jpg')] bg-cover bg-center flex items-center justify-center m-3 rounded-2xl"></div>
    </div>
  );
}
