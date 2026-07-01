import { publicUrl } from '@/lib/utils'

/** Background images for pain vignettes — one per weekday scenario. */
export const painVignetteImages = [
  {
    src: publicUrl('/images/pain/pre-rounds.jpg'),
    altEs: 'Residente en pasillo del hospital al amanecer',
    altEn: 'Medical resident in a hospital corridor at dawn',
  },
  {
    src: publicUrl('/images/pain/night-study.jpg'),
    altEs: 'Estudio nocturno con café y artículos médicos',
    altEn: 'Late-night study with coffee and medical papers',
  },
  {
    src: publicUrl('/images/pain/bedside-rounds.jpg'),
    altEs: 'Ronda de pacientes con el especialista',
    altEn: 'Bedside rounds with the specialist',
  },
  {
    src: publicUrl('/images/pain/commute-audio.jpg'),
    altEs: 'Estudio en el transporte con audífonos',
    altEn: 'Studying during the commute with headphones',
  },
  {
    src: publicUrl('/images/pain/exam-prep.jpg'),
    altEs: 'Estudiante de medicina preparando el examen',
    altEn: 'Medical student preparing for board exams',
  },
] as const
