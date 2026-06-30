import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  GraduationCap,
  Home,
  Radio,
  Stethoscope,
} from 'lucide-react'

export interface NavChild {
  path: string
  label: string
}

export interface NavFamily {
  id: string
  label: string
  path: string
  icon: LucideIcon
  description: string
  children?: NavChild[]
}

/** Lean sidebar: 5 familias. Los hijos aparecen como sub-nav al entrar. */
export const navFamilies: NavFamily[] = [
  {
    id: 'home',
    label: 'Inicio',
    path: '/app',
    icon: Home,
    description: 'Resumen del día y accesos rápidos',
  },
  {
    id: 'briefing',
    label: 'Inteligencia diaria',
    path: '/app/briefing',
    icon: Radio,
    description: 'Guías, congresos y evidencia cada mañana',
    children: [
      { path: '/app/briefing', label: 'Resumen de hoy' },
      { path: '/app/briefing/citados', label: 'Alta citación' },
    ],
  },
  {
    id: 'clinical',
    label: 'Clínico',
    path: '/app/ronda',
    icon: Stethoscope,
    description: 'Rondas con paciente y consultas con evidencia',
    children: [
      { path: '/app/ronda', label: 'Ronda' },
      { path: '/app/consulta', label: 'Consulta' },
    ],
  },
  {
    id: 'library',
    label: 'Biblioteca',
    path: '/app/biblioteca',
    icon: BookOpen,
    description: 'Papers, presentaciones, cuestionarios y podcasts por búsqueda',
    children: [
      { path: '/app/biblioteca', label: 'Papers' },
      { path: '/app/biblioteca/presentaciones', label: 'Presentaciones' },
      { path: '/app/biblioteca/cuestionarios', label: 'Cuestionarios' },
      { path: '/app/biblioteca/podcasts', label: 'Podcasts' },
    ],
  },
  {
    id: 'study',
    label: 'Estudio',
    path: '/app/tareas',
    icon: GraduationCap,
    description: 'Planes de manejo citados desde tus búsquedas',
    children: [
      { path: '/app/tareas', label: 'Planes de manejo' },
    ],
  },
]

export function getFamilyForPath(pathname: string): NavFamily | undefined {
  if (pathname === '/app' || pathname === '/app/') {
    return navFamilies.find((f) => f.id === 'home')
  }
  if (pathname.startsWith('/app/perfil') || pathname.startsWith('/app/ayuda')) {
    return undefined
  }
  return navFamilies.find((family) => {
    if (family.id === 'home') return false
    if (pathname === family.path || pathname.startsWith(`${family.path}/`)) return true
    return family.children?.some((c) => pathname === c.path || pathname.startsWith(`${c.path}/`))
  })
}

export function isFamilyActive(family: NavFamily, pathname: string): boolean {
  if (family.id === 'home') return pathname === '/app' || pathname === '/app/'
  if (family.id === 'library') {
    return pathname === family.path || pathname.startsWith(`${family.path}/`)
  }
  if (pathname === family.path) return true
  if (family.children?.some((c) => pathname === c.path || pathname.startsWith(`${c.path}/`))) {
    return true
  }
  return pathname.startsWith(`${family.path}/`)
}

/** @deprecated Use navFamilies */
export const appNavItems = navFamilies.flatMap((f) => {
  if (!f.children) {
    return [{ path: f.path, label: f.label, section: f.label, description: f.description, mockStatus: 'ready' as const }]
  }
  return f.children.map((c) => ({
    path: c.path,
    label: c.label,
    section: f.label,
    description: f.description,
    mockStatus: 'ready' as const,
  }))
})

/** @deprecated Use libraryPapers from mock-app-data.ts */
export { libraryPapers as mockPapers } from '@/lib/mock-app-data'
