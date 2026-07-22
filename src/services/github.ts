import { createLogger } from '../lib/logger';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const logger = createLogger('GitHubService');

export interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string;
  fork: boolean;
}

export class GitHubService {
  private token?: string;
  private username: string;

  constructor(username: string, token?: string) {
    this.username = username;
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'User-Agent': 'cloudflare-worker-portfolio-sync',
      'Accept': 'application/vnd.github.v3+json',
    };
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    return headers;
  }

  /**
   * Fetches public repositories from GitHub REST API.
   */
  async fetchUserRepos(): Promise<GitHubRepoResponse[]> {
    logger.info(`Fetching repos for user: ${this.username}`);
    const url = `https://api.github.com/users/${this.username}/repos?per_page=100&sort=updated`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as GitHubRepoResponse[];
    // Filter out forks
    return data.filter(r => !r.fork);
  }

  /**
   * Fetches pinned repositories using GitHub GraphQL API.
   */
  async fetchPinnedRepos(): Promise<string[]> {
    if (!this.token) {
      logger.warn('No GITHUB_TOKEN provided. Cannot fetch pinned repositories. Skipping.');
      return [];
    }

    logger.info(`Fetching pinned repos for user: ${this.username}`);
    const query = `
      query {
        user(login: "${this.username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      logger.error(`GitHub GraphQL error: ${response.status} ${response.statusText}`);
      return [];
    }

    const resJson = await response.json() as any;
    const nodes = resJson?.data?.user?.pinnedItems?.nodes || [];
    return nodes.map((node: any) => node.name);
  }

  /**
   * Performs database diff checks and sync operations.
   */
  async syncRepositories(db: any): Promise<{ newItemsCount: number; updatedItemsCount: number }> {
    logger.info("Starting GitHub sync process...");

    const repos = await this.fetchUserRepos();
    const pinnedNames = await this.fetchPinnedRepos();
    const pinnedSet = new Set(pinnedNames);

    let newItemsCount = 0;
    let updatedItemsCount = 0;

    for (const repo of repos) {
      const isPinned = pinnedSet.has(repo.name);

      // Check if it already exists in projects table
      const existing = await db.select()
        .from(schema.projects)
        .where(eq(schema.projects.id, String(repo.id)));

      const record = {
        id: String(repo.id),
        name: repo.name,
        description: repo.description,
        language: repo.language,
        topics: JSON.stringify(repo.topics || []),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        isPinned: isPinned,
        lastPushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        lastSyncedAt: new Date(),
      };

      try {
        await db.insert(schema.projects)
          .values(record)
          .onConflictDoUpdate({
            target: schema.projects.id,
            set: {
              name: record.name,
              description: record.description,
              language: record.language,
              topics: record.topics,
              stars: record.stars,
              forks: record.forks,
              url: record.url,
              isPinned: record.isPinned,
              lastPushedAt: record.lastPushedAt,
              lastSyncedAt: record.lastSyncedAt,
            }
          });

        if (existing.length === 0) {
          newItemsCount++;
        } else {
          updatedItemsCount++;
        }
      } catch (err: any) {
        logger.error(`Failed to upsert repo ${repo.name}:`, err);
      }
    }

    return { newItemsCount, updatedItemsCount };
  }
}
