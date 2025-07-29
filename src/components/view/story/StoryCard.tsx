import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StoryFromDB } from '@/types/story';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

type PropsStoryCard = {
  story: StoryFromDB;
};

export function StoryCard({ story }: PropsStoryCard) {
  const { data: session } = useSession();
  const date = new Date(story.created_at);

  const time = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const day = date.toLocaleDateString('id-ID', {
    weekday: 'long',
  });

  const fullDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatted = `${time} ${day}, ${fullDate}`;

  return (
    <Card className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-neutral-800/80 border-0 text-white">
      <CardHeader className="gap-3">
        <div className="">
          <Image
            src={story.img_url}
            alt="story image"
            width={200}
            height={120}
            className="object-cover rounded-sm h-[120px] w-[260px]"
            loading="lazy"
            unoptimized
          />
        </div>
        <p className="">{formatted}</p>
        <CardTitle>{story.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Kategori: {story.category.name}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-0 min-h-16 max-h-16">
        <CardDescription className="">
          {story.short_description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex">
          <div className="rounded-full">{session?.user.image}</div>
          <div>{session?.user.name}</div>
        </div>
        <Button type="submit" variant={'outline'} className="" asChild>
          <Link href={`story/${story.slug}`} className="text-black">
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
