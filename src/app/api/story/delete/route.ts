import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { Prisma } from '@/lib/prisma/prismaClient';

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = token ? verifyJwt(token) : null;

    if (!decoded || typeof decoded !== 'object' || !('sub' in decoded)) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = decoded.sub;

    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get('id');

    if (!storyId) {
      return NextResponse.json(
        { status: 400, message: 'Story ID wajib disertakan' },
        { status: 400 }
      );
    }

    // Validasi: pastikan story milik user
    const story = await Prisma.stories.findUnique({
      where: { id: Number(storyId) },
    });

    if (!story) {
      return NextResponse.json(
        { status: 404, message: 'Story tidak ditemukan' },
        { status: 404 }
      );
    }

    if (story.user_id !== Number(userId)) {
      return NextResponse.json(
        { status: 403, message: 'Forbidden: Anda tidak punya izin' },
        { status: 403 }
      );
    }

    await Prisma.likes.deleteMany({
      where: { story_id: Number(storyId) },
    });

    await Prisma.bookmark.deleteMany({
      where: { story_id: Number(storyId) },
    });

    await Prisma.stories.delete({
      where: { id: Number(storyId) },
    });

    return NextResponse.json(
      { status: 200, message: 'Story berhasil dihapus' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error on DELETE story:', err);
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
