import { useCallback, useEffect, useMemo, useState } from 'react'
import { feature } from 'topojson-client'
import worldAtlas from 'world-atlas/countries-110m.json'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import CountryTooltip from './components/CountryTooltip'
import DetailedSentimentPanel from './components/DetailedSentimentPanel'
import ErrorMessage from './components/ErrorMessage'
import Legend from './components/Legend'
import RegionSelector from './components/RegionSelector'
import RegionSummary from './components/RegionSummary'
import SentimentControls from './components/SentimentControls'
import WorldMap from './components/WorldMap'
import { getCountryByNumericId } from './data/countries'
import { enrichSentimentData, getSentimentColor } from './data/sentimentData'

const worldData = feature(worldAtlas, worldAtlas.objects.countries)

function App() {
  const [activeSentiment, setActiveSentiment] = useState('overall')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltipData, setTooltipData] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 12, y: 12 })
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [resetKey, setResetKey] = useState(0)
  const [sentimentData, setSentimentData] = useState([])
  const [dataState, setDataState] = useState('loading')
  const [dataError, setDataError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/sentiment.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Data request failed with ${response.status}`)
        return response.json()
      })
      .then((rows) => {
        if (cancelled) return
        setSentimentData(enrichSentimentData(rows))
        setDataState('ready')
      })
      .catch((loadError) => {
        if (cancelled) return
        setDataError(loadError.message)
        setDataState('error')
      })
    return () => { cancelled = true }
  }, [])

  const regions = useMemo(() => [...new Set(sentimentData.map((country) => country.region))].sort(), [sentimentData])
  const hoveredRegionData = useMemo(
    () => sentimentData.filter((country) => country.region === hoveredRegion),
    [hoveredRegion, sentimentData],
  )

  const getCountryInfo = useCallback((geo) => {
    const country = getCountryByNumericId(geo.id)
    const data = sentimentData.find((item) => item.iso3 === country?.iso3)
    const isInSelectedRegion = selectedRegion === 'all' || country?.region === selectedRegion
    const fill = !isInSelectedRegion
      ? '#eef0f2'
      : data ? getSentimentColor(activeSentiment, data[activeSentiment], data) : '#d9dee5'
    return { country, data, fill, isInSelectedRegion, interactive: Boolean(data) }
  }, [activeSentiment, selectedRegion, sentimentData])

  const handleHover = useCallback((geo, event) => {
    const country = getCountryByNumericId(geo.id)
    const data = sentimentData.find((item) => item.iso3 === country?.iso3)
    setHoveredCountry(geo)
    setTooltipData(data || { name: country?.name || 'Unknown country', noData: true })
    setHoveredRegion(data ? country.region : null)
    const mapBounds = event?.currentTarget?.closest('.map')?.getBoundingClientRect()
    if (mapBounds && event) setTooltipPosition({ x: event.clientX - mapBounds.left + 12, y: event.clientY - mapBounds.top + 12 })
  }, [sentimentData])

  const handleLeave = useCallback(() => {
    setHoveredCountry(null)
    setTooltipData(null)
    setHoveredRegion(null)
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
    const data = sentimentData.find((item) => item.iso3 === country?.iso3)
    if (data) setSelectedCountry({ geo, data })
  }, [sentimentData])

  const closeDetailedPanel = useCallback(() => setSelectedCountry(null), [])

  const summaryRegion = hoveredRegion || (selectedRegion === 'all' ? 'World overview' : selectedRegion)
  const summaryData = hoveredRegion
    ? hoveredRegionData
    : selectedRegion === 'all'
      ? sentimentData
      : sentimentData.filter((country) => country.region === selectedRegion)

  return (
    <ErrorBoundary>
      <main className="map-container">
        <h1>Sentiment Analysis World Map</h1>
        {dataState === 'loading' && <p className="data-status">Loading sentiment data…</p>}
        {dataState === 'error' && <ErrorMessage message={`Unable to load sentiment data: ${dataError}`} onRetry={() => window.location.reload()} />}
        {dataState === 'ready' && sentimentData.length === 0 && <p className="data-status">No sentiment data is available.</p>}
        <div className="control-panel" aria-busy={dataState === 'loading'}>
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
            {hoveredCountry && tooltipData && <CountryTooltip country={hoveredCountry} sentimentData={tooltipData} position={tooltipPosition} />}
            <Legend sentimentType={activeSentiment} />
          </div>
          {dataState === 'ready' && summaryData.length > 0 && (
            <aside className="region-summary-dock">
              <RegionSummary region={summaryRegion} sentimentData={summaryData} />
            </aside>
          )}
        </div>
        {dataState === 'ready' && sentimentData[0] && (
          <p className="methodology-note">
            Methodology: illustrative synthetic data for UI demonstration, not a real survey. Source: {sentimentData[0].source}. Last generated: {sentimentData[0].updatedAt}.
          </p>
        )}
        <section className="how-to-use-section">
          <h2>HOW TO USE</h2>
          <div className="instructions">
            <p><strong>Navigation:</strong> Drag to pan. Hold Ctrl/Cmd while using the wheel to zoom; a normal wheel scrolls the page.</p>
            <p><strong>View Data:</strong> Hover or tap countries to see sentiment data; select one for details.</p>
            <p><strong>Filter by Region:</strong> Select a region to focus on geographic areas.</p>
          </div>
        </section>
        {selectedCountry && (
          <DetailedSentimentPanel
            country={selectedCountry.geo}
            sentimentData={selectedCountry.data}
            onClose={closeDetailedPanel}
          />
        )}
      </main>
    </ErrorBoundary>
  )
}

export default App
