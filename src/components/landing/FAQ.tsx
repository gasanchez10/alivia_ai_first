import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Container, Section } from '@/components/ui/Container'
import { useLocale } from '@/context/LocaleContext'
import { faqItems, t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function FAQ() {
  const { locale } = useLocale()
  const items = faqItems[locale]
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" alt>
      <Container>
        <h2 className="text-center font-display text-3xl font-semibold text-ink">
          {t(locale, 'faq.title')}
        </h2>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-lilac/30">
          {items.map((item, i) => (
            <div key={i} className="py-4">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-ink">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={cn('shrink-0 text-plum transition', open === i && 'rotate-180')}
                />
              </button>
              {open === i && <p className="mt-3 text-plum/85">{item.a}</p>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
