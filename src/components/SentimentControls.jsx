import React from 'react';

const SentimentControls = ({ activeSentiment, onSentimentChange, disabled = false }) => {
  const controlStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px', // Increased gap between buttons
      margin: '15px 0 5px', // Increased top margin to make room for the label
      position: 'relative',
      padding: '10px 5px 5px', // Increased top padding
      borderRadius: '8px',
      backgroundColor: 'rgba(236, 240, 241, 0.5)',
    },
    button: {
      padding: '10px 16px',
      margin: '0 2px',
      borderRadius: '6px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      backgroundColor: 'transparent',
      color: '#34495e',
      opacity: disabled ? 0.6 : 1,
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1,
      boxShadow: 'none',
      minWidth: '100px', // Ensure buttons have minimum width
    },
    activeButton: {
      backgroundColor: '#fff',
      color: '#2c3e50',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    buttonIcon: {
      marginRight: '6px',
      fontSize: '14px',
    },
    disabledButton: {
      cursor: 'not-allowed',
      opacity: 0.6,
    },
    label: {
      position: 'absolute',
      top: '-10px',
      left: '50%', // Center the label
      transform: 'translateX(-50%)', // Center the label
      fontSize: '12px',
      fontWeight: '600',
      color: '#7f8c8d',
      backgroundColor: '#fff',
      padding: '2px 10px',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      zIndex: 2, // Ensure label is above buttons
      whiteSpace: 'nowrap', // Prevent text wrapping
    }
  };

  const sentimentOptions = [
    { id: 'overall', label: 'Overall', icon: '📊' },
    { id: 'positive', label: 'Positive', icon: '✓' },
    { id: 'neutral', label: 'Neutral', icon: '○' },
    { id: 'negative', label: 'Negative', icon: '✗' },
  ];

  return (
    <div style={controlStyles.container}>
      <div style={controlStyles.label}>Select Sentiment</div>
      {sentimentOptions.map((option) => {
        const isActive = activeSentiment === option.id;
        const buttonStyle = {
          ...controlStyles.button,
          ...(isActive ? controlStyles.activeButton : {}),
          // Add subtle color hints based on sentiment type
          borderBottom: isActive ? 
            option.id === 'positive' ? '3px solid #27ae60' :
            option.id === 'neutral' ? '3px solid #f39c12' :
            option.id === 'negative' ? '3px solid #c0392b' :
            '3px solid #3498db' : 'none'
        };
        
        return (
          <button
            key={option.id}
            style={buttonStyle}
            onClick={() => !disabled && onSentimentChange(option.id)}
            disabled={disabled}
            title={`Show ${option.label} Sentiment`}
          >
            <span style={controlStyles.buttonIcon}>{option.icon}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SentimentControls;
