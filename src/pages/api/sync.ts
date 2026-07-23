import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../db/schema';
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
    // 1. FETCH & INSERT GITHUB REPOSITORIES
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
            isPinned: isPinnedVal as any,
            isHidden: false as any
          }).onConflictDoUpdate({
            target: schema.projects.id,
            set: {
              description: String(repo.description || 'No description provided.'),
              stars: Number(repo.stargazers_count || 0),
              forks: Number(repo.forks_count || 0),
              language: String(repo.language || 'Code'),
              topics: topicsStr,
              isPinned: isPinnedVal as any
            }
          });
          results.github++;
        }
      }
    } catch (e: any) {
      errors.push(`GitHub Insert Error: ${e.message}`);
    }

    // ==========================================
    // 2. FETCH & INSERT CTFTIME RATING HISTORY
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
            const yearData = rating[yearStr];
            const yearNum = parseInt(yearStr, 10);
            if (isNaN(yearNum)) continue;

            const pts = Number(yearData.rating_points || 0);
            const countryRank = Number(yearData.country_place || 0);
            const globalRank = Number(yearData.rating_place || yearData.organizer_place || 0);

            await db.insert(schema.ctfRatingHistory).values({
              id: `ctf-${teamId}-${yearNum}`,
              year: yearNum,
              ratingPoints: pts,
              countryRank: countryRank,
              globalRank: globalRank
            }).onConflictDoUpdate({
              target: schema.ctfRatingHistory.id,
              set: {
                ratingPoints: pts,
                countryRank: countryRank,
                globalRank: globalRank
              }
            });
            results.ctfHistory++;
          }
        }
      }
    } catch (e: any) {
      errors.push(`CTF Rating Insert Error: ${e.message}`);
    }

    // ==========================================
    // 3. INSERT INITIAL CTF ACHIEVEMENTS
    // ==========================================
    try {
      const initialEvents = [
        {
          id: 'evt-nahamcon-2026',
          eventName: 'NahamCon CTF 2026',
          eventDate: new Date('2026-05-02'), // Menggunakan JS Date Object
          rank: 25,
          points: 1250.0,
          teamName: 'KuroCyber',
          isHidden: false
        },
        {
          id: 'evt-umd-2026',
          eventName: 'UMDCTF 2026',
          eventDate: new Date('2026-04-26'),
          rank: 12,
          points: 2100.0,
          teamName: 'KuroCyber',
          isHidden: false
        }
      ];

      for (const evt of initialEvents) {
        await db.insert(schema.ctfAchievements).values(evt as any).onConflictDoUpdate({
          target: schema.ctfAchievements.id,
          set: { rank: evt.rank, points: evt.points }
        });
        results.ctfEvents++;
      }
    } catch (e: any) {
      errors.push(`CTF Achievements Insert Error: ${e.message}`);
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