import { Prisma } from '@/lib/prisma/prismaClient';

/**
 * To running:
 * pnpm test:db
 */

async function main() {
  try {
    await Prisma.$connect();
    console.log('------------------------');
    console.log('✅ Connected to NeonDB!');
    console.log('------------------------');
  } catch (error) {
    console.log(
      '-----------------------------------------------------------------------------'
    );
    console.log('❌ Failed to connect to NeonDB:', error);
    console.log(
      '-----------------------------------------------------------------------------'
    );
  } finally {
    await Prisma.$disconnect();
  }
}

main();
