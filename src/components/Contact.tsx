export default function Contact() {
  return (
    <section id="contact" className="py-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Get In Touch</h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8">
          Tertarik untuk bekerja sama membangun proyek web aman atau ingin mengajak bergabung dalam kompetisi CTF mendatang? Hubungi saya kapan saja!
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="mailto:contact@example.com"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✉️ Email Me
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            🐙 GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
}
