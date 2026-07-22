CREATE TABLE `ctf_achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`event_date` integer,
	`rank` integer,
	`points` real,
	`team_name` text,
	`is_hidden` integer DEFAULT false NOT NULL,
	`last_synced_at` integer
);
--> statement-breakpoint
CREATE TABLE `ctf_rating_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year` integer NOT NULL,
	`rating_points` real NOT NULL,
	`country_rank` integer,
	`recorded_at` integer
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`language` text,
	`topics` text,
	`stars` integer DEFAULT 0 NOT NULL,
	`forks` integer DEFAULT 0 NOT NULL,
	`url` text NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`is_hidden` integer DEFAULT false NOT NULL,
	`admin_note` text,
	`last_pushed_at` integer,
	`last_synced_at` integer
);
--> statement-breakpoint
CREATE TABLE `sync_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`trigger_type` text NOT NULL,
	`status` text NOT NULL,
	`new_items_count` integer DEFAULT 0 NOT NULL,
	`error_message` text,
	`executed_at` integer
);
