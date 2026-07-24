import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
              nvc.
            </a>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-8">
                <a href="/" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</a>
                <a href="/about" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About</a>
                <a href="/projects" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Projects</a>
                <a href="/achievements" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">CTF & Achievements</a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* Simple Mobile nav helper button */}
            <div className="md:hidden">
              <a href="/about" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Menu</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
