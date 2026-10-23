// Custom MapLibre style definitions for themed maps
// Based on MapLibre Style Specification v8
// Uses OpenFreeMap vector tiles (OpenMapTiles schema)

const VECTOR_SOURCE = {
  type: 'vector',
  tiles: ['https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'],
  attribution: '© OpenStreetMap contributors',
} as const;

const GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';

export const CUSTOM_MAP_STYLES = {
  losSantos: {
    version: 8,
    name: 'Los Santos',
    glyphs: GLYPHS,
    sources: {
      'openmaptiles': VECTOR_SOURCE,
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#2d5016',
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#1a3a4a',
        },
      },
      {
        id: 'parks',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#3d6b2e',
        },
      },
      {
        id: 'roads-bg',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#4a4a4a',
          'line-width': 8,
        },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#8b7355',
          'line-width': 6,
        },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-color': '#3a3a2a',
          'fill-outline-color': '#5a5a4a',
        },
      },
      {
        id: 'labels',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 14,
        },
        paint: {
          'text-color': '#c9b896',
          'text-halo-color': '#2d5016',
          'text-halo-width': 2,
        },
      },
    ],
  },

  pipBoy: {
    version: 8,
    name: 'Pip-Boy',
    glyphs: GLYPHS,
    sources: {
      'openmaptiles': VECTOR_SOURCE,
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#0a1a0a',
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#0a2a1a',
        },
      },
      {
        id: 'parks',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#0f2a0f',
        },
      },
      {
        id: 'roads-bg',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#1a4a1a',
          'line-width': 8,
        },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#33ff33',
          'line-width': 6,
          'line-opacity': 0.8,
        },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-color': '#0a2a0a',
          'fill-outline-color': '#33ff33',
          'fill-opacity': 0.5,
        },
      },
      {
        id: 'labels',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 13,
          'text-transform': 'uppercase',
        },
        paint: {
          'text-color': '#33ff33',
          'text-halo-color': '#0a1a0a',
          'text-halo-width': 2,
          'text-opacity': 0.9,
        },
      },
    ],
  },

  pixelMap: {
    version: 8,
    name: 'Pixel Map',
    glyphs: GLYPHS,
    sources: {
      'openmaptiles': VECTOR_SOURCE,
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#2b1b3d',
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#3d2b6b',
        },
      },
      {
        id: 'parks',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#2d5a2d',
        },
      },
      {
        id: 'roads-bg',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#4a2b6b',
          'line-width': 10,
        },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#ff6b9d',
          'line-width': 8,
        },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-color': '#4a2b6b',
          'fill-outline-color': '#ff6b9d',
        },
      },
      {
        id: 'labels',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 14,
          'text-transform': 'uppercase',
        },
        paint: {
          'text-color': '#ff6b9d',
          'text-halo-color': '#2b1b3d',
          'text-halo-width': 3,
        },
      },
    ],
  },

  cyberpunk: {
    version: 8,
    name: 'Cyberpunk',
    glyphs: GLYPHS,
    sources: {
      'openmaptiles': VECTOR_SOURCE,
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#0a0a1a',
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#0a1a3a',
        },
      },
      {
        id: 'parks',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#1a0a2a',
        },
      },
      {
        id: 'roads-bg',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#2a1a4a',
          'line-width': 8,
        },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#00ffff',
          'line-width': 6,
          'line-opacity': 0.9,
        },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-color': '#1a0a3a',
          'fill-outline-color': '#ff00ff',
          'fill-opacity': 0.7,
        },
      },
      {
        id: 'labels',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 13,
          'text-transform': 'uppercase',
        },
        paint: {
          'text-color': '#00ffff',
          'text-halo-color': '#0a0a1a',
          'text-halo-width': 2,
        },
      },
    ],
  },

  retro: {
    version: 8,
    name: 'Retro',
    glyphs: GLYPHS,
    sources: {
      'openmaptiles': VECTOR_SOURCE,
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#f4e4c1',
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#7ba4c7',
        },
      },
      {
        id: 'parks',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#8fbc8f',
        },
      },
      {
        id: 'roads-bg',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#c4a77d',
          'line-width': 8,
        },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#8b4513',
          'line-width': 6,
        },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-color': '#deb887',
          'fill-outline-color': '#8b4513',
        },
      },
      {
        id: 'labels',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 14,
        },
        paint: {
          'text-color': '#5c4033',
          'text-halo-color': '#f4e4c1',
          'text-halo-width': 2,
        },
      },
    ],
  },

  ocean: {
    version: 8,
    name: 'Ocean',
    glyphs: GLYPHS,
    sources: {
      'openmaptiles': VECTOR_SOURCE,
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#0a2a4a',
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#1a4a7a',
        },
      },
      {
        id: 'parks',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#1a5a4a',
        },
      },
      {
        id: 'roads-bg',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#2a4a6a',
          'line-width': 8,
        },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        paint: {
          'line-color': '#4a8ab0',
          'line-width': 6,
        },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-color': '#1a3a5a',
          'fill-outline-color': '#4a8ab0',
        },
      },
      {
        id: 'labels',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 13,
        },
        paint: {
          'text-color': '#8ac4e0',
          'text-halo-color': '#0a2a4a',
          'text-halo-width': 2,
        },
      },
    ],
  },
} as const;

export type CustomMapStyleKey = keyof typeof CUSTOM_MAP_STYLES;

export const CUSTOM_MAP_STYLE_LABELS: Record<CustomMapStyleKey, string> = {
  losSantos: 'Los Santos',
  pipBoy: 'Pip-Boy',
  pixelMap: 'Pixel Map',
  cyberpunk: 'Cyberpunk',
  retro: 'Retro',
  ocean: 'Ocean',
};

export const CUSTOM_MAP_STYLE_COLORS: Record<CustomMapStyleKey, string> = {
  losSantos: '#2d5016',
  pipBoy: '#33ff33',
  pixelMap: '#ff6b9d',
  cyberpunk: '#00ffff',
  retro: '#8b4513',
  ocean: '#4a8ab0',
};
