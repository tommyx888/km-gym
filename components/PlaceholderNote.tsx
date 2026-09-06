/**
 * Malá značka pri textoch, ktoré ešte treba doplniť.
 * Zobrazí sa len keď text obsahuje "[PLACEHOLDER" – po doplnení sama zmizne.
 */
export default function PlaceholderNote({ text, label }: { text: string; label: string }) {
  if (!text.includes('[PLACEHOLDER')) return null;
  return (
    <span
      className="ml-2 inline-block align-middle border border-crimson-600/60 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-crimson-500"
      title={text.slice(text.indexOf('[PLACEHOLDER'))}
    >
      {label}
    </span>
  );
}

/** Odstráni [PLACEHOLDER …] poznámku z textu určeného návštevníkovi. */
export function clean(text: string): string {
  return text.replace(/\s*\[PLACEHOLDER[^\]]*\]/g, '').trim();
}
