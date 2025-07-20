import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export function StoryCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="">
          <Image src="/cerita.png" alt="story image" width={100} height={100} />
        </div>
        <p className="text-black">Date</p>
        <CardTitle>Judul</CardTitle>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Romance
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Drama
          </span>
        </div>
      </CardHeader>
      <div className=" h-[1px] w-full bg-black dark:via-neutral-700" />
      <CardContent className="py-0">
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardContent>
      <div className=" h-[1px] w-full bg-black dark:via-neutral-700" />
      <CardFooter className="flex gap-2">
        <div>Logo</div>
        <Button type="submit" variant={'outline'} className="" asChild>
          <Link href={'#'}>Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
