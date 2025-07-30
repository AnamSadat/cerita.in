'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Button } from '@/components/ui/button';
import { CalendarDays, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { useEffect } from 'react';
import { fetchStoryBySlug } from '@/lib/features/storySlice';
import LikeButton from '@/components/view/story/LikeButton';

export default function StoryDetailPage() {
  const { slug } = useParams();
  const dispatch = useAppDispatch();

  const { detail, loadingDetail, errorDetail } = useAppSelector(
    (state) => state.story
  );

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      dispatch(fetchStoryBySlug(slug));
    }
  }, [slug, dispatch]);

  if (loadingDetail) return <p>Loading detail...</p>;
  if (errorDetail) return <p className="text-red-500">{errorDetail}</p>;
  if (!detail) return null;

  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-zinc-400">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/story" className="text-zinc-400">
              Story
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Story</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <Card className="w-full max-w-3xl mx-auto my-13 shadow-lg bg-neutral-800/80 border-0">
          <CardHeader>
            <CardTitle className="text-3xl">{detail.title}</CardTitle>
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
                src="/placeholder-image.jpg"
                alt="Story Thumbnail"
                fill
                className="object-cover"
              />
            </div>

            {/* Deskripsi singkat */}
            <p className="text-lg italic text-gray-700">
              {detail.short_description}
            </p>

            {/* Isi konten */}
            <article className="prose prose-neutral max-w-none">
              <p>{detail.content}</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates, debitis. Lorem ipsum dolor sit amet consectetur.
              </p>
            </article>

            {/* Tombol aksi */}
            <div className="flex gap-3 pt-4">
              <LikeButton storyId={detail.id} />
              <Button variant="outline">🔖 Simpan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
