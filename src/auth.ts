import { Prisma } from '@/lib/prisma/prismaClient';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/types/auth';
import { authOptions } from './auth.config';
import { signJwt } from '@/lib/jwt';

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
          include: {
            profile: true,
          },
        });

        if (!user) return null;
        if (!user.password) return null;
        if (!user?.profile?.username) {
          throw new Error('Username is missing in profile');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null;

        const token: string = signJwt({ sub: String(user.id) });

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          token,
          username: user.profile.username,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
