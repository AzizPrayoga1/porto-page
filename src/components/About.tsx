export default function About() {
  const skills = {
    languages: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'C/C++'],
    frontend: ['React', 'Astro', 'TailwindCSS', 'HTML5/CSS3'],
    backend: ['Cloudflare Workers', 'Node.js', 'Express', 'Drizzle ORM', 'SQLite', 'PostgreSQL'],
    security: ['Web Exploitation', 'Reverse Engineering', 'Cryptography', 'Linux Forensics', 'OWASP Top 10']
  };

  return (
    <section id="about" className="py-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">About Me</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              Halo! Saya seorang developer yang antusias untuk menulis kode efisien dan aman. Saya percaya bahwa developer yang hebat harus memahami bagaimana sebuah sistem dibangun dan bagaimana sistem tersebut bisa dirusak.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Minat saya berada di persimpangan antara pengembangan aplikasi web dan keamanan siber. Selain berkontribusi pada proyek open-source di GitHub, saya juga aktif berkompetisi dalam Capture The Flag (CTF) secara daring maupun luring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Pendidikan & Fokus</h3>
            <p className="text-sm text-zinc-500">
              Fokus pada Keamanan Aplikasi Web, Infrastruktur Serverless (Cloudflare), dan Otomasi Konten Portofolio.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6">Skills & Technologies</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm uppercase tracking-wider">Languages</h4>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
                {skills.languages.map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm uppercase tracking-wider">Frontend</h4>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
                {skills.frontend.map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm uppercase tracking-wider">Backend & Cloud</h4>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
                {skills.backend.map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm uppercase tracking-wider">Security</h4>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
                {skills.security.map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
