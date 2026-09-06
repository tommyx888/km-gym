import Reveal from './Reveal';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
}

export default function PageHero({ eyebrow, title, lead }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b hairline bg-ink-950 pt-36 pb-16 md:pt-44 md:pb-24 grain">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[720px] rounded-full bg-crimson-700/20 blur-[140px] animate-breathe"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto px-5 md:px-8">
        <div className="max-w-4xl">
          <p className="eyebrow animate-rise">{eyebrow}</p>
          <h1 className="font-display mt-6 text-[3.4rem] leading-[0.9] text-white animate-clip md:text-[6rem] lg:text-[7.5rem]">
            {title}
          </h1>
          {lead && (
            <Reveal delay={200}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist md:text-xl">{lead}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
