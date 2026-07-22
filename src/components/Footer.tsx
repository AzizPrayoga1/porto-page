export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} dev&sec. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            GitHub
          </a>
          <a href="https://ctftime.org" target="_blank" rel="noreferrer" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            CTFtime
          </a>
          <a href="mailto:contact@example.com" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
