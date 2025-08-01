'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Heart, Bookmark, NotebookPen } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import toast from 'react-hot-toast';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const username = session?.user?.username;

  const links = [
    { href: `/user/${username}`, label: 'Profile', icon: User },
    { href: '/user/likes', label: 'Likes', icon: Heart },
    { href: '/user/bookmark', label: 'Bookmark', icon: Bookmark },
    { href: '/user/my-story', label: 'My Story', icon: NotebookPen },
  ];

  return (
    <aside className="w-full max-w-[285px] bg-neutral-800/90  min-h-screen p-4 text-white flex flex-col justify-between">
      <div>
        <Link href={'/'}>
          <Image
            src={'/logo-white.png'}
            alt="logo"
            width={160}
            height={0}
            className="mb-6"
          />
        </Link>
        {/* <h2 className="text-lg font-semibold mb-6">Dashboard</h2> */}
        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-muted/70 font-semibold text-black'
                    : 'hover:bg-muted/70 hover:text-black text-white'
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    'transition-colors ',
                    isActive
                      ? 'text-black'
                      : 'text-white group-hover:text-black'
                  )}
                  fill={isActive ? 'white' : 'none'}
                  stroke={isActive ? 'black' : 'white'}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-10">
        <Button
          className="w-full bg-muted/70 hover:bg-muted/50 font-semibold cursor-pointer text-black"
          onClick={async () => {
            toast.success('Success to logout');
            setTimeout(() => {
              signOut();
            }, 2000);
          }}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
