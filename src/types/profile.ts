import z from 'zod';

export const profileSchema = z.object({
  name: z.string().min(3),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(3).optional(),
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

export type profileSchemaInput = z.infer<typeof profileSchema>;
export type profileUpdateSchemaInput = z.infer<typeof profileUpdateSchema>;

export type formProfile = { id: number } & profileSchemaInput;
export type formProfileUpdate = { id: number } & profileUpdateSchemaInput;
