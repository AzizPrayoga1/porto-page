interface ProjectProps {
  name: string;
  description: string | null;
  language: string | null;
  topics?: string | string[]; // Can be array or JSON string
  stars: number;
  forks: number;
  url: string;
  isPinned?: boolean;
}

export default function ProjectCard({ name, description, language, topics, stars, forks, url, isPinned }: ProjectProps) {
  let parsedTopics: string[] = [];
  if (topics) {
    if (typeof topics === 'string') {
      try {
        parsedTopics = JSON.parse(topics);
      } catch (e) {
        parsedTopics = [];
      }
    } else {
      parsedTopics = topics;
    }
  }

  return (
    <div className="flex flex-col p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <a href={url} target="_blank" rel="noreferrer">
            {name}
          </a>
        </h3>
        {isPinned && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            📌 Pinned
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 flex-grow">
        {description || 'Tidak ada deskripsi proyek.'}
      </p>

      {parsedTopics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {parsedTopics.slice(0, 4).map((topic) => (
            <span key={topic} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          {language && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {language}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            ⭐ {stars}
          </span>
          <span className="flex items-center gap-0.5">
            🍴 {forks}
          </span>
        </div>
        <a href={url} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-500 hover:underline">
          View GitHub &rarr;
        </a>
      </div>
    </div>
  );
}
