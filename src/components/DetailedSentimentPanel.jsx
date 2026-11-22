import { useEffect, useRef } from 'react'

const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function DetailedSentimentPanel({ country, sentimentData, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    previousFocus.current = document.activeElement
    closeRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll(focusableSelector)
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus.current?.focus?.()
    }
  }, [onClose])

  if (!country || !sentimentData) return null
  const score = sentimentData.positive - sentimentData.negative
  const dominant = sentimentData.positive >= sentimentData.negative && sentimentData.positive >= sentimentData.neutral
    ? 'Positive' : sentimentData.negative > sentimentData.neutral ? 'Negative' : 'Neutral'

  return (
    <div className="detailed-panel-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="detailed-panel" role="dialog" aria-modal="true" aria-labelledby="country-dialog-title" ref={dialogRef}>
        <button className="detailed-panel-close" ref={closeRef} type="button" onClick={onClose} aria-label="Close country details">×</button>
        <h2 id="country-dialog-title">{sentimentData.name}</h2>
        <p className="dialog-subtitle">{sentimentData.region} · ISO-3 {sentimentData.iso3}</p>
        <div className="sentiment-bar-container" aria-label="Sentiment breakdown">
          <div className="sentiment-bar sentiment-bar-positive" style={{ width: `${sentimentData.positive}%` }}>{sentimentData.positive}%</div>
          <div className="sentiment-bar sentiment-bar-neutral" style={{ width: `${sentimentData.neutral}%` }}>{sentimentData.neutral}%</div>
          <div className="sentiment-bar sentiment-bar-negative" style={{ width: `${sentimentData.negative}%` }}>{sentimentData.negative}%</div>
        </div>
        <dl className="dialog-stats">
          <div><dt>Overall score</dt><dd>{score}</dd></div>
          <div><dt>Dominant sentiment</dt><dd>{dominant}</dd></div>
          <div><dt>Sample size</dt><dd>{sentimentData.sampleSize.toLocaleString()}</dd></div>
        </dl>
        <p className="dialog-source">Source: {sentimentData.source} · Updated {sentimentData.updatedAt}</p>
      </section>
    </div>
  )
}

export default DetailedSentimentPanel
