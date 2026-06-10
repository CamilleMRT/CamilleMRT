'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      const threshold = window.innerHeight * 0.7
      setScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header id="hdr" className={scrolled ? 'scrolled' : ''}>
        <div className="wrap nav">
          <a href="#top" className="brand" aria-label="Late Checkout, accueil">
            <Logo className="mark" />
            Late Checkout
          </a>

          <nav className="nav-links" aria-label="Navigation principale">
            <a href="#piliers">Pourquoi nous</a>
            <a href="#experience">L&apos;expérience</a>
            <a href="#formules">Formules</a>
            <a href="#simulateur">Simulateur</a>
          </nav>

          <a href="#simulateur" className="btn nav-cta">
            Estimer mes revenus
          </a>

          <button
            className="burger"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Menu de navigation">
          <a href="#piliers" onClick={closeMenu}>
            Pourquoi nous
          </a>
          <a href="#experience" onClick={closeMenu}>
            L&apos;expérience
          </a>
          <a href="#formules" onClick={closeMenu}>
            Formules
          </a>
          <a href="#simulateur" onClick={closeMenu}>
            Simulateur
          </a>
          <a href="#simulateur" onClick={closeMenu} style={{ color: 'var(--sienna)', fontWeight: 600 }}>
            Estimer mes revenus
          </a>
        </div>
      )}
    </>
  )
}
