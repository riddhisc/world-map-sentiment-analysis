import React from 'react';

const RegionSelector = ({ regions, selectedRegion, onRegionChange, disabled = false }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px 0',
    },
    label: {
      fontSize: '14px',
      marginBottom: '5px',
      fontWeight: '500',
      opacity: disabled ? 0.6 : 1,
    },
    select: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: disabled ? '#f5f5f5' : 'white',
      fontSize: '14px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      maxWidth: '250px',
      margin: '0 auto',
      opacity: disabled ? 0.6 : 1,
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label} htmlFor="region-select">Select Region</label>
      <select 
        id="region-select"
        style={styles.select}
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        disabled={disabled}
      >
        <option value="all">All Regions</option>
        {regions.map(region => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionSelector;
