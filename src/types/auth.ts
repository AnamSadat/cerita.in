import z from 'zod';

// Types Login
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid, coba lagi!' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password harus mengandung huruf besar (A-Z)',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password harus mengandung huruf kecil (a-z)',
    })
    .refine((val) => /[0-9]/.test(val), {
      message: 'Password harus mengandung angka (0-9)',
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: 'Password harus mengandung simbol (!@#$%, dll)',
    }),
});

// Types Register
export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email({ message: 'Email tidak valid' }),
    password: z
      .string()
      .min(8, { message: 'Password minimal 8 karakter' })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password harus mengandung huruf besar (A-Z)',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password harus mengandung huruf kecil (a-z)',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password harus mengandung angka (0-9)',
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: 'Password harus mengandung simbol (!@#$%, dll)',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak cocok',
  });

export type PostRegisterType = {
  name: string;
  email: string;
  password: string;
};

export type formSchemaLogin = z.infer<typeof loginSchema>;
export type formSchemaRegister = z.infer<typeof registerSchema>;
