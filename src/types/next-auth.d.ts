import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      token: string;
      username: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    token: string;
    username: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    token: string;
    username: string;
  }
}
