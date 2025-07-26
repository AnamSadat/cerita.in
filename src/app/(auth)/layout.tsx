import Image from 'next/image';
import Link from 'next/link';

const routes = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/about-us',
    label: 'About',
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="antialiased relative w-full  lg:h-screen mt-0 text-white">
        <header className="fixed top-0 z-50 w-full">
          <div className="container flex h-20 mx-auto items-center px-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-white.png"
                alt="Cerita.in Logo"
                width={125}
                height={35}
                priority
              />
            </Link>
            <div className="flex">
              <nav className="hidden ml-3 md:flex items-center space-x-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="font-medium transition-colors hover:text-orange-500"
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        {children}
      </div>
    </>
  );
}
