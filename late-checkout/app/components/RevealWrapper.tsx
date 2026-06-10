'use client'

import { useEffect, useRef } from 'react'

interface RevealWrapperProps {
  children: React.ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  style?: React.CSSProperties
}

export default function RevealWrapper({
  children,
  className = '',
  as: Tag = 'div',
  style,
}: RevealWrapperProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      if (ref.current) {
        ref.current.classList.add('in')
      }
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  const Comp = Tag as React.ElementType
  return (
    <Comp ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </Comp>
  )
}
