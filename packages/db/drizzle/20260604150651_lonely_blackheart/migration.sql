CREATE TABLE `algorithm` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL UNIQUE,
	`case_id` text NOT NULL,
	`rotations` text NOT NULL UNIQUE,
	`mnemonics` text,
	`description` text,
	CONSTRAINT `fk_algorithm_case_id_case_id_fk` FOREIGN KEY (`case_id`) REFERENCES `case`(`id`)
);
--> statement-breakpoint
CREATE TABLE `case` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL UNIQUE,
	`setup` text NOT NULL,
	`subset_id` text NOT NULL,
	`default_algorithm_id` text,
	CONSTRAINT `fk_case_subset_id_subset_id_fk` FOREIGN KEY (`subset_id`) REFERENCES `subset`(`id`),
	CONSTRAINT `fk_case_default_algorithm_id_algorithm_id_fk` FOREIGN KEY (`default_algorithm_id`) REFERENCES `algorithm`(`id`)
);
--> statement-breakpoint
CREATE TABLE `cube` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `set` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL UNIQUE,
	`preview_algorithm` text NOT NULL,
	`cube_id` text NOT NULL,
	`view_type` text NOT NULL,
	CONSTRAINT `fk_set_cube_id_cube_id_fk` FOREIGN KEY (`cube_id`) REFERENCES `cube`(`id`)
);
--> statement-breakpoint
CREATE TABLE `subset` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL UNIQUE,
	`preview_algorithm` text NOT NULL,
	`set_id` text NOT NULL,
	CONSTRAINT `fk_subset_set_id_set_id_fk` FOREIGN KEY (`set_id`) REFERENCES `set`(`id`)
);
