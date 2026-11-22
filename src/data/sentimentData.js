import { countriesByIso3 } from './countries'

export const enrichSentimentData = (rows) => rows.map((row) => ({
  ...countriesByIso3[row.country],
  ...row,
  iso3: row.country,
}))

export const getOverallSentiment = (data) => data.positive - data.negative

export const getDominantSentiment = (data) => {
  const values = [['positive', data.positive], ['neutral', data.neutral], ['negative', data.negative]]
  return values.reduce((best, current) => current[1] > best[1] ? current : best)[0]
}

export const getSentimentColor = (type, value, data) => {
  if (type === 'overall' && data) {
    const score = getOverallSentiment(data)
    const intensity = Math.min(1, Math.abs(score) / 100)
    if (score > 0) return `rgba(20, ${Math.round(100 + intensity * 100)}, 110, 0.85)`
    if (score < 0) return `rgba(${Math.round(150 + intensity * 80)}, 70, 85, 0.85)`
    return 'rgba(230, 180, 60, 0.85)'
  }
  const intensity = Math.min(1, Math.max(0, value / 100))
  if (type === 'positive') return `rgba(20, ${Math.round(110 + intensity * 100)}, 110, 0.85)`
  if (type === 'neutral') return `rgba(${Math.round(180 + intensity * 50)}, ${Math.round(140 + intensity * 60)}, 40, 0.85)`
  if (type === 'negative') return `rgba(${Math.round(150 + intensity * 80)}, 70, 85, 0.85)`
  return '#d9dee5'
}
