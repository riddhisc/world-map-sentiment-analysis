import worldAtlas from 'world-atlas/countries-110m.json'
import metadata from './countryMetadata.generated.js'

const atlasCountries = worldAtlas.objects.countries.geometries.map((geometry) => {
  const numericId = String(geometry.id).padStart(3, '0')
  const countryMetadata = metadata.find((item) => item.numericId === numericId)
  return {
    name: countryMetadata?.name || geometry.properties?.name || 'Unknown country',
    iso2: countryMetadata?.iso2 || '',
    iso3: countryMetadata?.iso3 || '',
    numericId,
    region: countryMetadata?.region || 'Other',
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
