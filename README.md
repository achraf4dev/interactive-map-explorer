# Interactive Map Explorer

A React application using react-leaflet that integrates multiple APIs to provide an interactive map experience. The app allows users to search for locations, view points of interest, and check weather information.

## Features

- Interactive map with zoom and pan functionality
- Location search using OpenStreetMap's Nominatim service
- Points of interest from Foursquare Places API
- Weather data from OpenWeather API
- Filter places by category and radius
- Responsive design for desktop and mobile

## APIs Used

This application integrates the following APIs:

1. **OpenStreetMap/Nominatim** - For map tiles and geocoding (converting addresses to coordinates)
2. **Foursquare Places API** - For retrieving points of interest
3. **OpenWeather API** - For weather data at specific locations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/achraf4dev/interactive-map-explorer.git
cd interactive-map-explorer
```

2. Install dependencies
```
npm install
```

3. Set up API Keys

Before running the application, you need to get API keys for:
- Foursquare Places API: https://developer.foursquare.com/
- OpenWeather API: https://openweathermap.org/api

Replace the placeholder API keys in the following files:
- `src/services/weatherService.ts`
- `src/services/placesService.ts`

4. Start the development server
```
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

- **Searching**: Enter a location name in the search box and press Enter (powered by OpenStreetMap)
- **Filtering**: Use the filter panel (gear icon) to filter places by category and radius
- **Viewing place details**: Click on any marker to view details about that place
- **Weather information**: Weather data is displayed for the main location

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── models/         # TypeScript interfaces and types
├── pages/          # Page components
├── services/       # API services
└── App.tsx         # Main application component
```

## Customization

You can customize marker icons by replacing the images in the `public/markers` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Foursquare Places API](https://developer.foursquare.com/)
- [OpenWeather API](https://openweathermap.org/api)
