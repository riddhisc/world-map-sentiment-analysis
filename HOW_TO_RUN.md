# World Map Sentiment Analysis Application

## How to Run the Application on Port 8080

### Option 1: Using the Development Server

1. Open a terminal/command prompt in the project directory
2. Create a file named `.env` in the project root with the following content:
   ```
   PORT=8080
   ```
3. Run the following commands:
   ```
   npm install
   npm start
   ```
4. The application will be available at: http://localhost:8080

### Option 2: Building and Serving the Production Version

1. Open a terminal/command prompt in the project directory
2. Run the following commands:
   ```
   npm install
   npm run build
   npx serve -s build -l 8080
   ```
3. The application will be available at: http://localhost:8080

### Option 3: Using Docker (if Docker is installed)

1. Open a terminal/command prompt in the project directory
2. Run the following commands:
   ```
   docker build -t sentiment-world-map .
   docker run -p 8080:8080 sentiment-world-map
   ```
3. The application will be available at: http://localhost:8080

## Features

- Interactive world map showing sentiment analysis data
- Filter by region (North America, South America, Europe, Asia, Africa, Oceania)
- View different sentiment types (Overall, Positive, Neutral, Negative)
- Hover over countries to see detailed sentiment data
- Click on countries for more information
- Zoom and pan functionality for better exploration

## Technologies Used

- React
- React Simple Maps
- TopoJSON
- CSS for styling
