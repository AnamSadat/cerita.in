import { verifyJwt } from '@/lib/jwt';
import { Prisma } from '@/lib/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
// import { profileSchema, profileUpdateSchema } from '@/types/profile';

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

// ============================
// 🛠️ 1. BACKEND - Tambahkan upload Gambar di POST & PUT profile
// ============================

// File: /app/api/profile/route.ts

import { uploadImageToGCS } from '@/lib/gcsUploader';
import { nextRequestToIncomingMessage, parseForm } from '@/lib/helperApiStory';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
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
  const incomingReq = nextRequestToIncomingMessage(req);
  const { fields, files } = await parseForm(incomingReq);

  const name = fields.name?.[0];
  const bio = fields.bio?.[0] || '';
  const gender = fields.gender?.[0];
  const imageFile = files.imageFile?.[0];

  if (!name || !gender) {
    return NextResponse.json(
      { status: 400, message: 'Invalid input' },
      { status: 400 }
    );
  }

  const existing = await Prisma.profile.findUnique({
    where: { userId: user_id },
  });
  if (existing) {
    return NextResponse.json(
      { status: 400, message: 'Profile already exists' },
      { status: 400 }
    );
  }

  let avatar_url =
    'https://raw.githubusercontent.com/AnamSadat/hosting-image/main/profile.png';
  if (imageFile) {
    avatar_url = await uploadImageToGCS(imageFile);
  }

  const profile = await Prisma.profile.create({
    data: { userId: user_id, name, bio, avatar_url, gender },
  });

  return NextResponse.json({ status: 201, data: profile }, { status: 201 });
}

export async function PUT(req: NextRequest) {
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
  const incomingReq = nextRequestToIncomingMessage(req);
  const { fields, files } = await parseForm(incomingReq);

  const name = fields.name?.[0];
  const bio = fields.bio?.[0] || '';
  const gender = fields.gender?.[0];
  const imageFile = files.imageFile?.[0];

  const existing = await Prisma.profile.findUnique({
    where: { userId: user_id },
  });
  if (!existing) {
    return NextResponse.json(
      { status: 404, message: 'Profile not found' },
      { status: 404 }
    );
  }

  let avatar_url = existing.avatar_url;
  if (imageFile) {
    avatar_url = await uploadImageToGCS(imageFile);
  }

  const updated = await Prisma.profile.update({
    where: { userId: user_id },
    data: { name, bio, avatar_url, gender },
  });

  return NextResponse.json({ status: 200, data: updated }, { status: 200 });
}
