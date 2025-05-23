import React from 'react';

const DetailedSentimentPanel = ({ country, sentimentData, onClose }) => {
  if (!country || !sentimentData) return null;
  
  // Map of country IDs to country names since world-atlas doesn't include names
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
  };
  
  // Get the country name from the ID
  const countryName = countryNames[country.id] || 'Unknown';

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    panel: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      padding: '20px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#666',
    },
    header: {
      borderBottom: '1px solid #eee',
      paddingBottom: '10px',
      marginBottom: '15px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#333',
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px',
    },
    section: {
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#444',
    },
    barContainer: {
      height: '25px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '15px',
      overflow: 'hidden',
      display: 'flex',
    },
    bar: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '12px',
      transition: 'width 0.3s ease',
    },
    positiveBar: {
      backgroundColor: 'rgba(0, 180, 0, 0.8)',
    },
    neutralBar: {
      backgroundColor: 'rgba(255, 204, 0, 0.8)',
    },
    negativeBar: {
      backgroundColor: 'rgba(220, 0, 0, 0.8)',
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      marginTop: '15px',
    },
    statItem: {
      backgroundColor: '#f9f9f9',
      padding: '10px',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
    },
    statLabel: {
      fontSize: '12px',
      color: '#666',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
    comparisonSection: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '6px',
    },
  };

  // Calculate overall sentiment score
  const overallScore = sentimentData.positive - sentimentData.negative;
  
  // Determine sentiment status
  const getSentimentStatus = () => {
    if (overallScore > 30) return { text: 'Very Positive', color: '#00a000' };
    if (overallScore > 10) return { text: 'Positive', color: '#00c000' };
    if (overallScore > -10) return { text: 'Neutral', color: '#cccc00' };
    if (overallScore > -30) return { text: 'Negative', color: '#c00000' };
    return { text: 'Very Negative', color: '#a00000' };
  };
  
  const sentimentStatus = getSentimentStatus();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        
        <div style={styles.header}>
          <div style={styles.title}>{countryName}</div>
          <div style={styles.subtitle}>Region: {sentimentData.region}</div>
        </div>
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Sentiment Breakdown</div>
          
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <span>Positive</span>
              <span>{sentimentData.positive}%</span>
            </div>
            <div style={styles.barContainer}>
              <div 
                style={{
                  ...styles.bar, 
                  ...styles.positiveBar,
                  width: `${sentimentData.positive}%`
                }}
              >
                {sentimentData.positive > 10 ? `${sentimentData.positive}%` : ''}
              </div>
            </div>
          </div>
          
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <span>Neutral</span>
              <span>{sentimentData.neutral}%</span>
            </div>
            <div style={styles.barContainer}>
              <div 
                style={{
                  ...styles.bar, 
                  ...styles.neutralBar,
                  width: `${sentimentData.neutral}%`
                }}
              >
                {sentimentData.neutral > 10 ? `${sentimentData.neutral}%` : ''}
              </div>
            </div>
          </div>
          
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <span>Negative</span>
              <span>{sentimentData.negative}%</span>
            </div>
            <div style={styles.barContainer}>
              <div 
                style={{
                  ...styles.bar, 
                  ...styles.negativeBar,
                  width: `${sentimentData.negative}%`
                }}
              >
                {sentimentData.negative > 10 ? `${sentimentData.negative}%` : ''}
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.statGrid}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Overall Sentiment</span>
            <span style={{...styles.statValue, color: sentimentStatus.color}}>
              {sentimentStatus.text}
            </span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Sentiment Score</span>
            <span style={styles.statValue}>{overallScore}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Positive to Negative Ratio</span>
            <span style={styles.statValue}>
              {sentimentData.negative === 0 
                ? '∞' 
                : (sentimentData.positive / sentimentData.negative).toFixed(1)}
            </span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Dominant Sentiment</span>
            <span style={styles.statValue}>
              {sentimentData.positive > sentimentData.neutral && sentimentData.positive > sentimentData.negative
                ? 'Positive'
                : sentimentData.negative > sentimentData.neutral && sentimentData.negative > sentimentData.positive
                  ? 'Negative'
                  : 'Neutral'}
            </span>
          </div>
        </div>
        
        <div style={styles.comparisonSection}>
          <div style={styles.sectionTitle}>Regional Context</div>
          <p style={{fontSize: '14px', lineHeight: '1.5'}}>
            {countryName} shows {overallScore > 0 ? 'positive' : overallScore < 0 ? 'negative' : 'neutral'} sentiment 
            overall, with {sentimentData.positive}% positive responses. This is 
            {sentimentData.positive > 60 ? ' above average' : sentimentData.positive < 50 ? ' below average' : ' average'} 
            for the {sentimentData.region} region.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedSentimentPanel;
