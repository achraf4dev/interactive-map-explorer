import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Fix for default marker icons in react-leaflet
import { Icon } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import CustomMarker from '../../components/CustomMarker';
import FilterPanel from '../../components/FilterPanel';
import { FilterOptions } from '../../models/filterModel';

// Import our models
import { Place } from '../../models/placesModel';
import { WeatherData } from '../../models/weatherModel';

// Import our services
import { getPlacesNearby } from '../../services/placesService';
import { getWeatherByCoords } from '../../services/weatherService';
import { geocodeAddress, reverseGeocode } from '../../services/geocodingService';

// Fix default icon
const defaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Component to handle map center changes
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

function Home() {
  // Barcelona as default location
  const [center, setCenter] = useState<[number, number]>([41.3874, 2.1686]);
  const [zoom, setZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState<string>('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>(undefined);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    radius: 1000,
    showWeather: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch location data
  const fetchLocationData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get location name through OpenStreetMap reverse geocoding
      const locationInfo = await reverseGeocode(lat, lon);
      if (locationInfo.address) {
        const city = locationInfo.address.city || '';
        const country = locationInfo.address.country || '';
        setLocationName(city ? `${city}, ${country}` : country);
      } else {
        setLocationName('');
      }
      
      // Get places nearby from Foursquare
      const placesData = await getPlacesNearby(
        lat, 
        lon, 
        filterOptions.categories.join(','), 
        filterOptions.radius
      );
      setPlaces(placesData);
      
      // Get weather data
      if (filterOptions.showWeather) {
        const weather = await getWeatherByCoords(lat, lon);
        setWeatherData(weather);
      } else {
        setWeatherData(undefined);
      }
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Failed to fetch location data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filterOptions]);

  // Effect to fetch data when center or filters change
  useEffect(() => {
    fetchLocationData(center[0], center[1]);
  }, [center, filterOptions, fetchLocationData]);

  // Handle search form submission - always use OpenStreetMap
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use OpenStreetMap for geocoding
      const results = await geocodeAddress(searchQuery);
      if (results.length > 0) {
        const { lat, lon } = results[0];
        setCenter([parseFloat(lat), parseFloat(lon)]);
        setSearchQuery('');
      } else {
        setError('Location not found. Please try a different search.');
      }
    } catch (err) {
      console.error('Error searching for location:', err);
      setError('Error searching for location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  return (
    <div className="home-container">
      <h1>Interactive Map Explorer</h1>
      
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location (using OpenStreetMap)..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {locationName && (
        <div className="location-info">
          <h2>{locationName}</h2>
          {weatherData && (
            <div className="current-weather">
              <img 
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
              />
              <span className="temperature">{Math.round(weatherData.main.temp)}°C</span>
              <span className="description">{weatherData.weather[0].description}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '600px', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Main location marker */}
          <CustomMarker 
            position={center}
            weather={weatherData}
          />
          
          {/* Place markers */}
          {places.map(place => (
            <CustomMarker
              key={place.fsq_id}
              position={[
                place.geocodes.main.latitude,
                place.geocodes.main.longitude
              ]}
              place={place}
              category={place.categories?.[0]?.name || ''}
            />
          ))}
          
          <MapController center={center} zoom={zoom} />
          <ZoomControl position="bottomright" />
          
          {/* Filter panel */}
          <FilterPanel onFilterChange={handleFilterChange} />
        </MapContainer>
      </div>
      
      {places.length > 0 && (
        <div className="places-list">
          <h3>Nearby Places ({places.length})</h3>
          <div className="places-grid">
            {places.map(place => (
              <div key={place.fsq_id} className="place-card">
                <h4>{place.name}</h4>
                {place.categories && place.categories[0] && (
                  <span className="place-category">{place.categories[0].name}</span>
                )}
                {place.location && (
                  <p className="place-address">{place.location.formatted_address || place.location.address}</p>
                )}
                <button 
                  className="show-on-map-btn"
                  onClick={() => setCenter([
                    place.geocodes.main.latitude,
                    place.geocodes.main.longitude
                  ])}
                >
                  Show on Map
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Interactive Map Explorer. Created with React and Leaflet.</p>
        <p>APIs used: OpenStreetMap, OpenWeather, and Foursquare Places.</p>
      </footer>
    </div>
  );
}

export default Home;
