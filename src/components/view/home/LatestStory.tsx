'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { fetchStory } from '@/lib/features/storySlice';
import { Carousel } from '@/components/ui/carousel';
import { LoaderOne } from '@/components/ui/loader';
import { Card } from '@/components/ui/card';
import { Frown } from 'lucide-react';

export function LatestStory() {
  const dispatch = useAppDispatch();
  const { items: stories, loading } = useAppSelector((state) => state.story);

  useEffect(() => {
    dispatch(fetchStory());
  }, [dispatch]);

  const slideData = [...stories]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 7)
    .map((story) => ({
      title: story.title,
      button: 'Baca Cerita',
      src:
        story.img_url ||
        'https://storage.googleapis.com/ceritain-images/19c2dbd0-6b6a-4c62-86bb-35d528188922.jpg',
      slug: story.slug,
    }));

  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      {loading ? (
        <div className="flex items-center justify-center mt-20">
          <LoaderOne />
        </div>
      ) : stories.length === 0 ? (
        <Card className="p-7 items-center border-0 flex flex-col bg-neutral-900/80">
          <Frown className="text-white size-50" />
          <h2 className="text-white text-2xl font-bold">
            Opsss Belum Ada Cerita Apapun...
          </h2>
        </Card>
      ) : (
        <Carousel slides={slideData} />
      )}
    </div>
  );
}
