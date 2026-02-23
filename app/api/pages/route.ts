import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ pages });
}

export async function POST() {
  const page = await prisma.page.create({
    data: {
      title: 'Nueva clase',
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      summary: {}
    }
  });

  return NextResponse.json({ page }, { status: 201 });
}
