import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageList } from '@/components/PageList';

export default async function HomePage() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } });

  async function createPage() {
    'use server';
    const page = await prisma.page.create({
      data: {
        title: 'Nueva clase',
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
        summary: {}
      }
    });

    redirect(`/pages/${page.id}`);
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">ASCLEPIO</h1>
        <p className="max-w-2xl text-zinc-600">Anotador inteligente minimalista para grabar, transcribir, resumir y editar apuntes universitarios.</p>
      </header>

      <form action={createPage}>
        <button className="rounded-xl bg-accent px-5 py-3 font-medium text-white shadow-sm">Nueva Página</button>
      </form>

      <PageList pages={pages} />
    </main>
  );
}
