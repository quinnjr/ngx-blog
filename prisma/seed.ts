import { PrismaClient } from '@prisma/client';
import seedSettings from './seed-settings';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed default settings (WordPress-style configuration)
  await seedSettings();

  console.log('');
  console.log('✅ Database seeding completed!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('  1. Start the server: pnpm dev:ssr');
  console.log('  2. Visit: http://localhost:4000/admin/settings');
  console.log('  3. Configure your site settings');
  console.log('');
  console.log('ℹ️  All configuration is stored in the database');
  console.log('   Only DATABASE_URL is needed in .env');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
