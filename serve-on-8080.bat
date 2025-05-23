@echo off
echo Installing serve package...
npm install -g serve

echo.
echo Building the React app...
npm run build

echo.
echo Starting server on port 8080...
echo Your app will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server when you're done.

serve -s build -l 8080
