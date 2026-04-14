import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn("Prisma: DATABASE_URL not found in process.env");
    return new PrismaClient();
  }

  console.log("Prisma: Initializing with URL starting with:", connectionString.substring(0, 20), "...");

  try {
    // If it's a Neon database URL, use the adapter for better compatibility with serverless
    if (connectionString.includes('neon.tech')) {
      const pool = new Pool({ connectionString });
      const adapter = new PrismaNeon(pool);
      
      return new PrismaClient({ 
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
      });
    }
  } catch (error) {
    console.error("Prisma: Error initializing Neon adapter:", error);
  }

  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
