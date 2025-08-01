import Image from 'next/image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen pt-25 px-5 pb-20 container mx-auto">
      {/* Tentang Cerita.in */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-zinc-400 hover:text-white">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">About</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="text-center w-full py-15 rounded-2xl mx-auto mt-10 mb-16 bg-neutral-900/80">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Tentang Cerita.in
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            <strong>Cerita.in</strong> adalah platform berbagi cerita yang
            memungkinkan siapa saja untuk menulis, membaca, dan menyimpan cerita
            favorit mereka. Dibuat dengan semangat untuk mendukung kreativitas
            literasi digital, Cerita.in menyajikan pengalaman menulis dan
            membaca yang sederhana, bersih, dan menyenangkan.
          </p>
        </div>
      </section>

      {/* Our Team */}
      <section className="text-center mb-10">
        <h2 className="text-3xl font-bold text-accent mb-20">Our Team</h2>

        <div className="flex justify-center">
          <div
            className="relative mx-auto w-full max-w-xs mt-10"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            <div className="backdrop-blur-md bg-neutral-800/50 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
              <div className="relative h-48 lg:h-78 overflow-visible">
                <div
                  className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-108"
                  style={{ zIndex: 10 }}
                >
                  <Image
                    src="/anams.png"
                    alt="Team Member"
                    fill
                    className="object-cover select-none pointer-events-none"
                    style={{ objectPosition: 'top center' }}
                  />
                </div>
              </div>
              <div className="p-4 backdrop-blur-sm bg-neutral-800/10 dark:bg-white/10 rounded-b-lg relative">
                <h3 className="text-lg font-bold text-white">Anam Sadat</h3>
                <p className="font-medium">Fullstack Developer</p>
                <p className="text-sm">STIKOM Poltek Cirebon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
