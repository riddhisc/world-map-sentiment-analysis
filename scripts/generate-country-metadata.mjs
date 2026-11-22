import { writeFile } from 'node:fs/promises'
import worldAtlas from 'world-atlas/countries-110m.json' with { type: 'json' }
import worldCountries from 'world-countries/countries.json' with { type: 'json' }

const byNumericId = Object.fromEntries(worldCountries.map((country) => [country.ccn3, country]))
const regionFor = (country) => {
  if (!country) return 'Other'
  if (country.cca3 === 'SAU') return 'Middle East'
  if (['Africa', 'Europe', 'Oceania', 'Asia'].includes(country.region)) return country.region
  if (country.region === 'Americas') return country.subregion === 'South America' ? 'South America' : 'North America'
  return 'Other'
}
const metadata = worldAtlas.objects.countries.geometries.map((geometry) => {
  const numericId = String(geometry.id).padStart(3, '0')
  const country = byNumericId[numericId]
  return { numericId, iso3: country?.cca3 || '', iso2: country?.cca2 || '', name: country?.name.common || geometry.properties?.name || 'Unknown country', region: regionFor(country) }
})
const output = `// Generated from world-atlas and world-countries. Do not edit by hand.\nexport default ${JSON.stringify(metadata, null, 2)}\n`
await writeFile(new URL('../src/data/countryMetadata.generated.js', import.meta.url), output)
