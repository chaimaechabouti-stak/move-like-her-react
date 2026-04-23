import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    targets.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [pathname])
}
