import { useState, useEffect, useCallback } from 'react'
import { slides } from './slides.jsx'

export default function App() {
  const [current, setCurrent] = useState(0)
  const [fragment, setFragment] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
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

  const toggleNotes = useCallback(() => setShowNotes((n) => !n), [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'n' || e.key === 'N') toggleNotes()
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
      else if (e.key >= '1' && e.key <= '9') go(Number(e.key) - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, go, toggleNotes, total])

  // Expose window.__presentation for Playwright / agent control
  useEffect(() => {
    window.__presentation = {
      currentSlide: current,
      currentFragment: fragment,
      totalSlides: total,
      totalFragments: slideFragments,
      slideId: slides[current].id,
      slideName: slides[current].title,
      showingNotes: showNotes,
      goTo: go,
      next,
      prev,
      toggleNotes,
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

      {/* Speaker notes panel — shown above nav bar */}
      {showNotes && (
        <aside
          className="notes-panel"
          data-testid="notes-panel"
          role="complementary"
          aria-label="Speaker notes"
        >
          <div className="notes-header">Speaker Notes</div>
          <div className="notes-content" data-testid="notes-content">
            {slide.notes}
          </div>
        </aside>
      )}

      {/* Navigation bar */}
      <nav className="nav-bar" data-testid="nav-bar" aria-label="Slide navigation">
        <button
          className="nav-btn"
          data-testid="nav-prev"
          onClick={prev}
          disabled={current === 0 && fragment === 0}
          aria-label="Previous slide"
        >
          ◀
        </button>

        <div className="nav-counter">
          <span data-testid="nav-counter" aria-label={`Slide ${current + 1} of ${total}`}>
            {current + 1} / {total}
          </span>
          <span className="nav-sep" aria-hidden="true">·</span>
          <span data-testid="nav-slide-name" className="nav-slide-name">
            {slide.title}
          </span>
        </div>

        <button
          className="nav-btn"
          data-testid="nav-next"
          onClick={next}
          disabled={current === total - 1 && fragment === slideFragments}
          aria-label="Next slide"
        >
          ▶
        </button>

        <button
          className={`nav-btn notes-toggle-btn${showNotes ? ' active' : ''}`}
          data-testid="notes-toggle"
          onClick={toggleNotes}
          aria-label="Toggle speaker notes"
          aria-pressed={showNotes}
          title="Toggle speaker notes (N)"
        >
          Notes
        </button>

        <span className="key-hint" data-testid="keyboard-hint" aria-hidden="true">
          ← → Space · N notes · Home/End
        </span>
      </nav>
    </div>
  )
}
