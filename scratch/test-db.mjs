import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.log("Attempting to connect to database via HTTP adapter...");
    const userCount = await prisma.user.count();
    console.log("Success! User count:", userCount);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
