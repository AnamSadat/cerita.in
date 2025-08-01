'use client';

import { Bookmark, BookmarkCheck, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import {
  fetchBookmark,
  deleteBookmark,
  resetBookmarkState,
} from '@/lib/features/bookmarkSlice';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { BookmarkResponse } from '@/types/story';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
  storyId: number;
  initialBookmarkId?: number;
};

type BookmarkForm = {
  notes?: string;
};

export function BookmarkButton({ storyId, initialBookmarkId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.bookmark);
  const [bookmarkId, setBookmarkId] = useState<number | null>(
    initialBookmarkId ?? null
  );
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BookmarkForm>();

  const isBookmarked = bookmarkId !== null;
  console.log('🚀 ~ BookmarkButton ~ bookmarkId:', bookmarkId);
  console.log('🚀 ~ BookmarkButton ~ isBookmarked:', isBookmarked);

  const handleToggle = () => {
    if (!session) {
      toast('Silakan login terlebih dahulu', {
        icon: <Info className="text-blue-500" />,
      });
      router.push('/login');
      return;
    }
    if (isBookmarked) {
      dispatch(deleteBookmark(bookmarkId))
        .unwrap()
        .then(() => {
          toast.success('Bookmark dihapus');
          setBookmarkId(null);
          console.log('log hapus bookmarkId:', bookmarkId);
        })
        .catch(() => toast.error('Gagal hapus bookmark'));
    } else {
      setOpen(true); // buka modal kalau belum disimpan
    }
  };

  const onSubmit = (data: BookmarkForm) => {
    dispatch(fetchBookmark({ story_id: storyId, notes: data.notes }))
      .unwrap()
      .then((res: BookmarkResponse) => {
        toast.success('Berhasil disimpan');
        setBookmarkId(res.data.id);
        console.log('log tambah', bookmarkId);
        reset();
        setOpen(false);
      })
      .catch(() => toast.error('Gagal menyimpan'));
  };

  useEffect(() => {
    if (error) {
      console.log('gagal di useeffect');
      toast.error(error);
      dispatch(resetBookmarkState());
    }
  }, [error, dispatch]);

  return (
    <>
      <Button
        onClick={handleToggle}
        className="bg-neutral-800 cursor-pointer hover:bg-amber-400/20"
        disabled={loading}
      >
        {isBookmarked ? (
          <div className="flex items-center">
            <BookmarkCheck className="size-5 text-yellow-400" /> &nbsp;
            Tersimpan
          </div>
        ) : (
          <div className="flex items-center">
            <Bookmark className="size-5 text-white" /> &nbsp; Simpan
          </div>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Simpan Bookmark</DialogTitle>
              <DialogDescription>Tambah catatan (opsional)</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="notes" className="text-white font-medium">
                  Notes
                </Label>
                <Input
                  id="notes"
                  {...register('notes')}
                  placeholder="Contoh: Bagian favorit saya"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer"
                >
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
              >
                {isSubmitting || loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
