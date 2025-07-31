// src/app/api/account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient';
import bcrypt from 'bcrypt';
import { verifyJwt } from '@/lib/jwt';

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = token ? verifyJwt(token) : null;

    if (!decoded || typeof decoded !== 'object' || !('sub' in decoded)) {
      if (decoded && typeof decoded === 'object' && 'status' in decoded) {
        if (decoded.status === 'expired') {
          return NextResponse.json(
            { status: 401, message: 'Unauthorized: Token expired' },
            { status: 401 }
          );
        }

        if (decoded.status === 'invalid') {
          return NextResponse.json(
            { status: 401, message: 'Unauthorized: Invalid token' },
            { status: 401 }
          );
        }

        return NextResponse.json(
          { status: 500, message: 'Unexpected JWT error' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { status: 401, message: 'Unauthorized: Invalid token format' },
        { status: 401 }
      );
    }

    const userId = Number(decoded.sub);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { username, email, password } = body;

    const updatedUser = await Prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        password: password ? await bcrypt.hash(password, 10) : undefined,
      },
    });

    return NextResponse.json({ status: 200, data: updatedUser });
  } catch (error) {
    console.error('[UPDATE_ACCOUNT_ERROR]', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui akun' },
      { status: 500 }
    );
  }
}
