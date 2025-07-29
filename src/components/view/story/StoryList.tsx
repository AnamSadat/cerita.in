'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { StoryCard } from './StoryCard';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import { fetchStory } from '@/lib/features/storySlice';

export default function StoryList() {
  const dispatch = useAppDispatch();
  const { items, error, loading } = useAppSelector(
    (state: RootState) => state.story
  );

  useEffect(() => {
    dispatch(fetchStory());
  }, [dispatch]);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
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
