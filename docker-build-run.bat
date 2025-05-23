@echo off
echo Building Docker image for the World Map Sentiment Analysis app...
docker build -t sentiment-world-map .

echo.
echo Docker image built successfully!
echo.
echo To run the application, use the following command:
echo docker run -p 8080:8080 sentiment-world-map
echo.
echo Then access the application at: http://127.0.0.1:8080
echo.

set /p run_now=Do you want to run the container now? (y/n): 

if /i "%run_now%"=="y" (
    echo Starting the container...
    docker run -p 8080:8080 sentiment-world-map
) else (
    echo You can run the container later using: docker run -p 8080:8080 sentiment-world-map
)
