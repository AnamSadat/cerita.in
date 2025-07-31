'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { RootState } from '@/lib/store';
import {
  fetchStory,
  deleteStoryThunk,
  updateStoryThunk,
} from '@/lib/features/storySlice';
import { Button } from '@/components/ui/button';
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
import { LoaderOne } from '@/components/ui/loader';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCategory } from '@/lib/prisma/apiPrisma';

export default function MyOwnStoryPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
    (state: RootState) => state.story
  );
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const [editFields, setEditFields] = useState<
    Record<
      number,
      {
        title: string;
        category: string;
        content: string;
        sortDescription: string;
        file: File | null;
      }
    >
  >({});

  useEffect(() => {
    dispatch(fetchStory(Number(userId)));
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        console.log('Kategori:', res);
        setCategories(res);
      } catch (err) {
        console.error('Gagal mengambil kategori:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (items.length > 0) {
      items.forEach((story) => {
        console.log('📦 story.id:', story.id);
        console.log('👤 story.user:', story.user); // Lihat isi user
        console.log('🔑 story.user.id:', story.user?.id); // Kalau udah ada
      });
    }
  }, [items]);

  const myStories = items.filter((story) => story.user.id === Number(userId));

  const handleDelete = (storyId: number) => {
    dispatch(deleteStoryThunk(storyId))
      .unwrap()
      .then(() => {
        toast.success('Cerita berhasil dihapus');
      })
      .catch(() => toast.error('Gagal menghapus cerita'));
  };

  const handleUpdateStory = (storyId: number) => {
    setIsLoading(true);
    const story = myStories.find((s) => s.id === storyId);
    if (!story) {
      setIsLoading(false);
      toast.error('Cerita tidak ditemukan');
      return;
    }

    const fields = editFields[storyId] || {};
    console.log('🚀 ~ handleUpdateStory ~ fields:', fields);
    console.log('STORYID: ', storyId);
    const title = fields.title || story.title;
    console.log('🚀 ~ handleUpdateStory ~ title:', title);
    const category = fields.category || story.category.name;
    console.log('🚀 ~ handleUpdateStory ~ category:', category);
    const content = fields.content || story.content;
    const sortDescription = fields.sortDescription || story.short_description;
    const file = fields.file;

    if (!file) {
      setIsLoading(false);
      toast.error('Gambar wajib diupload lagi!');
      return;
    }

    const formData = new FormData();
    formData.append('id', String(storyId));
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('sortDescription', sortDescription);
    formData.append('imageFile', file);

    dispatch(updateStoryThunk(formData))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        toast.success('Cerita berhasil diperbarui');
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Gagal memperbarui cerita');
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-white mb-2">Ceritaku</h1>
      <p className="text-md text-gray-400 mb-6">
        Total {myStories.length} cerita
      </p>

      {loading ? (
        <div className="flex items-center justify-center mt-20">
          <LoaderOne />
        </div>
      ) : myStories.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12">
          <p className="mb-3">Kamu belum menulis cerita apa pun.</p>
          <Link href="/write" className="text-blue-500 hover:underline text-sm">
            Tulis cerita pertama →
          </Link>
        </div>
      ) : (
        <ul className="space-y-6">
          {myStories.map((story) => (
            <li
              key={story.id}
              className="border border-neutral-800 bg-neutral-950 rounded-xl p-5 shadow-lg"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="w-full">
                  <Link href={`/story/${story.slug}`}>
                    <h2 className="text-xl font-semibold text-white hover:underline">
                      {story.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {story.short_description}
                  </p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Pencil className="w-4 h-4 mr-1" /> Edit Cerita
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Cerita</DialogTitle>
                        <DialogDescription>
                          Perbarui semua detail cerita & upload gambar baru.
                        </DialogDescription>
                      </DialogHeader>

                      {/* Title */}
                      <input
                        className="w-full mt-2 bg-neutral-800 text-white p-2 border border-neutral-700 rounded"
                        defaultValue={story.title}
                        placeholder="Judul"
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            [story.id]: {
                              ...prev[story.id],
                              title: e.target.value,
                            },
                          }))
                        }
                      />

                      {/* Category */}
                      <select className="border rounded-md p-2 w-full text-white">
                        <option value="" className="text-black">
                          Pilih kategori
                        </option>
                        {categories.map((item) => (
                          <option
                            key={item.id}
                            value={item.name}
                            className="text-black"
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>

                      {/* Content */}
                      <textarea
                        rows={5}
                        className="w-full mt-2 bg-neutral-800 text-white p-2 border border-neutral-700 rounded"
                        defaultValue={story.content}
                        placeholder="Isi Cerita"
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            [story.id]: {
                              ...prev[story.id],
                              content: e.target.value,
                            },
                          }))
                        }
                      />

                      {/* Short Description */}
                      <textarea
                        rows={3}
                        className="w-full mt-2 bg-neutral-800 text-white p-2 border border-neutral-700 rounded"
                        defaultValue={story.short_description}
                        placeholder="Deskripsi Singkat"
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            [story.id]: {
                              ...prev[story.id],
                              sortDescription: e.target.value,
                            },
                          }))
                        }
                      />

                      {/* File */}
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full mt-2 bg-neutral-800 text-white p-2 border border-neutral-700 rounded"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setEditFields((prev) => ({
                            ...prev,
                            [story.id]: {
                              ...prev[story.id],
                              file: file,
                            },
                          }));
                        }}
                      />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button onClick={() => handleUpdateStory(story.id)}>
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

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="mt-1"
                      title="Hapus cerita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Cerita?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini akan menghapus cerita secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(story.id)}>
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
