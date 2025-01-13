CREATE TABLE `workflow` (
	`id` integer PRIMARY KEY NOT NULL,
	`commandId` integer NOT NULL,
	`url` text NOT NULL,
	`inputs` text DEFAULT '[]' NOT NULL,
	`outputs` text DEFAULT '[]' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`commandId`) REFERENCES `command`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `command_userId_slug_unique` ON `command` (`userId`,`slug`);