import { NextResponse } from 'next/server';
import { z } from 'zod';
import { openai } from '@/lib/openai';

const bodySchema = z.object({
  transcript: z.string().min(10)
});

const prompt = `Analiza la siguiente transcripción de clase universitaria y devuelve estrictamente JSON con esta forma:
{
  "suggestedTitle": "string",
  "structuredSummary": "string",
  "keyPoints": ["string"],
  "importantConcepts": ["string"],
  "examQuestions": ["string"]
}`;

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.parse(await request.json());

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: parsed.transcript }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const summary = JSON.parse(raw) as Record<string, unknown>;

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: 'Summary failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
