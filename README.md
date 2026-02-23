# ASCLEPIO

Aplicación fullstack minimalista para estudiantes universitarios con grabación, transcripción automática y resumen inteligente.

## Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Prisma ORM + PostgreSQL
- TipTap para editor estilo Notion
- MediaRecorder API para grabación
- OpenAI Whisper (transcripción)
- OpenAI GPT-4o mini (resumen estructurado)

## Estructura

```txt
app/
  api/
    pages/
    transcribe/
    summarize/
  pages/[id]/
components/
hooks/
lib/
prisma/
types/
```

## Configuración

1. Instala dependencias:

```bash
npm install
```

2. Copia variables de entorno:

```bash
cp .env.example .env.local
```

3. Configura `DATABASE_URL` y `OPENAI_API_KEY` en `.env.local`.

4. Genera cliente Prisma:

```bash
npm run prisma:generate
```

5. Ejecuta migración inicial:

```bash
npm run prisma:migrate -- --name init
```

6. Arranca en desarrollo:

```bash
npm run dev
```

## MVP incluido

- Crear página.
- Selección de micrófono y grabación por chunks.
- Transcripción progresiva por endpoint `/api/transcribe`.
- Resumen IA por endpoint `/api/summarize`.
- Editor TipTap y panel editable de transcripción.
- Guardado persistente en PostgreSQL con Prisma.

## Notas técnicas

- El endpoint `/api/transcribe` recibe `FormData` con `chunk` y lo envía a Whisper.
- El endpoint `/api/summarize` exige JSON estructurado para poblar el bloque IA editable.
- La UI es minimalista, con espacios amplios y color acento sutil.
codex/create-fullstack-application-asclepio-tw427c


## Nota sobre GitHub Pages

Este proyecto es una app de Next.js (no un sitio estático Vite).
Si abres `index.html` directamente en un hosting estático verás una página informativa.
La app real se ejecuta con runtime de Next (`npm run dev` / `next start`).
=======
main
