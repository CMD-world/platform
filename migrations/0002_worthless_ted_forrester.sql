CREATE TABLE `command` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
