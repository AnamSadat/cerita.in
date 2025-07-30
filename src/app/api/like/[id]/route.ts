import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient'; // pastikan path sesuai

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const likeId = Number(id);

  if (!likeId) {
    return NextResponse.json(
      { status: 400, message: 'ID is required' },
      { status: 400 }
    );
  }

  try {
    const existing = await Prisma.likes.findUnique({
      where: { id: likeId },
    });

    if (!existing) {
      return NextResponse.json(
        { status: 404, message: 'Like not found' },
        { status: 404 }
      );
    }

    await Prisma.likes.delete({
      where: { id: likeId },
    });

    return NextResponse.json(
      { status: 200, message: 'Success to delete like' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete like: ', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
