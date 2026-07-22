export default function Hero() {
  return (
    <section className="py-20 sm:py-32 flex flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Available for Freelance & CTF Teams
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
        Building Secure Applications &{' '}
        <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          Breaking Security Vulnerabilities
        </span>
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
        Saya adalah Software Developer yang berfokus pada TypeScript & Go, serta Cybersecurity Enthusiast (CTF Player) dengan spesialisasi Web Exploitation & Reverse Engineering.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a
          href="/projects"
          className="px-6 py-3 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
        >
          Lihat Proyek
        </a>
        <a
          href="/achievements"
          className="px-6 py-3 rounded-lg font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Pencapaian CTF
        </a>
      </div>
    </section>
  );
}
