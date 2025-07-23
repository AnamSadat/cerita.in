import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Prisma } from '@/lib/prisma/prismaClient';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name } = body;

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
      name,
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
}
