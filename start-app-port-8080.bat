@echo off
echo Starting the World Map Sentiment Analysis app on port 8080...
echo.

REM We're using the .env file to set PORT=8080

echo Building the React app...
npm run build

echo.
echo Starting the server on port 8080...
echo.

REM Use a simple http-server to serve the build folder
npx serve -s build -l 8080

echo.
echo Server is running at http://localhost:8080
echo Press Ctrl+C to stop the server
