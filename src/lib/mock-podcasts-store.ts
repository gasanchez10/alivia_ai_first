import type { PodcastLocale, PodcastVersion } from '@/lib/evidence-toolkit'
import type { LibrarySearchContext } from '@/lib/library-search-context'

export interface StoredPodcast {
  id: string
  locale: PodcastLocale
  version: PodcastVersion
  durationMin: number
  script: string
  searchContext: LibrarySearchContext
  createdAt: string
}

const PODCASTS_KEY = 'alivia.mock.podcasts'

function load(): StoredPodcast[] {
  try {
    const raw = localStorage.getItem(PODCASTS_KEY)
    return raw ? (JSON.parse(raw) as StoredPodcast[]) : []
  } catch {
    return []
  }
}

function save(items: StoredPodcast[]) {
  localStorage.setItem(PODCASTS_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('alivia-library-updated'))
}

export function getStoredPodcasts(): StoredPodcast[] {
  return load()
}

export function savePodcastFromSearch(params: {
  locale: PodcastLocale
  version: PodcastVersion
  durationMin: number
  script: string
  searchContext: LibrarySearchContext
}): StoredPodcast {
  const item: StoredPodcast = {
    id: `pod-${crypto.randomUUID().slice(0, 8)}`,
    ...params,
    createdAt: new Date().toISOString(),
  }
  save([item, ...load()])
  return item
}
