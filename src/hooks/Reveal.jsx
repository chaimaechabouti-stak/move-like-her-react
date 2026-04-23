import { useInView } from './useInView'

/**
 * Composant de scroll-reveal partagé.
 * Variantes : 'up' | 'left' | 'right' | 'zoom' | 'blur'
 */
export function Reveal({ children, variant = 'up', delay = 0, duration = 700, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`sr sr--${variant} ${inView ? 'sr--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

export const FadeIn    = ({ children, delay = 0, className = '' }) =>
  <Reveal variant="up"    delay={delay} className={className}>{children}</Reveal>

export const FadeLeft  = ({ children, delay = 0 }) =>
  <Reveal variant="left"  delay={delay}>{children}</Reveal>

export const FadeRight = ({ children, delay = 0 }) =>
  <Reveal variant="right" delay={delay}>{children}</Reveal>

export const ZoomIn    = ({ children, delay = 0 }) =>
  <Reveal variant="zoom"  delay={delay}>{children}</Reveal>

export const BlurIn    = ({ children, delay = 0 }) =>
  <Reveal variant="blur"  delay={delay}>{children}</Reveal>

/**
 * Compteur animé — s'incrémente une fois visible
 */
import { useEffect, useState } from 'react'

export function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView(0.3)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = parseInt(target)
    if (end === 0) return
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / 30))
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}
