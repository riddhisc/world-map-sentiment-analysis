const RegionSummary = ({ region, sentimentData, variant = 'drawer' }) => {
  if (!region || !sentimentData?.length) return null
  const averages = ['positive', 'neutral', 'negative'].reduce((result, key) => {
    result[key] = Math.round(sentimentData.reduce((sum, item) => sum + item[key], 0) / sentimentData.length)
    return result
  }, {})
  const mostPositive = sentimentData.reduce((a, b) => a.positive > b.positive ? a : b)
  const mostNegative = sentimentData.reduce((a, b) => a.negative > b.negative ? a : b)
  return (
    <section className={`region-summary region-summary--${variant}`} aria-label={`${region} summary`}>
      <div className="summary-heading"><div><span className="eyebrow">Live summary</span><h2>{region}</h2></div><span className="summary-count">{sentimentData.length} countries</span></div>
      <div className="summary-stats">
        {['positive', 'neutral', 'negative'].map((key) => <div className="summary-stat" key={key}><div><span>{key}</span><b>{averages[key]}%</b></div><div className={`summary-bar summary-bar--${key}`}><i style={{ '--bar-size': `${averages[key]}%` }} /></div></div>)}
      </div>
      <div className="summary-highlights"><span>Most positive <b>{mostPositive.name}</b></span><span>Most negative <b>{mostNegative.name}</b></span></div>
    </section>
  )
}

export default RegionSummary
