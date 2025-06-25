// index.ts
import { db } from './drizzle/db';
import { users } from './drizzle/schema';

async function test() {
  const result = await db.select().from(users);
  console.log(result);
}

test();
