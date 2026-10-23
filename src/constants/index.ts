export const MAP_STYLES = {
  streets: 'https://tiles.openfreemap.org/styles/liberty',
  outdoor: 'https://tiles.openfreemap.org/styles/outdoors',
  satellite: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
  bright: 'https://tiles.openfreemap.org/styles/bright',
  pastel: 'https://tiles.openfreemap.org/styles/fiord',
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;

export const MAP_STYLE_LABELS: Record<MapStyleKey, string> = {
  streets: 'Ruas',
  outdoor: 'Ar livre',
  satellite: 'Claro',
  dark: 'Escuro',
  bright: 'Solar',
  pastel: 'Pastel',
};

export const ROUTE_COLORS = {
  default: '#4ECDC4',
  selected: '#FF6B6B',
  alternative: '#95E1D3',
  completed: '#A8D8EA',
  walking: '#45B7D1',
  driving: '#2C3E50',
} as const;

export const ROUTE_LINE_STYLE = {
  width: 8,
  opacity: 0.8,
  lineWidth: 8,
  casingWidth: 12,
  casingColor: '#FFFFFF',
  casingOpacity: 0.6,
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
  voicePromptClose: 50,
  mapFollowZoom: 17,
  mapTiltAngle: 45,
  overviewZoom: 14,
  routePreviewZoom: 15,
} as const;

export const WAYPOINT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
] as const;

export const WAYPOINT_ICONS = [
  '📍', '🏠', '🏪', '⛽', '🅿️', '🍽️', '☕', '🏥',
  '🏫', '🏛️', '⛪', '🏟️', '🎭', '🎵', '🛍️', '💼',
] as const;

export const DEFAULT_SETTINGS = {
  mapStyle: MAP_STYLES.streets,
  units: 'metric' as const,
  voiceGuidance: true,
  keepScreenOn: true,
  followLocation: true,
  showTraffic: false,
  offlineMode: false,
  autoReroute: true,
  showSpeedometer: true,
  nightMode: 'auto' as 'auto' | 'day' | 'night',
};

export const NAVIGATION_MANEUVERS = {
  turn: '🔄',
  'new name': '➡️',
  depart: '🚗',
  arrive: '🏁',
  merge: '🔀',
  'on ramp': '↗️',
  'off ramp': '↘️',
  fork: '🍴',
  'end of road': '↩️',
  continue: '⬆️',
  roundabout: '🔄',
  rotary: '🔄',
  merge_left: '⬅️',
  merge_right: '➡️',
} as const;

export const NAVIGATION_MODIFIERS = {
  left: 'à esquerda',
  right: 'à direita',
  'slight left': 'leve à esquerda',
  'slight right': 'leve à direita',
  'sharp left': 'bruscamente à esquerda',
  'sharp right': 'bruscamente à direita',
  straight: 'em frente',
  uturn: 'retorno',
} as const;
