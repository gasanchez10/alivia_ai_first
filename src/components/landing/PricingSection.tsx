import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Check, Minus } from 'lucide-react'
import { Container, Section } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/i18n'
import {
  TIER_COLUMNS,
  featureIncluded,
  featuresByCategory,
  pricingPlans,
} from '@/lib/pricing-features'
import { cn } from '@/lib/utils'
import { FeatureTooltip } from '@/components/ui/FeatureTooltip'

export function PricingSection() {
  const { locale } = useLocale()
  const plans = pricingPlans[locale]
  const grouped = featuresByCategory(locale)

  return (
    <Section id="precios">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            {t(locale, 'pricing.title')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-plum/80">{t(locale, 'pricing.subtitle')}</p>
          <p className="mt-2 text-sm text-plum/60">{t(locale, 'pricing.note')}</p>
        </div>

        {/* Plan cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-2xl border p-6',
                plan.highlight
                  ? 'border-violet bg-gradient-to-b from-violet/8 to-white shadow-lg shadow-violet/15 ring-1 ring-violet/20'
                  : 'border-lilac/30 bg-white',
              )}
            >
              {plan.badge && (
                <span
                  className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide',
                    plan.highlight ? 'bg-violet text-white' : 'bg-lilac-100 text-plum',
                  )}
                >
                  {plan.badge}
                </span>
              )}

              <h3 className="font-display text-xl font-semibold text-ink">{plan.name}</h3>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-violet">{plan.price}</span>
                {plan.priceDetail && (
                  <span className="text-sm font-medium text-plum/70">{plan.priceDetail}</span>
                )}
              </div>

              <p className="mt-2 min-h-[2.5rem] text-sm leading-snug text-plum/70">{plan.note}</p>

              <Link to="/register" className="mt-auto pt-6">
                <Button
                  variant={plan.highlight ? 'primary' : 'secondary'}
                  className={cn('w-full', plan.highlight && 'shadow-md shadow-violet/20')}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Full feature matrix */}
        <div className="mt-16">
          <div className="text-center">
            <h3 className="font-display text-2xl font-semibold text-ink">
              {t(locale, 'pricing.matrixTitle')}
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-plum/70">
              {t(locale, 'pricing.matrixHint')}
            </p>
          </div>

          <div className="mt-8 overflow-x-auto overflow-y-visible rounded-2xl border border-lilac/30 bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-lilac/25 bg-bone/60">
                  <th className="sticky left-0 z-10 bg-bone/95 px-4 py-4 font-semibold text-ink backdrop-blur sm:px-6">
                    {t(locale, 'pricing.matrixFeature')}
                  </th>
                  {TIER_COLUMNS.map((tierId) => {
                    const plan = plans.find((p) => p.id === tierId)
                    return (
                      <th
                        key={tierId}
                        className={cn(
                          'px-3 py-4 text-center font-semibold',
                          tierId === 'pro' ? 'bg-violet/5 text-violet' : 'text-plum',
                        )}
                      >
                        <span className="block text-xs uppercase tracking-wide opacity-70">
                          {plan?.name}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {grouped.map(({ category, features }) => (
                  <Fragment key={category}>
                    <tr key={`cat-${category}`} className="border-b border-lilac/15 bg-lilac-50/50">
                      <td
                        colSpan={TIER_COLUMNS.length + 1}
                        className="sticky left-0 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-mauve sm:px-6"
                      >
                        {category}
                      </td>
                    </tr>
                    {features.map((feature) => (
                      <tr
                        key={feature.id}
                        className="border-b border-lilac/10 transition-colors hover:bg-bone/40"
                      >
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 sm:px-6 hover:bg-bone/40">
                          <FeatureTooltip
                            label={feature.name[locale]}
                            description={feature.tooltip[locale]}
                            moreInfoLabel={t(locale, 'pricing.featureMoreInfo')}
                          />
                        </td>
                        {TIER_COLUMNS.map((tierId) => {
                          const included = featureIncluded(feature, tierId)
                          return (
                            <td
                              key={tierId}
                              className={cn(
                                'px-3 py-3 text-center',
                                tierId === 'pro' && included && 'bg-violet/[0.03]',
                              )}
                            >
                              <span className="sr-only">
                                {included
                                  ? t(locale, 'pricing.included')
                                  : t(locale, 'pricing.notIncluded')}
                              </span>
                              {included ? (
                                <Check
                                  className="mx-auto text-green-600"
                                  size={18}
                                  strokeWidth={2.5}
                                  aria-hidden
                                />
                              ) : (
                                <Minus className="mx-auto text-gray-300" size={18} aria-hidden />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  )
}
