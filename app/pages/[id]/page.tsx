import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageWorkspace } from './PageWorkspace';

export default async function PageDetail({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });

  if (!page) return notFound();

  return (
    <PageWorkspace
      initialPage={{
        id: page.id,
        title: page.title,
        content: (page.content as Record<string, unknown>) ?? {},
        transcript: page.transcript,
        summary: (page.summary as Record<string, unknown>) ?? {},
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString()
      }}
    />
  );
}
