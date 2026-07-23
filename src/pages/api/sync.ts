import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../db/schema';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const db = drizzle(env.DB, { schema });
    const username = env.GITHUB_USERNAME || 'AzizPrayoga1';
    const teamId = env.CTFTIME_TEAM_ID || '426938';
    const token = env.GITHUB_TOKEN;

    const results = { github: 0, ctfHistory: 0 };

    // ==========================================
    // 1. FETCH GITHUB REPOSITORIES
    // ==========================================
    const ghHeaders: Record<string, string> = {
      'User-Agent': 'Astro-Portfolio-App',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (token) ghHeaders['Authorization'] = `token ${token}`;

    const ghRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`, {
      headers: ghHeaders
    });

    if (ghRes.ok) {
      const repos: any[] = await ghRes.json();
      for (const repo of repos) {
        if (repo.fork) continue;

        const isPinnedVal = Boolean(repo.stargazers_count > 0 || repo.name === 'porto-page');
        const topicsJson = JSON.stringify(Array.isArray(repo.topics) ? repo.topics : []);

        await db.insert(schema.projects).values({
          id: String(repo.id),
          name: String(repo.name),
          description: String(repo.description || 'No description provided.'),
          language: String(repo.language || 'Code'),
          topics: topicsJson,
          stars: Number(repo.stargazers_count || 0),
          forks: Number(repo.forks_count || 0),
          url: String(repo.html_url),
          isPinned: isPinnedVal as any,
          isHidden: false as any
        }).onConflictDoUpdate({
          target: schema.projects.id,
          set: {
            description: String(repo.description || 'No description provided.'),
            stars: Number(repo.stargazers_count || 0),
            forks: Number(repo.forks_count || 0),
            language: String(repo.language || 'Code'),
            topics: topicsJson,
          }
        });
        results.github++;
      }
    }

    // ==========================================
    // 2. FETCH CTFTIME TEAM & RATING DATA
    // ==========================================
    const ctfRes = await fetch(`https://ctftime.org/api/v1/teams/${teamId}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (ctfRes.ok) {
      const ctfData: any = await ctfRes.json();
      const rating = ctfData.rating;

      if (rating && typeof rating === 'object') {
        for (const yearStr of Object.keys(rating)) {
          const yearData = rating[yearStr];
          const yearNum = parseInt(yearStr, 10);

          if (isNaN(yearNum)) continue;

          await db.insert(schema.ctfRatingHistory).values({
            id: `ctf-${teamId}-${yearNum}`,
            year: yearNum,
            ratingPoints: Number(yearData.rating_points || 0),
            countryRank: Number(yearData.country_place || 0),
            globalRank: Number(yearData.organizer_place || yearData.rating_place || 0),
          }).onConflictDoUpdate({
            target: schema.ctfRatingHistory.id,
            set: {
              ratingPoints: Number(yearData.rating_points || 0),
              countryRank: Number(yearData.country_place || 0),
              globalRank: Number(yearData.organizer_place || yearData.rating_place || 0),
            }
          });
          results.ctfHistory++;
        }
      }
    }

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Data GitHub & CTFtime berhasil disinkronkan ke D1 Database!',
      synced: results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message || 'Unknown database error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
