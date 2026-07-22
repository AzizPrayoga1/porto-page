# Automated Personal Portfolio Website

Self-updating personal portfolio for a software developer and CTF player. The goal is to keep projects, open-source activity, and CTF achievements fresh without routine manual editing.

This repository currently starts from the product requirements document:

- [PRD_Automated_Portfolio_Website.md](PRD_Automated_Portfolio_Website.md)

## Product Vision

Most personal portfolios become outdated quickly. This project is designed as a portfolio that syncs activity from external sources, stores the latest verified data, and renders a fast public website from cached database content.

The website should communicate two professional identities clearly:

- Software developer: public GitHub projects, pinned repositories, tech stack, stars, forks, and recent activity.
- Cybersecurity enthusiast / CTF player: CTFtime rating history, event participation, ranks, points, and writeups where available.

## Core Objectives

- Keep portfolio data updated automatically with minimal manual maintenance.
- Stay cheap to operate, ideally within free tiers.
- Give the owner full control over what appears publicly.
- Make technical credibility easy to verify for recruiters, teammates, and CTF peers.
- Degrade gracefully when GitHub or CTFtime is unavailable.

## Planned Features

### Public Website

- Home page with concise professional profile.
- Projects page powered by synced GitHub repository data.
- Achievements page powered by synced CTFtime data.
- Fast mobile-friendly layout.
- No direct calls from public pages to GitHub or CTFtime.

### GitHub Automation

- Monthly scheduled sync.
- Fetch public repositories and pinned repositories.
- Store repository metadata such as name, description, language, topics, stars, forks, URL, and last push time.
- Filter private repositories and low-signal forks.
- Support admin-controlled publishing behavior.

### CTFtime Automation

- Weekly scheduled sync.
- Fetch team or profile data from available CTFtime endpoints and public pages.
- Store event participation, rank, points, and rating snapshots.
- Preserve last known good data if CTFtime parsing fails.

### Admin Dashboard

- Protected owner-only dashboard.
- Manual sync buttons for GitHub and CTFtime.
- Show/hide controls for synced projects and events.
- Sync logs with status, timestamps, item counts, and error details.
- Lightweight manual notes for adding context to synced items.

## Target Architecture

The proposed stack is optimized for a low-cost personal project:

| Layer | Proposed Tooling |
|---|---|
| Frontend hosting | Cloudflare Pages |
| Compute and cron | Cloudflare Workers |
| Database | Cloudflare D1 |
| Optional object storage | Cloudflare R2 |
| Admin authentication | Cloudflare Access |
| Secrets | Wrangler Secrets |
| Monitoring | Workers logs and optional webhook alerts |

Data flow:

1. Cloudflare Cron triggers scheduled sync workers.
2. Workers fetch GitHub and CTFtime data.
3. Workers diff and upsert records into D1.
4. Public pages render from stored data.
5. Admin dashboard controls visibility, manual sync, and sync review.

## Data Model Draft

Initial database entities:

- `projects`: GitHub repository records.
- `ctf_achievements`: CTF event participation records.
- `ctf_rating_history`: historical CTFtime rating snapshots.
- `sync_logs`: cron and manual sync execution logs.

The detailed draft schema is documented in the PRD.

## Non-Functional Goals

- Public page TTFB target below 200 ms.
- Lighthouse performance target of 90 or higher.
- Idempotent sync jobs with no duplicate records.
- Graceful failure when external APIs are down.
- GitHub tokens and credentials stored only as platform secrets.
- Admin endpoints protected by proper authentication and rate limiting.

## Repository Status

This is the initial product planning stage. Implementation has not started yet.

Recommended first implementation milestones:

1. Choose frontend framework: Astro or Next.js.
2. Scaffold Cloudflare Pages and Workers structure.
3. Add D1 schema and migrations.
4. Implement GitHub sync worker.
5. Implement public Projects page.
6. Implement CTFtime sync worker.
7. Add admin dashboard and sync logs.
8. Add deployment and operational documentation.

## Security Notes

- Do not commit API tokens, admin credentials, cookies, or secrets.
- Store GitHub tokens through `wrangler secret put`.
- Protect admin paths with Cloudflare Access or equivalent authentication.
- Add rate limiting to manual sync endpoints.
- Keep synced data immutable by default and use soft-hide behavior for moderation.

## License

License has not been selected yet.
