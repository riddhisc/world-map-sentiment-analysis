import { countriesByIso3 } from './countries'

export const enrichSentimentData = (rows) => rows.map((row) => {
  const country = countriesByIso3[row.country]
  if (!country) console.warn('[sentiment] data row "' + row.country + '" matches no world-atlas feature')
  return {
    ...country,
    ...row,
    iso3: row.country,
  }
})

export const getOverallSentiment = (data) => data.positive - data.negative

export const getDominantSentiment = (data) => {
  const values = [['positive', data.positive], ['neutral', data.neutral], ['negative', data.negative]]
  return values.reduce((best, current) => current[1] > best[1] ? current : best)[0]
}

export const getSentimentColor = (type, value, data) => {
  if (type === 'overall' && data) {
    return getOverallColor(getOverallSentiment(data))
  }
  const intensity = Math.min(1, Math.max(0, value / 100))
  const ramps = {
    positive: [[214, 235, 245], [0, 114, 178]],
    neutral: [[205, 222, 216], [95, 135, 146]],
    negative: [[248, 218, 191], [213, 94, 0]],
  }
  return ramps[type] ? rgbToHex(mixRgb(ramps[type][0], ramps[type][1], intensity)) : '#59636d'
}

const mixRgb = (from, to, amount) => from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount))
const rgbToHex = (rgb) => `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`

export const getOverallColor = (score) => {
  const neutral = [95, 135, 146]
  const orange = [213, 94, 0]
  const blue = [0, 114, 178]
  const amount = Math.min(1, Math.abs(score) / 100)
  return rgbToHex(score < 0 ? mixRgb(neutral, orange, amount) : mixRgb(neutral, blue, amount))
}

export const getLegendValues = (type) => type === 'overall' ? [-100, -50, 0, 50, 100] : [0, 25, 50, 75, 100]

export const getLegendColors = (type) => getLegendValues(type).map((value) => (
  type === 'overall' ? getOverallColor(value) : getSentimentColor(type, value)
))
