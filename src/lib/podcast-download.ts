import type { EvidenceToolkitContext, PodcastLocale, PodcastVersion } from '@/lib/evidence-toolkit'

interface PodcastDownloadInput {
  context: EvidenceToolkitContext
  script: string
  locale: PodcastLocale
  version: PodcastVersion
  durationMin: number
  pmids: string[]
}

function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 48)
}

function buildBaseName(input: PodcastDownloadInput): string {
  const slug = sanitizeFilename(input.context.clinicalQuestion)
  return `alivia-podcast-${input.locale}-${input.version}-${slug}`
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** WAV corto (~3 s) como audio simulado del episodio. */
function synthesizePodcastWav(durationSeconds = 3): ArrayBuffer {
  const sampleRate = 22050
  const numSamples = Math.floor(sampleRate * durationSeconds)
  const dataSize = numSamples * 2
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i))
  }

  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, dataSize, true)

  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate
    const intro = Math.exp(-t * 1.2)
    const tone = Math.sin(2 * Math.PI * 220 * t) * 0.12 * intro
    const sample = Math.max(-1, Math.min(1, tone))
    view.setInt16(44 + i * 2, sample * 0x7fff, true)
  }

  return buffer
}

function buildTranscript(input: PodcastDownloadInput): string {
  const localeLabel = { es: 'Español', en: 'English', pt: 'Português' }[input.locale]
  const versionLabel = input.version === 'lite' ? 'Lite' : 'Full'

  return [
    'ALIVIA — Podcast clínico',
    `Idioma: ${localeLabel}`,
    `Versión: ${versionLabel}`,
    `Duración estimada: ~${input.durationMin} min`,
    `Fuente: ${input.context.sourceLabel}`,
    `Paciente: ${input.context.patientLabel}`,
    `Pregunta: ${input.context.clinicalQuestion}`,
    `PMIDs: ${input.pmids.join(', ')}`,
    '',
    '--- Guion ---',
    input.script,
    '',
    'Generado por Alivia. Audio simulado para demo.',
  ].join('\n')
}

export function downloadPodcast(input: PodcastDownloadInput): void {
  const base = buildBaseName(input)

  const wavBytes = synthesizePodcastWav(3)
  triggerDownload(new Blob([wavBytes], { type: 'audio/wav' }), `${base}.wav`)

  const transcript = buildTranscript(input)
  triggerDownload(new Blob([transcript], { type: 'text/plain;charset=utf-8' }), `${base}-guion.txt`)
}
