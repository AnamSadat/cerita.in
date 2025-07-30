import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Prisma } from '@/lib/prisma/prismaClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username } = body;

    const exist = await Prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return NextResponse.json(
        { status: 400, error: 'User already exist' },
        { status: 400 }
      );
    }

    const hashingPassword = await bcrypt.hash(password, 10);

    const user = await Prisma.user.create({
      data: {
        username,
        email,
        password: hashingPassword,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: 'Successfully register account',
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Failed to fetch category: ', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}
