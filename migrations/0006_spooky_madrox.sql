ALTER TABLE `workflow` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `workflow` ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `workflow_commandId_slug_unique` ON `workflow` (`commandId`,`slug`);