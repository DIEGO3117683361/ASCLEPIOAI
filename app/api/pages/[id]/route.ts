import { NextResponse } from 'next/server';
codex/create-fullstack-application-asclepio-tb9ca0
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const patchBodySchema = z.object({
  title: z.string().min(1).optional(),
  transcript: z.string().optional(),
  content: z.unknown().optional(),
  summary: z.unknown().optional()
});

function isInputJsonValue(value: unknown): value is Prisma.InputJsonValue {
  if (value === null) return false;

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isInputJsonValue(item));
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).every(
      (entry) => entry === null || isInputJsonValue(entry)
    );
  }

  return false;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

=======
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
main
  return NextResponse.json({ page });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
codex/create-fullstack-application-asclepio-tb9ca0
  try {
    const body = patchBodySchema.parse(await request.json());

    const data: Prisma.PageUpdateInput = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.transcript !== undefined) data.transcript = body.transcript;

    if (body.content !== undefined) {
      if (!isInputJsonValue(body.content)) {
        return NextResponse.json({ error: 'Invalid content JSON payload' }, { status: 400 });
      }
      data.content = body.content;
    }

    if (body.summary !== undefined) {
      if (!isInputJsonValue(body.summary)) {
        return NextResponse.json({ error: 'Invalid summary JSON payload' }, { status: 400 });
      }
      data.summary = body.summary;
    }

    const page = await prisma.page.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({ page });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid PATCH payload',
          details: error.flatten()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update page', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
=======
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
main
}
