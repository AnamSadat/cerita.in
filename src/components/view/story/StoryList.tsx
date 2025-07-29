'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { StoryCard } from './StoryCard';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import { fetchStory } from '@/lib/features/storySlice';
import toast from 'react-hot-toast';

export default function StoryList() {
  const dispatch = useAppDispatch();
  const { items, error, loading } = useAppSelector(
    (state: RootState) => state.story
  );

  useEffect(() => {
    dispatch(fetchStory());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // if (error?.message.includes('timeout')) {
  //   toast.error('Server lambat, coba lagi nanti.');
  // }

  console.log({ loading, error, items });

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error && items.length === 0) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  console.log('story: ', items);

  return (
    <div className="space-y-4">
      <div className="grid mx-auto lg:grid-cols-4  gap-5 md:grid-cols-3">
        {items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
