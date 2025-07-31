import formidable from 'formidable';
import type { IncomingMessage } from 'http';
import type { Fields, Files } from 'formidable';
import { Readable } from 'stream';
import { NextRequest } from 'next/server';
import { Prisma } from './prisma/prismaClient';

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
export function nextRequestToIncomingMessage(
  req: NextRequest
): IncomingMessage {
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
export async function parseForm(
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

export async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Prisma.stories.findUnique({
      where: { slug },
    });

    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
