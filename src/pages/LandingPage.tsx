import { LandingNav } from '@/components/landing/LandingNav'
import { Hero } from '@/components/landing/Hero'
import { TrustStrip } from '@/components/landing/LandingFooter'
import { PainNarrative } from '@/components/landing/PainNarrative'
import { EncounterSection } from '@/components/landing/EncounterSection'
import { LibraryBriefing } from '@/components/landing/LibraryBriefing'
import { VsGenericAI } from '@/components/landing/VsGenericAI'
import { First50Offer } from '@/components/landing/First50Offer'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQ } from '@/components/landing/FAQ'
import { WaitlistForm } from '@/components/landing/WaitlistForm'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LocaleProvider } from '@/context/LocaleContext'

export function LandingPage() {
  return (
    <LocaleProvider>
      <LandingNav />
      <main className="landing-main">
        <Hero />
        <TrustStrip />
        <PainNarrative />
        <EncounterSection />
        <LibraryBriefing />
        <VsGenericAI />
        <First50Offer />
        <PricingSection />
        <FAQ />
        <WaitlistForm />
      </main>
      <LandingFooter />
    </LocaleProvider>
  )
}
