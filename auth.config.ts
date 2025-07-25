import { Prisma } from '@/lib/prisma/prismaClient';
import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/types/auth';

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

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
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
  secret: process.env.NEXTAUTH_URL,
};
