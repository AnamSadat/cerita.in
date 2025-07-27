import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { signOut } from 'next-auth/react';

import Image from 'next/image';
import type { DropDownDemoProps } from '@/types/navbar';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

export function DropdownMenuDemo({ session }: DropDownDemoProps) {
  if (!session) return <button>Login</button>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-white hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 focus:outline-none">
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src={session.user?.image || '/luffy.jpg'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
                width={20}
                height={10}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-md">My Account</DropdownMenuLabel>
        <DropdownMenuLabel>Nama</DropdownMenuLabel>
        <DropdownMenuItem disabled>{session.user.name}</DropdownMenuItem>
        <DropdownMenuLabel>Email</DropdownMenuLabel>
        <DropdownMenuItem disabled>{session.user.email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              toast('Masih dalam tahap development', {
                icon: <Info className="text-blue-500" />,
                className: 'justify-center',
              });
            }}
          >
            Profile
            <DropdownMenuShortcut>
              <Image
                src={'/profile.png'}
                alt="profile"
                width={18}
                height={10}
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            toast.success('Success to logout');
            setTimeout(() => {
              signOut();
            }, 2000);
          }}
        >
          Log out
          <DropdownMenuShortcut>
            <Image src={'/logout.png'} alt="logout" width={15} height={10} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
