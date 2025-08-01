'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { StoryCard } from './StoryCard';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import { fetchStory } from '@/lib/features/storySlice';
import toast from 'react-hot-toast';
import { LoaderOne } from '@/components/ui/loader';
import { Card } from '@/components/ui/card';

interface Props {
  query: string;
  category: string;
  currentPage: number;
  itemsPerPage: number;
  onTotalChange?: (total: number) => void;
}

export default function StoryList({
  query,
  category,
  currentPage,
  itemsPerPage,
  onTotalChange,
}: Props) {
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

  useEffect(() => {
    onTotalChange?.(filteredItems.length);
  }, [filteredItems.length, onTotalChange]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  console.log('Filtered:', filteredItems);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20 mb-20">
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
        <Card className="p-7 items-center border-0 flex flex-col bg-neutral-900/80 space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width={120}
          >
            <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm240 80c0-8.8 7.2-16 16-16c45 0 85.6 20.5 115.7 53.1c6 6.5 5.6 16.6-.9 22.6s-16.6 5.6-22.6-.9c-25-27.1-57.4-42.9-92.3-42.9c-8.8 0-16-7.2-16-16zm-80 80c-26.5 0-48-21-48-47c0-20 28.6-60.4 41.6-77.7c3.2-4.4 9.6-4.4 12.8 0C179.6 308.6 208 349 208 369c0 26-21.5 47-48 47zM367.6 208a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
          <h2 className="text-white text-2xl font-bold">
            Daftar Story Masih Kosong
          </h2>
          <p>Silahkan untuk membuat daftar Story terlebih dahulu</p>
        </Card>
      ) : (
        <div className="grid mx-auto lg:grid-cols-4 gap-5 md:grid-cols-3">
          {paginated.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
