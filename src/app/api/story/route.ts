import { NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient';

export async function GET() {
  try {
    const story = await Prisma.stories.findMany();

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
