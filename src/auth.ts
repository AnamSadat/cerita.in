import { Prisma } from '@/lib/prisma/prismaClient';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/types/auth';
import { authOptions } from './auth.config';
import { signJwt } from '@/lib/jwt';

// https://youtube.com/shorts/fuf1Q-aQI6k?si=s4NJb3EBpilubG-s

export const { auth, signIn, signOut } = NextAuth({
  ...authOptions,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await Prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) return null;
        if (!user.password) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null;

        const token: string = signJwt({ sub: String(user.id) });

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          token,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
