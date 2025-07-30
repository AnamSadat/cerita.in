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
            'https://storage.googleapis.com/ceritain-images/luffy.jpg',
          gender: 'Laki-laki',
        },
      },
    },
  });

  const category = await Prisma.category.upsert({
    where: {
      name: 'Petualangan',
    },
    update: {},
    create: {
      name: 'Petualangan',
      slug: 'petualangan',
    },
  });

  const story = await Prisma.stories.create({
    data: {
      user_id: user.id,
      title: 'Bromo',
      slug: 'bromo',
      content: 'ini adalah cerita pertama saya',
      short_description: 'Cerita pembuka tentang pengalaman pertama',
      img_url:
        'https://storage.googleapis.com/ceritain-images/19c2dbd0-6b6a-4c62-86bb-35d528188922.jpg',
      category_id: category.id,
    },
  });

  await Prisma.bookmark.create({
    data: {
      user_id: user.id,
      story_id: story.id,
      notes: 'Keren nih',
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
