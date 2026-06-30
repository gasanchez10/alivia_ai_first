interface SlideInput {
  title: string
  clinicalQuestion: string
  patientLabel: string
  papers: { title: string; pmid: string; journal: string }[]
  slideCount: number
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s-áéíóúñÁÉÍÓÚÑ]/g, '').replace(/\s+/g, '-').slice(0, 60)
}

function buildSlides(input: SlideInput): { title: string; body: string }[] {
  const slides: { title: string; body: string }[] = [
    {
      title: input.title,
      body: `${input.clinicalQuestion}\n\n${input.patientLabel}`,
    },
    {
      title: 'Pregunta clínica',
      body: input.clinicalQuestion,
    },
    {
      title: 'Caso / paciente',
      body: input.patientLabel,
    },
  ]

  input.papers.forEach((p, i) => {
    slides.push({
      title: `Evidencia ${i + 1}`,
      body: `${p.title}\n${p.journal} · PMID ${p.pmid}`,
    })
  })

  slides.push({
    title: 'Conclusión',
    body: 'Recomendación citada con PMIDs verificables. Generado por Alivia.',
  })

  return slides.slice(0, input.slideCount)
}

function buildHtmlDeck(slides: { title: string; body: string }[], title: string): string {
  const slideHtml = slides
    .map(
      (s, i) => `
    <section class="slide">
      <p class="meta">Diapositiva ${i + 1} de ${slides.length}</p>
      <h2>${s.title}</h2>
      <p>${s.body.replace(/\n/g, '<br/>')}</p>
    </section>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #1e1033; color: #fff; }
    .slide { min-height: 100vh; padding: 3rem; box-sizing: border-box; border-bottom: 1px solid #5b3a8c; }
    .meta { opacity: 0.7; font-size: 0.85rem; }
    h2 { font-size: 1.75rem; margin: 1rem 0; }
    p { line-height: 1.6; max-width: 42rem; }
    @media print { .slide { page-break-after: always; min-height: auto; } }
  </style>
</head>
<body>
  ${slideHtml}
</body>
</html>`
}

export function downloadPresentation(input: SlideInput): void {
  const slides = buildSlides(input)
  const html = buildHtmlDeck(slides, input.title)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(input.title)}.html`
  link.click()
  URL.revokeObjectURL(url)
}
