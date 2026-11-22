import { describe, expect, it } from 'vitest'
import { getCountryByNumericId } from './countries'
import { getOverallColor, getOverallSentiment, getSentimentColor } from './sentimentData'

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
})
