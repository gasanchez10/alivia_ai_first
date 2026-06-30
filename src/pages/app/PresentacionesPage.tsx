import { useEffect, useState } from 'react'
import { Presentation, Download, Plus, FileText } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import { getPresentations } from '@/lib/mock-presentations-store'
import { downloadPresentation } from '@/lib/presentation-download'
import type { Presentation as PresentationItem } from '@/lib/mock-app-data'
import { cn } from '@/lib/utils'

export function PresentacionesPage() {
  const [items, setItems] = useState<PresentationItem[]>(() => getPresentations())

  useEffect(() => {
    const refresh = () => setItems(getPresentations())
    window.addEventListener('alivia-presentations-updated', refresh)
    return () => window.removeEventListener('alivia-presentations-updated', refresh)
  }, [])

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        section="Biblioteca"
        title="Presentaciones"
        description="Diapositivas con citas para journal club y exposiciones — exporta PPTX. También puedes generarlas desde La Ronda o una consulta."
        action={
          <Button>
            <Plus size={18} /> Nueva presentación
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {items.map((pr) => (
          <AppCard key={pr.id} hover>
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-violet">
                <Presentation size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                    pr.status === 'listo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700',
                  )}
                >
                  {pr.status}
                </span>
                <h3 className="mt-2 font-semibold text-ink">{pr.title}</h3>
                <p className="mt-1 text-xs text-plum/60">
                  {pr.slides} diapositivas · PMID {pr.pmid} · {pr.updatedAt}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" className="!px-3 !py-2 text-sm">
                    <FileText size={16} /> Vista previa
                  </Button>
                  <Button
                    variant="secondary"
                    className="!px-3 !py-2 text-sm"
                    onClick={() =>
                      downloadPresentation({
                        title: pr.title,
                        clinicalQuestion: pr.title.replace(/^Presentación — /, ''),
                        patientLabel: 'Caso clínico Alivia',
                        papers: [{ title: pr.title, pmid: pr.pmid, journal: 'PubMed' }],
                        slideCount: pr.slides,
                      })
                    }
                  >
                    <Download size={16} /> Descargar
                  </Button>
                </div>
              </div>
            </div>
          </AppCard>
        ))}
      </div>

      <AppCard className="border-dashed border-violet/30 bg-violet/5">
        <p className="text-xs font-bold uppercase tracking-widest text-mauve">Vista previa simulada</p>
        <div className="mt-4 aspect-video rounded-xl bg-gradient-to-br from-plum to-violet p-6 text-white shadow-inner">
          <p className="text-xs opacity-80">Diapositiva 1 de 14</p>
          <h3 className="mt-4 font-display text-xl font-semibold">
            Anticoagulación en FA: evidencia 2024
          </h3>
          <p className="mt-2 text-sm opacity-90">PMID 38472910 · NEJM Meta-analysis</p>
        </div>
      </AppCard>
    </div>
  )
}
