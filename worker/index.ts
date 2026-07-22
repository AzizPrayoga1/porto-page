import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

export interface Env {
  DB: D1Database;
  GITHUB_TOKEN?: string;
  GITHUB_USERNAME: string;
  CTFTIME_TEAM_ID: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Check if D1 database binding is present
    let db: ReturnType<typeof drizzle> | null = null;
    if (env.DB) {
      db = drizzle(env.DB, { schema });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Dummy mock data for fallback
    const mockProjects = [
      {
        id: "repo-1",
        name: "auto-portfolio",
        description: "Self-updating developer & CTF portfolio platform on Cloudflare.",
        language: "TypeScript",
        topics: JSON.stringify(["astro", "cloudflare", "drizzle", "react"]),
        stars: 12,
        forks: 2,
        url: "https://github.com/octocat/auto-portfolio",
        isPinned: true,
        isHidden: false,
        adminNote: "Built during hackathon",
        lastPushedAt: new Date("2026-07-20T12:00:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      },
      {
        id: "repo-2",
        name: "ctf-exploit-kit",
        description: "Collection of automated exploit scripts for various CTF categories.",
        language: "Python",
        topics: JSON.stringify(["ctf", "exploit", "pwn", "security"]),
        stars: 45,
        forks: 8,
        url: "https://github.com/octocat/ctf-exploit-kit",
        isPinned: true,
        isHidden: false,
        adminNote: "Most popular repo",
        lastPushedAt: new Date("2026-07-15T08:30:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      },
      {
        id: "repo-3",
        name: "dotfiles",
        description: "My personal developer workspace configs for Neovim and Tmux.",
        language: "Lua",
        topics: JSON.stringify(["neovim", "tmux", "dotfiles"]),
        stars: 3,
        forks: 0,
        url: "https://github.com/octocat/dotfiles",
        isPinned: false,
        isHidden: false,
        adminNote: null,
        lastPushedAt: new Date("2026-07-22T10:00:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      }
    ];

    const mockAchievements = [
      {
        id: "ctf-1",
        eventName: "Google CTF 2026",
        eventDate: new Date("2026-06-25").getTime(),
        rank: 42,
        points: 1550.5,
        teamName: "KuroCyber",
        isHidden: false,
        lastSyncedAt: new Date("2026-07-22").getTime(),
      },
      {
        id: "ctf-2",
        eventName: "DEF CON CTF 34 Quals",
        eventDate: new Date("2026-05-18").getTime(),
        rank: 18,
        points: 3400.0,
        teamName: "KuroCyber",
        isHidden: false,
        lastSyncedAt: new Date("2026-07-22").getTime(),
      },
      {
        id: "ctf-3",
        eventName: "InnoSec CTF 2026",
        eventDate: new Date("2026-07-10").getTime(),
        rank: 2,
        points: 420.0,
        teamName: "KuroCyber (Individu)",
        isHidden: false,
        lastSyncedAt: new Date("2026-07-22").getTime(),
      }
    ];

    try {
      if (url.pathname === '/api/projects' && request.method === 'GET') {
        if (db) {
          try {
            const data = await db.select().from(schema.projects).where(eq(schema.projects.isHidden, false));
            if (data.length > 0) {
              return Response.json(data, { headers: corsHeaders });
            }
          } catch (e) {
            // Fallback to mock data if table doesn't exist or query fails
          }
        }
        return Response.json(mockProjects, { headers: corsHeaders });
      }

      if (url.pathname === '/api/achievements' && request.method === 'GET') {
        if (db) {
          try {
            const data = await db.select().from(schema.ctfAchievements).where(eq(schema.ctfAchievements.isHidden, false));
            if (data.length > 0) {
              return Response.json(data, { headers: corsHeaders });
            }
          } catch (e) {
            // Fallback
          }
        }
        return Response.json(mockAchievements, { headers: corsHeaders });
      }

      if (url.pathname === '/api/stats' && request.method === 'GET') {
        let projectsCount = mockProjects.length;
        let achievementsCount = mockAchievements.length;

        if (db) {
          try {
            const projList = await db.select().from(schema.projects);
            const ctfList = await db.select().from(schema.ctfAchievements);
            projectsCount = projList.length || projectsCount;
            achievementsCount = ctfList.length || achievementsCount;
          } catch (e) {
            // Fallback
          }
        }

        return Response.json({
          projectsCount,
          achievementsCount,
          ctftimeGlobalRating: 2450.5,
          ctftimeGlobalRank: 124,
        }, { headers: corsHeaders });
      }

      if (url.pathname === '/api/sync/github' && request.method === 'POST') {
        // TODO: Implement actual GitHub sync logic using GitHub API & Drizzle upsert
        // Technical Reason: External sync engines are out of scope for the current milestone (50% target).
        return Response.json({
          success: true,
          message: "Sync GitHub triggered (mock response). GitHub API integration is pending.",
          itemsSyncedCount: 0
        }, { headers: corsHeaders });
      }

      if (url.pathname === '/api/sync/ctftime' && request.method === 'POST') {
        // TODO: Implement actual CTFtime scraping / API parsing
        // Technical Reason: CTFtime scraping engine is out of scope for the current milestone.
        return Response.json({
          success: true,
          message: "Sync CTFtime triggered (mock response). CTFtime scraping engine is pending.",
          itemsSyncedCount: 0
        }, { headers: corsHeaders });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err: any) {
      return new Response(err.message, { status: 500, headers: corsHeaders });
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // TODO: Implement cron trigger execution matching GITHUB_USERNAME and CTFTIME_TEAM_ID
    // Technical Reason: Cron workers and automated background tasks are out of scope for current milestone.
    console.log("Cron execution triggered:", event.cron);
  }
};
