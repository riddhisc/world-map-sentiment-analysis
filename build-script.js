// Custom build script to work around crypto issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables to bypass crypto issues
process.env.NODE_OPTIONS = '--openssl-legacy-provider';

console.log('Building application with custom script...');

try {
  // Run Vite build with environment variables set
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_DISABLE_CRYPTO: 'true'
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
