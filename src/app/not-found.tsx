'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-neutal-950 mx-2 my-2 rounded-2xl">
      <Image
        src="/not-found-animation.gif"
        alt="Animasi halaman tidak ditemukan"
        width={600}
        height={300}
        unoptimized
        className="rounded-lg"
      />
      <h1 className="text-3xl font-bold mb-4 text-white">
        Oops! Halaman Tidak Ditemukan
      </h1>
      <p className="mt-4 text-gray-500 mb-4">
        Coba periksa URL atau kembali ke{' '}
        <Link
          href={'/'}
          className="underline bg-transparent underline-offset-1 cursor-pointer transition-colors duration-200 text-gray-500 hover:text-white"
        >
          halaman utama.
        </Link>
      </p>
      <Button
        onClick={() => router.back()}
        className="cursor-pointer hover:bg-neutral-800 transition-colors duration-200 text-gray-500"
      >
        Kembali
      </Button>
    </div>
  );
}
