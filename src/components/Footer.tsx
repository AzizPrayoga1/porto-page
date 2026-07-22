import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'GitHub', href: 'https://github.com', target: '_blank', rel: 'noreferrer' },
    { label: 'CTFtime', href: 'https://ctftime.org', target: '_blank', rel: 'noreferrer' },
    { label: 'Contact', href: 'mailto:contact@example.com' }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo / Brand & Copyright */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-sm font-bold tracking-wider text-zinc-800 dark:text-zinc-200">
                dev&sec
              </span>
            </div>
            <p className="text-xs tracking-wide text-zinc-400 dark:text-zinc-500 text-center sm:text-left">
              &copy; {currentYear} dev&sec. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Footer Navigation">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    target={link.target}
                    rel={link.rel}
                    whileHover={{ y: -2, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="relative text-sm font-medium text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 py-1"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </motion.footer>
  );
}
