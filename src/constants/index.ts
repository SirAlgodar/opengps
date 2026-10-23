export const MAP_STYLES = {
  streets: 'https://demotiles.maplibre.org/style.json',
  outdoor: 'https://tiles.openfreemap.org/styles/liberty',
  satellite: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const;

export const ROUTING_API = {
  osrm: 'https://router.project-osrm.org',
  valhalla: 'https://valhalla1.openstreetmap.de',
} as const;

export const SEARCH_API = {
  nominatim: 'https://nominatim.openstreetmap.org',
  photon: 'https://photon.komoot.io',
} as const;

export const NAVIGATION_CONFIG = {
  minDistanceToUpdate: 10,
  maxDistanceToUpdate: 100,
  rerouteDistance: 50,
  arrivalThreshold: 30,
  voicePromptDistance: 200,
  mapFollowZoom: 17,
  overviewZoom: 14,
} as const;

export const WAYPOINT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
] as const;

export const DEFAULT_SETTINGS = {
  mapStyle: MAP_STYLES.streets,
  units: 'metric' as const,
  voiceGuidance: true,
  keepScreenOn: true,
  followLocation: true,
  showTraffic: false,
  offlineMode: false,
};
