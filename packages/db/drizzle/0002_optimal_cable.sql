ALTER TABLE subsets ADD `view_type` text NOT NULL DEFAULT 'OLL';--> statement-breakpoint
ALTER TABLE `cases` DROP COLUMN `view_type`;