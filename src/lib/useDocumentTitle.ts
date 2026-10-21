import { useEffect } from 'react'

const SITE = 'Kirabo Catering Services (independent concept)'
const DEFAULT_DESCRIPTION = 'An independent website concept for Kirabo Catering Services: sample menus, a dish shortlist and a demo catering quote. Not the official website; images are AI-generated illustrations and forms send nothing.'

export function useDocumentTitle(title: string | null, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} · Good food, generous hospitality`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
