'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { StoryCard } from './StoryCard';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import { fetchStory } from '@/lib/features/storySlice';
import toast from 'react-hot-toast';
import { LoaderOne } from '@/components/ui/loader';

interface Props {
  query: string;
  category: string;
}

export default function StoryList({ query, category }: Props) {
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

  // ✅ Logika filter
  const filteredItems = items.filter((story) => {
    const matchesQuery = story.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesCategory = category
      ? story.category.name.toLowerCase() === category.toLowerCase()
      : true;

    return matchesQuery && matchesCategory;
  });

  console.log('Filtered:', filteredItems);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <LoaderOne />
      </div>
    );
  }

  if (error && items.length === 0) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-400">No stories found.</p>
      ) : (
        <div className="grid mx-auto lg:grid-cols-4 gap-5 md:grid-cols-3">
          {filteredItems.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
