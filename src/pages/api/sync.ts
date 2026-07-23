import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async () => {
  const debugLog: Record<string, any> = {};
  const errors: string[] = [];

  try {
    const db = drizzle(env.DB, { schema });
    const username = env.GITHUB_USERNAME || 'AzizPrayoga1';
    const teamId = env.CTFTIME_TEAM_ID || '426938';
    const token = env.GITHUB_TOKEN;

    const results = { github: 0, ctfHistory: 0, ctfEvents: 0 };

    // ==========================================
    // 1. FETCH GITHUB REPOSITORIES
    // ==========================================
    try {
      const ghHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Portfolio-App',
        'Accept': 'application/vnd.github.v3+json'
      };
      if (token) ghHeaders['Authorization'] = `token ${token}`;

      const ghRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`, {
        headers: ghHeaders
      });
      debugLog.githubStatus = ghRes.status;

      if (ghRes.ok) {
        const repos: any[] = await ghRes.json();
        for (const repo of repos) {
          if (repo.fork) continue;

          const isPinnedVal = Boolean(repo.stargazers_count > 0 || repo.name === 'porto-page');
          const topicsStr = JSON.stringify(Array.isArray(repo.topics) ? repo.topics : []);

          await db.insert(schema.projects).values({
            id: String(repo.id),
            name: String(repo.name || ''),
            description: String(repo.description || 'No description provided.'),
            language: String(repo.language || 'Code'),
            topics: topicsStr,
            stars: Number(repo.stargazers_count || 0),
            forks: Number(repo.forks_count || 0),
            url: String(repo.html_url || ''),
            isPinned: isPinnedVal,
            isHidden: false,
            lastSyncedAt: new Date()
          }).onConflictDoUpdate({
            target: schema.projects.id,
            set: {
              description: String(repo.description || 'No description provided.'),
              stars: Number(repo.stargazers_count || 0),
              forks: Number(repo.forks_count || 0),
              language: String(repo.language || 'Code'),
              topics: topicsStr,
              isPinned: isPinnedVal,
              lastSyncedAt: new Date()
            }
          });
          results.github++;
        }
      }
    } catch (e: any) {
      errors.push(`GitHub Insert Error: ${e.message}`);
    }

    // ==========================================
    // 2. FETCH CTFTIME RATING (ONLY YEAR >= 2026)
    // ==========================================
    try {
      const ctfRes = await fetch(`https://ctftime.org/api/v1/teams/${teamId}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      debugLog.ctfStatus = ctfRes.status;

      if (ctfRes.ok) {
        const ctfData: any = await ctfRes.json();
        const rating = ctfData.rating;

        if (rating && typeof rating === 'object') {
          for (const yearStr of Object.keys(rating)) {
            const yearNum = parseInt(yearStr, 10);
            
            // HANYA AMBIL TAHUN 2026 KE ATAS
            if (isNaN(yearNum) || yearNum < 2026) continue;

            const yearData = rating[yearStr];
            const pts = Number(yearData.rating_points || 0);
            const countryRank = Number(yearData.country_place || 0);

            const existing = await db
              .select()
              .from(schema.ctfRatingHistory)
              .where(eq(schema.ctfRatingHistory.year, yearNum));

            if (existing.length > 0) {
              await db
                .update(schema.ctfRatingHistory)
                .set({
                  ratingPoints: pts,
                  countryRank: countryRank,
                  recordedAt: new Date()
                })
                .where(eq(schema.ctfRatingHistory.year, yearNum));
            } else {
              await db.insert(schema.ctfRatingHistory).values({
                year: yearNum,
                ratingPoints: pts,
                countryRank: countryRank,
                recordedAt: new Date()
              });
            }
            results.ctfHistory++;
          }
        }
      }
    } catch (e: any) {
      errors.push(`CTF Rating Insert Error: ${e.message}`);
    }

    // ==========================================
    // 3. FETCH & SYNC ALL CTF EVENTS (2026)
    // ==========================================
    try {
      const eventsRes = await fetch(`https://ctftime.org/api/v1/results/2026/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });

      if (eventsRes.ok) {
        const results2026: Record<string, any> = await eventsRes.json();
        for (const eventIdStr of Object.keys(results2026)) {
          const eventItem = results2026[eventIdStr];
          const scores = eventItem.scores || [];
          
          // Cari skor tim KuroCyber / Team ID
          const teamScore = scores.find((s: any) => String(s.team_id) === String(teamId));
          if (teamScore) {
            await db.insert(schema.ctfAchievements).values({
              id: `evt-${eventIdStr}`,
              eventName: String(eventItem.title || 'CTF Event 2026'),
              eventDate: new Date(),
              rank: Number(teamScore.place || 0),
              points: Number(teamScore.points || 0),
              teamName: 'KuroCyber',
              isHidden: false,
              lastSyncedAt: new Date()
            }).onConflictDoUpdate({
              target: schema.ctfAchievements.id,
              set: {
                rank: Number(teamScore.place || 0),
                points: Number(teamScore.points || 0),
                lastSyncedAt: new Date()
              }
            });
            results.ctfEvents++;
          }
        }
      }
    } catch (e: any) {
      errors.push(`CTF Events Sync Error: ${e.message}`);
    }

    return new Response(JSON.stringify({
      status: errors.length > 0 ? 'partial_error' : 'success',
      message: 'Proses sinkronisasi selesai!',
      synced: results,
      errors: errors.length > 0 ? errors : undefined,
      debug: debugLog
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message || 'Unknown database error',
      debug: debugLog
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};