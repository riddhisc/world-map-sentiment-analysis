import { describe, expect, it, vi } from 'vitest'
import { getCountryByNumericId } from './countries'
import { enrichSentimentData, getLegendColors, getLegendValues, getOverallColor, getOverallSentiment, getSentimentColor } from './sentimentData'

const parseHex = (hex) => [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16))
const simulate = (rgb, matrix) => matrix.map((row) => Math.max(0, Math.min(255, row.reduce((sum, value, index) => sum + value * rgb[index], 0))))
const toLab = ([red, green, blue]) => {
  const linear = [red, green, blue].map((value) => value / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  const x = (linear[0] * 0.4124 + linear[1] * 0.3576 + linear[2] * 0.1805) / 0.95047
  const y = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
  const z = (linear[0] * 0.0193 + linear[1] * 0.1192 + linear[2] * 0.9505) / 1.08883
  const f = (value) => value > 0.008856 ? value ** (1 / 3) : 7.787 * value + 16 / 116
  const [fx, fy, fz] = [f(x), f(y), f(z)]
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}
const deltaE = (first, second) => Math.hypot(...first.map((value, index) => value - second[index]))
const visionMatrices = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
}

describe('country lookup', () => {
  it.each([
    ['076', 'BRA', 'Brazil'],
    ['032', 'ARG', 'Argentina'],
    ['036', 'AUS', 'Australia'],
  ])('resolves zero-padded ID %s', (numericId, iso3, name) => {
    expect(getCountryByNumericId(numericId)).toMatchObject({ numericId, iso3, name })
  })
})

describe('sentiment helpers', () => {
  const data = { positive: 70, neutral: 20, negative: 10 }

  it('calculates net sentiment', () => {
    expect(getOverallSentiment(data)).toBe(60)
  })

  it('uses the same diverging scale for overall colors', () => {
    expect(getOverallColor(60)).toBe(getSentimentColor('overall', 0, { positive: 60, neutral: 0, negative: 0 }))
    expect(getOverallColor(-60)).toBe(getSentimentColor('overall', 0, { positive: 0, neutral: 0, negative: 60 }))
    expect(getOverallColor(0)).toBe(getSentimentColor('overall', 0, { positive: 0, neutral: 0, negative: 0 }))
  })

  it.each(Object.entries(visionMatrices))('keeps blue/orange colors distinct under %s simulation', (_name, matrix) => {
    const positive = toLab(simulate(parseHex(getOverallColor(60)), matrix))
    const negative = toLab(simulate(parseHex(getOverallColor(-60)), matrix))
    expect(deltaE(positive, negative)).toBeGreaterThanOrEqual(25)
  })

  it.each(['positive', 'neutral', 'negative'])('keeps %s legend stops equal to map colors', (type) => {
    expect(getLegendColors(type)).toEqual(getLegendValues(type).map((value) => getSentimentColor(type, value)))
  })

  it('warns when a sentiment row has no world-atlas country', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const [row] = enrichSentimentData([{ country: 'ZZZ', positive: 10, neutral: 20, negative: 70 }])
    expect(row.iso3).toBe('ZZZ')
    expect(warning).toHaveBeenCalledWith('[sentiment] data row "ZZZ" matches no world-atlas feature')
    warning.mockRestore()
  })
})
