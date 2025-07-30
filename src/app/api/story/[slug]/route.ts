import { Prisma } from '@/lib/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const storyDetail = await Prisma.stories.findUnique({
      where: {
        slug,
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
