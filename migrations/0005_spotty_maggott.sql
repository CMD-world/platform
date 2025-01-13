DROP INDEX "apiKey_apiKey_unique";--> statement-breakpoint
DROP INDEX "command_userId_slug_unique";--> statement-breakpoint
ALTER TABLE `workflow` ALTER COLUMN "inputs" TO "inputs" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `apiKey_apiKey_unique` ON `apiKey` (`apiKey`);--> statement-breakpoint
CREATE UNIQUE INDEX `command_userId_slug_unique` ON `command` (`userId`,`slug`);--> statement-breakpoint
ALTER TABLE `workflow` ALTER COLUMN "outputs" TO "outputs" text NOT NULL;