import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen pt-28 px-4 pb-20 container mx-auto">
      {/* Tentang Cerita.in */}
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Tentang Cerita.in
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          <strong>Cerita.in</strong> adalah platform berbagi cerita yang
          memungkinkan siapa saja untuk menulis, membaca, dan menyimpan cerita
          favorit mereka. Dibuat dengan semangat untuk mendukung kreativitas
          literasi digital, Cerita.in menyajikan pengalaman menulis dan membaca
          yang sederhana, bersih, dan menyenangkan.
        </p>
      </section>

      {/* Our Team */}
      <section className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-accent mb-8">Our Team</h2>

        <div className="flex justify-center">
          <Card className="w-full max-w-xs bg-neutral-800/80 border-0">
            <div className="relative h-64 w-full rounded-t-xl overflow-hidden">
              <Image
                src="/anamsadat.png"
                alt="Anam Sadat"
                fill
                className="object-cover object-top"
              />
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-primary">Anam Sadat</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Fullstack Developer
              </p>
              <p className="text-sm text-muted-foreground">
                STIKOM Poltek Cirebon
              </p>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-300 px-6 pb-6">
              <p>
                Saya adalah pengembang utama dari Cerita.in. Proyek ini dibangun
                menggunakan Next.js, TypeScript, dan berbagai teknologi modern
                untuk memberikan pengalaman terbaik dalam membaca dan menulis
                cerita.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
