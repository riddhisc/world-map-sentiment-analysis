// Simple deployment script for GitHub Pages
import { execSync } from 'child_process';

console.log('Starting deployment process...');

try {
  // Build the app directly with Vite
  console.log('Building the application...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--openssl-legacy-provider'
    }
  });
  
  // Deploy to GitHub Pages
  console.log('Deploying to GitHub Pages...');
  execSync('npx gh-pages -d build', { 
    stdio: 'inherit'
  });
  
  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
