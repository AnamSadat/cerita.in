import { NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient';

export async function GET() {
  try {
    const story = await Prisma.stories.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        created_at: true,
        img_url: true,
        short_description: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            profile: {
              select: {
                avatar_url: true,
              },
            },
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
            user_id: true,
          },
        },
        bookmarks: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Story masih kosong',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        data: story,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Failed to fetch story: ', error);

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
