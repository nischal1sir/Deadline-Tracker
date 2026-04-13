import { neon } from '@neondatabase/serverless';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn("Prisma: No DATABASE_URL found. Falling back to default client.");
    return new PrismaClient();
  }

  try {
    // If it's a Neon database URL, use the adapter for better compatibility with serverless
    if (connectionString.includes('neon.tech')) {
      const sql = neon(connectionString);
      const adapter = new PrismaNeonHTTP(sql);
      
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
