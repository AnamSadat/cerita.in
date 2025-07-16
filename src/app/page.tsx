import { BackgroundBeams } from '@/components/ui/background-beams';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { FlipWords } from '@/components/ui/flip-words';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

export default function Home() {
  const words = ['kisah', 'hidup', 'diri', 'takdir', 'cinta'];

  const testimonials = [
    {
      quote:
        'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.',
      name: 'Charles Dickens',
      title: 'A Tale of Two Cities',
    },
    {
      quote:
        'To be, or not to be, that is the question: Whether \'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.',
      name: 'William Shakespeare',
      title: 'Hamlet',
    },
    {
      quote: 'All that we see or seem is but a dream within a dream.',
      name: 'Edgar Allan Poe',
      title: 'A Dream Within a Dream',
    },
    {
      quote:
        'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
      name: 'Jane Austen',
      title: 'Pride and Prejudice',
    },
    {
      quote:
        'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
      name: 'Herman Melville',
      title: 'Moby-Dick',
    },
  ];

  // TODO: Add responsive page

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
      <div>
        <h1>Top Story</h1>
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
    </>
  );
}
