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
import { LoaderOne } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
        <div className="mb-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-zinc-400 hover:text-white">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Like</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Cerita yang Kamu Sukai
        </h1>
        <span className="text-md text-gray-400 mb-6">
          Total {likedStories.length} cerita
        </span>
        <div className="max-w-4xl mx-auto mt-10">
          <div className="flex items-center justify-center mt-20">
            <LoaderOne />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="mb-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-zinc-400">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Like</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">
        Cerita yang Kamu Sukai
      </h1>
      <p className="text-md text-gray-400 mb-6">
        Total {likedStories.length} cerita
      </p>

      {likedStories.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12">
          <p className="mb-3">Kamu belum menyukai cerita apa pun.</p>
          <Link href="/story" className="text-blue-500 hover:underline text-sm">
            Buat ceritamu
          </Link>
        </div>
      ) : (
        <ul className="space-y-6">
          {likedStories.map((story) => {
            const like = story.likes?.find((l) => l.user_id === Number(userId));

            return (
              <li
                key={story.id}
                className="border border-neutral-800 rounded-xl p-4 hover:bg-neutral-900 transition bg-neutral-800/30"
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
                      <Button
                        size="icon"
                        className="text-red-500 bg-neutral-900/30 hover:text-white transition hover:bg-red-500 p-2 rounded cursor-pointer"
                        title="Hapus dari suka"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus dari Suka?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer hover:text-white bg-neutral-700 hover:bg-neutral-800 border-0 text-white">
                          Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer bg-neutral-700 hover:bg-neutral-800"
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
