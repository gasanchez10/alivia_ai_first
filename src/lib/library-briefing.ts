import type { LucideIcon } from 'lucide-react'
import {
  BookMarked,
  CalendarDays,
  FileText,
  Headphones,
  MessageCircle,
  Mic,
  Newspaper,
  Presentation,
  HelpCircle,
} from 'lucide-react'

export const libraryImage = '/images/pain/night-study.jpg'
export const briefingImage = '/images/hero-briefing.jpg'

export const libraryFeatures: Record<
  'es' | 'en',
  { label: string; icon: LucideIcon }[]
> = {
  es: [
    { label: 'Marcar leído', icon: BookMarked },
    { label: 'Podcast', icon: Mic },
    { label: 'Cuestionario', icon: HelpCircle },
    { label: 'Presentación', icon: Presentation },
    { label: 'Chat', icon: MessageCircle },
  ],
  en: [
    { label: 'Mark read', icon: BookMarked },
    { label: 'Podcast', icon: Mic },
    { label: 'Quiz', icon: HelpCircle },
    { label: 'Slides', icon: Presentation },
    { label: 'Chat', icon: MessageCircle },
  ],
}

export const briefingFeatures: Record<
  'es' | 'en',
  { label: string; icon: LucideIcon }[]
> = {
  es: [
    { label: 'Artículos nuevos', icon: Newspaper },
    { label: 'Congresos', icon: CalendarDays },
    { label: 'Guías', icon: FileText },
    { label: '12 min audio', icon: Headphones },
  ],
  en: [
    { label: 'New papers', icon: Newspaper },
    { label: 'Congresses', icon: CalendarDays },
    { label: 'Guidelines', icon: FileText },
    { label: '12 min audio', icon: Headphones },
  ],
}

/** Evenly spaced angles (degrees), starting at top (-90°). */
export function orbitAngles(count: number): number[] {
  const step = 360 / count
  return Array.from({ length: count }, (_, i) => -90 + step * i)
}

export function polarPosition(angleDeg: number, radiusPercent: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    left: `${50 + radiusPercent * Math.cos(rad)}%`,
    top: `${50 + radiusPercent * Math.sin(rad)}%`,
  }
}
