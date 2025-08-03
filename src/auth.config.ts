import { Prisma } from '@/lib/prisma/prismaClient';
import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/types/auth';
import { signJwt } from '@/lib/jwt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
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
        const { email, password } = loginSchema.parse(credentials);

        const user = await Prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            profile: true,
          },
        });

        if (!user) throw new Error('No user found');
        if (!user.password) throw new Error('No password set for user');
        // if (!user?.profile?.username) {
        //   throw new Error('Username is missing in profile');
        // }

        const name = user.profile?.name || '';

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error('Invalid password');

        const token = signJwt({ sub: String(user.id) });

        return {
          id: String(user.id),
          username: user.username,
          email: user.email,
          token,
          name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 86400,
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.token) {
        session.user.token = token.token as string;
      }

      if (session.user && token.username) {
        session.user.username = token.username;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user && typeof user.token === 'string') {
        token.token = user.token;
        token.username = user.username ?? null;
      }
      console.log('🧠 JWT CALLBACK');
      console.log('token:', token.token);

      return token;
    },
  },
};
