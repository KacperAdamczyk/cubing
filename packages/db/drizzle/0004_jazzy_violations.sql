ALTER TABLE algorithms ADD `default_for_case_id` text REFERENCES cases(id);--> statement-breakpoint
CREATE UNIQUE INDEX `algorithms_default_for_case_id_unique` ON `algorithms` (`default_for_case_id`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `algorithms` DROP COLUMN `append_setup`;--> statement-breakpoint
ALTER TABLE `algorithms` DROP COLUMN `is_main`;