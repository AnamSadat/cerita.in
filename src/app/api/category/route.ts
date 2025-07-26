import { NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient';

export async function GET() {
  try {
    const category = await Prisma.category.findMany();

    if (!category) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Category tidak ditemukan',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        data: category,
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
