import Image from 'next/image';
import Link from 'next/link';

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
                width={140}
                height={35}
                priority
              />
            </Link>
          </div>
        </header>
        {children}
      </div>
    </>
  );
}
