'use client'

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export default function Navbar() {
  const routes = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/story',
      label: 'Story',
    },
  ];

  const pathname = usePathname();

  return (
    <div className=''>
      <header className='fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded-xl w-full max-w-7xl mx-auto justify-center shadow-20 transition-all duration-300 bg-[var(--gray)]'>
        <div className='flex justify-between container mx-auto items-center py-3 text-lg gap-3'>
          <div>
            <Link href={'/'}>
              <Image
                src={'/logo-white.png'}
                alt="Logo Cerita.in"
                width={150}
                height={0}
              />
            </Link>
          </div>
          <nav>
            <ul className="flex gap-7">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={
                      pathname === route.href ||
                    (route.href !== '/' && pathname.startsWith(route.href))
                        ? 'text-[var(--light-gray)] font-bold'
                        : 'text-input font-semibold'
                    }
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='gap-2 flex'>
            <div>
              <Button variant={'secondary'} asChild>
                <Link href={'/'}>
              Sign In
                </Link>
              </Button>
            </div>
            <div>
              <Button variant={'secondary'} asChild>
                <Link href={'/'}>
              Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
