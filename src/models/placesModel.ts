// Types for places data
export interface Place {
  fsq_id: string;
  categories: {
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }[];
  chains: any[];
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  location: {
    address: string;
    country: string;
    cross_street: string;
    formatted_address: string;
    locality: string;
    postcode: string;
    region: string;
  };
  name: string;
  related_places: any;
  timezone: string;
} 