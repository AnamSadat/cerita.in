import { Prisma } from '@/lib/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { status: 400, message: 'Slug is required' },
        { status: 400 }
      );
    }

    const storyDetail = await Prisma.stories.findUnique({
      where: {
        slug,
      },
      include: {
        user: {
          select: {
            username: true,
            profile: {
              select: { avatar_url: true },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            bookmarks: true,
          },
        },
        likes: {
          select: {
            id: true,
            user_id: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            story_id: true,
            user_id: true,
          },
        },
      },
    });

    if (!storyDetail) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Story not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        data: storyDetail,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error to GET storyDetail: ', error);
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
