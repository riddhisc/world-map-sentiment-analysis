import { countriesByIso3 } from './countries'

export const sentimentData = [
  ['USA', 65, 25, 10], ['CAN', 70, 20, 10], ['GBR', 55, 30, 15],
  ['FRA', 50, 35, 15], ['DEU', 60, 25, 15], ['JPN', 75, 15, 10],
  ['CHN', 45, 30, 25], ['IND', 60, 25, 15], ['BRA', 70, 20, 10],
  ['ZAF', 55, 30, 15], ['AUS', 75, 15, 10], ['RUS', 40, 35, 25],
  ['MEX', 65, 25, 10], ['ITA', 60, 25, 15], ['ESP', 65, 20, 15],
  ['KOR', 70, 20, 10], ['SAU', 50, 30, 20], ['EGY', 45, 35, 20],
  ['NGA', 60, 25, 15], ['ARG', 65, 25, 10],
].map(([iso3, positive, neutral, negative]) => ({
  ...countriesByIso3[iso3], positive, neutral, negative,
  sampleSize: 1000, updatedAt: '2026-11-22',
  source: 'Demo dataset bundled with the application',
}))

export const sentimentByIso3 = Object.fromEntries(
  sentimentData.map((country) => [country.iso3, country]),
)

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
