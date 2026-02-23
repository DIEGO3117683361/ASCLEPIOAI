import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as {
    title?: string;
    content?: Record<string, unknown>;
    transcript?: string;
    summary?: Record<string, unknown>;
  };

  const page = await prisma.page.update({
    where: { id: params.id },
    data: {
      title: body.title,
      content: body.content,
      transcript: body.transcript,
      summary: body.summary
    }
  });

  return NextResponse.json({ page });
}
