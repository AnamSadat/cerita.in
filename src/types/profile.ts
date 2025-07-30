import z from 'zod';

export const profileSchema = z.object({
  name: z.string().min(3),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});
