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
        if (!parsed.success) {
          console.log('❌ Schema validation failed:', parsed.error);
          return null;
        }

        const { email, password } = parsed.data;
        console.log('🚀 ~ authorize ~ password:', password);
        console.log('🔍 Email:', email);

        const user = await Prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            profile: true,
          },
        });

        if (!user) {
          console.log('❌ User not found');
          return null;
        }
        if (!user.password) {
          console.log('❌ No password in DB');
          return null;
        }

        if (!user?.profile?.name) {
          console.log('❌ Username missing in profile');
          throw new Error('Username is missing in profile');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('🔐 Password valid?', isPasswordValid);

        if (!isPasswordValid) return null;
        if (!isPasswordValid) {
          console.log('❌ Password mismatch');
          return null;
        }

        const token: string = signJwt({ sub: String(user.id) });
        console.log('✅ Authorized user:', user.email);

        return {
          id: String(user.id),
          username: user.username,
          email: user.email,
          token,
          name: user.profile.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
