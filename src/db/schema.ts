import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(), // github repo_id as string
  name: text('name').notNull(),
  description: text('description'),
  language: text('language'),
  topics: text('topics'), // JSON array as string
  stars: integer('stars').default(0).notNull(),
  forks: integer('forks').default(0).notNull(),
  url: text('url').notNull(),
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false).notNull(),
  isHidden: integer('is_hidden', { mode: 'boolean' }).default(false).notNull(),
  adminNote: text('admin_note'),
  lastPushedAt: integer('last_pushed_at', { mode: 'timestamp' }),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

export const ctfAchievements = sqliteTable('ctf_achievements', {
  id: text('id').primaryKey(), // event_id from CTFtime as string
  eventName: text('event_name').notNull(),
  eventDate: integer('event_date', { mode: 'timestamp' }),
  rank: integer('rank'),
  points: real('points'),
  teamName: text('team_name'),
  isHidden: integer('is_hidden', { mode: 'boolean' }).default(false).notNull(),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

export const ctfRatingHistory = sqliteTable('ctf_rating_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  year: integer('year').notNull(),
  ratingPoints: real('rating_points').notNull(),
  countryRank: integer('country_rank'),
  recordedAt: integer('recorded_at', { mode: 'timestamp' }),
});

export const syncLogs = sqliteTable('sync_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  source: text('source').notNull(), // 'github' | 'ctftime'
  triggerType: text('trigger_type').notNull(), // 'cron' | 'manual'
  status: text('status').notNull(), // 'success' | 'failed'
  newItemsCount: integer('new_items_count').default(0).notNull(),
  errorMessage: text('error_message'),
  executedAt: integer('executed_at', { mode: 'timestamp' }),
});
