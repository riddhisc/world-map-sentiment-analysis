import React from 'react';

const Legend = ({ sentimentType }) => {
  const legendStyles = {
    container: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontSize: '13px',
      maxWidth: '220px',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(236, 240, 241, 0.8)',
    },
    title: {
      fontWeight: '600',
      marginBottom: '8px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#2c3e50',
      borderBottom: '2px solid #3498db',
      paddingBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '4px 0',
    },
    colorBox: {
      width: '18px',
      height: '18px',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    },
    label: {
      flexGrow: 1,
      fontWeight: '500',
      color: '#34495e',
    },
    footer: {
      fontSize: '11px',
      marginTop: '8px',
      color: '#7f8c8d',
      fontStyle: 'italic',
      borderTop: '1px solid #ecf0f1',
      paddingTop: '6px',
    }
  };

  const renderLegendItems = () => {
    switch (sentimentType) {
      case 'positive':
        return (
          <>
            <div style={legendStyles.title}>Positive Sentiment</div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(0, 200, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>Low (0-33%)</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(0, 225, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>Medium (34-66%)</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(0, 255, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>High (67-100%)</div>
            </div>
          </>
        );
      case 'neutral':
        return (
          <>
            <div style={legendStyles.title}>Neutral Sentiment</div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(200, 200, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>Low (0-33%)</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(225, 225, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>Medium (34-66%)</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(255, 255, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>High (67-100%)</div>
            </div>
          </>
        );
      case 'negative':
        return (
          <>
            <div style={legendStyles.title}>Negative Sentiment</div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(200, 0, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>Low (0-33%)</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(225, 0, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>Medium (34-66%)</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(255, 0, 0, 0.7)' }}></div>
              <div style={legendStyles.label}>High (67-100%)</div>
            </div>
          </>
        );
      case 'overall':
        return (
          <>
            <div style={legendStyles.title}>Overall Sentiment</div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(192, 57, 43, 0.85)' }}></div>
              <div style={legendStyles.label}>Negative Dominant</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(243, 156, 18, 0.85)' }}></div>
              <div style={legendStyles.label}>Neutral Dominant</div>
            </div>
            <div style={legendStyles.row}>
              <div style={{ ...legendStyles.colorBox, backgroundColor: 'rgba(39, 174, 96, 0.85)' }}></div>
              <div style={legendStyles.label}>Positive Dominant</div>
            </div>
            <div style={legendStyles.footer}>
              Countries are colored based on their dominant sentiment
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return <div style={legendStyles.container}>{renderLegendItems()}</div>;
};

export default Legend;
