import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from the React app
app.use(express.static('build'));

// Handle all routes by serving the index.html
app.get('*', function (req, res) {
  res.sendFile(join(__dirname, 'build', 'index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://127.0.0.1:${PORT} in your browser`);
});
