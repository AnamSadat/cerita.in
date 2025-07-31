import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient';
import slugify from 'slugify';
import { uploadImageToGCS } from '@/lib/gcsUploader';
import { verifyJwt } from '@/lib/jwt';
import {
  generateUniqueSlug,
  nextRequestToIncomingMessage,
  parseForm,
} from '@/lib/helperApiStory';

// Nonaktifkan bodyParser bawaan (WAJIB kalau pakai formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Verifikasi token
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

    const userId = decoded.sub;

    // Konversi req dan parse form
    const incomingReq = nextRequestToIncomingMessage(req);
    const { fields, files } = await parseForm(incomingReq);

    const title = fields.title?.[0];
    const content = fields.content?.[0];
    const sortDescription = fields.sortDescription?.[0];
    const imageFile = files.imageFile?.[0];
    const category = fields.category?.[0];

    if (!title || !content || !sortDescription || !imageFile) {
      return NextResponse.json(
        { status: 400, message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { status: 400, message: 'Kategori wajib diisi' },
        { status: 400 }
      );
    }

    const categorySlug = slugify(category, { lower: true });

    // Cari kategori berdasarkan nama
    const existingCategory = await Prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    console.log('category hasil slug: ', categorySlug);
    console.log('category isinya: ', existingCategory);

    if (!existingCategory) {
      return NextResponse.json(
        { status: 400, message: `Kategori "${category}" tidak ditemukan` },
        { status: 400 }
      );
    }

    // Upload gambar ke GCS
    let img_url;
    try {
      img_url = await uploadImageToGCS(imageFile);
    } catch (err) {
      console.error('Gagal upload gambar ke GCS:', err);
      return NextResponse.json(
        { status: 500, message: 'Gagal upload gambar' },
        { status: 500 }
      );
    }

    const baseSlug = slugify(title, { lower: true });
    const finalSlug = await generateUniqueSlug(baseSlug);

    // Simpan ke database
    const newStory = await Prisma.stories.create({
      data: {
        title,
        slug: finalSlug,
        short_description: sortDescription,
        content,
        img_url,
        category_id: existingCategory.id,
        user_id: Number(userId),
      },
    });

    return NextResponse.json({ status: 200, data: newStory }, { status: 200 });
  } catch (error) {
    console.error('Error on POST story:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
