'use client';

import Link from 'next/link';

const dummyLikedStories = [
  {
    id: 1,
    title: 'Belajar Next.js dari Nol sampai Deploy',
    short_description:
      'Panduan lengkap membangun aplikasi web modern menggunakan Next.js.',
    slug: 'belajar-nextjs',
    author: 'Anam Sadat',
    date: '28 Juli 2025',
  },
  {
    id: 2,
    title: 'Mengenal Prisma ORM untuk Node.js',
    short_description:
      'Cara mudah mengelola database menggunakan Prisma di proyek TypeScript-mu.',
    slug: 'prisma-orm-nodejs',
    author: 'Rafli Setiawan',
    date: '20 Juli 2025',
  },
];

export default function LikesPage() {
  return (
    <div className="max-w-3xl mx-auto mt-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Cerita yang Kamu Sukai ❤️</h1>

      {dummyLikedStories.length === 0 ? (
        <p className="text-muted-foreground">
          Kamu belum menyukai cerita apa pun.
        </p>
      ) : (
        <ul className="space-y-6">
          {dummyLikedStories.map((story) => (
            <li key={story.id} className="border-b pb-4">
              <Link href={`/story/${story.slug}`}>
                <h2 className="text-lg font-semibold hover:underline">
                  {story.title}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                {story.short_description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                oleh <span className="font-medium">{story.author}</span> —{' '}
                {story.date}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
