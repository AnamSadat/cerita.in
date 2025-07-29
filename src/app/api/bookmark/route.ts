import { authOptions } from '@/auth.config';
import { verifyJwt } from '@/lib/jwt';
import { Prisma } from '@/lib/prisma/prismaClient';
import { bookmarkSchema } from '@/types/story';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';

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

    const bookmarks = await Prisma.bookmark.findMany({
      where: { user_id },
    });

    if (!bookmarks.length) {
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
        data: bookmarks,
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
    const { story_id, notes } = await req.json();
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

    const existing = await Prisma.bookmark.findUnique({
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
          message: 'Already Bookmark',
        },
        {
          status: 400,
        }
      );
    }

    const bookmark = await Prisma.bookmark.create({
      data: { user_id, story_id, notes },
    });

    return NextResponse.json(
      {
        status: 200,
        data: bookmark,
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
  try {
    const body = await req.json();
    const { id } = body;
    const bookmarkId = Number(id);

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

    const existing = await Prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
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

    await Prisma.bookmark.delete({
      where: { id: bookmarkId },
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

export async function PUT(req: NextRequest) {
  try {
    const session = getServerSession(authOptions);
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

    if (!session)
      return NextResponse.json(
        {
          status: 401,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );

    const user_id = Number(decoded.sub);
    console.log('🚀 ~ POST ~ user_id:', user_id);
    const { id, notes } = await req.json();
    console.log('🚀 ~ PUT ~ notes:', notes);
    // const body = await req.json();
    // const { id, notes } = body;

    if (!id)
      return NextResponse.json(
        {
          status: 400,
          message: 'ID is required',
        },
        {
          status: 400,
        }
      );

    const parse = bookmarkSchema.safeParse({ notes });
    console.log('🚀 ~ PUT ~ parse:', parse);

    if (!parse.success) {
      return NextResponse.json(
        {
          error: parse.error.format(),
        },
        {
          status: 400,
        }
      );
    }

    const index = await Prisma.bookmark.findUnique({
      where: { id: Number(id) },
    });

    if (!index) {
      return NextResponse.json(
        {
          status: 404,
          error: 'Bookmark not found',
        },
        {
          status: 404,
        }
      );
    }

    const updateBookmark = await Prisma.bookmark.update({
      where: {
        id: Number(id),
      },
      data: {
        notes,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        data: updateBookmark,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Failed to update bookmark: ', error);
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
