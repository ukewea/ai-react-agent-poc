import { useState, useEffect, useCallback } from 'react'
import { slides } from './slides.jsx'

export default function App() {
  const [current, setCurrent] = useState(0)
  const [fragment, setFragment] = useState(0)
  const total = slides.length

  const slideFragments = slides[current].fragments || 0

  const go = useCallback(
    (i) => {
      const clamped = Math.max(0, Math.min(total - 1, i))
      setCurrent(clamped)
      setFragment(0)
    },
    [total]
  )

  const next = useCallback(() => {
    if (fragment < slideFragments) {
      setFragment(fragment + 1)
    } else {
      if (current < total - 1) {
        setCurrent(current + 1)
        setFragment(0)
      }
    }
  }, [fragment, slideFragments, current, total])

  const prev = useCallback(() => {
    if (fragment > 0) {
      setFragment(fragment - 1)
    } else {
      if (current > 0) {
        const prevSlide = current - 1
        const prevFragments = slides[prevSlide].fragments || 0
        setCurrent(prevSlide)
        setFragment(prevFragments)
      }
    }
  }, [fragment, current])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
      else if (e.key >= '1' && e.key <= '9') go(Number(e.key) - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, go, total])

  // Expose window.__presentation for Playwright / agent control
  useEffect(() => {
    window.__presentation = {
      currentSlide: current,
      currentFragment: fragment,
      totalSlides: total,
      totalFragments: slideFragments,
      slideId: slides[current].id,
      slideName: slides[current].title,
      goTo: go,
      next,
      prev,
      goToId: (id) => {
        const idx = slides.findIndex((s) => s.id === id)
        if (idx !== -1) go(idx)
      },
      listSlides: () => slides.map((s, i) => ({ index: i, id: s.id, title: s.title, fragments: s.fragments || 0 })),
    }
  })

  const slide = slides[current]
  const SlideComponent = slide.component

  return (
    <div data-testid="presentation" className="presentation">
      {/* Thin progress bar at top */}
      <div className="progress-bar" data-testid="progress-bar" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
        <div
          className="progress-fill"
          style={{ width: `${((current + 1) / total) * 100}%` }}
          data-testid="progress-fill"
        />
      </div>

      {/* Slide content area */}
      <main
        className="slide-area"
        data-testid="slide"
        data-slide-id={slide.id}
        data-slide-index={current}
        data-fragment={fragment}
        aria-live="polite"
        aria-label={`Slide ${current + 1} of ${total}: ${slide.title}`}
      >
        <SlideComponent visibleFragments={fragment} />
      </main>

    </div>
  )
}
