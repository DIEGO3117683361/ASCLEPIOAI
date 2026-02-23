import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const chunk = form.get('chunk');

    if (!(chunk instanceof File)) {
      return NextResponse.json({ error: 'Audio chunk is required' }, { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: chunk,
      model: 'whisper-1',
      response_format: 'text'
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    return NextResponse.json(
      { error: 'Transcription failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
