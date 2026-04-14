import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function test() {
  const url = process.env.DATABASE_URL;
  console.log("Testing Neon URL starting with:", url?.substring(0, 20));
  
  try {
    const sql = neon(url);
    const result = await sql`SELECT 1 as test`;
    console.log("Neon HTTP connection SUCCESS:", result);
  } catch (err) {
    console.error("Neon HTTP connection FAILED:", err);
  }
}

test();
