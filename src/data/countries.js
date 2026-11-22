const countryRows = [
  ['United States', 'US', 'USA', '840', 'North America'],
  ['Canada', 'CA', 'CAN', '124', 'North America'],
  ['Mexico', 'MX', 'MEX', '484', 'North America'],
  ['United Kingdom', 'GB', 'GBR', '826', 'Europe'],
  ['France', 'FR', 'FRA', '250', 'Europe'],
  ['Germany', 'DE', 'DEU', '276', 'Europe'],
  ['Russia', 'RU', 'RUS', '643', 'Europe'],
  ['Italy', 'IT', 'ITA', '380', 'Europe'],
  ['Spain', 'ES', 'ESP', '724', 'Europe'],
  ['Japan', 'JP', 'JPN', '392', 'Asia'],
  ['China', 'CN', 'CHN', '156', 'Asia'],
  ['India', 'IN', 'IND', '356', 'Asia'],
  ['South Korea', 'KR', 'KOR', '410', 'Asia'],
  ['Brazil', 'BR', 'BRA', '076', 'South America'],
  ['Argentina', 'AR', 'ARG', '032', 'South America'],
  ['Chile', 'CL', 'CHL', '152', 'South America'],
  ['Peru', 'PE', 'PER', '604', 'South America'],
  ['Colombia', 'CO', 'COL', '170', 'South America'],
  ['Venezuela', 'VE', 'VEN', '862', 'South America'],
  ['South Africa', 'ZA', 'ZAF', '710', 'Africa'],
  ['Egypt', 'EG', 'EGY', '818', 'Africa'],
  ['Nigeria', 'NG', 'NGA', '566', 'Africa'],
  ['Saudi Arabia', 'SA', 'SAU', '682', 'Middle East'],
  ['Australia', 'AU', 'AUS', '036', 'Oceania'],
  ['New Zealand', 'NZ', 'NZL', '554', 'Oceania'],
  ['Papua New Guinea', 'PG', 'PNG', '598', 'Oceania'],
  ['Fiji', 'FJ', 'FJI', '242', 'Oceania'],
]

export const countries = countryRows.map(([name, iso2, iso3, numericId, region]) => ({
  name,
  iso2,
  iso3,
  numericId,
  region,
}))

export const countriesByNumericId = Object.fromEntries(
  countries.map((country) => [country.numericId, country]),
)

export const countriesByIso3 = Object.fromEntries(
  countries.map((country) => [country.iso3, country]),
)

export const getCountryByNumericId = (id) => countriesByNumericId[String(id).padStart(3, '0')]
export const getCountryByIso3 = (iso3) => countriesByIso3[iso3]
