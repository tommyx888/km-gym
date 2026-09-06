import Link from 'next/link';
import '@/app/globals.css';

export default function NotFound() {
  return (
    <html lang="sk">
      <body className="flex min-h-screen items-center justify-center bg-ink-950 px-6 text-white">
        <div className="text-center">
          <p className="font-display text-[8rem] leading-none text-crimson-600">404</p>
          <p className="mt-4 text-mist">Stránka neexistuje · Page not found</p>
          <Link href="/" className="btn btn-ghost mt-10">
            KM Gym
          </Link>
        </div>
      </body>
    </html>
  );
}
