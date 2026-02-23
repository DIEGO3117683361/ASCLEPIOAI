import Link from 'next/link';
import { Page } from '@prisma/client';

export function PageList({ pages }: { pages: Page[] }) {
  if (!pages.length) {
    return <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-500">Aún no hay páginas. Crea la primera.</p>;
  }

  return (
    <ul className="space-y-3">
      {pages.map((page) => (
        <li key={page.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-accent/40">
          <Link href={`/pages/${page.id}`} className="block">
            <h3 className="text-lg font-semibold">{page.title}</h3>
            <p className="text-sm text-zinc-500">Actualizada: {new Date(page.updatedAt).toLocaleString()}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
