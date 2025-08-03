'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { Frown, Pencil, Trash2, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { RootState } from '@/lib/store';
import { fetchStory } from '@/lib/features/storySlice';
import { deleteBookmark, updateBookmark } from '@/lib/features/bookmarkSlice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LoaderOne } from '@/components/ui/loader';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export default function BookmarkPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
    (state: RootState) => state.story
  );

  const [isLoading, setIsLoading] = useState(false);

  // Untuk simpan notes sementara
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});

  useEffect(() => {
    dispatch(fetchStory());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const bookmarkedStories = items.filter((story) =>
    story.bookmarks?.some((bookmark) => bookmark.user_id === Number(userId))
  );

  const handleRemoveBookmark = (
    storyId: number,
    bookmarkId: number | undefined
  ) => {
    if (!bookmarkId) return toast.error('Bookmark ID tidak ditemukan');

    dispatch(deleteBookmark(bookmarkId))
      .unwrap()
      .then(() => {
        toast.success('Berhasil hapus bookmark');
        dispatch(fetchStory());
      })
      .catch(() => {
        toast.error('Gagal hapus bookmark');
      });
  };

  // const handleUpdateNotes = (bookmarkId: number, notes: string) => {
  //   dispatch(updateBookmark({ id: bookmarkId, notes }))
  //     .unwrap()
  //     .then(() => {
  //       toast.success('Catatan diperbarui');
  //       dispatch(fetchStory());
  //     })
  //     .catch(() => toast.error('Gagal update catatan'));
  // };

  // const handleNotesChange = (bookmarkId: number, value: string) => {
  //   setNotesMap((prev) => ({ ...prev, [bookmarkId]: value }));
  // };

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
                <BreadcrumbPage className="text-white">Bookmark</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Cerita yang Kamu Simpan
        </h1>
        <span className="text-md text-gray-400 mb-6">
          Total {bookmarkedStories.length} cerita
        </span>
        <div className="flex items-center justify-center mt-20">
          <LoaderOne />
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
                <Link href="/" className="text-zinc-400 hover:text-white">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Bookmark</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">
        Cerita yang Kamu Simpan
      </h1>
      <p className="text-md text-gray-400 mb-6">
        Total {bookmarkedStories.length} cerita
      </p>

      {bookmarkedStories.length === 0 ? (
        <Card className="p-7 items-center border-0 flex flex-col bg-neutral-900/80">
          <Frown className="text-white size-50" />
          <h2 className="text-white text-2xl font-bold">
            Opsss Kamu Belum Menyimpan Cerita Apapun...
          </h2>
          <Link
            href="/story"
            className="text-blue-500  hover:underline text-lg"
          >
            Telusuri cerita menarik →
          </Link>
        </Card>
      ) : (
        <ul className="space-y-6">
          {bookmarkedStories.map((story) => {
            const bookmark = story.bookmarks?.find(
              (b) => b.user_id === Number(userId)
            );
            const currentNotes = bookmark?.notes ?? '';

            return (
              <li
                key={story.id}
                className="border border-neutral-800 bg-neutral-900/30 rounded-xl p-4 hover:bg-neutral-900 transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/story/${story.slug}`}>
                          <h2 className="text-lg font-semibold text-white hover:underline">
                            {story.title}
                          </h2>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {story.short_description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex gap-1">
                          <User size={14} />
                          <span className="font-medium">
                            {story.user?.username ?? 'Penulis'}
                          </span>
                        </p>
                      </div>
                      {/* Delete Alert */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            className="text-red-500 bg-neutral-900/30 hover:text-white transition hover:bg-red-500 p-2 rounded cursor-pointer"
                            title="Hapus dari bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-h-[630px] overflow-y-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Bookmark?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer hover:text-white bg-neutral-700 hover:bg-neutral-800 border-0 text-white">
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="cursor-pointer bg-red-500 hover:bg-red-600"
                              onClick={() =>
                                handleRemoveBookmark(story.id, bookmark?.id)
                              }
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Notes readonly */}
                    <textarea
                      className="mt-2 w-full bg-neutral-900 text-white text-sm p-2 rounded border border-neutral-700 resize-none"
                      rows={3}
                      disabled
                      value={currentNotes}
                    />

                    {/* Dialog for editing */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 hover:bg-neutral-300 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 mr-1" /> Edit Catatan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Catatan</DialogTitle>
                          <DialogDescription>
                            Ubah catatan untuk cerita ini.
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          className="w-full mt-2 text-black p-2 border bg-white border-white rounded resize-none"
                          rows={4}
                          value={notesMap[bookmark?.id ?? 0] ?? currentNotes}
                          onChange={(e) =>
                            setNotesMap((prev) => ({
                              ...prev,
                              [bookmark?.id ?? 0]: e.target.value,
                            }))
                          }
                        />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button className="cursor-pointer bg-red-500 hover:bg-red-600">
                              Batal
                            </Button>
                          </DialogClose>
                          <Button
                            className="cursor-pointer bg-neutral-700 hover:bg-neutral-800"
                            disabled={isLoading}
                            onClick={() => {
                              setIsLoading(true);
                              if (!bookmark) {
                                setIsLoading(false);
                                return;
                              }
                              const updatedNote = notesMap[bookmark.id] ?? '';
                              dispatch(
                                updateBookmark({
                                  id: bookmark.id,
                                  notes: updatedNote,
                                })
                              )
                                .unwrap()
                                .then(() => {
                                  setIsLoading(false);
                                  dispatch(fetchStory());
                                  toast.success('Catatan diperbarui');
                                })
                                .catch(() =>
                                  toast.error('Gagal update catatan')
                                );
                            }}
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <svg
                                  className="w-4 h-4 animate-spin text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                  ></path>
                                </svg>
                                Loading...
                              </div>
                            ) : (
                              'Simpan'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
