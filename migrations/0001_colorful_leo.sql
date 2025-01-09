CREATE TABLE `apiKey` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`apiKey` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`expiresAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `apiKey_apiKey_unique` ON `apiKey` (`apiKey`);