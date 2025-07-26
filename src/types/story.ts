import z from 'zod';

export const storySchema = z.object({
  title: z.string().min(3),
  sortDescription: z.string().min(10),
  category: z.string().min(1, { message: 'Pilih setidaknya 1 tag' }),
  content: z.string().min(30),
  img_url: z
    .any()
    .refine((file) => file instanceof File, {
      message: 'Wajib unggah file gambar',
    })
    .refine((file) => file?.size <= 10 * 1024 * 1024, {
      message: 'Ukuran gambar maksimal 10MB',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file?.type), {
      message: 'Format harus JPG atau PNG',
    }),
});

export type Category = {
  id: string;
  name: string;
};

export type PostStoryType = {
  title: string;
  sortDescription: string;
  category: string;
  content: string;
  img_url: File;
};

export type formSchemaStoryInput = z.infer<typeof storySchema>;
export type formSchemaStory = { id: number } & formSchemaStoryInput;
