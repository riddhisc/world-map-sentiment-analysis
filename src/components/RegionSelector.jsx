const RegionSelector = ({ regions, selectedRegion, onRegionChange, disabled = false }) => (
  <label className="region-selector" htmlFor="region-select">
    <span>Region</span>
    <select id="region-select" value={selectedRegion} onChange={(event) => onRegionChange(event.target.value)} disabled={disabled}>
      <option value="all">All regions</option>
      {regions.map((region) => <option key={region} value={region}>{region}</option>)}
    </select>
  </label>
)

export default RegionSelector
