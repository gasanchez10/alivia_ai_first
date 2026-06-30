export type Locale = 'es' | 'en'

export const defaultLocale: Locale = 'es'

type Dict = Record<string, string>

export const dict: Record<Locale, Dict> = {
  es: {
    'nav.howItWorks': 'Cómo funciona',
    'nav.product': 'Producto',
    'nav.pricing': 'Precios',
    'nav.faq': 'Preguntas',
    'nav.join': 'Únete a la lista',
    'nav.login': 'Iniciar sesión',
    'nav.demo': 'Probar demo',

    'hero.eyebrow': 'PARA RESIDENTES Y ESTUDIANTES DE MEDICINA',
    'hero.title': 'Guías, congresos y evidencia — listos cada mañana.',
    'hero.subtitle':
      'Alivia escucha tus rondas, busca en PubMed por ti, y te dice exactamente qué estudiar esta noche. En español. Con citas reales.',
    'hero.cta.primary': 'Únete a la lista',
    'hero.cta.secondary': 'Ver en 90 segundos',
    'hero.counter.prefix': 'Ya somos',
    'hero.counter.suffix': 'médicos en formación en la lista de espera',
    'hero.trust':
      'Citas reales de PubMed · Cero alucinaciones · Gratis para estudiantes verificados',

    'trust.title': 'Residentes y estudiantes de estas universidades ya usan Alivia',
    'trust.disclaimer':
      'Los logos identifican la institución de usuarios suscritos. No representan alianza, patrocinio ni endoso institucional en este momento. Las marcas pertenecen a sus respectivos titulares.',

    'pain.title': '¿Te suena familiar? Así se ve una semana en residencia.',
    'pain.subtitle':
      'Son cinco escenas de tu semana. Cada una podría empezar con tu briefing listo, un plan por paciente y 12 minutos de audio en el trayecto.',

    'encounter.eyebrow': 'LA RONDA',
    'encounter.title': 'De la ronda al plan con evidencia citada, en ~90 segundos.',
    'encounter.body':
      'Graba la ronda, sube un audio o pega el texto del caso. Alivia transcribe si hace falta, identifica términos MeSH y no-MeSH, y busca en PubMed en tiempo real.',
    'encounter.body2':
      'Tú eliges qué papers usar. Con esas fuentes arma el plan de manejo del paciente o caso y tu plan de estudio — lecturas, respuesta citada y quiz para esta noche.',
    'encounter.image.bedside': 'En la ronda',
    'encounter.image.bedside.caption': 'Graba, sube audio o pega texto. Transcripción automática con consentimiento.',
    'encounter.image.study': 'Esta noche',
    'encounter.image.study.caption': 'Tu lista de estudio ya viene con respuestas, artículos y un quiz — no otra noche empezando de cero con el portátil y el café.',
    'encounter.step1.title': 'Tu entrada: grabar, subir o escribir',
    'encounter.step1.body': 'Tres formas de empezar: grabación en la ronda, archivo de audio que ya tengas, o texto del caso. Todo converge en el mismo flujo.',
    'encounter.step2.title': 'Términos clínicos',
    'encounter.step2.body': 'A partir de tu entrada, Alivia genera los términos MeSH y asociados que alimentan la búsqueda en PubMed.',
    'encounter.step3.title': 'Elige tus papers',
    'encounter.step3.body':
      'Revisa la lista de artículos y marca solo los que quieres usar para responder la tarea y fundamentar los planes.',
    'encounter.step4.title': 'Plan de manejo y de estudio',
    'encounter.step4.body':
      'Con las fuentes aprobadas: plan citado para el paciente o caso, más lecturas y quiz para cerrar la tarea del especialista.',

    'library.eyebrow': 'LA BIBLIOTECA',
    'library.title': 'Cada artículo que tocas, en un solo lugar.',
    'library.body':
      'Guarda cada paper que usas. Marca como leído, genera podcast, arma cuestionarios, presentaciones con citas o chatea con el artículo — todo desde un solo lugar.',

    'briefing.eyebrow': 'EL BRIEFING',
    'briefing.title': 'Tus 12 minutos de audio para el bus.',
    'briefing.body':
      'Cada mañana llega lo esencial de tu especialidad: artículos nuevos, próximos congresos y guías que cambiaron. Léelo en 5 minutos o escúchalo en 12 en el bus.',

    'vs.title': 'Lo que las otras herramientas no pueden ser para ti',
    'vs.subtitle':
      'La IA genérica alucina citas que parecen reales. En un paciente, eso no es un error — es un daño.',

    'offer.title': 'Los primeros 50 reciben Premium gratis de por vida.',
    'offer.body': 'Verificamos tu correo de la universidad o el hospital. Únete antes de que se acaben.',
    'offer.cta': 'Reservar mi cupo',
    'offer.eyebrow': 'Cohorte fundadora · Preventa',
    'offer.spotsLabel': 'Cupos disponibles',
    'offer.spotsRemaining': 'Quedan {count} de {total}',
    'offer.spotsClaimed': '{claimed} de {total} ya reservados',
    'offer.verified': 'Solo correos @universidad o @hospital',
    'offer.urgency': 'Se están llenando rápido — el siguiente congreso no espera.',
    'offer.lifetime': 'Premium de por vida · $0',

    'pricing.title': 'Diseñado para tu billetera de residente.',
    'pricing.subtitle':
      '15 días gratis con lo esencial. Pro completo por $9.99/mes.',
    'pricing.note': 'Precios preliminares. Los primeros 50 inscritos no pagan, nunca.',
    'pricing.matrixTitle': 'Todo lo que incluye cada plan',
    'pricing.matrixHint': 'Prueba y Estudiante fundador comparten las funciones básicas. Pro desbloquea el flujo clínico completo. Toca o pasa el cursor sobre ℹ️ para ver el detalle.',
    'pricing.matrixFeature': 'Función',
    'pricing.featureMoreInfo': 'Más información sobre',
    'pricing.included': 'Incluido',
    'pricing.notIncluded': 'No incluido',

    'faq.title': 'Preguntas frecuentes',

    'form.title': 'Únete a la lista',
    'form.subtitle': 'Te avisamos cuando abramos tu cohorte. Sin spam.',
    'form.submit': 'Reservar mi acceso',
    'form.success': '¡Estás dentro! Te escribimos cuando abramos tu cohorte.',

    'footer.copyright': '© 2026 Alivia AI S.A.S · Bogotá, Colombia',

    'auth.login.title': 'Bienvenido de vuelta',
    'auth.login.submit': 'Entrar',
    'auth.register.title': 'Crea tu cuenta',
    'auth.register.submit': 'Registrarme',
    'auth.email': 'Correo universitario o del hospital',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre completo',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.mockNote': 'Demo sin backend — los datos se guardan en tu navegador.',
  },
  en: {
    'nav.howItWorks': 'How it works',
    'nav.product': 'Product',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.join': 'Join waitlist',
    'nav.login': 'Log in',
    'nav.demo': 'Try demo',

    'hero.eyebrow': 'FOR MEDICAL RESIDENTS & STUDENTS',
    'hero.title': 'Guidelines, congresses, and evidence — ready every morning.',
    'hero.subtitle':
      'Alivia listens to your rounds, searches PubMed for you, and tells you exactly what to study tonight. In Spanish. With real citations.',
    'hero.cta.primary': 'Join the waitlist',
    'hero.cta.secondary': 'See it in 90 seconds',
    'hero.counter.prefix': 'Already',
    'hero.counter.suffix': 'medical trainees on the waitlist',
    'hero.trust':
      'Real PubMed citations · Zero hallucinations · Free for verified students',

    'trust.title': 'Trainees from these universities are already on Alivia',
    'trust.disclaimer':
      'Logos identify the home institution of subscribed users. They do not represent a partnership, sponsorship, or institutional endorsement at this time. Marks belong to their respective owners.',

    'pain.title': 'Sound familiar? This is what a week in residency looks like.',
    'pain.subtitle':
      'Five scenes from your week. Each one could start with your briefing done, a plan per patient, and 12 minutes of audio on your commute.',

    'encounter.eyebrow': 'ROUNDS',
    'encounter.title': 'From rounds to a sourced clinical plan, in ~90 seconds.',
    'encounter.body':
      'Record the round, upload audio, or paste case text. Alivia transcribes when needed, identifies MeSH and non-MeSH terms, and searches PubMed in real time.',
    'encounter.body2':
      'You choose which papers to use. From those sources it builds the patient or case management plan and your study plan — readings, cited answer, and quiz for tonight.',
    'encounter.image.bedside': 'On rounds',
    'encounter.image.bedside.caption': 'Record, upload audio, or paste text. Automatic transcription with consent.',
    'encounter.image.study': 'Tonight',
    'encounter.image.study.caption': 'Your study list arrives with answers, papers, and a quiz — not another night starting from scratch with your laptop and coffee.',
    'encounter.step1.title': 'Your input: record, upload, or type',
    'encounter.step1.body': 'Three ways to start: record on rounds, an audio file you already have, or case text. Everything flows through the same pipeline.',
    'encounter.step2.title': 'Clinical terms',
    'encounter.step2.body': 'From your input, Alivia generates MeSH and related terms that power the PubMed search.',
    'encounter.step3.title': 'Choose your papers',
    'encounter.step3.body':
      'Review the article list and select only the sources you want for answering the task and building the plans.',
    'encounter.step4.title': 'Management & study plans',
    'encounter.step4.body':
      'With approved sources: a cited plan for the patient or case, plus readings and a quiz to close the specialist’s task.',

    'library.eyebrow': 'THE LIBRARY',
    'library.title': 'Every paper you touch, in one place.',
    'library.body':
      'Save every paper you use. Mark as read, generate podcasts, build quizzes, cited slides, or chat with the article — all from one place.',

    'briefing.eyebrow': 'THE BRIEFING',
    'briefing.title': 'Your 12 minutes of audio for the commute.',
    'briefing.body':
      'Every morning you get what matters in your specialty: new papers, upcoming congresses, and guidelines that changed. Read it in 5 minutes or listen in 12 on your commute.',

    'vs.title': "What other tools can't be for you",
    'vs.subtitle':
      "General AI hallucinates citations that look real. On a patient, that's not a typo — it's harm.",

    'offer.title': 'The first 50 sign-ups get Premium free forever.',
    'offer.body': 'We verify your university or hospital email. Join before spots run out.',
    'offer.cta': 'Claim my spot',
    'offer.eyebrow': 'Founder cohort · Pre-launch',
    'offer.spotsLabel': 'Spots left',
    'offer.spotsRemaining': '{count} of {total} remaining',
    'offer.spotsClaimed': '{claimed} of {total} already claimed',
    'offer.verified': 'University or hospital email only',
    'offer.urgency': 'Filling fast — don’t wait for the next congress.',
    'offer.lifetime': 'Lifetime Premium · $0',

    'pricing.title': "Built for a resident's wallet.",
    'pricing.subtitle':
      '15-day free trial with essentials. Full Pro at $9.99/mo.',
    'pricing.note': 'Indicative pricing. The first 50 sign-ups pay nothing, ever.',
    'pricing.matrixTitle': 'Everything in each plan',
    'pricing.matrixHint': 'Trial and Founding Student share basic features. Pro unlocks the full clinical workflow. Hover or tap ℹ️ for details.',
    'pricing.matrixFeature': 'Feature',
    'pricing.featureMoreInfo': 'More about',
    'pricing.included': 'Included',
    'pricing.notIncluded': 'Not included',

    'faq.title': 'Frequently asked questions',

    'form.title': 'Join the waitlist',
    'form.subtitle': "We'll write you when your cohort opens. No spam.",
    'form.submit': 'Claim my access',
    'form.success': "You're in! We'll reach out when your cohort opens.",

    'footer.copyright': '© 2026 Alivia AI S.A.S · Bogotá, Colombia',

    'auth.login.title': 'Welcome back',
    'auth.login.submit': 'Log in',
    'auth.register.title': 'Create your account',
    'auth.register.submit': 'Sign up',
    'auth.email': 'University or hospital email',
    'auth.password': 'Password',
    'auth.name': 'Full name',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.mockNote': 'Demo without backend — data stored in your browser.',
  },
}

export function t(locale: Locale, key: string): string {
  return dict[locale][key] ?? key
}

export const painScenes = {
  es: [
    { time: 'Lunes 5:30 am', scene: 'Pre-rondas con 12 pacientes', body: 'Necesitas un plan con evidencia para cada uno antes de las 7. Alivia te lo arma en minutos.' },
    { time: 'Martes 11 pm', scene: 'Mañana expones el caso. Son las 11 de la noche.', body: 'El NEJM sin leer. MinSalud en el tintero. Alivia te resume ambos y deja la presentación lista antes de que cierres el portátil.' },
    { time: 'Miércoles 9:15 am', scene: 'El especialista te pregunta algo y no recuerdas', body: 'Alivia capturó la pregunta y te tiene la respuesta citada a las 6 pm.' },
    { time: 'Jueves 6:30 pm', scene: '90 minutos en TransMilenio', body: 'Alivia convirtió el artículo de hoy en un podcast de 12 minutos.' },
    { time: 'Sábado · Examen en 3 meses', scene: 'El examen se acerca. Miles de temas por cubrir.', body: 'Tu plan debería seguir tu carrera, tu año y tu especialidad — no un mazo AnKi en inglés que no calza con tu currículo.' },
  ],
  en: [
    { time: 'Monday 5:30 am', scene: 'Pre-rounds with 12 patients', body: 'Evidence-backed plans needed before 7. Alivia drafts them in minutes.' },
    { time: 'Tuesday 11 pm', scene: "You present tomorrow. It's 11 pm.", body: 'NEJM unread. MinSalud still pending. Alivia summarizes both and gets your slides ready before you shut your laptop.' },
    { time: 'Wednesday 9:15 am', scene: 'The specialist asks — you blank', body: 'Alivia captured the question and has the cited answer at 6 pm.' },
    { time: 'Thursday 6:30 pm', scene: '90 minutes on the bus', body: "Alivia turned today's paper into a 12-minute podcast." },
    { time: 'Saturday · Exam in 3 months', scene: 'The exam is coming. Thousands of topics to cover.', body: 'Your study plan should match your year, specialty, and curriculum — not an English Anki deck that was never built for you.' },
  ],
}


export const faqItems = {
  es: [
    { q: '¿Alivia alucina?', a: 'No genera afirmaciones clínicas sin un PMID que las respalde. Cero citas inventadas.' },
    { q: '¿Mis pacientes están seguros?', a: 'Grabación con consentimiento, anonimización y eliminación. Cumplimos Ley 1581/2012.' },
    { q: '¿En qué especialidades funciona?', a: 'Interna, pediatría, ginecología, cirugía y medicina familiar al lanzamiento.' },
    { q: '¿Funciona en mi teléfono?', a: 'Sí — PWA en iOS, Android y desktop.' },
    { q: '¿Cuándo abren?', a: 'Preventa. Los primeros 50 → cohorte fundadora con Premium gratis.' },
  ],
  en: [
    { q: 'Does Alivia hallucinate?', a: "No clinical claim without a PMID. Zero made-up citations." },
    { q: 'Are my patients safe?', a: 'Consent, anonymization, deletion. Colombia Ley 1581/2012 compliant.' },
    { q: 'Which specialties?', a: 'Internal medicine, pediatrics, OB/GYN, surgery, family medicine at launch.' },
    { q: 'Does it work on my phone?', a: 'Yes — PWA on iOS, Android, and desktop.' },
    { q: 'When do you open?', a: 'Pre-launch. First 50 → founder cohort with free Premium.' },
  ],
}

export const yearOptions = [
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'Internado', 'R1', 'R2', 'R3', 'R4', 'Fellow',
]

export const countryOptions = [
  'Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'España', 'Estados Unidos', 'Otro',
]
