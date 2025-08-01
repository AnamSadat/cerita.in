import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient';
import { verifyJwt } from '@/lib/jwt';
import { nextRequestToIncomingMessage, parseForm } from '@/lib/helperApiStory';
import slugify from 'slugify';
import { uploadImageToGCS } from '@/lib/gcsUploader';

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
            id: true,
            username: true,
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
            id: true,
            user_id: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            user_id: true,
            story_id: true,
            notes: true,
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

export async function PUT(req: NextRequest) {
  try {
    // 🔑 1) Verifikasi token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = token ? verifyJwt(token) : null;

    if (!decoded || typeof decoded !== 'object' || !('sub' in decoded)) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // const userId = decoded.sub;

    // 🔑 2) Konversi req → parse form multipart
    const incomingReq = nextRequestToIncomingMessage(req);
    const { fields, files } = await parseForm(incomingReq);

    const id = fields.id?.[0];
    const title = fields.title?.[0];
    const content = fields.content?.[0];
    const sortDescription = fields.sortDescription?.[0];
    const imageFile = files.imageFile?.[0];
    const category = fields.category?.[0];

    if (!id || !title || !content || !sortDescription || !category) {
      return NextResponse.json(
        { status: 400, message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    // 🔑 3) Validasi kategori
    const categorySlug = slugify(category, { lower: true });
    const existingCategory = await Prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { status: 400, message: `Kategori "${category}" tidak ditemukan` },
        { status: 400 }
      );
    }

    // 🔑 4) Upload gambar baru (kalau ada)
    let img_url: string | undefined;
    if (imageFile) {
      try {
        img_url = await uploadImageToGCS(imageFile);
      } catch (err) {
        console.error('Gagal upload gambar ke GCS:', err);
        return NextResponse.json(
          { status: 500, message: 'Gagal upload gambar' },
          { status: 500 }
        );
      }
    }

    // 🔑 5) Slug baru (optional update)
    const baseSlug = slugify(title, { lower: true });

    // Biasanya slug tetap unik → generate slug baru kalau judul diubah
    const finalSlug = `${baseSlug}-${id}`;

    // 🔑 6) Update story
    const updatedStory = await Prisma.stories.update({
      where: { id: Number(id) },
      data: {
        title,
        slug: finalSlug,
        short_description: sortDescription,
        content,
        img_url: img_url || undefined, // hanya ganti kalau ada gambar baru
        category_id: existingCategory.id,
      },
      include: {
        user: true,
        category: true,
        likes: true,
        bookmarks: true,
        _count: { select: { likes: true, bookmarks: true } },
      },
    });

    return NextResponse.json(
      { status: 200, data: updatedStory },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error on PUT story:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
