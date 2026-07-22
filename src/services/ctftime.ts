import { createLogger } from '../lib/logger';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const logger = createLogger('CTFtimeService');

export interface CTFtimeEvent {
  id: string;
  eventName: string;
  eventDate: Date;
  rank: number;
  points: number;
  teamName: string;
}

export class CTFtimeService {
  private teamId: string;
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  constructor(teamId: string) {
    this.teamId = teamId;
  }

  /**
   * Fetches team rating statistics from CTFtime API endpoint.
   */
  async fetchTeamStats(): Promise<any> {
    logger.info(`Fetching team stats for team: ${this.teamId}`);
    const url = `https://ctftime.org/api/v1/teams/${this.teamId}/`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
      },
    });

    if (!response.ok) {
      throw new Error(`CTFtime API returned status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Scrapes event lists and individual ranks from the team page on CTFtime.
   */
  async scrapeTeamEvents(): Promise<Omit<CTFtimeEvent, 'eventDate'>[]> {
    logger.info(`Scraping team events for team: ${this.teamId}`);
    const url = `https://ctftime.org/team/${this.teamId}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
      },
    });

    if (!response.ok) {
      throw new Error(`CTFtime scraping returned status ${response.status}`);
    }

    const html = await response.text();
    const events: Omit<CTFtimeEvent, 'eventDate'>[] = [];

    // Parse the HTML table rows
    // Format: <tr><td class="place_ico"></td><td class="place">675</td><td><a href="/event/3249">V1T CTF 2026</a></td><td>49.0000</td><td>0.124</td></tr>
    const rowRegex = /<tr><td[^>]*><\/td><td[^>]*>(\d+)<\/td><td><a href="\/event\/(\d+)">([^<]+)<\/a><\/td><td>([\d.]+)<\/td><td>([\d.]+)<\/td><\/tr>/g;

    let match;
    // Let's clean the HTML of whitespaces/newlines inside row elements to make matching robust
    const cleanedHtml = html.replace(/\s+/g, ' ').replace(/> </g, '><');

    while ((match = rowRegex.exec(cleanedHtml)) !== null) {
      events.push({
        id: match[2],
        eventName: match[3].trim(),
        rank: parseInt(match[1], 10),
        points: parseFloat(match[4]),
        teamName: 'NVC',
      });
    }

    return events;
  }

  /**
   * Fetches event start date from CTFtime Event API.
   */
  async fetchEventDate(eventId: string): Promise<Date> {
    try {
      const url = `https://ctftime.org/api/v1/events/${eventId}/`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });
      if (response.ok) {
        const data = (await response.json()) as any;
        if (data.start) {
          return new Date(data.start);
        }
      }
    } catch (e) {
      logger.error(`Error fetching details for event ${eventId}:`, e);
    }
    return new Date(); // Fallback
  }

  /**
   * Synchronizes CTF achievements into the database.
   */
  async syncAchievements(db: any): Promise<{ newAchievementsCount: number }> {
    logger.info("Starting CTFtime sync process...");

    // 1. Sync rating history (annual snapshots)
    try {
      const stats = await this.fetchTeamStats();
      if (stats && stats.rating) {
        const now = new Date();
        for (const [yearStr, details] of Object.entries(stats.rating)) {
          const year = parseInt(yearStr, 10);
          const info = details as any;

          if (info.country_place !== undefined || info.rating_points !== undefined) {
            const ratingPoints = info.rating_points || 0.0;
            const countryRank = info.country_place || null;

            const existing = await db.select()
              .from(schema.ctfRatingHistory)
              .where(eq(schema.ctfRatingHistory.year, year));

            if (existing.length > 0) {
              await db.update(schema.ctfRatingHistory)
                .set({
                  ratingPoints,
                  countryRank,
                  recordedAt: now,
                })
                .where(eq(schema.ctfRatingHistory.year, year));
            } else {
              await db.insert(schema.ctfRatingHistory).values({
                year,
                ratingPoints,
                countryRank,
                recordedAt: now,
              });
            }
          }
        }
      }
    } catch (e) {
      logger.error("Failed to sync rating history:", e);
    }

    // 2. Sync achievements (events)
    let newAchievementsCount = 0;
    try {
      const scrapedEvents = await this.scrapeTeamEvents();
      const now = new Date();

      for (const event of scrapedEvents) {
        const existing = await db.select()
          .from(schema.ctfAchievements)
          .where(eq(schema.ctfAchievements.id, event.id));

        if (existing.length > 0) {
          // Update event points/rank
          await db.update(schema.ctfAchievements)
            .set({
              eventName: event.eventName,
              rank: event.rank,
              points: event.points,
              teamName: event.teamName,
              lastSyncedAt: now,
            })
            .where(eq(schema.ctfAchievements.id, event.id));
        } else {
          newAchievementsCount++;
          // Fetch exact date from event API details
          const eventDate = await this.fetchEventDate(event.id);

          await db.insert(schema.ctfAchievements).values({
            id: event.id,
            eventName: event.eventName,
            eventDate,
            rank: event.rank,
            points: event.points,
            teamName: event.teamName,
            isHidden: false,
            lastSyncedAt: now,
          });
        }
      }
    } catch (e) {
      logger.error("Failed to sync achievements:", e);
      throw e;
    }

    return { newAchievementsCount };
  }
}
