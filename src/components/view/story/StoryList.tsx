'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { StoryCard } from './StoryCard';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import { fetchStory } from '@/lib/features/storySlice';
import toast from 'react-hot-toast';
import { LoaderOne } from '@/components/ui/loader';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Frown } from 'lucide-react';

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
          <Frown className="text-white size-50" />
          <h2 className="text-white text-2xl font-bold">
            Opsss Masih Kosong atau Tidak di Temukan...
          </h2>
          <p>
            Silahkan untuk membuat daftar Story terlebih dahulu atau clear
            filter
          </p>
        </Card>
      ) : (
        <div
          className={`grid gap-5 mx-auto 
    ${
      paginated.length >= 4
        ? 'md:grid-cols-3 lg:grid-cols-4'
        : paginated.length === 3
        ? 'grid-cols-3 justify-center'
        : paginated.length === 2
        ? 'grid-cols-2'
        : paginated.length === 1
        ? 'place-items-center w-74'
        : ''
    }`}
          style={{
            maxWidth:
              paginated.length === 2
                ? '600px'
                : paginated.length === 3
                ? '850px'
                : '100%',
          }}
        >
          {paginated.map((story) => (
            <Link key={story.id} href={`story/${story.slug}`}>
              <StoryCard story={story} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
