import { Prisma } from '@/lib/prisma/prismaClient';
import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/types/auth';
import { signJwt } from '@/lib/jwt';

// https://youtube.com/shorts/fuf1Q-aQI6k?si=s4NJb3EBpilubG-s

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
        });

        if (!user) throw new Error('No user found');
        if (!user.password) throw new Error('No password set for user');

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error('Invalid password');

        const token = signJwt({ sub: String(user.id) });

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

      return session;
    },
    async jwt({ token, user }) {
      if (user && typeof user.token === 'string') {
        token.token = user.token;
      }
      console.log('🧠 JWT CALLBACK');
      console.log('token:', token.token);

      return token;
    },
  },
};
