import { useState } from 'react'
import { ChevronDown, MessageCircle, Mail } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import { helpFaq } from '@/lib/mock-app-data'
import { cn } from '@/lib/utils'

export function AyudaPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        section="Cuenta"
        title="Ayuda"
        description="Preguntas frecuentes, contacto y soporte para residentes LATAM."
      />

      <AppCard className="mb-6 border-violet/20 bg-violet/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-ink">¿Necesitas ayuda humana?</p>
            <p className="mt-1 text-sm text-plum/70">Respondemos en horario LATAM · español</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <MessageCircle size={18} /> WhatsApp
            </Button>
            <Button variant="secondary">
              <Mail size={18} /> Email
            </Button>
          </div>
        </div>
      </AppCard>

      <div className="space-y-2">
        {helpFaq.map((item, i) => (
          <AppCard key={item.q} className="!p-0 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="font-medium text-ink">{item.q}</span>
              <ChevronDown
                size={18}
                className={cn('shrink-0 text-plum/50 transition', open === i && 'rotate-180')}
              />
            </button>
            {open === i && (
              <div className="border-t border-lilac/20 px-5 py-4 text-sm leading-relaxed text-plum/85">
                {item.a}
              </div>
            )}
          </AppCard>
        ))}
      </div>
    </div>
  )
}
