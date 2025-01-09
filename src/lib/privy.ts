import { env } from "$env/dynamic/private";
import { env as envPublic } from "$env/dynamic/public";
import { PrivyClient } from "@privy-io/server-auth";

export const privy = new PrivyClient(envPublic.PUBLIC_PRIVY_APP_ID, env.PRIVY_APP_SECRET);
