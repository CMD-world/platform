CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`privyId` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
