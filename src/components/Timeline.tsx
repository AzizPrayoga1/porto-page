import { motion } from 'framer-motion';

export interface TimelineItem {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'work' | 'education' | 'ctf';
}

export default function Timeline() {
  const items: TimelineItem[] = [
    {
      id: 1,
      year: "2026",
      title: "bhackari CTF 2026",
      subtitle: "Cybersecurity Enthusiast / NVC",
      description: "Berhasil meraih Rank #7 berskala global bersama tim NVC dengan perolehan 3692 poin.",
      type: "ctf"
    },
    {
      id: 2,
      year: "2026",
      title: "squ1rrel CTF 2026",
      subtitle: "Cybersecurity Enthusiast / NVC",
      description: "Meraih Rank #21 berskala global bersama tim NVC.",
      type: "ctf"
    },
    {
      id: 3,
      year: "2025 - Sekarang",
      title: "Fullstack Developer",
      subtitle: "Freelance & Open Source Contributor",
      description: "Mengembangkan aplikasi web berbasis TypeScript, React, dan database relational.",
      type: "work"
    },
    {
      id: 4,
      year: "2023",
      title: "SPP Ukom SMK",
      subtitle: "Developer",
      description: "Membangun aplikasi manajemen pembayaran SPP sekolah menggunakan PHP (Laravel/Native) & MySQL.",
      type: "work"
    }
  ];

  // Helper to render type-specific icons
  const renderIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'ctf':
        return (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-19m0 0h18l-3 6 3 6H3" />
          </svg>
        );
      case 'work':
        return (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  // Color scheme per type
  const getTypeColors = (type: TimelineItem['type']) => {
    switch (type) {
      case 'ctf':
        return {
          bg: 'bg-red-500',
          gradient: 'from-red-500 to-orange-500',
          text: 'text-red-500 dark:text-red-400',
          border: 'border-red-500/20 hover:border-red-500/50 dark:border-red-500/10 dark:hover:border-red-500/30',
          lightBg: 'bg-red-500/10'
        };
      case 'work':
        return {
          bg: 'bg-blue-500',
          gradient: 'from-blue-500 to-indigo-500',
          text: 'text-blue-500 dark:text-blue-400',
          border: 'border-blue-500/20 hover:border-blue-500/50 dark:border-blue-500/10 dark:hover:border-blue-500/30',
          lightBg: 'bg-blue-500/10'
        };
      default:
        return {
          bg: 'bg-emerald-500',
          gradient: 'from-emerald-500 to-teal-500',
          text: 'text-emerald-500 dark:text-emerald-400',
          border: 'border-emerald-500/20 hover:border-emerald-500/50 dark:border-emerald-500/10 dark:hover:border-emerald-500/30',
          lightBg: 'bg-emerald-500/10'
        };
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      filter: 'blur(8px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  return (
    <section id="timeline" className="py-24 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            Timeline Perjalanan
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-emerald-500 mx-auto mt-4 rounded-full"
          />
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500 via-blue-500 to-zinc-200 dark:to-zinc-800 transform md:-translate-x-1/2 rounded-full" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-80px' }}
            className="space-y-12 md:space-y-16"
          >
            {items.map((item, idx) => {
              const colors = getTypeColors(item.type);
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={`flex flex-col md:flex-row items-stretch w-full relative ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left/Right empty placeholder for desktop */}
                  <div className="hidden md:block w-1/2 px-8" />

                  {/* Icon Badge Center Node */}
                  <div className="absolute left-8 md:left-1/2 flex items-center justify-center w-8 h-8 rounded-full transform -translate-x-1/2 z-10 shadow-lg ring-4 ring-zinc-50 dark:ring-zinc-950 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`} />
                    <div className="relative z-20 flex items-center justify-center">
                      {renderIcon(item.type)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8">
                    <motion.div
                      whileHover={{
                        y: -5,
                        scale: 1.01,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`p-6 rounded-2xl border ${colors.border} bg-white dark:bg-zinc-900/90 backdrop-blur-sm transition-all duration-300 relative shadow-sm`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.lightBg} ${colors.text}`}>
                          {item.year}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded">
                          {item.type}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
                        {item.title}
                      </h3>

                      <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        {item.subtitle}
                      </h4>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
