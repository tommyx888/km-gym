'use client';

export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-ghost !px-5 !py-2 !text-[0.65rem]">
      {label}
    </button>
  );
}
