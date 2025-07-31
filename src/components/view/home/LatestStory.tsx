'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { fetchStory } from '@/lib/features/storySlice';
import { Carousel } from '@/components/ui/carousel';

export function CarouselDemo() {
  const dispatch = useAppDispatch();
  const { items: stories, loading } = useAppSelector((state) => state.story);

  useEffect(() => {
    dispatch(fetchStory());
  }, [dispatch]);

  const slideData = stories.map((story) => ({
    title: story.title,
    button: 'Baca Cerita',
    src: story.img_url || 'https://via.placeholder.com/800x400?text=No+Image',
    slug: story.slug,
  }));

  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      {loading ? (
        <div className="text-center text-gray-500">Memuat cerita...</div>
      ) : stories.length === 0 ? (
        <div className="text-center text-gray-500">Belum ada story.</div>
      ) : (
        <Carousel slides={slideData} />
      )}
    </div>
  );
}
