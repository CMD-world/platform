PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_apiKey` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`apiKey` text NOT NULL,
	`expiresAt` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_apiKey`("id", "userId", "apiKey", "expiresAt", "createdAt") SELECT "id", "userId", "apiKey", "expiresAt", "createdAt" FROM `apiKey`;--> statement-breakpoint
DROP TABLE `apiKey`;--> statement-breakpoint
ALTER TABLE `__new_apiKey` RENAME TO `apiKey`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `apiKey_apiKey_unique` ON `apiKey` (`apiKey`);--> statement-breakpoint
CREATE TABLE `__new_command` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_command`("id", "userId", "name", "slug", "createdAt") SELECT "id", "userId", "name", "slug", "createdAt" FROM `command`;--> statement-breakpoint
DROP TABLE `command`;--> statement-breakpoint
ALTER TABLE `__new_command` RENAME TO `command`;--> statement-breakpoint
CREATE UNIQUE INDEX `command_userId_slug_unique` ON `command` (`userId`,`slug`);--> statement-breakpoint
CREATE TABLE `__new_workflow` (
	`id` integer PRIMARY KEY NOT NULL,
	`commandId` integer NOT NULL,
	`url` text NOT NULL,
	`inputs` text DEFAULT '[]' NOT NULL,
	`outputs` text DEFAULT '[]' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`commandId`) REFERENCES `command`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workflow`("id", "commandId", "url", "inputs", "outputs", "createdAt") SELECT "id", "commandId", "url", "inputs", "outputs", "createdAt" FROM `workflow`;--> statement-breakpoint
DROP TABLE `workflow`;--> statement-breakpoint
ALTER TABLE `__new_workflow` RENAME TO `workflow`;