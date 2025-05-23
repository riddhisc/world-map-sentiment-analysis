import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { feature } from 'topojson-client'
// Use a lower resolution map for better performance
import worldAtlas from 'world-atlas/countries-110m.json'
import './App.css'

// Import error handling components
import ErrorBoundary from './components/ErrorBoundary'
import ErrorMessage from './components/ErrorMessage'

// Import components
import Legend from './components/Legend'
import SentimentControls from './components/SentimentControls'
import CountryTooltip from './components/CountryTooltip'
import RegionSelector from './components/RegionSelector'
import RegionSummary from './components/RegionSummary'
import DetailedSentimentPanel from './components/DetailedSentimentPanel'

// Import sentiment data and helper functions
import { 
  sentimentData, 
  countryCodeMapping, 
  getOverallSentiment, 
  getDominantSentiment, 
  getSentimentColor 
} from './data/sentimentData'

// Process the world map topojson data
const worldData = feature(worldAtlas, worldAtlas.objects.countries)

// Define region coordinates for quick navigation
const regionCoordinates = {
  'North America': [-100, 40],
  'South America': [-60, -20],
  'Europe': [15, 50],
  'Africa': [20, 0],
  'Asia': [90, 30],
  'Oceania': [130, -25],
  'Middle East': [45, 25]
}

// Helper function to map numeric country IDs to ISO codes
const getCountryCodeFromId = (id) => {
  const countryMapping = {
    840: 'USA', // United States
    124: 'CAN', // Canada
    826: 'GBR', // United Kingdom
    250: 'FRA', // France
    276: 'DEU', // Germany
    392: 'JPN', // Japan
    156: 'CHN', // China
    356: 'IND', // India
    76: 'BRA',  // Brazil
    710: 'ZAF', // South Africa
    36: 'AUS',  // Australia
    643: 'RUS', // Russia
    484: 'MEX', // Mexico
    380: 'ITA', // Italy
    724: 'ESP', // Spain
    410: 'KOR', // South Korea
    682: 'SAU', // Saudi Arabia
    818: 'EGY', // Egypt
    566: 'NGA', // Nigeria
    32: 'ARG',  // Argentina
    152: 'CHL', // Chile (South America)
    604: 'PER', // Peru (South America)
    170: 'COL', // Colombia (South America)
    862: 'VEN', // Venezuela (South America)
    554: 'NZL', // New Zealand (Oceania)
    598: 'PNG', // Papua New Guinea (Oceania)
    242: 'FJI', // Fiji (Oceania)
  }
  
  return countryMapping[id] || ''
}

// Memoize the Geography component for better performance
const MemoizedGeography = memo(Geography)

function App() {
  // Start with a more zoomed in view
  const [position, setPosition] = useState({ coordinates: [10, 20], zoom: 1.8 })
  const [activeSentiment, setActiveSentiment] = useState('overall')
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltipData, setTooltipData] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [detailedCountryData, setDetailedCountryData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef()
  
  // Extract unique regions from sentiment data
  const regions = useMemo(() => {
    try {
      const uniqueRegions = [...new Set(sentimentData.map(item => item.region))]
      return uniqueRegions.sort()
    } catch (err) {
      console.error('Error extracting regions:', err)
      setError('Failed to load region data. Please try again.')
      return []
    }
  }, [])
  
  // Filter countries by selected region
  const filteredCountries = useMemo(() => {
    try {
      if (selectedRegion === 'all') return sentimentData
      return sentimentData.filter(country => country.region === selectedRegion)
    } catch (err) {
      console.error('Error filtering countries:', err)
      setError('Failed to filter countries by region. Please try again.')
      return []
    }
  }, [selectedRegion])
  
  // Get countries for the hovered region
  const hoveredRegionData = useMemo(() => {
    if (!hoveredRegion) return []
    return sentimentData.filter(country => country.region === hoveredRegion)
  }, [hoveredRegion])
  
  // Reset map to initial position
  const handleReset = useCallback(() => {
    setPosition({ coordinates: [0, 0], zoom: 1 })
    setSelectedRegion('all')
    setSelectedCountry(null)
    setDetailedCountryData(null)
    setError(null)
  }, [])
  
  // Define region map for countries without sentiment data
  const regionMap = useMemo(() => ({
    // South America countries
    'CHL': 'South America',
    'PER': 'South America',
    'COL': 'South America',
    'VEN': 'South America',
    'BOL': 'South America',
    'ECU': 'South America',
    'PRY': 'South America',
    'URY': 'South America',
    'GUY': 'South America',
    'SUR': 'South America',
    
    // Oceania countries
    'NZL': 'Oceania',
    'PNG': 'Oceania',
    'FJI': 'Oceania',
    'SLB': 'Oceania',
    'VUT': 'Oceania',
    'WSM': 'Oceania',
    'TON': 'Oceania',
  }), [])

  // Pre-compute country data mapping for better performance
  const countryDataMap = useMemo(() => {
    const map = {}
    try {
      // Debug region selection
      console.log('Selected region:', selectedRegion)
      
      worldData.features.forEach(geo => {
        const countryCode = getCountryCodeFromId(geo.id)
        if (countryCode) {
          // First try to find the country in our sentiment data
          const countryData = sentimentData.find(item => {
            const mappedCode = countryCodeMapping[item.country]
            return mappedCode === countryCode
          })
          
          if (countryData) {
            // We have sentiment data for this country
            map[geo.id] = {
              countryCode,
              countryData,
              isInSelectedRegion: selectedRegion === 'all' || countryData.region === selectedRegion
            }
          } else if (regionMap[countryCode]) {
            // We don't have sentiment data but we know the region
            // Create a placeholder for region highlighting
            map[geo.id] = {
              countryCode,
              countryData: null,
              isInSelectedRegion: selectedRegion === 'all' || regionMap[countryCode] === selectedRegion
            }
          }
        }
      })
    } catch (err) {
      console.error('Error creating country data map:', err)
    }
    return map
  }, [selectedRegion, regionMap])

  // Get fill color for a country based on sentiment data and active sentiment type
  const getFillColor = useCallback((geo) => {
    const countryCode = getCountryCodeFromId(geo.id)
    const countryInfo = countryDataMap[geo.id]
    
    // Find the country in our sentiment data
    const countryData = sentimentData.find(item => {
      // Special cases for countries with different codes
      if (item.country === 'AR' && countryCode === 'ARG') return true;
      if (item.country === 'AU' && countryCode === 'AUS') return true;
      if (item.country === 'BR' && countryCode === 'BRA') return true;
      
      const mappedCode = countryCodeMapping[item.country]
      return mappedCode === countryCode
    })
    
    // Handle region highlighting for countries without sentiment data
    if (selectedRegion !== 'all') {
      // Check if this country belongs to the selected region
      const countryRegion = countryData?.region || regionMap[countryCode]
      
      if (countryRegion && countryRegion !== selectedRegion) {
        return '#f0f0f0' // Light gray for countries not in selected region
      }
      
      // If country is in the selected region but has no data, use a light version of region color
      if (!countryData && countryRegion === selectedRegion) {
        // Use colors that match the sentiment colors for consistency
        switch (selectedRegion) {
          case 'South America':
            return 'rgba(39, 174, 96, 0.7)' // Green for South America (positive dominant)
          case 'Oceania':
            return 'rgba(39, 174, 96, 0.7)' // Green for Oceania too (positive dominant)
          default:
            return '#e0e0e0' // Light gray
        }
      }
    }
    
    if (!countryData) return '#DDD' // Default color for countries without data
    
    // Return color based on active sentiment type
    switch (activeSentiment) {
      case 'positive':
        return getSentimentColor('positive', countryData.positive)
      case 'neutral':
        return getSentimentColor('neutral', countryData.neutral)
      case 'negative':
        return getSentimentColor('negative', countryData.negative)
      case 'overall':
        // Pass the entire country data to determine dominant sentiment
        return getSentimentColor('overall', 0, countryData)
      default:
        return '#DDD'
    }
  }, [activeSentiment, selectedRegion, countryDataMap, regionMap])
  
  // Handle country hover
  const handleCountryHover = useCallback((geo) => {
    const countryCode = getCountryCodeFromId(geo.id)
    
    // Find the country in our sentiment data
    const countryData = sentimentData.find(item => {
      const mappedCode = countryCodeMapping[item.country]
      return mappedCode === countryCode
    })
    
    if (countryData) {
      // Map of country IDs to names for better display
      const countryNames = {
        840: 'United States',
        124: 'Canada',
        826: 'United Kingdom',
        250: 'France',
        276: 'Germany',
        392: 'Japan',
        156: 'China',
        356: 'India',
        76: 'Brazil',
        710: 'South Africa',
        36: 'Australia',
        643: 'Russia',
        484: 'Mexico',
        380: 'Italy',
        724: 'Spain',
        410: 'South Korea',
        682: 'Saudi Arabia',
        818: 'Egypt',
        566: 'Nigeria',
        32: 'Argentina'
      }
      
      // Add the proper country name to the data
      const countryName = countryNames[geo.id] || countryData.country
      const enrichedData = {
        ...countryData,
        displayName: countryName
      }
      
      setHoveredCountry(geo)
      setTooltipData(enrichedData)
      setHoveredRegion(countryData.region)
    }
  }, [])
  
  // Handle country click for detailed view
  const handleCountryClick = useCallback((geo) => {
    const countryCode = getCountryCodeFromId(geo.id)
    
    // Find the country in our sentiment data
    const countryData = sentimentData.find(item => {
      // Special cases for countries with different codes
      if (item.country === 'AR' && countryCode === 'ARG') return true;
      if (item.country === 'AU' && countryCode === 'AUS') return true;
      if (item.country === 'BR' && countryCode === 'BRA') return true;
      
      const mappedCode = countryCodeMapping[item.country]
      return mappedCode === countryCode
    })
    
    if (countryData) {
      setSelectedCountry(geo)
      setDetailedCountryData(countryData)
    }
  }, [])
  
  // Handle region change
  const handleRegionChange = useCallback((region) => {
    try {
      setIsLoading(true)
      setSelectedRegion(region)
      
      // If a specific region is selected, adjust the map to focus on that region
      if (region !== 'all' && regionCoordinates[region]) {
        setPosition({
          coordinates: regionCoordinates[region],
          zoom: 2
        })
      }
      setError(null) // Clear any errors on successful region change
    } catch (err) {
      console.error('Error changing region:', err)
      setError(`Failed to focus on ${region} region. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Close detailed panel
  const closeDetailedPanel = useCallback(() => {
    setSelectedCountry(null)
    setDetailedCountryData(null)
  }, [])
  
  // Handle error retry
  const handleErrorRetry = useCallback(() => {
    setError(null)
    handleReset()
  }, [handleReset])

  // This section was removed to fix the duplicate countryDataMap definition error

  return (
    <div className="map-container">
      <h1>Sentiment Analysis World Map</h1>
      
      {/* Display error message if there's an error */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={handleErrorRetry} 
        />
      )}
      
      <div className="control-panel">
        <SentimentControls 
          activeSentiment={activeSentiment} 
          onSentimentChange={setActiveSentiment} 
          disabled={isLoading || !!error}
        />
        
        <RegionSelector
          regions={regions}
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          disabled={isLoading || !!error}
        />
      </div>
      
      <div className="controls">
        <button 
          onClick={handleReset} 
          disabled={isLoading}
        >
          Reset Map
        </button>
      </div>
      
      <div className="map">
        <ComposableMap 
          projection="geoMercator"
          projectionConfig={{
            scale: 90, /* Further reduced scale to show more of the world */
            center: position.coordinates
          }}
          style={{
            width: "100%",
            height: "450px", /* Match the fixed height in CSS */
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={setPosition}
            // Enhanced settings for smooth mouse-based navigation
            minZoom={0.4}
            maxZoom={8}
            // Much wider translate extent for unrestricted panning
            translateExtent={[
              [-2000, -1000],
              [2000, 1500]
            ]}
            // Ensure mouse movement controls are enabled
            enablePanning={true}
            enableDragging={true}
            // Improve mouse wheel zoom behavior
            wheelDelta={(event) => {
              return event.deltaY > 0 ? -1 : 1;
            }}
            // Make panning smoother
            panningDuration={250}
          >
            <Geographies geography={worldData}>
              {({ geographies }) => 
                geographies.map((geo) => {
                  const countryInfo = countryDataMap[geo.id]
                  
                  // Determine if country should be interactive (has data)
                  const isInteractive = !!countryInfo?.countryData
                  
                  // Determine if country is in selected region
                  const isInSelectedRegion = countryInfo?.isInSelectedRegion || false
                  
                  // Skip rendering very small countries when zoomed out for performance
                  if (position.zoom < 2 && geo.properties.area < 10000 && !isInteractive) {
                    return null
                  }
                  
                  return (
                    <MemoizedGeography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getFillColor(geo)}
                      stroke={isInSelectedRegion ? "#FFF" : "#DDD"}
                      strokeWidth={isInSelectedRegion ? 0.5 : 0.3}
                      style={{
                        default: { 
                          outline: 'none',
                          cursor: isInteractive ? 'pointer' : 'default',
                          opacity: isInSelectedRegion ? 1 : 0.7
                        },
                        hover: { 
                          stroke: isInteractive ? '#000' : '#DDD', 
                          strokeWidth: isInteractive ? 1 : 0.3, 
                          outline: 'none',
                          opacity: isInSelectedRegion ? 1 : 0.8
                        },
                        pressed: { outline: 'none' }
                      }}
                      onMouseEnter={() => isInteractive && handleCountryHover(geo)}
                      onMouseLeave={() => {
                        setHoveredCountry(null)
                        setTooltipData(null)
                        // Keep hoveredRegion for a moment to allow viewing region summary
                        setTimeout(() => {
                          if (!hoveredCountry) {
                            setHoveredRegion(null)
                          }
                        }, 300)
                      }}
                      onClick={() => isInteractive && handleCountryClick(geo)}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        {/* Show tooltip when hovering over a country with data */}
        {hoveredCountry && tooltipData && (
          <CountryTooltip 
            country={hoveredCountry.properties} 
            sentimentData={tooltipData} 
          />
        )}
        
        {/* Show region summary when hovering over a region */}
        {!hoveredCountry && hoveredRegion && hoveredRegionData.length > 0 && (
          <RegionSummary 
            region={hoveredRegion} 
            sentimentData={hoveredRegionData} 
          />
        )}
        
        {/* Show detailed panel when a country is clicked */}
        {selectedCountry && detailedCountryData && (
          <DetailedSentimentPanel
            country={selectedCountry.properties}
            sentimentData={detailedCountryData}
            onClose={closeDetailedPanel}
          />
        )}
        
        {/* Show legend for the active sentiment type */}
        <Legend sentimentType={activeSentiment} />
      </div>
      
      {/* How to Use section moved to bottom of page and made more prominent */}
      <div className="how-to-use-section">
        <h2>HOW TO USE</h2>
        <div className="instructions">
          <p><strong>Navigation:</strong> Drag to pan, use mouse wheel to zoom in/out</p>
          <p><strong>View Data:</strong> Hover over countries to see sentiment data, click for detailed breakdown</p>
          <p><strong>Filter by Region:</strong> Select a region to focus on specific geographic areas</p>
          <p><strong>Change View:</strong> Use the buttons above to toggle between different sentiment views</p>
        </div>
      </div>
    </div>
  )
}

export default function WrappedApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}
