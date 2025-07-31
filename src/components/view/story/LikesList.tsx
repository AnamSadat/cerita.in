'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { StoryCard } from './StoryCard';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import { fetchStory } from '@/lib/features/storySlice';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';

export default function LikesList() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useAppDispatch();
  const { items, error, loading } = useAppSelector(
    (state: RootState) => state.story
  );

  const likedStories = items.filter((story) =>
    story.likes?.some((like) => like.user_id === Number(userId))
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid mx-auto lg:grid-cols-4 gap-5 md:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-100 rounded-lg bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  console.log('story: ', items);

  return (
    <div className="space-y-4">
      <div className="grid mx-auto lg:grid-cols-4  gap-5 md:grid-cols-3">
        {likedStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
