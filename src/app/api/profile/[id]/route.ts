import { Prisma } from '@/lib/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profileId = Number(id);

    const profile = await Prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Profile not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 200, data: profile }, { status: 200 });
  } catch (error) {
    console.error('Failed to get profile: ', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Internal server error!',
      },
      { status: 500 }
    );
  }
}
