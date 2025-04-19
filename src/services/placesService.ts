import axios from 'axios';
import { Place } from '../models/placesModel';

const API_KEY = 'fsq3SJjUXeYhrdjg4R50awOYEiDm/xaVv3ugWieTluqLVgU=';
const BASE_URL = 'https://api.foursquare.com/v3/places';

// Get places near coordinates
export const getPlacesNearby = async (
  lat: number, 
  lon: number, 
  query?: string, 
  radius: number = 1000, 
  limit: number = 10
): Promise<Place[]> => {
  try {
    const params: any = {
      ll: `${lat},${lon}`,
      radius,
      limit,
    };
    
    // Add query if provided
    if (query) {
      params.query = query;
    }
    
    const response = await axios.get(`${BASE_URL}/search`, {
      params,
      headers: {
        Authorization: `${API_KEY}`,
        Accept: 'application/json'
      }
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Error fetching places data:', error);
    throw error;
  }
};

// Search for places by text query
export const searchPlacesByQuery = async (
  query: string,
  limit: number = 10
): Promise<Place[]> => {
  try {
    const params: any = {
      query,
      limit
    };
    
    const response = await axios.get(`${BASE_URL}/search`, {
      params,
      headers: {
        Authorization: `${API_KEY}`,
        Accept: 'application/json'
      }
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Error searching for places:', error);
    throw error;
  }
};

// Get details for a specific place
export const getPlaceDetails = async (placeId: string): Promise<Place> => {
  try {
    const response = await axios.get(`${BASE_URL}/${placeId}`, {
      headers: {
        Authorization: `${API_KEY}`,
        Accept: 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

// Get place category icon URL
export const getCategoryIconUrl = (prefix: string, suffix: string, size: number = 64): string => {
  return `${prefix}${size}${suffix}`;
}; 