import Lenis from 'lenis'

let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -80 } })
  return () => { lenis?.destroy(); lenis = null }
}

/** Trava a rolagem da página (menu mobile, modais) sem brigar com o Lenis. */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}
