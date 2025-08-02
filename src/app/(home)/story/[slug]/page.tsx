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

import { CalendarDays, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { useEffect } from 'react';
import { fetchStoryBySlug } from '@/lib/features/storySlice';
import LikeButton from '@/components/view/story/LikeButton';
import { BookmarkButton } from '@/components/view/story/BookmarkButton';
import { useSession } from 'next-auth/react';
import { LoaderOne } from '@/components/ui/loader';
import formatDate from '@/lib/formatDate';
import toast from 'react-hot-toast';

export default function StoryDetailPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { slug } = useParams();
  const dispatch = useAppDispatch();

  const { detail, loadingDetail, errorDetail } = useAppSelector(
    (state) => state.story
  );

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      console.log('Fetching story with slug:', slug);
      dispatch(fetchStoryBySlug(slug));
    }
  }, [slug, dispatch]);

  if (loadingDetail) {
    return (
      <div className="min-h-screen pt-25 px-5 container mx-auto justify-center">
        <div className="mb-10 items-center h-[150]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-zinc-400 hover:text-white">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href="/story" className="text-zinc-400 hover:text-white">
                  Story
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  Story Detail
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-center mt-20">
          <LoaderOne />
        </div>
      </div>
    );
  }

  if (!detail) return null;

  console.log('✅ detail.bookmarks:', detail.bookmarks);
  console.log('🧠 userId:', userId);

  if (errorDetail) return <p className="text-red-500">{errorDetail}</p>;
  const userBookmark = detail.bookmarks?.find(
    (bm) => bm.user_id === Number(userId)
  );

  const convertFormatDate = formatDate(detail.created_at);
  if (!detail) return null;

  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-zinc-400 hover:text-white">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/story" className="text-zinc-400 hover:text-white">
              Story
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Story Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <Card className="w-full max-w-3xl mx-auto my-13 shadow-lg bg-neutral-800/80 border-0">
          <CardHeader>
            <CardTitle className="text-3xl text-white">
              {detail.title}
            </CardTitle>
            <CardDescription>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {detail.user.username}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {convertFormatDate.day} {convertFormatDate.fullDate}
                  &nbsp;
                  <Clock size={14} />
                  {convertFormatDate.time}
                </span>
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-xs">
                  {detail.category.name}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gambar utama */}
            <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden">
              <Image
                src={detail.img_url}
                alt={detail.slug}
                fill
                className="object-cover"
                unoptimized
                onError={() => {
                  toast.error('Gagal memuat gambar. Silakan refresh halaman!');
                }}
              />
            </div>

            {/* Deskripsi singkat */}
            <p className="text-lg italic text-muted-foreground">
              {detail.short_description}
            </p>

            {/* Isi konten */}
            <article className="prose prose-neutral max-w-none">
              <p>{detail.content}</p>
            </article>

            {/* Tombol aksi */}
            <div className="flex gap-3 pt-4">
              <LikeButton storyId={detail.id} />
              <BookmarkButton
                storyId={detail.id}
                initialBookmarkId={userBookmark?.id}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
