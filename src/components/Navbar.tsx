'use client';

import Image from 'next/image';
import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { NavItems } from './ui/resizable-navbar';

export default function Navbar() {
  const routes = [
    { link: '/', name: 'Home' },
    { link: '/story', name: 'Story' },
  ];

  // const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClass = `
    fixed top-5 left-1/2 -translate-x-1/2 z-50
    rounded-full w-full max-w-4xl
    transition-colors duration-300
    px-4 backdrop-blur-md
    ${scrolled ? 'bg-gray-900/60 shadow-xl' : 'bg-[var(--gray)]'}
  `;

  return (
    <header className={navbarClass}>
      <div className="flex items-center justify-between w-full py-2 px-4 md:px-1">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo-white.png"
            alt="Logo Cerita.in"
            width={130}
            height={0}
            priority
          />
        </Link>

        {/* Navigation */}
        <NavItems items={routes}/>
        
        {/* Button Log In */}
        <div>
          <Button variant="secondary" className="rounded-full" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
