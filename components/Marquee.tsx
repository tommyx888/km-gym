export default function Marquee({ items }: { items: readonly string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee relative overflow-hidden border-y hairline bg-ink-950 py-5" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={i} className="font-display flex items-center text-[1.6rem] text-mist md:text-[2rem]">
            <span className="px-8">{item}</span>
            <span className="h-1.5 w-1.5 bg-crimson-600" />
          </span>
        ))}
      </div>
    </div>
  );
}
