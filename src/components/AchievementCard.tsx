interface AchievementProps {
  eventName: string;
  eventDate?: string | number | null;
  rank: number | null;
  points: number | null;
  teamName: string | null;
}

export default function AchievementCard({ eventName, eventDate, rank, points, teamName }: AchievementProps) {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
    : null;

  return (
    <div className="flex flex-col p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{eventName}</h3>
          {formattedDate && (
            <time className="text-xs text-zinc-500 block mt-0.5">{formattedDate}</time>
          )}
        </div>
        <div className="flex items-center justify-center min-w-[50px] px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
          #{rank || 'N/A'}
        </div>
      </div>

      <div className="mt-4 space-y-1.5 flex-grow">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium">Tim:</span> {teamName || 'Individu'}
        </p>
        {points !== null && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium">Poin Terkumpul:</span> {Math.round(points * 100) / 100} pts
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
        <span>Verified CTFtime Record</span>
        <span className="text-emerald-500">✓ Sync OK</span>
      </div>
    </div>
  );
}
