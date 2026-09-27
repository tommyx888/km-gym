'use client';

import { useEffect, useState } from 'react';
import ReservineButton from './ReservineButton';

/** Mobil: lišta „Rezervovať“ prilepená k spodku obrazovky – objaví sa po odscrollovaní hero. */
export default function StickyCta({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t hairline bg-ink-950/90 p-3 backdrop-blur-md transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <ReservineButton text={text} className="w-full" />
    </div>
  );
}
