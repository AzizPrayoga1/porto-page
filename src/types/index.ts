export interface Project {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  topics: string; // JSON string array
  stars: number;
  forks: number;
  url: string;
  isPinned: boolean;
  isHidden: boolean;
  adminNote: string | null;
  lastPushedAt: Date | null;
  lastSyncedAt: Date | null;
}

export interface CtfAchievement {
  id: string;
  eventName: string;
  eventDate: Date | null;
  rank: number | null;
  points: number | null;
  teamName: string | null;
  isHidden: boolean;
  lastSyncedAt: Date | null;
}

export interface CtfRatingHistory {
  id: number;
  year: number;
  ratingPoints: number;
  countryRank: number | null;
  recordedAt: Date | null;
}

export interface SyncLog {
  id: number;
  source: 'github' | 'ctftime';
  triggerType: 'cron' | 'manual';
  status: 'success' | 'failed';
  newItemsCount: number;
  errorMessage: string | null;
  executedAt: Date | null;
}
