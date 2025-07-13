'use client'

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

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

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return  () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClass = `fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded-full w-4xl shadow-xl transition-all duration-300 transition-colors backdrop-blur-md ${scrolled ? 'bg-gray-900/20 backdrop-blur-md' : 'bg-[var(--gray)]'}`;

  // TODO: Fixing bug navbar

  return (
    <header className={handleClass}>
      <div className='flex justify-between container items-center py-2 text-lg gap-3 px-3'>
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
            <Button variant={'secondary'} className='rounded-full' asChild>
              <Link href={'/'}>
              Log In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
