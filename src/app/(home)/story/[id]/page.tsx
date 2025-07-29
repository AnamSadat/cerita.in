import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, User } from 'lucide-react';

export default function StoryDetailPage() {
  return (
    <div className="min-h-screen pt-28 px-4 md:px-8 container mx-auto flex justify-center mb-12">
      <Card className="w-full max-w-3xl shadow-lg bg-neutral-800/80 border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Judul Cerita Menarik</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <User size={14} />
                Anam Sadat
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                29 Juli 2025
              </span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-xs">
                Teknologi
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gambar utama */}
          <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder-image.jpg" // Ganti dengan data dinamis img_url
              alt="Story Thumbnail"
              fill
              className="object-cover"
            />
          </div>

          {/* Deskripsi singkat */}
          <p className="text-lg italic text-gray-700">
            Ini adalah deskripsi singkat dari cerita ini untuk menarik pembaca.
          </p>

          {/* Isi konten */}
          <article className="prose prose-neutral max-w-none">
            <p>
              Ini adalah isi cerita yang lengkap. Kamu bisa menambahkan banyak
              paragraf, subjudul, dan elemen lainnya di sini.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates, debitis. Lorem ipsum dolor sit amet consectetur.
            </p>
          </article>

          {/* Tombol aksi */}
          <div className="flex gap-3 pt-4">
            <Button>❤️ Suka (123)</Button>
            <Button variant="outline">🔖 Simpan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
