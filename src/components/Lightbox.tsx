import { useCallback, useEffect, useRef, useState } from 'react'
import type { GalleryImage } from '../data/gallery'
import { useFocusTrap, useScrollLock } from '../lib/useFocusTrap'
import { srcSet } from './Img'
import { CONCEPT_CAPTION } from './Bits'
import { Icon } from './Icon'

/**
 * Full-screen viewer for a list of images. Pages with buttons, arrow keys or a horizontal
 * swipe, traps focus, closes on Escape and (through the focus trap) returns focus to the
 * thumbnail that opened it.
 */
export function Lightbox({ images, index, onIndex, onClose }: { images: GalleryImage[]; index: number; onIndex: (index: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const image = images[index]
  const [loaded, setLoaded] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useFocusTrap(ref, true, onClose)
  useScrollLock(true)

  const go = useCallback((delta: number) => {
    setLoaded(false)
    onIndex((index + delta + images.length) % images.length)
  }, [index, images.length, onIndex])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go])

  const single = images.length < 2

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" ref={ref}>
      <div className="lightbox__bar">
        <p className="lightbox__count" aria-live="polite">{index + 1} of {images.length}</p>
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close image viewer" data-autofocus>
          <Icon name="close" size={22} />
        </button>
      </div>
      <figure
        className="lightbox__figure"
        onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
        onTouchEnd={event => {
          const start = touchStart.current
          touchStart.current = null
          if (!start || single) return
          const dx = event.changedTouches[0].clientX - start.x
          const dy = event.changedTouches[0].clientY - start.y
          // Deliberate horizontal swipes only, so vertical scrolls and taps are ignored.
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
        }}
      >
        <div className={`lightbox__frame ${loaded ? 'is-loaded' : ''}`}>
          <img key={image.name} srcSet={srcSet(image.name)} sizes="(min-width: 1000px) 80vw, 100vw" alt={image.alt} onLoad={() => setLoaded(true)} />
          {!loaded && <span className="lightbox__loading">Loading image…</span>}
        </div>
        <figcaption className="lightbox__caption">
          {image.caption}
          <span>{CONCEPT_CAPTION}</span>
        </figcaption>
      </figure>
      {!single && (
        <>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous image"><Icon name="left" size={26} /></button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next image"><Icon name="right" size={26} /></button>
        </>
      )}
    </div>
  )
}
