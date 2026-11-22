import { getLegendColors, getLegendValues } from '../data/sentimentData'

const labels = {
  overall: 'Overall net sentiment',
  positive: 'Positive sentiment',
  neutral: 'Neutral sentiment',
  negative: 'Negative sentiment',
}

const getLegendGradient = (sentimentType) => {
  const colors = getLegendColors(sentimentType)
  return `linear-gradient(to right, ${colors.map((color, index) => `${color} ${(index / (colors.length - 1)) * 100}%`).join(', ')})`
}

function Legend({ sentimentType }) {
  const values = getLegendValues(sentimentType)
  const isOverall = sentimentType === 'overall'
  const minLabel = isOverall ? `${values[0]} negative` : `${values[0]}%`
  const maxLabel = isOverall ? `+${values.at(-1)} positive` : `${values.at(-1)}%`

  return (
    <div className="legend" aria-label={`${labels[sentimentType]} legend`}>
      <div className="legend-title">{labels[sentimentType]}</div>
      <div className="legend-gradient" style={{ background: getLegendGradient(sentimentType) }} />
      <div className="legend-scale"><span>{minLabel}</span><span>0</span><span>{maxLabel}</span></div>
      <div className="legend-row"><span className="legend-no-data" />No data</div>
    </div>
  )
}

export default Legend
