import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

const DUR = { base: 0.6, hero: 1.6 }
const EASE = { out: 'power3.out', expo: 'expo.out', reveal: 'power2.inOut', settle: 'power2.out' }
const INTERACTIVE = 'a, button, input, select, textarea'

const revealPending = () => document.documentElement.classList.remove('hero-pending')

/**
 * One scoped context per page. useGSAP reverts every tween and ScrollTrigger on unmount,
 * and matchMedia reverts per-breakpoint work on resize, so navigation and resizing cannot
 * pile triggers up. Content is visible by default: elements are hidden only inside the
 * motion branch, right before their reveal is armed, and nothing that is or contains a link,
 * button or form control is ever made transparent. Nothing is pinned and nothing loops.
 */
export function useSiteMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, context => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean }
      const scope = root.current
      // Reduced motion: the complete static composition, exactly as the CSS lays it out.
      if (!scope || !motion) { revealPending(); return }
      const cleanups: (() => void)[] = []

      // ---- Hero: the photograph settles while the three lines arrive in turn ----------
      if (scope.querySelector('[data-hero="line"]')) {
        const tl = gsap.timeline({ defaults: { ease: EASE.expo } })
        tl.from('[data-hero="photo"]', { scale: 1.04, duration: DUR.hero, ease: EASE.settle }, 0)
          // Kept short: the headline is the page's LCP element, so a long entrance delays it.
          .from('[data-hero="line"]', { yPercent: 100, duration: 0.8, stagger: 0.16 }, 0.05)
          // The lede only moves: fading it would make it a late LCP candidate on phones.
          .from('[data-hero="lede"]', { y: 10, duration: DUR.base, ease: EASE.out }, '-=0.5')
          // The actions only move; they are never transparent, so they are usable at once.
          .from('[data-hero="actions"]', { y: 10, duration: DUR.base, ease: EASE.out }, '<')
        revealPending()
        // Reaching for a control mid-entrance finishes the entrance at once.
        const settle = () => tl.progress(1)
        scope.addEventListener('pointerdown', settle)
        scope.addEventListener('focusin', settle)
        cleanups.push(() => { scope.removeEventListener('pointerdown', settle); scope.removeEventListener('focusin', settle) })
      } else {
        revealPending()
      }

      // ---- Photographs: a mask opens from the lower edge on desktop; a short fade on phones ----
      gsap.utils.toArray<HTMLElement>('[data-anim="scene"]', scope).forEach(frame => {
        const image = frame.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } })
        if (desktop) {
          tl.fromTo(frame, { clipPath: 'inset(10% 0% 0% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1, ease: EASE.reveal, clearProps: 'clipPath' })
          if (image) tl.from(image, { scale: 1.05, duration: 1.3, ease: EASE.settle, clearProps: 'transform' }, 0)
        } else {
          tl.from(frame, { opacity: 0, duration: DUR.base, ease: EASE.out, clearProps: 'opacity' })
        }
      })

      // ---- Text groups: a modest stagger, batched into one trigger per screenful ---------
      const items = gsap.utils.toArray<HTMLElement>('[data-anim="rise"]', scope)
        .filter(item => !item.matches(INTERACTIVE) && !item.querySelector(INTERACTIVE))
      if (items.length) {
        gsap.set(items, { y: desktop ? 18 : 10, opacity: 0 })
        ScrollTrigger.batch(items, {
          start: 'top 92%', once: true,
          onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: DUR.base, stagger: 0.08, ease: EASE.out, clearProps: 'transform,opacity' }),
        })
      }

      // Late fonts and lazy images shift layout; recalculate trigger positions once they land.
      let alive = true
      const refresh = () => { if (alive) ScrollTrigger.refresh() }
      document.fonts.ready.then(refresh)
      window.addEventListener('load', refresh, { once: true })
      return () => { alive = false; window.removeEventListener('load', refresh); cleanups.forEach(cleanup => cleanup()) }
    })

    return () => revealPending()
  }, { scope: root, dependencies: [] })
}
