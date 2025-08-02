'use client';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { DropdownMenuDemo } from '@/components/view/navbar/dropdownDemo';
import { Skeleton } from '@/components/ui/skeleton';

export function Nav() {
  const navItems = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Story',
      link: '/story',
    },
    {
      name: 'About',
      link: '/about',
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton
              variant="secondary"
              href="/add-story"
              className="text-white flex gap-1.5 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width={15}
                style={{ fill: '#FFFFFF' }}
              >
                <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
              Add Story
            </NavbarButton>
            {status === 'loading' ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : session ? (
              <div className="relative group">
                <DropdownMenuDemo session={session} />
              </div>
            ) : (
              <NavbarButton variant="primary" href="/login">
                Login
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {status === 'loading' ? (
              <Skeleton className="h-8 w-8 rounded-full mb-4" />
            ) : session ? (
              <div className="mb-4 flex gap-4">
                <DropdownMenuDemo session={session} />
                <div className="text-sm text-neutral-500">
                  <p className="text-neutral-500">{session.user.username}</p>
                  <p className="text-neutral-500">{session.user.email}</p>
                </div>
              </div>
            ) : null}

            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}

            <div className="flex w-full flex-col gap-4 mt-4">
              <NavbarButton
                href="/add-story"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Add Story
              </NavbarButton>
              {!session && (
                <NavbarButton
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
