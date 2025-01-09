import { env } from "$env/dynamic/private";
import { env as envPublic } from "$env/dynamic/public";
import { apiKeyTable, userTable, type User as DbUser } from "$lib/schema";
import { PrivyClient, type User as PrivyUser } from "@privy-io/server-auth";
import { type Cookies } from "@sveltejs/kit";
import { db } from "$lib/database";
import { eq } from "drizzle-orm";

// Create client
export type PrivyDbUser = Omit<PrivyUser, "id"> & DbUser;
export const privy = new PrivyClient(envPublic.PUBLIC_PRIVY_APP_ID, env.PRIVY_APP_SECRET);

// Helper function to get both Privy and database user
export async function getOrCreateUser(cookies: Cookies, authorizationHeader: string | null): Promise<PrivyDbUser | null> {
  // Try Authorization header first
  if (authorizationHeader) {
    // Find match in database
    const apiKeys = await db
      .select()
      .from(apiKeyTable)
      .innerJoin(userTable, eq(apiKeyTable.userId, userTable.id))
      .where(eq(apiKeyTable.apiKey, authorizationHeader.split(" ")[1]));
    if (apiKeys.length == 0) return null;
    const { user } = apiKeys[0];

    // Get user in database and in Privy
    const privyUser = await privy.getUserById(user.privyId);
    return { ...privyUser, ...user };
  } else {
    // Extract user from token
    const idToken = cookies.get("privy-id-token");
    const privyUser = idToken ? await privy.getUser({ idToken }) : null;
    if (!privyUser) return null;

    // Get user from database
    let users = await db.select().from(userTable).where(eq(userTable.privyId, privyUser.id));
    if (users.length == 0) users = await db.insert(userTable).values({ privyId: privyUser.id }).returning();
    return { ...privyUser, ...users[0] };
  }
}
