import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  const styles = {
    container: {
      padding: '15px',
      backgroundColor: 'rgba(255, 235, 235, 0.9)',
      border: '1px solid #ffcccc',
      borderRadius: '5px',
      margin: '10px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    icon: {
      color: '#d9534f',
      fontSize: '24px',
      marginBottom: '10px',
    },
    message: {
      color: '#d9534f',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: '#4a90e2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      cursor: 'pointer',
      marginTop: '10px',
      fontWeight: 'bold',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚠️</div>
      <div style={styles.message}>{message}</div>
      {onRetry && (
        <button style={styles.button} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
