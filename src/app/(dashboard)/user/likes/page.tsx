'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { RootState } from '@/lib/store';
import { fetchStory } from '@/lib/features/storySlice';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { deleteLikes } from '@/lib/features/likeSlice';
import { Skeleton } from '@/components/ui/skeleton';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function LikesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
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

  const likedStories = items.filter((story) =>
    story.likes?.some((like) => like.user_id === Number(userId))
  );

  const handleUnlike = (storyId: number, likeId: number | undefined) => {
    if (!likeId) return toast.error('Like ID tidak ditemukan');

    dispatch(deleteLikes({ storyId, likeId }))
      .unwrap()
      .then(() => {
        toast.success('Berhasil unlike');
        dispatch(fetchStory());
      })
      .catch(() => {
        toast.error('Gagal unlike');
      });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-4xl font-bold text-white mb-2">
          Cerita yang Kamu Sukai
        </h1>
        <span className="text-md text-gray-400 mb-6">
          Total {likedStories.length} cerita
        </span>
        <div className="max-w-4xl mx-auto mt-10">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-27 rounded-xl mt-5 bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-white mb-2">
        Cerita yang Kamu Sukai
      </h1>
      <p className="text-md text-gray-400 mb-6">
        Total {likedStories.length} cerita
      </p>

      {likedStories.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12">
          <p className="mb-3">Kamu belum menyukai cerita apa pun.</p>
          <Link
            href="/stories"
            className="text-blue-500 hover:underline text-sm"
          >
            Telusuri cerita menarik →
          </Link>
        </div>
      ) : (
        <ul className="space-y-6">
          {likedStories.map((story) => {
            const like = story.likes?.find((l) => l.user_id === Number(userId));

            return (
              <li
                key={story.id}
                className="border border-neutral-800 rounded-xl p-4 hover:bg-neutral-900 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/story/${story.slug}`}>
                      <h2 className="text-lg font-semibold text-white hover:underline">
                        {story.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {story.short_description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      oleh{' '}
                      <span className="font-medium">
                        {story.user?.username ?? 'Penulis'}
                      </span>
                    </p>
                  </div>

                  {/* AlertDialog untuk hapus suka */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="text-red-500 hover:text-red-600 transition hover:bg-neutral-900/70 p-2 rounded"
                        title="Hapus dari suka"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus dari Suka?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleUnlike(story.id, like?.id)}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
