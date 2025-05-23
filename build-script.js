// Custom build script to work around crypto issues
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
