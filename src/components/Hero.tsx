import { motion } from 'framer-motion';

export default function Hero({ username = "AzizPrayoga1" }: { username?: string }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto flex flex-col items-center justify-center"
      >
        {/* Avatar */}
        <motion.div
          variants={itemVariants}
          className="relative mb-6 group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <img
            src={`https://avatars.githubusercontent.com/${username}`}
            alt={username}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-emerald-500/30 dark:ring-emerald-500/20 group-hover:ring-emerald-500 transition-all duration-300 object-cover shadow-lg relative z-10"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
            }}
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-500/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Available for Freelance & CTF Teams
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl lg:max-w-5xl leading-[1.1] sm:leading-tight text-zinc-900 dark:text-zinc-50"
        >
          Building Secure Applications &{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Breaking Security Vulnerabilities
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl sm:max-w-3xl leading-relaxed font-normal"
        >
          Saya adalah Software Developer yang berfokus pada TypeScript & JavaScript, serta Cybersecurity Enthusiast (CTF Player) dengan spesialisasi Web Exploitation dan sedikit Forensics.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={buttonVariants}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <motion.a
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            href="/projects"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold shadow-md bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border border-transparent transition-colors duration-200 text-sm"
          >
            Lihat Proyek
          </motion.a>
          <motion.a
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            href="/achievements"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors duration-200 text-zinc-900 dark:text-zinc-50 text-sm"
          >
            Pencapaian CTF
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
