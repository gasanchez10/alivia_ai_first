import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Globe,
  Headphones,
  MessageCircle,
  Presentation,
  Search,
} from 'lucide-react'

export interface VsRow {
  task: string
  tagline: string
  description: string
  others: string
  alivia: string
  icon: LucideIcon
  image: string
  imageAlt: string
}

import { publicUrl } from '@/lib/utils'

const images = {
  evidence: publicUrl('/images/vs/evidence.jpg'),
  summarize: publicUrl('/images/vs/summarize.jpg'),
  journalClub: publicUrl('/images/vs/journal-club.jpg'),
  specialist: publicUrl('/images/vs/specialist.jpg'),
  commute: publicUrl('/images/vs/commute.jpg'),
  language: publicUrl('/images/vs/language.jpg'),
} as const

export const vsGenericImage = publicUrl('/images/vs/generic-ai.jpg')

export const vsComparison: Record<'es' | 'en', VsRow[]> = {
  es: [
    {
      task: 'Buscar evidencia',
      tagline: 'PubMed en vivo, desde tu paciente o tu pregunta clínica.',
      description:
        'Alivia extrae términos MeSH de la ronda, busca en PubMed en tiempo real y te muestra artículos con DOI clickeable. Tú eliges cuáles usar — sin salir de tu flujo ni perder la tarde en el buscador.',
      others: 'Fuentes a veces inventadas',
      alivia: 'PubMed en vivo con DOI',
      icon: Search,
      image: images.evidence,
      imageAlt: 'Residente buscando evidencia en artículos médicos',
    },
    {
      task: 'Resumir artículo',
      tagline: 'Del PDF al resumen citado en minutos.',
      description:
        'Sube o guarda un paper y Alivia genera un resumen estructurado con referencias, lo archiva en tu biblioteca y te deja marcarlo como leído, convertirlo en audio o repasarlo con un quiz.',
      others: 'Sin citas',
      alivia: 'Resumen citado + biblioteca',
      icon: BookOpen,
      image: images.summarize,
      imageAlt: 'Residente resumiendo un artículo con café',
    },
    {
      task: 'Club de revistas',
      tagline: 'Diapositivas citadas, listas para exponer.',
      description:
        'Arma tu club de revistas con diapositivas generadas solo de tu biblioteca o fuentes certificadas. Cada slide con su referencia — sin armar la bibliografía a mano la noche anterior.',
      others: '~30% citas alucinadas',
      alivia: '0% — solo fuentes certificadas',
      icon: Presentation,
      image: images.journalClub,
      imageAlt: 'Preparación de club de revistas con guías y congresos',
    },
    {
      task: 'Preguntas del especialista',
      tagline: 'Nada de lo que preguntó se pierde.',
      description:
        'Graba la ronda con el especialista y Alivia captura cada pregunta. Por la noche recibes respuestas con fuentes y un quiz personalizado — para llegar preparado a la siguiente exposición.',
      others: 'No lo hace',
      alivia: 'Captura + quiz nocturno',
      icon: MessageCircle,
      image: images.specialist,
      imageAlt: 'Ronda clínica con el especialista',
    },
    {
      task: 'Audio para el bus',
      tagline: 'Tu trayecto, convertido en estudio.',
      description:
        'Cualquier artículo o briefing se convierte en podcast o audiolibro de unos 12 minutos. Escucha en el TransMilenio, el metro o entre paciente y paciente — sin sacrificar la evidencia.',
      others: 'No',
      alivia: 'Podcast / audiolibro',
      icon: Headphones,
      image: images.commute,
      imageAlt: 'Residente escuchando un podcast en el trayecto',
    },
    {
      task: 'Idioma',
      tagline: 'Español nativo, pensado para LATAM.',
      description:
        'Guías MinSalud, congresos regionales y tono clínico escrito para residentes latinoamericanos — no una traducción de un producto pensado para médicos en EE.UU.',
      others: 'Traducción',
      alivia: 'Español nativo LATAM',
      icon: Globe,
      image: images.language,
      imageAlt: 'Médico en formación en un hospital de LATAM',
    },
  ],
  en: [
    {
      task: 'Find evidence',
      tagline: 'Live PubMed, from your patient or clinical question.',
      description:
        'Alivia extracts MeSH terms from your round or query, searches PubMed in real time, and shows papers with clickable DOIs. You pick which sources to use — without leaving your workflow or losing the afternoon in the browser.',
      others: 'Sometimes invented sources',
      alivia: 'Live PubMed with DOI',
      icon: Search,
      image: images.evidence,
      imageAlt: 'Resident searching medical literature for evidence',
    },
    {
      task: 'Summarize paper',
      tagline: 'From PDF to cited summary in minutes.',
      description:
        'Upload or save a paper and Alivia builds a structured summary with references, files it in your library, and lets you mark it read, turn it into audio, or review it with a quiz.',
      others: 'No citations',
      alivia: 'Cited summary + library',
      icon: BookOpen,
      image: images.summarize,
      imageAlt: 'Resident summarizing a paper with coffee',
    },
    {
      task: 'Journal club',
      tagline: 'Cited slides, ready to present.',
      description:
        'Build your journal club deck from your library or certified sources only. Every slide linked to its reference — no hand-assembling bibliographies the night before.',
      others: '~30% hallucinated citations',
      alivia: '0% — certified sources only',
      icon: Presentation,
      image: images.journalClub,
      imageAlt: 'Journal club prep with guidelines and congress materials',
    },
    {
      task: 'Specialist questions',
      tagline: 'Nothing your specialist asked gets lost.',
      description:
        'Record rounds with your specialist and Alivia captures every question. That night you get sourced answers and a personalized quiz — so you show up prepared for the next presentation.',
      others: "Doesn't",
      alivia: 'Capture + nightly quiz',
      icon: MessageCircle,
      image: images.specialist,
      imageAlt: 'Clinical rounds with the specialist',
    },
    {
      task: 'Commute audio',
      tagline: 'Your commute, turned into study time.',
      description:
        'Any article or briefing becomes a ~12-minute podcast or audiobook. Listen on the bus, metro, or between patients — without skipping the evidence.',
      others: 'No',
      alivia: 'Podcast / audiobook',
      icon: Headphones,
      image: images.commute,
      imageAlt: 'Resident listening to a podcast on the commute',
    },
    {
      task: 'Language',
      tagline: 'Native Spanish, built for LATAM.',
      description:
        'MinSalud guidelines, regional congresses, and clinical tone written for Latin American trainees — not a translation of a product built for US physicians.',
      others: 'Translation',
      alivia: 'Native Spanish LATAM',
      icon: Globe,
      image: images.language,
      imageAlt: 'Medical trainee in a LATAM hospital',
    },
  ],
}
