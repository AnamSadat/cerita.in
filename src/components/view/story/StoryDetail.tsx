'use client';

import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Image from 'next/image';
import { CalendarDays, User } from 'lucide-react';
import Link from 'next/link';
import LikeButton from './LikeButton';
import { BookmarkButton } from './BookmarkButton';
import { StoryFromDB } from '@/types/story'; // Sesuaikan tipe datanya

export default function StoryDetail({ story }: { story: StoryFromDB }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userBookmark = story.bookmarks?.find(
    (bm) => bm.user_id === Number(userId)
  );

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

      <Card className="w-full max-w-3xl mx-auto my-13 shadow-lg bg-neutral-800/80 border-0">
        <CardHeader>
          <CardTitle className="text-3xl">{story.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <User size={14} />
                {story.user.username}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                {story.created_at}
              </span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-xs">
                {story.category.name}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden">
            <Image
              src={story.img_url}
              alt="Story Thumbnail"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-lg italic text-gray-700">
            {story.short_description}
          </p>
          <article className="prose prose-neutral max-w-none">
            <p>{story.content}</p>
          </article>
          <div className="flex gap-6 pt-4">
            <LikeButton storyId={story.id} />
            <BookmarkButton
              storyId={story.id}
              initialBookmarkId={userBookmark?.id}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
