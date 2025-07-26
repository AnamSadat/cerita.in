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

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

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

  const onSubmit = async (data: formSchemaStoryInput) => {
    try {
      const res = await postStory({
        title: data.title,
        sortDescription: data.sortDescription,
        category: data.category,
        content: data.content,
        img_url: data.img_url,
      });

      console.log('✅ Story added:', res);
    } catch (error) {
      console.error('❌ Gagal menambahkan story:', error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full cursor-pointer">
            Submit Cerita
          </Button>
        </form>
      </Form>
    </div>
  );
}
