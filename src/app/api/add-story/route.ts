import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/lib/prisma/prismaClient';
import slugify from 'slugify';
import { uploadImageToGCS } from '@/lib/gcsUploader';
import formidable from 'formidable';
import type { IncomingMessage } from 'http';
import type { Fields, Files } from 'formidable';
import { verifyJwt } from '@/lib/jwt';
import { Readable } from 'stream';

// Nonaktifkan bodyParser bawaan (WAJIB kalau pakai formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Konversi NextRequest ke IncomingMessage agar cocok dengan formidable
function readableStreamToAsyncIterable(
  stream: ReadableStream<Uint8Array>
): AsyncIterable<Uint8Array> {
  const reader = stream.getReader();

  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) yield value;
      }
    },
  };
}

// Konversi NextRequest ke IncomingMessage (agar cocok untuk formidable)
function nextRequestToIncomingMessage(req: NextRequest): IncomingMessage {
  const bodyStream = req.body;
  if (!bodyStream) throw new Error('Request body is empty');

  const asyncIterable = readableStreamToAsyncIterable(bodyStream);
  const nodeReadable = Readable.from(asyncIterable);

  const headers = Object.fromEntries(req.headers.entries());

  const incomingReq = Object.assign(nodeReadable, {
    headers,
    method: req.method,
    url: req.nextUrl.pathname,
  });

  return incomingReq as unknown as IncomingMessage;
}

// Fungsi parse form menggunakan formidable
async function parseForm(
  req: IncomingMessage
): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({ multiples: false, keepExtensions: true });

  return await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

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
    const imageFile = files.image?.[0];
    const category = fields.category?.[0];

    if (!title || !content || !sortDescription || !imageFile) {
      console.log('FIELDS:', fields);
      console.log('FILES:', files);
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

    // Simpan ke database
    const newStory = await Prisma.stories.create({
      data: {
        title,
        slug: slugify(title, { lower: true }),
        short_description: sortDescription,
        content,
        img_url,
        category_id: existingCategory.id,
        user_id: Number(userId),
      },
    });

    return NextResponse.json({ status: 200, data: newStory });
  } catch (error) {
    console.error('Error on POST story:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
