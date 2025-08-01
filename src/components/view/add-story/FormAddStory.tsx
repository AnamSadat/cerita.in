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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

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
    <Card className="p-5 bg-neutral-950/20 border-0 backdrop-blur-md shadow-neutral-200">
      <h1 className="text-4xl text-center font-bold ">Story</h1>
      <div className="max-w-md min-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Judul</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Judul cerita..."
                      {...field}
                    />
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
                  <FormLabel className="text-white">
                    Deskripsi Singkat
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat..."
                      className=""
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full border-2 border-gray-200 rounded-l">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Pilih Kategori</SelectLabel>
                          {categories.map((story) => (
                            <SelectItem key={story.id} value={story.name}>
                              {story.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                    <Textarea
                      placeholder="Isi cerita lengkap..."
                      className=""
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
              className="w-full cursor-pointer bg-neutral-700 hover:bg-neutral-800"
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
    </Card>
  );
}
