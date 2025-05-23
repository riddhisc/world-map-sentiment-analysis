import React from 'react';

const RegionSummary = ({ region, sentimentData }) => {
  if (!region || !sentimentData || sentimentData.length === 0) return null;

  const styles = {
    container: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '15px',
      borderRadius: '6px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      zIndex: 1000,
      maxWidth: '300px',
      fontSize: '14px',
    },
    title: {
      fontWeight: 'bold',
      fontSize: '16px',
      marginBottom: '10px',
      borderBottom: '1px solid #eee',
      paddingBottom: '5px',
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '5px 0',
    },
    label: {
      color: '#555',
    },
    value: {
      fontWeight: '500',
    },
    barContainer: {
      height: '12px',
      backgroundColor: '#f0f0f0',
      borderRadius: '6px',
      marginTop: '3px',
      marginBottom: '10px',
      overflow: 'hidden',
      display: 'flex',
    },
    positiveBar: {
      height: '100%',
      backgroundColor: 'rgba(0, 180, 0, 0.7)',
    },
    neutralBar: {
      height: '100%',
      backgroundColor: 'rgba(255, 204, 0, 0.7)',
    },
    negativeBar: {
      height: '100%',
      backgroundColor: 'rgba(220, 0, 0, 0.7)',
    },
    footer: {
      fontSize: '12px',
      color: '#666',
      marginTop: '10px',
      fontStyle: 'italic',
    }
  };

  // Calculate average sentiment values for the region
  const calculateRegionAverages = () => {
    const total = sentimentData.length;
    const sums = sentimentData.reduce((acc, country) => {
      acc.positive += country.positive;
      acc.neutral += country.neutral;
      acc.negative += country.negative;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    return {
      positive: Math.round(sums.positive / total),
      neutral: Math.round(sums.neutral / total),
      negative: Math.round(sums.negative / total),
    };
  };

  const averages = calculateRegionAverages();
  
  // Calculate additional statistics
  const countryCount = sentimentData.length;
  
  // Find most positive and most negative countries
  const mostPositive = sentimentData.reduce((prev, current) => 
    (prev.positive > current.positive) ? prev : current
  );
  
  const mostNegative = sentimentData.reduce((prev, current) => 
    (prev.negative > current.negative) ? prev : current
  );

  return (
    <div style={styles.container}>
      <div style={styles.title}>{region} Region Summary</div>
      
      <div>
        <div style={styles.statRow}>
          <span style={styles.label}>Average Positive:</span>
          <span style={styles.value}>{averages.positive}%</span>
        </div>
        <div style={styles.barContainer}>
          <div style={{...styles.positiveBar, width: `${averages.positive}%`}}></div>
        </div>
        
        <div style={styles.statRow}>
          <span style={styles.label}>Average Neutral:</span>
          <span style={styles.value}>{averages.neutral}%</span>
        </div>
        <div style={styles.barContainer}>
          <div style={{...styles.neutralBar, width: `${averages.neutral}%`}}></div>
        </div>
        
        <div style={styles.statRow}>
          <span style={styles.label}>Average Negative:</span>
          <span style={styles.value}>{averages.negative}%</span>
        </div>
        <div style={styles.barContainer}>
          <div style={{...styles.negativeBar, width: `${averages.negative}%`}}></div>
        </div>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.label}>Countries in Region:</span>
        <span style={styles.value}>{countryCount}</span>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.label}>Most Positive:</span>
        <span style={styles.value}>{mostPositive.country} ({mostPositive.positive}%)</span>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.label}>Most Negative:</span>
        <span style={styles.value}>{mostNegative.country} ({mostNegative.negative}%)</span>
      </div>
      
      <div style={styles.footer}>
        Click on individual countries for detailed breakdown
      </div>
    </div>
  );
};

export default RegionSummary;
