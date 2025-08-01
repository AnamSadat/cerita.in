import { BackgroundBeams } from '@/components/ui/background-beams';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { FlipWords } from '@/components/ui/flip-words';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LatestStory } from '@/components/view/home/LatestStory';
// import { StickyScrollRevealDemo } from '@/components/view/home/StickyScrollRevealDemo';

export default function User() {
  const words = ['kisah', 'hidup', 'diri', 'takdir', 'cinta'];

  const testimonials = [
    {
      quote:
        'Cerita.in benar-benar tempat terbaik untuk menemukan kisah-kisah inspiratif dan penuh makna yang membuat saya selalu ingin kembali membaca.',
      name: 'Rina Sari',
      title: 'Pembaca Setia Cerita.in',
    },
    {
      quote:
        'Platform ini memudahkan saya membagikan pengalaman pribadi saya dalam bentuk cerita yang mudah diakses dan diapresiasi banyak orang.',
      name: 'Andi Pratama',
      title: 'Penulis Cerita',
    },
    {
      quote:
        'Dengan Cerita.in, saya menemukan komunitas pembaca dan penulis yang suportif dan penuh semangat untuk berkarya.',
      name: 'Dewi Lestari',
      title: 'Pengguna Aktif Cerita.in',
    },
    {
      quote:
        'Cerita yang saya baca di sini memberikan wawasan baru dan seringkali menyentuh hati, membuat hari saya lebih berwarna.',
      name: 'Budi Santoso',
      title: 'Penggemar Cerita Inspiratif',
    },
    {
      quote:
        'Antarmuka yang sederhana dan mudah digunakan membuat saya betah berlama-lama menjelajahi berbagai cerita di Cerita.in.',
      name: 'Maya Putri',
      title: 'Pengguna Baru',
    },
  ];

  return (
    <>
      <div className="h-[42rem] mx-2 my-2 rounded-2xl bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <BackgroundBeams /> {/* Background khusus area atas */}
        <div className="container flex justify-center items-center px-4">
          <div className="hero text-center mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl">
            <div className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl mb-10 leading-tight">
              Tiap hari adalah halaman baru dari
              <FlipWords words={words} className="" /> <br />
              yang layak ditulis.
            </div>
            <div className="text-base sm:text-lg text-neutral-300">
              <TextGenerateEffect words="Tidak ada kisah yang terlalu biasa. Di cerita.in, kamu bisa berbagi pengalaman hidup tanpa rasa takut, dan menemukan orang-orang yang pernah merasakan hal yang sama." />
            </div>
          </div>
        </div>
      </div>

      {/* Ini DILUAR background utama */}
      <div className="container mx-auto mt-15">
        <div className="flex justify-between text-white">
          <h1 className="text-white text-3xl font-bold">Feedback Flow</h1>
        </div>
        <div className="my-10 px-4 w-full flex justify-center mx-auto">
          <div className="w-screen overflow-hidden">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
              className="w-full flex mx-auto"
            />
          </div>
        </div>
      </div>

      {/* carousel */}
      <div className="container mx-auto mt-30">
        <div className="flex justify-between text-white">
          <h1 className="text-white text-3xl font-bold">Latest Story</h1>
          <Link href={'/story'} className="hover:text-zinc-300">
            View All {'->'}
          </Link>
        </div>
        <div>
          <LatestStory />
        </div>
      </div>

      {/* Sticky scroll */}
      {/* <div className="w-full mx-auto">
        <div className="h-full">
          <StickyScrollRevealDemo />
        </div>
      </div> */}

      {/* Call Action */}
      <div className=" mx-auto container py-20 px-4 bg-[url(/buku.jpeg)] h-120 bg-cover text-white text-center overflow-hidden rounded-2xl mt-30 mb-30">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Setiap kisah layak didengar.
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto mb-8">
          Mulailah menulis ceritamu hari ini dan temukan orang-orang yang
          terhubung lewat pengalaman yang serupa. Kamu tidak sendiri, suaramu
          berarti.
        </p>
        <Button
          className="bg-white text-black hover:bg-neutral-400 font-semibold py-6  rounded-2xl text-lg transition"
          asChild
        >
          <Link href={'/add-story'}>✍️ Ceritakan Sekarang</Link>
        </Button>
      </div>
    </>
  );
}
