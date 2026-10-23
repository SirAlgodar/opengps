export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface Waypoint {
  id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
  icon?: string;
  color?: string;
  createdAt: number;
  visitedAt?: number;
}

export interface Route {
  distance: number;
  duration: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
  };
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  distance?: number;
}

export interface NavigationState {
  isNavigating: boolean;
  currentRoute: Route | null;
  currentStepIndex: number;
  remainingDistance: number;
  remainingDuration: number;
  nextManeuver: {
    type: string;
    modifier?: string;
    distance: number;
  } | null;
}

export interface AppSettings {
  mapStyle: string;
  units: 'metric' | 'imperial';
  voiceGuidance: boolean;
  keepScreenOn: boolean;
  followLocation: boolean;
  showTraffic: boolean;
  offlineMode: boolean;
}
