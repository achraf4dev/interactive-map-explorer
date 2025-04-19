import axios from 'axios';
import { GeocodingResult } from '../models/geocodingModel';

const BASE_URL = 'https://nominatim.openstreetmap.org';

// Convert address or place name to coordinates
export const geocodeAddress = async (address: string): Promise<GeocodingResult[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        email: 'achrafibrahimi.1998@gmail.com' 
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

// Convert coordinates to address/place info (reverse geocoding)
export const reverseGeocode = async (lat: number, lon: number): Promise<GeocodingResult> => {
  try {
    const response = await axios.get(`${BASE_URL}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1,
        email: 'achrafibrahimi.1998@gmail.com'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
}; 