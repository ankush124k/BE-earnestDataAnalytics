const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Database connection logging
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to database:', process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'unknown');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
  });

module.exports = prisma;
