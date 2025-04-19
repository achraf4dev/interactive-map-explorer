import { useState } from 'react';
import { FilterOptions } from '../models/filterModel';
import './FilterPanel.css';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  defaultRadius?: number;
  defaultCategories?: string[];
}

const PREDEFINED_CATEGORIES = [
  'restaurants',
  'hotels',
  'attractions',
  'shops',
  'services',
  'transit',
  'nightlife',
  'outdoors'
];

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onFilterChange,
  defaultRadius = 1000,
  defaultCategories = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(defaultCategories);
  const [radius, setRadius] = useState(defaultRadius);
  const [showWeather, setShowWeather] = useState(true);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    
    // Call the parent's filter change handler
    onFilterChange({
      categories: updatedCategories,
      radius,
      showWeather
    });
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    
    onFilterChange({
      categories: selectedCategories,
      radius: newRadius,
      showWeather
    });
  };

  const handleWeatherToggle = () => {
    const newShowWeather = !showWeather;
    setShowWeather(newShowWeather);
    
    onFilterChange({
      categories: selectedCategories,
      radius,
      showWeather: newShowWeather
    });
  };

  return (
    <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
      <button 
        className="toggle-button"
        onClick={togglePanel}
        aria-label={isOpen ? 'Close filters' : 'Open filters'}
      >
        <span className="filter-icon">⚙️</span>
        <span className="filter-text">Filters</span>
      </button>
      
      <div className="filter-content">
        <h3>Filter Options</h3>
        
        <div className="filter-section">
          <h4>Categories</h4>
          <div className="category-options">
            {PREDEFINED_CATEGORIES.map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="category-name">{category}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="filter-section">
          <h4>Search Radius: {radius}m</h4>
          <input
            type="range"
            min="200"
            max="5000"
            step="100"
            value={radius}
            onChange={handleRadiusChange}
            className="radius-slider"
          />
        </div>
        
        <div className="filter-section">
          <label className="weather-toggle">
            <input
              type="checkbox"
              checked={showWeather}
              onChange={handleWeatherToggle}
            />
            <span>Show Weather Data</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 