import { File as FormidableFile } from 'formidable';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const keyPath = path.join(process.cwd(), 'key.json');

if (!fs.existsSync(keyPath)) {
  throw new Error(
    '❌ key.json is missing. Please provide the service account key file.'
  );
}

const storage = new Storage({
  keyFilename: keyPath,
});

const bucketName = 'ceritain-images';
const bucket = storage.bucket(bucketName);

export async function uploadImageToGCS(file: FormidableFile): Promise<string> {
  const ext = path.extname(file.originalFilename || file.newFilename);
  const filename = `${uuidv4()}${ext}`;
  const blob = bucket.file(filename);

  console.log('[UPLOAD] Uploading file:', filename);

  // Simpan file
  await blob.save(fs.readFileSync(file.filepath), {
    resumable: false,
    contentType: file.mimetype || undefined,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log('[UPLOAD] File saved, attempting to make public...');

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
  console.log('[UPLOAD] Public URL:', publicUrl);

  return publicUrl;
}
