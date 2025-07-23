import { Prisma } from '@/lib/prisma/prismaClient';
import bcrypt from 'bcrypt';

async function main() {
  const password = 'Admin1234*';
  const hashingPassword = await bcrypt.hash(password, 10);

  const user = await Prisma.user.create({
    data: {
      name: 'example',
      email: 'contoh@example.com',
      password: hashingPassword,
      profile: {
        create: {
          username: 'example',
          bio: 'Backend & Fullstack developer',
          avatar_url:
            'https://4kwallpapers.com/images/walls/thumbs_3t/23027.jpg',
          gender: 'Laki-laki',
        },
      },
    },
  });

  const story = await Prisma.stories.create({
    data: {
      user_id: user.id,
      title: 'Bromo',
      slug: 'bromo',
      content: 'ini adalah cerita pertama saya',
      short_description: 'Cerita pembuka tentang pengalaman pertama',
      img_url: 'https://4kwallpapers.com/images/walls/thumbs_3t/23027.jpg',
      category_id: 1,
    },
  });

  await Prisma.bookmark.create({
    data: {
      user_id: user.id,
      story_id: story.id,
    },
  });

  await Prisma.likes.create({
    data: {
      user_id: user.id,
      story_id: story.id,
    },
  });

  console.log(
    '--------------------------------------------------------------------------------'
  );
  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => Prisma.$disconnect());
