/**
 * Mengubah nilai tanggal (Date, string, atau number) menjadi format tanggal lokal Indonesia.
 * Contoh: "22 Juli 2026"
 */
export function formatLongDate(date: Date | string | number | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Mengubah tanggal ke format relatif (misal: "3 hari yang lalu").
 */
export function formatRelativeTime(date: Date | string | number | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) {
    return formatLongDate(d);
  }
  if (diffDay > 0) {
    return `${diffDay} hari yang lalu`;
  }
  if (diffHour > 0) {
    return `${diffHour} jam yang lalu`;
  }
  if (diffMin > 0) {
    return `${diffMin} menit yang lalu`;
  }
  return 'baru saja';
}
