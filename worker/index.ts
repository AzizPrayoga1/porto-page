import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { GitHubService } from '../src/services/github';
import { CTFtimeService } from '../src/services/ctftime';

export interface Env {
  DB: D1Database;
  GITHUB_TOKEN?: string;
  GITHUB_USERNAME: string;
  CTFTIME_TEAM_ID: string;
  ASSETS: Fetcher;
  SYNC_SECRET?: string;
}

function isAuthorized(request: Request, syncSecret?: string): boolean {
  if (!syncSecret) return true;
  const auth = request.headers.get('Authorization') || request.headers.get('x-sync-secret') || request.headers.get('X-Sync-Secret');
  const token = auth?.startsWith('Bearer ') ? auth.substring(7) : auth;
  return token === syncSecret;
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
        name: "porto-page",
        description: "Personal portfolio website with Astro and TailwindCSS.",
        language: "TypeScript",
        topics: JSON.stringify(["astro", "cloudflare", "drizzle", "react"]),
        stars: 0,
        forks: 0,
        url: "https://github.com/AzizPrayoga1/porto-page",
        isPinned: true,
        isHidden: false,
        adminNote: "Personal website",
        lastPushedAt: new Date("2026-07-22T10:00:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      },
      {
        id: "repo-2",
        name: "whatsapp-trading-analyze",
        description: "Automated analysis tool for trading signals via WhatsApp messages.",
        language: "JavaScript",
        topics: JSON.stringify(["whatsapp", "trading", "analysis"]),
        stars: 0,
        forks: 0,
        url: "https://github.com/AzizPrayoga1/whatsapp-trading-analyze",
        isPinned: true,
        isHidden: false,
        adminNote: null,
        lastPushedAt: new Date("2026-07-20T08:30:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      },
      {
        id: "repo-3",
        name: "absen-face-recognition",
        description: "Face recognition attendance check-in system using Python.",
        language: "Python",
        topics: JSON.stringify(["opencv", "face-recognition", "python"]),
        stars: 0,
        forks: 0,
        url: "https://github.com/AzizPrayoga1/absen-face-recognition",
        isPinned: true,
        isHidden: false,
        adminNote: "Machine learning integration",
        lastPushedAt: new Date("2026-07-15T00:00:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      },
      {
        id: "repo-4",
        name: "quiz_in",
        description: "Mobile quiz application built with Kotlin.",
        language: "Kotlin",
        topics: JSON.stringify(["kotlin", "android", "quiz"]),
        stars: 0,
        forks: 0,
        url: "https://github.com/AzizPrayoga1/quiz_in",
        isPinned: false,
        isHidden: false,
        adminNote: null,
        lastPushedAt: new Date("2026-07-10T12:00:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      },
      {
        id: "repo-5",
        name: "spp-ukom-smk-2023",
        description: "Student payment management application for school project.",
        language: "PHP",
        topics: JSON.stringify(["php", "laravel", "mysql"]),
        stars: 0,
        forks: 0,
        url: "https://github.com/AzizPrayoga1/spp-ukom-smk-2023",
        isPinned: false,
        isHidden: false,
        adminNote: null,
        lastPushedAt: new Date("2026-06-25T00:00:00Z").getTime(),
        lastSyncedAt: new Date("2026-07-22T00:00:00Z").getTime(),
      }
    ];

    const mockAchievements = [
      {
        id: "ctf-1",
        eventName: "bhackari CTF 2026",
        eventDate: new Date("2026-07-05").getTime(),
        rank: 7,
        points: 3692.0,
        teamName: "NVC",
        isHidden: false,
        lastSyncedAt: new Date("2026-07-22").getTime(),
      },
      {
        id: "ctf-2",
        eventName: "squ1rrel CTF 2026",
        eventDate: new Date("2026-06-15").getTime(),
        rank: 21,
        points: 6132.0,
        teamName: "NVC",
        isHidden: false,
        lastSyncedAt: new Date("2026-07-22").getTime(),
      },
      {
        id: "ctf-3",
        eventName: "BlueHens CTF 2026",
        eventDate: new Date("2026-05-20").getTime(),
        rank: 55,
        points: 1670.0,
        teamName: "NVC",
        isHidden: false,
        lastSyncedAt: new Date("2026-07-22").getTime(),
      },
      {
        id: "ctf-4",
        eventName: "UMDCTF 2026",
        eventDate: new Date("2026-04-18").getTime(),
        rank: 177,
        points: 725.0,
        teamName: "NVC",
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
        let ctftimeGlobalRating = 145.63;
        let ctftimeCountryRank = 10;
        let ratingHistoryList: any[] = [{ year: 2026, ratingPoints: 145.63, countryRank: 10 }];

        if (db) {
          try {
            const projList = await db.select().from(schema.projects);
            const ctfList = await db.select().from(schema.ctfAchievements);
            projectsCount = projList.length || projectsCount;
            achievementsCount = ctfList.length || achievementsCount;

            const dbRatingHistory = await db.select().from(schema.ctfRatingHistory).orderBy(schema.ctfRatingHistory.year);
            if (dbRatingHistory.length > 0) {
              ratingHistoryList = dbRatingHistory.map(r => ({
                year: r.year,
                ratingPoints: r.ratingPoints,
                countryRank: r.countryRank
              }));

              // Find 2026 rating details specifically
              const r2026 = dbRatingHistory.find(r => r.year === 2026);
              if (r2026) {
                ctftimeGlobalRating = r2026.ratingPoints;
                ctftimeCountryRank = r2026.countryRank || ctftimeCountryRank;
              }
            }
          } catch (e) {
            // Fallback
          }
        }

        return Response.json({
          projectsCount,
          achievementsCount,
          ctftimeGlobalRating,
          ctftimeCountryRank,
          ratingHistory: ratingHistoryList
        }, { headers: corsHeaders });
      }

      if (url.pathname === '/api/sync/github' && request.method === 'POST') {
        if (!isAuthorized(request, env.SYNC_SECRET)) {
          return Response.json({
            success: false,
            message: "Unauthorized: Invalid or missing secret token",
          }, { status: 401, headers: corsHeaders });
        }

        if (!db) {
          return Response.json({
            success: false,
            message: "Database connection not available.",
          }, { status: 500, headers: corsHeaders });
        }

        try {
          const githubService = new GitHubService(
            env.GITHUB_USERNAME || 'AzizPrayoga1',
            env.GITHUB_TOKEN
          );

          const result = await githubService.syncRepositories(db);

          await db.insert(schema.syncLogs).values({
            source: 'github',
            triggerType: 'manual',
            status: 'success',
            newItemsCount: result.newItemsCount + result.updatedItemsCount,
            executedAt: new Date(),
          });

          return Response.json({
            success: true,
            message: "GitHub sync completed successfully.",
            itemsSyncedCount: result.newItemsCount + result.updatedItemsCount
          }, { headers: corsHeaders });
        } catch (e: any) {
          await db.insert(schema.syncLogs).values({
            source: 'github',
            triggerType: 'manual',
            status: 'failed',
            newItemsCount: 0,
            errorMessage: e.message || String(e),
            executedAt: new Date(),
          });

          return Response.json({
            success: false,
            message: `GitHub sync failed: ${e.message || String(e)}`,
          }, { status: 500, headers: corsHeaders });
        }
      }

      if (url.pathname === '/api/sync/ctftime' && request.method === 'POST') {
        if (!isAuthorized(request, env.SYNC_SECRET)) {
          return Response.json({
            success: false,
            message: "Unauthorized: Invalid or missing secret token",
          }, { status: 401, headers: corsHeaders });
        }

        if (!db) {
          return Response.json({
            success: false,
            message: "Database connection not available.",
          }, { status: 500, headers: corsHeaders });
        }

        try {
          const ctftimeService = new CTFtimeService(
            env.CTFTIME_TEAM_ID || '426938'
          );

          const result = await ctftimeService.syncAchievements(db);

          await db.insert(schema.syncLogs).values({
            source: 'ctftime',
            triggerType: 'manual',
            status: 'success',
            newItemsCount: result.newAchievementsCount,
            executedAt: new Date(),
          });

          return Response.json({
            success: true,
            message: "CTFtime sync completed successfully.",
            itemsSyncedCount: result.newAchievementsCount
          }, { headers: corsHeaders });
        } catch (e: any) {
          await db.insert(schema.syncLogs).values({
            source: 'ctftime',
            triggerType: 'manual',
            status: 'failed',
            newItemsCount: 0,
            errorMessage: e.message || String(e),
            executedAt: new Date(),
          });

          return Response.json({
            success: false,
            message: `CTFtime sync failed: ${e.message || String(e)}`,
          }, { status: 500, headers: corsHeaders });
        }
      }

      if (!url.pathname.startsWith('/api/')) {
        return env.ASSETS.fetch(request);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err: any) {
      return new Response(err.message, { status: 500, headers: corsHeaders });
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    let db: ReturnType<typeof drizzle> | null = null;
    if (env.DB) {
      db = drizzle(env.DB, { schema });
    }
    if (!db) return;

    const githubService = new GitHubService(
      env.GITHUB_USERNAME || 'AzizPrayoga1',
      env.GITHUB_TOKEN
    );
    const ctftimeService = new CTFtimeService(
      env.CTFTIME_TEAM_ID || '426938'
    );

    ctx.waitUntil(
      Promise.allSettled([
        (async () => {
          try {
            const result = await githubService.syncRepositories(db!);
            await db!.insert(schema.syncLogs).values({
              source: 'github',
              triggerType: 'cron',
              status: 'success',
              newItemsCount: result.newItemsCount + result.updatedItemsCount,
              executedAt: new Date(),
            });
          } catch (e: any) {
            await db!.insert(schema.syncLogs).values({
              source: 'github',
              triggerType: 'cron',
              status: 'failed',
              newItemsCount: 0,
              errorMessage: e.message || String(e),
              executedAt: new Date(),
            });
          }
        })(),
        (async () => {
          try {
            const result = await ctftimeService.syncAchievements(db!);
            await db!.insert(schema.syncLogs).values({
              source: 'ctftime',
              triggerType: 'cron',
              status: 'success',
              newItemsCount: result.newAchievementsCount,
              executedAt: new Date(),
            });
          } catch (e: any) {
            await db!.insert(schema.syncLogs).values({
              source: 'ctftime',
              triggerType: 'cron',
              status: 'failed',
              newItemsCount: 0,
              errorMessage: e.message || String(e),
              executedAt: new Date(),
            });
          }
        })()
      ])
    );
  }
};
