'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storySchema, formSchemaStoryInput } from '@/types/story';
import { getCategory, postStory } from '@/lib/prisma/apiPrisma';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
// import { convertTo16by9 } from '@/lib/convertResolution';

export default function FormAddStory() {
  const form = useForm<formSchemaStoryInput>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: '',
      sortDescription: '',
      category: '',
      content: '',
      img_url: null,
    },
  });

  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (data: formSchemaStoryInput) => {
    setIsLoading(true);

    console.log('img_url:', data.img_url);
    console.log('instanceof File?', data.img_url instanceof File);

    try {
      const res = await postStory({
        title: data.title,
        sortDescription: data.sortDescription,
        category: data.category,
        content: data.content,
        img_url: data.img_url,
      });

      console.log('✅ Story added:', res);
      setIsLoading(false);
      toast.success('Story has been created');
      form.reset();
      router.push('/story');
    } catch (error) {
      setIsLoading(false);
      console.error('❌ Gagal menambahkan story:', error);
      toast.error('Failed to create story');
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Judul</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Judul cerita..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Deskripsi Singkat</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Deskripsi singkat..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Kategori</FormLabel>
                <FormControl className="">
                  <select
                    {...field}
                    className="border rounded-md p-2 w-full text-white"
                  >
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Isi Cerita</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Isi cerita lengkap..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="img_url"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel className="text-white">Gambar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
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
              'Submit story'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
