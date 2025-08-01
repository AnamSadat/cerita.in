import { verifyJwt } from '@/lib/jwt';
import { Prisma } from '@/lib/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
import { profileSchema, profileUpdateSchema } from '@/types/profile';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
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

    const user_id = Number(decoded.sub);
    console.log('🚀 ~ POST ~ user_id:', user_id);

    const { username } = await context.params;

    let profile = await Prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        profile: true,
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

    if (!profile.profile) {
      const createdProfile = await Prisma.profile.create({
        data: {
          userId: profile.id,
          name: '',
          bio: '',
          avatar_url: '',
          gender: 'Male',
        },
      });

      // update profile hasil query agar ada profile-nya
      profile = {
        ...profile,
        profile: createdProfile,
      };
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

export async function POST(req: NextRequest) {
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
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid input',
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Cek apakah sudah punya profile
    const existingProfile = await Prisma.profile.findUnique({
      where: { userId: user_id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { status: 400, message: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Set avatar default kalau tidak dikirim
    const defaultAvatar =
      'https://raw.githubusercontent.com/AnamSadat/hosting-image/main/profile.png';

    const profile = await Prisma.profile.create({
      data: {
        userId: user_id,
        name: parsed.data.name,
        bio: parsed.data.bio || '',
        avatar_url: parsed.data.avatar_url || defaultAvatar,
        gender: parsed.data.gender,
      },
    });

    return NextResponse.json({ status: 201, data: profile }, { status: 201 });
  } catch (error) {
    console.error('Failed to post profile:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid input',
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existingProfile = await Prisma.profile.findUnique({
      where: { userId: user_id },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { status: 404, message: 'Profile not found' },
        { status: 404 }
      );
    }

    const updatedProfile = await Prisma.profile.update({
      where: { userId: user_id },
      data: {
        ...parsed.data,
      },
    });

    return NextResponse.json(
      { status: 200, message: 'Profile updated', data: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
