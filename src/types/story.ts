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

export type StorySlice = {
  items: StoryFromDB[];
  loading: boolean;
  error: string | null;
  detail: StoryFromDB | null; // ✅ Tambah
  loadingDetail: boolean; // ✅ Tambah
  errorDetail: string | null;
};

export type StoryFromDB = {
  id: number;
  title: string;
  short_description: string;
  slug: string;
  user: {
    name: string;
    profile: {
      avatar_url: string;
    };
  };
  category: {
    name: string;
  };
  content: string;
  img_url: string;
  created_at: string;
};

export const bookmarkSchema = z.object({
  notes: z.string().min(3),
});

export type BookmarkFromDB = {
  id: number;
  story_id: number;
  user_id: number;
  notes: string;
  created_at: string;
};

export type bookmarkSchemaInput = z.infer<typeof bookmarkSchema>;
export type formBookmark = { id: number } & bookmarkSchemaInput;

export type formSchemaStoryInput = z.infer<typeof storySchema>;
export type formSchemaStory = { id: number } & formSchemaStoryInput;
