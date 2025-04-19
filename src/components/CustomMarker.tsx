import { Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Place } from '../models/placesModel';
import { WeatherData } from '../models/weatherModel';
import { getWeatherIconUrl } from '../services/weatherService';
import './CustomMarker.css';

const createIcon = (category?: string): Icon => {
  let iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
  let iconSize: [number, number] = [25, 41];
  
  switch (category?.toLowerCase()) {
    case 'restaurant':
    case 'food':
      iconUrl = 'https://static.thenounproject.com/png/1661307-200.png';
      iconSize = [32, 32];
      break;
    case 'hotel':
    case 'lodging':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/9922/9922103.png';
      iconSize = [32, 32];
      break;
    case 'attraction':
    case 'entertainment':
      iconUrl = 'https://cdn0.iconfinder.com/data/icons/map-markers-2-1/512/xxx004-512.png';
      iconSize = [32, 32];
      break;
    default:
      break;
  }
  
  return new Icon({
    iconUrl,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });
};

interface CustomMarkerProps {
  position: LatLngExpression;
  place?: Place;
  weather?: WeatherData;
  category?: string;
  clickHandler?: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ 
  position, 
  place, 
  weather, 
  category,
  clickHandler 
}) => {
  // Create event handlers object only if clickHandler is defined
  const eventHandlers = clickHandler ? { click: clickHandler } : {};
  
  return (
    <Marker 
      position={position} 
      icon={createIcon(category)}
      eventHandlers={eventHandlers}
    >
      <Popup className="custom-popup">
        {place && (
          <div className="place-info">
            <h3>{place.name}</h3>
            {place.location && (
              <p className="address">{place.location.formatted_address || place.location.address}</p>
            )}
            {place.categories && place.categories.length > 0 && (
              <div className="categories">
                {place.categories.map(cat => (
                  <span key={cat.id} className="category-tag">{cat.name}</span>
                ))}
              </div>
            )}
          </div>
        )}
        
        {weather && (
          <div className="weather-info">
            <div className="weather-header">
              <img 
                src={getWeatherIconUrl(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
                className="weather-icon"
              />
              <div className="weather-temp">
                <span className="temp">{Math.round(weather.main.temp)}°C</span>
                <span className="feels-like">Feels like: {Math.round(weather.main.feels_like)}°C</span>
              </div>
            </div>
            <div className="weather-details">
              <p className="description">{weather.weather[0].description}</p>
              <div className="weather-metrics">
                <span>Humidity: {weather.main.humidity}%</span>
                <span>Wind: {weather.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        )}
        
        {!place && !weather && (
          <div className="default-popup">
            <p>Marker at {Array.isArray(position) ? `${position[0]}, ${position[1]}` : 'this location'}.</p>
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default CustomMarker; 