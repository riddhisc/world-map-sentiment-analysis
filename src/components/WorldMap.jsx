import { useEffect, useRef, useState } from 'react'
import { geoEqualEarth, geoPath } from 'd3-geo'
import { zoom, zoomIdentity } from 'd3-zoom'
import { select } from 'd3-selection'

const INITIAL_TRANSFORM = { x: 0, y: 0, k: 1 }

function WorldMap({ features, getCountryInfo, onHover, onLeave, onClick, onReset }) {
  const svgRef = useRef(null)
  const zoomRef = useRef(null)
  const [size, setSize] = useState({ width: 900, height: 450 })
  const [transform, setTransform] = useState(INITIAL_TRANSFORM)

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
    const element = svgRef.current
    if (!element) return undefined
    const selection = select(element)
    const behavior = zoom()
      .scaleExtent([1, 4])
      .translateExtent([[0, 0], [size.width, size.height]])
      .extent([[0, 0], [size.width, size.height]])
      .on('zoom', (event) => {
        const next = event.transform
        setTransform({ x: next.x, y: next.y, k: next.k })
      })
    zoomRef.current = behavior
    selection.call(behavior)
    return () => selection.on('.zoom', null)
  }, [size])

  useEffect(() => {
    if (!zoomRef.current || !svgRef.current) return
    select(svgRef.current).call(zoomRef.current.transform, zoomIdentity)
    onReset?.()
  }, [onReset])

  const projection = geoEqualEarth().fitSize([size.width, size.height], {
    type: 'FeatureCollection',
    features,
  })
  const path = geoPath(projection)

  return (
    <svg ref={svgRef} viewBox={`0 0 ${size.width} ${size.height}`} role="img" aria-label="Interactive sentiment world map">
      <rect width={size.width} height={size.height} fill="#e6f2ff" />
      <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
        {features.map((geo) => {
          const info = getCountryInfo(geo)
          const country = info?.country
          const name = country?.name || geo.properties?.name || 'Unknown country'
          return (
            <path
              key={geo.id}
              d={path(geo) || undefined}
              fill={info?.fill || '#d9dee5'}
              stroke={info?.isInSelectedRegion ? '#ffffff' : '#aeb8c4'}
              strokeWidth={0.5 / transform.k}
              tabIndex={info?.interactive ? 0 : -1}
              role={info?.interactive ? 'button' : undefined}
              aria-label={info?.interactive ? `${name}, sentiment data available` : `${name}, no data`}
              onMouseEnter={(event) => info?.interactive && onHover?.(geo, event)}
              onMouseMove={(event) => info?.interactive && onHover?.(geo, event)}
              onMouseLeave={onLeave}
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
