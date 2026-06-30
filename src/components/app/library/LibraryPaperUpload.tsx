import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import { addPaperToLibrary } from '@/lib/mock-library-store'

interface LibraryPaperUploadProps {
  onAdded: (pmid: string) => void
}

export function LibraryPaperUpload({ onAdded }: LibraryPaperUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [pmid, setPmid] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    const value = pmid.trim()
    if (!value && !fileName) {
      setError('Indica un PMID o sube un archivo PDF.')
      return
    }
    setError('')
    setLoading(true)
    await new Promise((r) => window.setTimeout(r, 700))
    const resolvedPmid = value || `UP${Date.now().toString().slice(-8)}`
    const added = addPaperToLibrary({ pmid: resolvedPmid, uploadFileName: fileName ?? undefined })
    setLoading(false)
    if (!added) return
    setPmid('')
    setFileName(null)
    if (fileRef.current) fileRef.current.value = ''
    onAdded(added.pmid)
  }

  return (
    <AppCard className="border-dashed border-violet/30 bg-violet/5">
      <p className="text-xs font-bold uppercase tracking-widest text-mauve">Subir paper</p>
      <p className="mt-1 text-sm text-plum/70">
        Añade por PMID o sube un PDF — quedará disponible para quiz, podcast, chat y presentación.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label className="text-xs font-medium text-plum">PMID</label>
          <input
            type="text"
            inputMode="numeric"
            value={pmid}
            onChange={(e) => setPmid(e.target.value)}
            placeholder="Ej. 38472910"
            className="mt-1 w-full rounded-xl border border-lilac/40 bg-white px-3 py-2 text-sm focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/20"
          />
        </div>
        <div className="min-w-0 flex-1">
          <label className="text-xs font-medium text-plum">PDF (opcional)</label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            className="mt-1 w-full text-sm text-plum/80 file:mr-2 file:rounded-lg file:border-0 file:bg-violet/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-violet"
          />
        </div>
        <Button className="shrink-0" onClick={() => void submit()} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Subiendo…
            </>
          ) : (
            <>
              <Upload size={16} /> Añadir
            </>
          )}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-plum/50">
        Prueba con PMID <strong>38472910</strong> o <strong>38291044</strong> del catálogo demo.
      </p>
    </AppCard>
  )
}
