import worldAtlas from 'world-atlas/countries-110m.json'
import worldCountries from 'world-countries/countries.json'

const isoByNumericId = Object.fromEntries(
  worldCountries.map((country) => [country.ccn3, country]),
)

const regionFor = (country) => {
  if (!country) return 'Other'
  if (country.cca3 === 'SAU') return 'Middle East'
  if (country.region === 'Africa') return 'Africa'
  if (country.region === 'Europe') return 'Europe'
  if (country.region === 'Oceania') return 'Oceania'
  if (country.region === 'Asia') return 'Asia'
  if (country.region === 'Americas') return country.subregion === 'South America' ? 'South America' : 'North America'
  return 'Other'
}

const atlasCountries = worldAtlas.objects.countries.geometries.map((geometry) => {
  const numericId = String(geometry.id).padStart(3, '0')
  const metadata = isoByNumericId[numericId]
  return {
    name: metadata?.name.common || geometry.properties?.name || 'Unknown country',
    iso2: metadata?.cca2 || '',
    iso3: metadata?.cca3 || '',
    numericId,
    region: regionFor(metadata),
  }
})

export const countries = atlasCountries
export const countriesByNumericId = Object.fromEntries(
  countries.map((country) => [country.numericId, country]),
)
export const countriesByIso3 = Object.fromEntries(
  countries.filter((country) => country.iso3).map((country) => [country.iso3, country]),
)

export const getCountryByNumericId = (id) => countriesByNumericId[String(id).padStart(3, '0')]
export const getCountryByIso3 = (iso3) => countriesByIso3[iso3]
