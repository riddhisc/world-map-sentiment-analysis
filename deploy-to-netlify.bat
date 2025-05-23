@echo off
echo Building and deploying your World Map Sentiment Analysis app to Netlify...
echo.

echo Building the React app...
call npm run build

echo.
echo Deploying to Netlify...
echo This will give you a standard Netlify URL like yoursite.netlify.app
echo.

npx netlify deploy --prod --dir=build

echo.
echo Your app has been deployed to Netlify!
echo You can share the Netlify URL with anyone.
echo.
pause
