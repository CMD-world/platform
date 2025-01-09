import { env } from "$env/dynamic/private";
import { env as envPublic } from "$env/dynamic/public";
import { userTable, type User as DbUser } from "$lib/schema";
import { PrivyClient, type User as PrivyUser } from "@privy-io/server-auth";
import { type Cookies } from "@sveltejs/kit";
import { db } from "$lib/database";
import { eq } from "drizzle-orm";

// Create client
export type PrivyDbUser = Omit<PrivyUser, "id"> & DbUser;
export const privy = new PrivyClient(envPublic.PUBLIC_PRIVY_APP_ID, env.PRIVY_APP_SECRET);

// Helper function to get both Privy and database user
export async function getOrCreateUser(cookies: Cookies): Promise<PrivyDbUser | null> {
  // Extract user from token
  const idToken = cookies.get("privy-id-token");
  const privyUser = idToken ? await privy.getUser({ idToken }) : null;
  if (!privyUser) return null;

  // Get user from database
  let dbUsers = await db.select().from(userTable).where(eq(userTable.privyId, privyUser.id));
  if (dbUsers.length == 0) dbUsers = await db.insert(userTable).values({ privyId: privyUser.id }).returning();
  return { ...privyUser, ...dbUsers[0] };
}
