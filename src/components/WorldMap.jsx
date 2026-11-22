import { useEffect, useMemo, useRef, useState } from 'react'
import { geoEqualEarth, geoPath } from 'd3-geo'
import { zoom, zoomIdentity } from 'd3-zoom'
import { select } from 'd3-selection'

const INITIAL_ZOOM = 1.8

const initialTransform = (width, height) => ({
  x: width * (1 - INITIAL_ZOOM) / 2,
  y: height * (1 - INITIAL_ZOOM) / 2,
  k: INITIAL_ZOOM,
})

function WorldMap({ features, getCountryInfo, onHover, onLeave, onClick, resetKey, onZoomInteraction }) {
  const svgRef = useRef(null)
  const zoomRef = useRef(null)
  const transformRef = useRef(initialTransform(900, 450))
  const sizeRef = useRef({ width: 900, height: 450 })
  const [size, setSize] = useState({ width: 900, height: 450 })
  const [transform, setTransform] = useState(() => initialTransform(900, 450))

  useEffect(() => {
    const element = svgRef.current
    if (!element) return undefined
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.max(320, entry.contentRect.width)
      setSize({ width, height: Math.max(320, Math.min(520, width * 0.52)) })
    })
    observer.observe(element.parentElement)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    sizeRef.current = size
  }, [size])

  useEffect(() => {
    const element = svgRef.current
    if (!element) return undefined
    const selection = select(element)
    const behavior = zoom()
      .scaleExtent([1, 4])
      .translateExtent([[0, 0], [size.width, size.height]])
      .extent([[0, 0], [size.width, size.height]])
      .on('zoom', (event) => {
        if (event.sourceEvent?.type === 'wheel') onZoomInteraction?.()
        const next = event.transform
        transformRef.current = { x: next.x, y: next.y, k: next.k }
        setTransform({ x: next.x, y: next.y, k: next.k })
      })
      .filter((event) => event.type !== 'wheel' || event.ctrlKey || event.metaKey)
    zoomRef.current = behavior
    selection.call(behavior).call(behavior.transform, zoomIdentity
      .translate(transformRef.current.x, transformRef.current.y)
      .scale(transformRef.current.k))
    return () => selection.on('.zoom', null)
  }, [onZoomInteraction, size])

  useEffect(() => {
    if (!zoomRef.current || !svgRef.current) return
    const { width, height } = sizeRef.current
    const next = zoomIdentity
      .translate(width * (1 - INITIAL_ZOOM) / 2, height * (1 - INITIAL_ZOOM) / 2)
      .scale(INITIAL_ZOOM)
    transformRef.current = { x: next.x, y: next.y, k: next.k }
    select(svgRef.current).call(zoomRef.current.transform, next)
  }, [resetKey])

  const projection = useMemo(() => geoEqualEarth().fitSize([size.width, size.height], {
    type: 'FeatureCollection',
    features,
  }), [features, size])
  const path = useMemo(() => geoPath(projection), [projection])
  const renderedFeatures = useMemo(() => features.map((geo, index) => ({
    geo,
    path: path(geo) || undefined,
    key: geo.id || `${geo.properties?.name || 'country'}-${index}`,
  })), [features, path])

  return (
    <svg ref={svgRef} viewBox={`0 0 ${size.width} ${size.height}`} role="group" aria-labelledby="world-map-title">
      <title id="world-map-title">Interactive sentiment world map</title>
      <defs><pattern id="no-data-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V6" stroke="#fff" strokeOpacity=".28" strokeWidth="2" /></pattern></defs>
      <rect width={size.width} height={size.height} className="map-ocean" />
      <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
        {renderedFeatures.map(({ geo, path: countryPath, key }) => {
          const info = getCountryInfo(geo)
          const country = info?.country
          const name = country?.name || geo.properties?.name || 'Unknown country'
          return (
            <path
              key={key}
              d={countryPath}
              fill={info?.interactive ? info.fill : `url(#no-data-hatch)`}
              className={info?.interactive ? 'country-shape' : 'country-shape country-shape--no-data'}
              stroke={info?.isInSelectedRegion ? '#ffffff' : '#aeb8c4'}
              strokeWidth={0.5 / transform.k}
              tabIndex={info?.interactive ? 0 : -1}
              role={info?.interactive ? 'button' : undefined}
              aria-label={info?.interactive ? `${name}, sentiment data available` : `${name}, no data`}
              onMouseEnter={(event) => onHover?.(geo, event)}
              onMouseMove={(event) => onHover?.(geo, event)}
              onMouseLeave={onLeave}
              onFocus={(event) => onHover?.(geo, event)}
              onBlur={onLeave}
              onClick={() => info?.interactive && onClick?.(geo)}
              onKeyDown={(event) => {
                if (info?.interactive && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  onClick?.(geo)
                }
              }}
            />
          )
        })}
      </g>
    </svg>
  )
}

export default WorldMap
