const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * The site's one playful moment: adding a dish turns its plus into a tick with a small
 * overshoot, and every "My menu" count gives a single pulse, so the eye finds where the
 * choice went. Transforms only, each tween under half a second, nothing with reduced motion.
 * `overwrite` stops rapid taps from stacking tweens on the same element.
 *
 * GSAP is imported on demand: this runs from controls in the always-loaded drawer, and a
 * static import would pull GSAP into the first-load bundle. Pages that animate already
 * load the same chunk, so this usually resolves instantly.
 */
export function celebrateAdd(button: HTMLElement | null) {
  if (reduced()) return
  const icon = button?.querySelector('svg')
  import('./gsap').then(({ gsap }) => {
    if (icon?.isConnected) gsap.fromTo(icon, { scale: 0.3, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.42, ease: 'back.out(2.6)', overwrite: true, clearProps: 'transform' })
    const counts = document.querySelectorAll('[data-menu-count]')
    if (counts.length) gsap.fromTo(counts, { scale: 1 }, { scale: 1.35, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true, clearProps: 'transform' })
  }).catch(() => { /* decorative only: the toggle has already changed state */ })
}
