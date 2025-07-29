'use client';

import FormLogin from '@/components/view/auth/FormLogin';
import Image from 'next/image';
import { Suspense } from 'react';

export default function Login() {
  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto">
      <div className="justify-center flex mx-auto">
        <div className="mx-auto justify-center flex">
          <Suspense fallback={<div>Loading form...</div>}>
            <FormLogin />
          </Suspense>
        </div>
        <div>
          <Image src={'/nature.jpg'} alt="alam" width={400} height={200} />
        </div>
      </div>
    </div>
  );
}
