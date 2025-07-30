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
import Image from 'next/image';
import Link from 'next/link';

type PropsStoryCard = {
  story: StoryFromDB;
};

export function StoryCard({ story }: PropsStoryCard) {
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

  console.log('✅ StoryCard item:', story);

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
            {story.category.name}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-0 min-h-16 max-h-16">
        <CardDescription className="">
          {story.short_description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={story.user.profile?.avatar_url ?? '/luffy.jpg'}
            alt={story.user.username}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span>{story.user.username}</span>
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
