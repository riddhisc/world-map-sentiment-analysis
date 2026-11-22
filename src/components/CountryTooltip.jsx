import React from 'react';

const CountryTooltip = ({ country, sentimentData, position }) => {
  if (!country || !sentimentData) return null;
  
  const countryName = sentimentData.name || sentimentData.displayName || 'Unknown';

  if (sentimentData.noData) {
    return (
      <div className="country-tooltip" role="status" style={{ left: position?.x ?? 12, top: position?.y ?? 12 }}>
        <strong>{countryName}</strong>
        <p>No sentiment data available for this country.</p>
      </div>
    );
  }

  const tooltipStyles = {
    container: {
      position: 'absolute',
      top: `${position?.y ?? 10}px`,
      left: `${position?.x ?? 10}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      maxWidth: '280px',
      fontSize: '14px',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(236, 240, 241, 0.9)',
    },
    title: {
      fontWeight: '700',
      fontSize: '18px',
      marginBottom: '10px',
      color: '#2c3e50',
      borderBottom: '2px solid #3498db',
      paddingBottom: '8px',
      textAlign: 'center',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '6px 0',
      alignItems: 'center',
    },
    label: {
      fontWeight: '600',
      color: '#34495e',
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: '6px',
      fontSize: '14px',
    },
    value: {
      fontWeight: '500',
      backgroundColor: 'rgba(236, 240, 241, 0.7)',
      padding: '3px 8px',
      borderRadius: '4px',
      color: '#2c3e50',
    },
    barContainer: {
      height: '12px',
      width: '100%',
      backgroundColor: '#ecf0f1',
      borderRadius: '6px',
      marginTop: '10px',
      marginBottom: '5px',
      overflow: 'hidden',
      display: 'flex',
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    positiveBar: {
      height: '100%',
      backgroundColor: 'rgba(39, 174, 96, 0.85)',
    },
    neutralBar: {
      height: '100%',
      backgroundColor: 'rgba(243, 156, 18, 0.85)',
    },
    negativeBar: {
      height: '100%',
      backgroundColor: 'rgba(192, 57, 43, 0.85)',
    },
    footer: {
      fontSize: '11px',
      color: '#7f8c8d',
      fontStyle: 'italic',
      marginTop: '10px',
      textAlign: 'center',
      borderTop: '1px solid #ecf0f1',
      paddingTop: '8px',
    }
  };

  // Determine dominant sentiment for highlighting
  const dominantSentiment = (() => {
    const { positive, neutral, negative } = sentimentData;
    if (positive > neutral && positive > negative) return 'positive';
    if (negative > neutral && negative > positive) return 'negative';
    return 'neutral';
  })();

  return (
    <div style={tooltipStyles.container}>
      <div style={tooltipStyles.title}>{countryName}</div>
      <div style={tooltipStyles.row}>
        <span style={tooltipStyles.label}>
          <span style={tooltipStyles.icon}>🌎</span>
          Region:
        </span>
        <span style={tooltipStyles.value}>{sentimentData.region}</span>
      </div>
      <div style={tooltipStyles.row}>
        <span style={tooltipStyles.label}>
          <span style={tooltipStyles.icon}>✓</span>
          Positive:
        </span>
        <span style={{...tooltipStyles.value, 
          fontWeight: dominantSentiment === 'positive' ? '700' : '500',
          backgroundColor: dominantSentiment === 'positive' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(236, 240, 241, 0.7)'
        }}>
          {sentimentData.positive}%
        </span>
      </div>
      <div style={tooltipStyles.row}>
        <span style={tooltipStyles.label}>
          <span style={tooltipStyles.icon}>○</span>
          Neutral:
        </span>
        <span style={{...tooltipStyles.value, 
          fontWeight: dominantSentiment === 'neutral' ? '700' : '500',
          backgroundColor: dominantSentiment === 'neutral' ? 'rgba(243, 156, 18, 0.2)' : 'rgba(236, 240, 241, 0.7)'
        }}>
          {sentimentData.neutral}%
        </span>
      </div>
      <div style={tooltipStyles.row}>
        <span style={tooltipStyles.label}>
          <span style={tooltipStyles.icon}>✗</span>
          Negative:
        </span>
        <span style={{...tooltipStyles.value, 
          fontWeight: dominantSentiment === 'negative' ? '700' : '500',
          backgroundColor: dominantSentiment === 'negative' ? 'rgba(192, 57, 43, 0.2)' : 'rgba(236, 240, 241, 0.7)'
        }}>
          {sentimentData.negative}%
        </span>
      </div>
      <div style={tooltipStyles.barContainer}>
        <div 
          style={{
            ...tooltipStyles.positiveBar,
            width: `${sentimentData.positive}%`
          }}
        />
        <div 
          style={{
            ...tooltipStyles.neutralBar,
            width: `${sentimentData.neutral}%`
          }}
        />
        <div 
          style={{
            ...tooltipStyles.negativeBar,
            width: `${sentimentData.negative}%`
          }}
        />
      </div>
      <div style={tooltipStyles.footer}>
        Click for detailed sentiment breakdown
      </div>
    </div>
  );
};

export default CountryTooltip;
