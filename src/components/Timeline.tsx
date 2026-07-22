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

  return (
    <section id="timeline" className="py-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-12">Timeline Perjalanan</h2>
        <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-6 space-y-10 py-2">
          {items.map((item) => (
            <div key={item.id} className="relative pl-8 md:pl-10">
              <span className={`absolute left-[-9px] md:left-[-11px] top-1.5 flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full ring-4 ring-zinc-50 dark:ring-zinc-950 ${
                item.type === 'work' ? 'bg-blue-500' :
                item.type === 'ctf' ? 'bg-red-500' :
                'bg-emerald-500'
              }`}>
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {item.year}
                </span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                  {item.type}
                </span>
              </div>
              <h3 className="text-lg font-bold mt-2">{item.title}</h3>
              <h4 className="text-sm font-medium text-zinc-500 mt-0.5">{item.subtitle}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
