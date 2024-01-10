CREATE TABLE `algorithms` (
	`id` text PRIMARY KEY NOT NULL,
	`rotations` text NOT NULL,
	`rotations_mnemonic` text,
	`description` text,
	`append_setup` text,
	`case_id` text NOT NULL,
	`is_main` integer DEFAULT false,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cases` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`setup` text NOT NULL,
	`subset_id` text NOT NULL,
	FOREIGN KEY (`subset_id`) REFERENCES `subsets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subsets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`preview_algorithm` text NOT NULL,
	`set_id` text NOT NULL,
	FOREIGN KEY (`set_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action
);
