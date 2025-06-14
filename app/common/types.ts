export interface User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface BeachData {
  id?: number;
  name: string;
  address: string;
  beachTypeId: string;
  beachDepthId: string;
  beach_country: string;
  beachTextureId: string;
  cityId: string;
  working_hours: string;
  description: string;
  best_time_to_visit?: string;
  local_wildlife?: string;
  restaurants_and_bars_nearby?: string;
  characteristics?: Array<number>;
  featured_items: Array<string>;
  approved?: boolean;
  userId: string;
  images?: Array<string>;
}

export interface BeachDetailsData {
  id?: number;
  name: string;
  address: string;
  beachTypeId: number;
  beachDepthId: number;
  beach_country: string;
  beachTextureId: number;
  cityId: string;
  beach_working_hours: string;
  description: string;
  best_time_to_visit?: string;
  local_wildlife?: string;
  restaurants_and_bars_nearby?: string;
  characteristics?: Array<{
    name: string;
    icon_url: string;
    beach_has_characteristics: { featured: boolean };
  }>;
  featured_items: Array<string>;
  approved?: boolean;
  userId: string;
  images?: Array<string>;
  beach_depth: { description: string };
  beach_texture: { name: string; img_url: string };
  beach_type: { name: string };
  cities: {
    name: string;
    latitude: string;
    longitude: string;
    countries: { name: string };
  };
  reviews: Array<{
    title: string;
    description: string;
    rating: number;
    user: { first_name: string; last_name: string };
  }>;
  users?: { first_name: string; last_name: string };
  avgRating?: number;
}

export interface Image {
  path: string;
}

export interface Review {
  id?: number;
  title: string;
  description: string | null;
  rating: number;
  userId?: string;
  users?: { first_name: string; last_name: string };
  beach_name?: string;
  beachId?: string;
}

export interface CardData {
  id: number;
  name: string;
  image: string;
  rating: number;
  city: {
    name: string;
    latitude: string;
    longitude: string;
    country: { name: string };
  };
  reviews: Array<{
    title: string;
    description: string;
    rating: number;
    user: { first_name: string; last_name: string };
  }>;
}

export interface Filters {
  cityId: string | undefined;
  waterTypeId: string | undefined;
  beachTextureId: string | undefined;
  characteristicIds: number[] | undefined;
}

export interface BeachGeoData {
  city: {
    name: string;
    latitude: number;
    longitude: number;
    country: {
      id: number;
      name: string;
    };
  };
  name: string;
}

export interface FilteredBeaches {
  avgRating?: number;
  id: number;
  image?: string;
  name: string;
}

export interface CharacteristicModified {
  characteristics: { name: string; icon_url: string };
}

export interface Characteristic {
  id: number | string;
  name: string;
  icon_url: string;
  beach_has_characteristics?: { featured: boolean };
}

export interface City {
  id: string | number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  countryId: number;
  country_id?: number;
}
