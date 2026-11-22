const SentimentControls = ({ activeSentiment, onSentimentChange, disabled = false }) => {
  const options = ['overall', 'positive', 'neutral', 'negative']
  return <div className="sentiment-controls" aria-label="Sentiment view">
    {options.map((id) => <button key={id} className={`sentiment-tab sentiment-tab--${id} ${activeSentiment === id ? 'is-active' : ''}`} type="button" onClick={() => onSentimentChange(id)} disabled={disabled} aria-pressed={activeSentiment === id}><span className={`sentiment-dot dot-${id}`} aria-hidden="true" />{id[0].toUpperCase() + id.slice(1)}</button>)}
  </div>
}

export default SentimentControls
