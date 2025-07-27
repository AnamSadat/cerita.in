// app/(home)/layout.tsx
import { Poppins } from 'next/font/google';
import Footer from '@/components/view/footer/Footer';
import { Nav } from '@/components/view/navbar/Navbar';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${poppins.variable} antialiased min-h-screen flex flex-col`}
    >
      <Nav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
