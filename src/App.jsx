import { useCallback, useMemo, useRef, useState } from 'react'
import { feature } from 'topojson-client'
import worldAtlas from 'world-atlas/countries-110m.json'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import CountryTooltip from './components/CountryTooltip'
import DetailedSentimentPanel from './components/DetailedSentimentPanel'
import Legend from './components/Legend'
import RegionSelector from './components/RegionSelector'
import RegionSummary from './components/RegionSummary'
import SentimentControls from './components/SentimentControls'
import WorldMap from './components/WorldMap'
import { getCountryByNumericId } from './data/countries'
import { getSentimentColor, sentimentByIso3, sentimentData } from './data/sentimentData'

const worldData = feature(worldAtlas, worldAtlas.objects.countries)

function App() {
  const [activeSentiment, setActiveSentiment] = useState('overall')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltipData, setTooltipData] = useState(null)
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [resetKey, setResetKey] = useState(0)
  const leaveTimeout = useRef(null)

  const regions = useMemo(() => [...new Set(sentimentData.map((country) => country.region))].sort(), [])
  const hoveredRegionData = useMemo(
    () => sentimentData.filter((country) => country.region === hoveredRegion),
    [hoveredRegion],
  )

  const getCountryInfo = useCallback((geo) => {
    const country = getCountryByNumericId(geo.id)
    const data = country ? sentimentByIso3[country.iso3] : null
    const isInSelectedRegion = selectedRegion === 'all' || country?.region === selectedRegion
    const fill = !isInSelectedRegion
      ? '#eef0f2'
      : data ? getSentimentColor(activeSentiment, data[activeSentiment], data) : '#d9dee5'
    return { country, data, fill, isInSelectedRegion, interactive: Boolean(data) }
  }, [activeSentiment, selectedRegion])

  const handleHover = useCallback((geo) => {
    const country = getCountryByNumericId(geo.id)
    const data = country ? sentimentByIso3[country.iso3] : null
    if (!data) return
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current)
    setHoveredCountry(geo)
    setTooltipData(data)
    setHoveredRegion(country.region)
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredCountry(null)
    setTooltipData(null)
    leaveTimeout.current = setTimeout(() => setHoveredRegion(null), 300)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedRegion('all')
    setHoveredCountry(null)
    setTooltipData(null)
    setHoveredRegion(null)
    setSelectedCountry(null)
    setResetKey((value) => value + 1)
  }, [])

  const handleClick = useCallback((geo) => {
    const country = getCountryByNumericId(geo.id)
    const data = country ? sentimentByIso3[country.iso3] : null
    if (data) setSelectedCountry({ geo, data })
  }, [])

  return (
    <ErrorBoundary>
      <main className="map-container">
        <h1>Sentiment Analysis World Map</h1>
        <div className="control-panel">
          <SentimentControls activeSentiment={activeSentiment} onSentimentChange={setActiveSentiment} />
          <RegionSelector regions={regions} selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
          <button className="reset-button" type="button" onClick={handleReset}>Reset Map</button>
        </div>
        <div className="map-layout">
          <div className="map">
            <WorldMap
              features={worldData.features}
              getCountryInfo={getCountryInfo}
              onHover={handleHover}
              onLeave={handleLeave}
              onClick={handleClick}
              resetKey={resetKey}
            />
            {hoveredCountry && tooltipData && <CountryTooltip country={hoveredCountry} sentimentData={tooltipData} />}
            <Legend sentimentType={activeSentiment} />
          </div>
          {!hoveredCountry && hoveredRegion && hoveredRegionData.length > 0 && (
            <aside className="region-summary-dock">
              <RegionSummary region={hoveredRegion} sentimentData={hoveredRegionData} />
            </aside>
          )}
        </div>
        <section className="how-to-use-section">
          <h2>HOW TO USE</h2>
          <div className="instructions">
            <p><strong>Navigation:</strong> Drag to pan, use mouse wheel to zoom in/out.</p>
            <p><strong>View Data:</strong> Hover or tap countries to see sentiment data; select one for details.</p>
            <p><strong>Filter by Region:</strong> Select a region to focus on geographic areas.</p>
          </div>
        </section>
        {selectedCountry && (
          <DetailedSentimentPanel
            country={selectedCountry.geo}
            sentimentData={selectedCountry.data}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </main>
    </ErrorBoundary>
  )
}

export default App
