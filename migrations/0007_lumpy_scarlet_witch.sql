CREATE TABLE `eliza` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`appName` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
