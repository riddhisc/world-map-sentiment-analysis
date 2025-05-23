export const sentimentData = [
  {
    "country": "US",
    "region": "North America",
    "positive": 65,
    "neutral": 25,
    "negative": 10
  },
  {
    "country": "CA",
    "region": "North America",
    "positive": 70,
    "neutral": 20,
    "negative": 10
  },
  {
    "country": "GB",
    "region": "Europe",
    "positive": 55,
    "neutral": 30,
    "negative": 15
  },
  {
    "country": "FR",
    "region": "Europe",
    "positive": 50,
    "neutral": 35,
    "negative": 15
  },
  {
    "country": "DE",
    "region": "Europe",
    "positive": 60,
    "neutral": 25,
    "negative": 15
  },
  {
    "country": "JP",
    "region": "Asia",
    "positive": 75,
    "neutral": 15,
    "negative": 10
  },
  {
    "country": "CN",
    "region": "Asia",
    "positive": 45,
    "neutral": 30,
    "negative": 25
  },
  {
    "country": "IN",
    "region": "Asia",
    "positive": 60,
    "neutral": 25,
    "negative": 15
  },
  {
    "country": "BR",
    "region": "South America",
    "positive": 70,
    "neutral": 20,
    "negative": 10
  },
  {
    "country": "ZA",
    "region": "Africa",
    "positive": 55,
    "neutral": 30,
    "negative": 15
  },
  {
    "country": "AU",
    "region": "Oceania",
    "positive": 75,
    "neutral": 15,
    "negative": 10
  },
  {
    "country": "RU",
    "region": "Europe",
    "positive": 40,
    "neutral": 35,
    "negative": 25
  },
  {
    "country": "MX",
    "region": "North America",
    "positive": 65,
    "neutral": 25,
    "negative": 10
  },
  {
    "country": "IT",
    "region": "Europe",
    "positive": 60,
    "neutral": 25,
    "negative": 15
  },
  {
    "country": "ES",
    "region": "Europe",
    "positive": 65,
    "neutral": 20,
    "negative": 15
  },
  {
    "country": "KR",
    "region": "Asia",
    "positive": 70,
    "neutral": 20,
    "negative": 10
  },
  {
    "country": "SA",
    "region": "Middle East",
    "positive": 50,
    "neutral": 30,
    "negative": 20
  },
  {
    "country": "EG",
    "region": "Africa",
    "positive": 45,
    "neutral": 35,
    "negative": 20
  },
  {
    "country": "NG",
    "region": "Africa",
    "positive": 60,
    "neutral": 25,
    "negative": 15
  },
  {
    "country": "AR",
    "region": "South America",
    "positive": 65,
    "neutral": 25,
    "negative": 10
  }
];

// Create a mapping of country codes to ISO Alpha-3 codes for the map
export const countryCodeMapping = {
  "US": "USA",
  "CA": "CAN",
  "GB": "GBR",
  "FR": "FRA",
  "DE": "DEU",
  "JP": "JPN",
  "CN": "CHN",
  "IN": "IND",
  "BR": "BRA",
  "ZA": "ZAF",
  "AU": "AUS",
  "RU": "RUS",
  "MX": "MEX",
  "IT": "ITA",
  "ES": "ESP",
  "KR": "KOR",
  "SA": "SAU",
  "EG": "EGY",
  "NG": "NGA",
  "AR": "ARG"
};

// Helper function to get overall sentiment score
export const getOverallSentiment = (data) => {
  return data.positive - data.negative;
};

// Helper function to get dominant sentiment
export const getDominantSentiment = (data) => {
  const { positive, neutral, negative } = data;
  let result;
  
  if (positive > neutral && positive > negative) result = "positive";
  else if (negative > neutral && negative > positive) result = "negative";
  else if (neutral > positive && neutral > negative) result = "neutral";
  // In case of ties, prioritize in this order: positive, neutral, negative
  else if (positive === negative && positive > neutral) result = "positive";
  else if (positive === neutral && positive > negative) result = "positive";
  else if (neutral === negative && neutral > positive) result = "neutral";
  // If all values are equal
  else result = "neutral";
  
  // Log for debugging
  console.log(`Country data:`, data.country, `- Dominant sentiment: ${result}`, 
              `(Positive: ${data.positive}%, Neutral: ${data.neutral}%, Negative: ${data.negative}%)`);
  
  return result;
};

// Helper function to get color based on sentiment type and value
export const getSentimentColor = (type, value, data) => {
  switch(type) {
    case "positive":
      // Green gradient from light to dark
      return `rgba(0, ${Math.min(200 + value/2, 255)}, 0, 0.7)`;
    case "neutral":
      // Yellow gradient
      return `rgba(${Math.min(200 + value/2, 255)}, ${Math.min(200 + value/2, 255)}, 0, 0.7)`;
    case "negative":
      // Red gradient
      return `rgba(${Math.min(200 + value/2, 255)}, 0, 0, 0.7)`;
    case "overall":
      // For overall sentiment, use the dominant sentiment
      if (data) {
        const dominantType = getDominantSentiment(data);
        // Use the value of the dominant sentiment type for intensity
        const intensityValue = data[dominantType];
        
        // Return color based on dominant sentiment type
        switch(dominantType) {
          case "positive":
            // Green for positive dominant sentiment
            return `rgba(0, ${Math.min(200 + intensityValue/2, 255)}, 0, 0.7)`;
          case "neutral":
            // Yellow for neutral dominant sentiment
            return `rgba(${Math.min(200 + intensityValue/2, 255)}, ${Math.min(200 + intensityValue/2, 255)}, 0, 0.7)`;
          case "negative":
            // Red for negative dominant sentiment
            return `rgba(${Math.min(200 + intensityValue/2, 255)}, 0, 0, 0.7)`;
          default:
            return '#DDD';
        }
      }
      
      // Fallback to original calculation if no data is provided
      if (value > 0) {
        // Positive: Green
        return `rgba(0, ${Math.min(150 + value, 255)}, 0, 0.7)`;
      } else if (value < 0) {
        // Negative: Red
        const absValue = Math.abs(value);
        return `rgba(${Math.min(150 + absValue, 255)}, 0, 0, 0.7)`;
      } else {
        // Neutral: Yellow
        return `rgba(255, 255, 0, 0.7)`;
      }
    default:
      return "#DDD";
  }
};
