// Types for geocoding data
export interface GeocodingResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: string[];
  importance: number;
  address?: {
    city?: string;
    country?: string;
    country_code?: string;
  };
} 