import crypto from "crypto";
import os from "os";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { t } from "$lib/trpc/t";
import { privateProcedure } from "$lib/trpc/context";
import { db } from "$lib/database";
import { elizaTable } from "$lib/schema";
import { TRPCError } from "@trpc/server";
import { createSelectSchema } from "drizzle-zod";
import { env } from "$env/dynamic/private";

const execAsync = promisify(exec);

async function launchMachine(appName: string) {
  console.info(`Starting launch of machine with app name: ${appName}`);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "eliza-"));
  console.info(`Created temporary directory at: ${tmpDir}`);

  // Create fly.toml content
  const flyConfig = `app = '${appName}'
primary_region = 'fra'

[build]
image = 'svelterust/eliza:latest'

[http_service]
internal_port = 3000
force_https = true
auto_stop_machines = 'suspend'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
memory = '2gb'
cpu_kind = 'shared'
cpus = 4
`;
  console.info("Generated fly.toml configuration");

  try {
    // Write fly.toml
    await fs.writeFile(path.join(tmpDir, "fly.toml"), flyConfig);
    console.info(`Wrote fly.toml to ${tmpDir}`);

    // Launch the app
    console.info("Executing fly launch command...");
    const { stdout, stderr } = await execAsync(
      `fly launch --org andy-mann --ha=false --access-token=${env.FLY_API_TOKEN} --copy-config --dockerignore-from-gitignore --yes --now`,
      {
        cwd: tmpDir,
      },
    );
    console.info("Fly launch command completed successfully");
    console.info("Command output:", stdout);
    if (stderr) console.warn("Command stderr:", stderr);

    // Update status to ready if successful
    await db.update(elizaTable).set({ status: "ready" }).where(eq(elizaTable.appName, appName));
    console.info(`Updated database status to ready for app: ${appName}`);
  } catch (error) {
    // Update status to error
    console.error("Failed to launch Fly app:", error);
    await db.update(elizaTable).set({ status: "error" }).where(eq(elizaTable.appName, appName));
    console.info(`Updated database status to error for app: ${appName}`);

    console.info(`Attempting to destroy failed app: ${appName}`);
    await execAsync(`fly apps destroy ${appName} --access-token=${env.FLY_API_TOKEN} --yes`);
    console.info(`Successfully destroyed failed app: ${appName}`);
  } finally {
    // Clean up temp directory
    console.info(`Cleaning up temporary directory: ${tmpDir}`);
    await fs.rm(tmpDir, { recursive: true });
    console.info("Cleanup completed");
  }
}

export const eliza = t.router({
  create: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/eliza/create",
        tags: ["Eliza"],
        description: "Create new Eliza instance for user.",
      },
    })
    .input(z.void())
    .output(createSelectSchema(elizaTable))
    .mutation(async ({ ctx: { user } }) => {
      // Check if Eliza already exists for this user
      const [existing] = await db.select().from(elizaTable).where(eq(elizaTable.userId, user.id));
      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Eliza instance already exists for this user",
        });
      }

      // Generate app name
      const appName = `eliza-${crypto.randomBytes(8).toString("hex").toLowerCase()}`;

      try {
        // Create initial database entry
        const [newEliza] = await db
          .insert(elizaTable)
          .values({
            userId: user.id,
            appName: appName,
            status: "pending",
          })
          .returning();

        // Launch machine and update status asynchronously
        launchMachine(appName);
        console.info("Added Fly.io machine to database:", newEliza);
        return newEliza;
      } catch (error) {
        console.error("Failed to create Fly app:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create Fly app: ${error}`,
        });
      }
    }),
});
