import z from 'zod';

export const profileSchema = z.object({
  name: z.string().min(3, { message: 'Minimal 3 karakter' }),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(3, { message: 'Minimal 3 karakter' }).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});

export type ProfileType = {
  id: number;
  userId: number;
  name: string;
  bio: string;
  avatar_url?: string;
  gender: string;
  created_at: string;
  updated_at: string;
};

export type UserWithProfile = {
  id: number;
  username: string;
  email: string;
  profile: ProfileType;
};

export const profileToFormData = (data: {
  name: string;
  bio: string;
  gender: 'Male' | 'Female' | 'Other';
  file?: File;
}) => {
  const form = new FormData();
  form.append('name', data.name);
  form.append('bio', data.bio);
  form.append('gender', data.gender);
  if (data.file) form.append('imageFile', data.file);
  return form;
};

export const TypeProfile = z.object({
  name: z.string().min(3, { message: 'Minimal 3 karakter' }),
  bio: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  file: z
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

export const TypeProfileUpdate = z.object({
  name: z.string().min(3, { message: 'Minimal 3 karakter' }),
  bio: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  file: z
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

export type FormTypeProfile = z.infer<typeof TypeProfile>;
export type FormTypeProfileUpdate = z.infer<typeof TypeProfileUpdate>;

export type profileSchemaInput = z.infer<typeof profileSchema>;
export type profileUpdateSchemaInput = z.infer<typeof profileUpdateSchema>;

export type formProfile = { id: number } & profileSchemaInput;
export type formProfileUpdate = { id: number } & profileUpdateSchemaInput;
