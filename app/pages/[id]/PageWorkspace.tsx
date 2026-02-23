'use client';

import { useMemo, useState } from 'react';
import { SmartRecorder } from '@/components/SmartRecorder';
import { NotionEditor } from '@/components/NotionEditor';
import { PageDTO, SummaryPayload } from '@/types/page';

type Props = {
  initialPage: PageDTO;
};

const defaultContent = { type: 'doc', content: [{ type: 'paragraph' }] };

export function PageWorkspace({ initialPage }: Props) {
  const [title, setTitle] = useState(initialPage.title);
  const [transcript, setTranscript] = useState(initialPage.transcript ?? '');
  const [content, setContent] = useState<Record<string, unknown>>(initialPage.content ?? defaultContent);
  const [summary, setSummary] = useState<Record<string, unknown>>(initialPage.summary ?? {});
  const [status, setStatus] = useState('Cambios sin guardar');

  const parsedSummary = useMemo(() => summary as Partial<SummaryPayload>, [summary]);

  const savePage = async () => {
    setStatus('Guardando...');
    const response = await fetch(`/api/pages/${initialPage.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, transcript, content, summary })
    });

    setStatus(response.ok ? 'Guardado correctamente' : 'No se pudo guardar');
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-8">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="w-full border-none bg-transparent text-4xl font-semibold outline-none"
        placeholder="Título de la clase"
      />

      <SmartRecorder transcript={transcript} onTranscriptChange={setTranscript} onSummaryGenerated={setSummary} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Bloque generado por IA</h2>
            <div className="space-y-3 text-sm text-zinc-700">
              <p><strong>Título sugerido:</strong> {parsedSummary.suggestedTitle ?? '—'}</p>
              <p><strong>Resumen:</strong> {parsedSummary.structuredSummary ?? '—'}</p>
              <p><strong>Puntos clave:</strong> {(parsedSummary.keyPoints ?? []).join(' · ') || '—'}</p>
              <p><strong>Conceptos importantes:</strong> {(parsedSummary.importantConcepts ?? []).join(' · ') || '—'}</p>
              <p><strong>Preguntas de examen:</strong> {(parsedSummary.examQuestions ?? []).join(' · ') || '—'}</p>
            </div>
          </div>

          <NotionEditor content={content} onChange={setContent} />
        </section>

        <aside className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Transcripción completa editable</h2>
          <textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            className="min-h-[420px] w-full resize-y rounded-xl border border-zinc-200 p-3 text-sm outline-none"
          />
        </aside>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={savePage} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          Guardar página
        </button>
        <span className="text-sm text-zinc-500">{status}</span>
      </div>
    </div>
  );
}
