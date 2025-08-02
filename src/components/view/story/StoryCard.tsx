import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import formatDate from '@/lib/formatDate';
import { StoryFromDB } from '@/types/story';
import Image from 'next/image';

type PropsStoryCard = {
  story: StoryFromDB;
};

export function StoryCard({ story }: PropsStoryCard) {
  const convertFormatDate = formatDate(story.created_at);

  console.log('✅ StoryCard item:', story);

  return (
    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-neutral-800/80 hover:bg-neutral-700/60 border-0 text-white">
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
        <p className="text-sm">
          {convertFormatDate.day} {convertFormatDate.fullDate}
          {', '}
          {`${convertFormatDate.time}`}
        </p>
        <CardTitle className="text-xl min-h-[60px] max-h-[60px]">
          {story.title}
        </CardTitle>
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
            src={
              story.user.profile?.avatar_url?.trim()
                ? story.user.profile.avatar_url
                : '/luffy.jpg'
            }
            alt={story.user.username}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span>{story.user.username}</span>
        </div>
        <Button
          variant={'outline'}
          className="text-black hover:bg-neutral-300 cursor-pointer"
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
