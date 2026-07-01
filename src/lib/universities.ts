import { publicUrl } from '@/lib/utils'

/** Universities with subscribed users on Alivia (logos for trust strip only — not partnerships). */
export const trustUniversities = [
  {
    src: publicUrl('/logos/unal.svg'),
    name: 'Universidad Nacional de Colombia',
    short: 'UNAL',
  },
  {
    src: publicUrl('/logos/javeriana.svg'),
    name: 'Pontificia Universidad Javeriana',
    short: 'Javeriana',
  },
  {
    src: publicUrl('/logos/uniandes.svg'),
    name: 'Universidad de los Andes',
    short: 'Uniandes',
  },
  {
    src: publicUrl('/logos/bosque.svg'),
    name: 'Universidad El Bosque',
    short: 'El Bosque',
  },
  {
    src: publicUrl('/logos/udea.svg'),
    name: 'Universidad de Antioquia',
    short: 'UdeA',
  },
] as const
