'use client';

import { useEffect, useRef, useState } from 'react';

type Device = MediaDeviceInfo;

type UseAudioRecorderArgs = {
  onChunkTranscribed: (text: string) => void;
  onError: (message: string) => void;
};

export function useAudioRecorder({ onChunkTranscribed, onError }: UseAudioRecorderArgs) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const available = await navigator.mediaDevices.enumerateDevices();
        const microphones = available.filter((device) => device.kind === 'audioinput');
        setDevices(microphones);
        if (!selectedDeviceId && microphones[0]) {
          setSelectedDeviceId(microphones[0].deviceId);
        }
      } catch {
        onError('No fue posible acceder a los micrófonos del sistema.');
      }
    };

    loadDevices();
  }, [onError, selectedDeviceId]);

  const stop = () => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    streamRef.current = null;
    setIsRecording(false);
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
      });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorderRef.current = recorder;

      recorder.ondataavailable = async (event) => {
        if (!event.data.size) return;

        const form = new FormData();
        form.append('chunk', event.data, `chunk-${Date.now()}.webm`);

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: form
        });

        if (!response.ok) {
          onError('Error al transcribir un fragmento de audio.');
          return;
        }

        const payload = (await response.json()) as { text: string };
        if (payload.text?.trim()) {
          onChunkTranscribed(payload.text.trim());
        }
      };

      recorder.start(4000);
      setIsRecording(true);
    } catch {
      onError('No fue posible iniciar la grabación.');
    }
  };

  return { devices, selectedDeviceId, setSelectedDeviceId, isRecording, start, stop };
}
