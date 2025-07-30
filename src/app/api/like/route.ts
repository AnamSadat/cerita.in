import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { Prisma } from '@/lib/prisma/prismaClient';

export async function GET(req: NextRequest) {
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

    const user_id = Number(decoded.sub);

    const likes = await Prisma.likes.findMany({
      where: { user_id },
    });

    if (!likes.length) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Bookmark is empty',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        data: likes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to get bookmark: ', error);
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

export async function POST(req: NextRequest) {
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

    // TODO: create api bookmark
    const user_id = Number(decoded.sub);
    console.log('🚀 ~ POST ~ user_id:', user_id);
    const { story_id } = await req.json();
    console.log('✅ DEBUG story_id:', story_id, typeof story_id);
    // const body = await req.json();
    // console.log('🚀 ~ POST ~ body:', body);
    console.log('story_id :', story_id);

    if (!story_id) {
      return NextResponse.json(
        {
          status: 400,
          message: 'story_id is required',
        },
        {
          status: 400,
        }
      );
    }

    const existing = await Prisma.likes.findUnique({
      where: {
        user_story_unique: {
          user_id,
          story_id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Already Like',
        },
        {
          status: 400,
        }
      );
    }

    const story = await Prisma.stories.findUnique({
      where: { id: story_id },
    });

    if (!story) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Story not found',
        },
        { status: 404 }
      );
    }

    const newLikes = await Prisma.likes.create({
      data: { user_id, story_id },
    });

    return NextResponse.json(
      {
        status: 200,
        data: newLikes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch bookmark', error);
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

export async function DELETE(req: NextRequest) {
  console.log('ini req', req);
  try {
    const body = await req.json();
    const { id } = body;
    const likeId = Number(id);

    console.log('ini likeId', likeId);
    console.log('ini likeId', id);

    if (!id) {
      return NextResponse.json(
        {
          status: 400,
          message: 'ID is required',
        },
        {
          status: 400,
        }
      );
    }

    if (!likeId) {
      return NextResponse.json(
        {
          status: 400,
          message: 'ID is required',
        },
        {
          status: 400,
        }
      );
    }

    const existing = await Prisma.likes.findUnique({
      where: {
        id: likeId,
      },
    });

    if (!existing)
      return NextResponse.json(
        {
          status: 404,
          message: 'Bookmark not found',
        },
        {
          status: 404,
        }
      );

    await Prisma.likes.delete({
      where: { id: likeId },
    });

    return NextResponse.json(
      {
        status: 200,
        message: 'Success to delete bookmark',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Failed to delete bookmark: ', error);
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
