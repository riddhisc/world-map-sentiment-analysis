const CountryTooltip = ({ country, sentimentData, position }) => {
  if (!country || !sentimentData) return null
  const name = sentimentData.name || sentimentData.displayName || 'Unknown'
  const style = { '--tooltip-x': `${position?.x ?? 12}px`, '--tooltip-y': `${position?.y ?? 12}px` }

  if (sentimentData.noData) return <div className="country-tooltip" role="status" style={style}><strong>{name}</strong><p>No sentiment data available for this country.</p></div>

  const dominant = sentimentData.positive > sentimentData.neutral && sentimentData.positive > sentimentData.negative
    ? 'positive' : sentimentData.negative > sentimentData.neutral ? 'negative' : 'neutral'
  return (
    <div className="country-tooltip" role="status" style={style}>
      <strong className="tooltip-title">{name}</strong>
      <div className="tooltip-row"><span>🌎 Region</span><b>{sentimentData.region}</b></div>
      {['positive', 'neutral', 'negative'].map((key) => (
        <div className="tooltip-row" key={key}><span>{key[0].toUpperCase() + key.slice(1)}</span><b className={dominant === key ? 'is-dominant' : ''}>{sentimentData[key]}%</b></div>
      ))}
      <div className="tooltip-bars" aria-label="Sentiment distribution">
        <i className="bar-positive" style={{ '--bar-size': `${sentimentData.positive}%` }} />
        <i className="bar-neutral" style={{ '--bar-size': `${sentimentData.neutral}%` }} />
        <i className="bar-negative" style={{ '--bar-size': `${sentimentData.negative}%` }} />
      </div>
      <small>Click for detailed sentiment breakdown</small>
    </div>
  )
}

export default CountryTooltip
