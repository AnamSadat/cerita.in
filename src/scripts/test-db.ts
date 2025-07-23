import { Prisma } from '@/lib/prisma/prismaClient';

/**
 * To run:
 * pnpm test:db
 */

function getDbInfo(url: string | undefined) {
  if (!url) return { type: 'Unknown', name: 'Unknown' };

  try {
    const parsed = new URL(url);
    const type = parsed.protocol.replace(':', '');
    const dbName = parsed.pathname.replace('/', '') || 'Unknown';

    const formattedType =
      {
        postgresql: 'PostgreSQL',
        mysql: 'MySQL',
        mongodb: 'MongoDB',
        sqlite: 'SQLite',
      }[type] || type;

    return { type: formattedType, name: dbName };
  } catch {
    return { type: 'Unknown', name: 'Unknown' };
  }
}

async function main() {
  const { type, name } = getDbInfo(process.env.DATABASE_URL);

  try {
    await Prisma.$connect();
    console.log('------------------------------------------------');
    console.log(`✅ Connected to ${type} database "${name}"`);
    console.log('------------------------------------------------');
  } catch (error) {
    console.log(
      '-----------------------------------------------------------------------------'
    );
    console.log(`❌ Failed to connect to ${type} database "${name}":`, error);
    console.log(
      '-----------------------------------------------------------------------------'
    );
  } finally {
    await Prisma.$disconnect();
  }
}

main();
