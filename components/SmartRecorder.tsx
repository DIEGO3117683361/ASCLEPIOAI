'use client';

import { useState } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

type Props = {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onSummaryGenerated: (summary: Record<string, unknown>) => void;
};

export function SmartRecorder({ transcript, onTranscriptChange, onSummaryGenerated }: Props) {
  const [error, setError] = useState('');

  const recorder = useAudioRecorder({
    onChunkTranscribed: (chunkText) => {
      onTranscriptChange(`${transcript} ${chunkText}`.trim());
    },
    onError: setError
  });

  const generateSummary = async () => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });

    if (!response.ok) {
      setError('No se pudo generar el resumen inteligente.');
      return;
    }

    const payload = (await response.json()) as { summary: Record<string, unknown> };
    onSummaryGenerated(payload.summary);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
          value={recorder.selectedDeviceId}
          onChange={(event) => recorder.setSelectedDeviceId(event.target.value)}
        >
          {recorder.devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Micrófono ${device.deviceId.slice(0, 4)}`}
            </option>
          ))}
        </select>

        {!recorder.isRecording ? (
          <button onClick={recorder.start} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white">
            Iniciar Anotador Inteligente
          </button>
        ) : (
          <button onClick={recorder.stop} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white">
            Detener Grabación
          </button>
        )}

        <button
          onClick={generateSummary}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
          disabled={!transcript.trim()}
        >
          Generar resumen IA
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
