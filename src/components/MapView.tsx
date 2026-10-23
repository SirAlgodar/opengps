import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  Map as MapLibreMap,
  Camera,
  UserLocation,
  MapRef,
  CameraRef,
  ViewStateChangeEvent,
  GeoJSONSource,
  Layer,
  Marker,
} from '@maplibre/maplibre-react-native';
import { Location, Waypoint, Route } from '../types';
import {
  MAP_STYLES,
  NAVIGATION_CONFIG,
  ROUTE_COLORS,
  ROUTE_LINE_STYLE,
  WAYPOINT_COLORS,
} from '../constants';
import {
  CUSTOM_MAP_STYLES,
  CustomMapStyleKey,
} from '../constants/customMapStyles';

type LngLat = [number, number];
type LngLatBounds = [number, number, number, number];

interface MapPressEvent {
  nativeEvent: {
    lngLat: LngLat;
    point: { x: number; y: number };
  };
}

interface MapViewProps {
  location: Location | null;
  waypoints: Waypoint[];
  route: Route | null;
  alternativeRoute: Route | null;
  followUser: boolean;
  mapStyle?: string | object;
  showRoute: boolean;
  showWaypoints: boolean;
  onMapPress?: (latitude: number, longitude: number) => void;
  onMarkerPress?: (waypoint: Waypoint) => void;
  onViewStateChange?: (viewState: { zoom: number; pitch: number; bearing: number }) => void;
}

export function MapView({
  location,
  waypoints,
  route,
  alternativeRoute,
  followUser,
  mapStyle = MAP_STYLES.streets,
  showRoute = true,
  showWaypoints = true,
  onMapPress,
  onMarkerPress,
  onViewStateChange,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const lastFollowRef = useRef<boolean>(followUser);

  // Resolve map style - handles both URL strings and custom style objects
  const resolvedMapStyle = useMemo(() => {
    if (typeof mapStyle === 'object') return mapStyle as any;
    const customStyleKeys = Object.keys(CUSTOM_MAP_STYLES) as CustomMapStyleKey[];
    if (customStyleKeys.includes(mapStyle as CustomMapStyleKey)) {
      return CUSTOM_MAP_STYLES[mapStyle as CustomMapStyleKey] as any;
    }
    return mapStyle;
  }, [mapStyle]);

  useEffect(() => {
    if (followUser && location && !lastFollowRef.current) {
      cameraRef.current?.flyTo({
        center: [location.longitude, location.latitude] as LngLat,
        zoom: NAVIGATION_CONFIG.mapFollowZoom,
        pitch: NAVIGATION_CONFIG.mapTiltAngle,
        duration: 500,
      });
    }
    lastFollowRef.current = followUser;
  }, [followUser, location]);

  useEffect(() => {
    if (route && route.geometry.coordinates.length > 0) {
      const coords = route.geometry.coordinates;
      const lats = coords.map((c) => c[1]);
      const lons = coords.map((c) => c[0]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);

      const bounds: LngLatBounds = [minLon, minLat, maxLon, maxLat];
      cameraRef.current?.fitBounds(bounds, {
        padding: { top: 150, right: 50, bottom: 150, left: 50 },
      });
    }
  }, [route]);

  const handlePress = useCallback(
    (event: MapPressEvent) => {
      const [lon, lat] = event.nativeEvent.lngLat;
      onMapPress?.(lat, lon);
    },
    [onMapPress]
  );

  const handleRegionChange = useCallback(
    (event: ViewStateChangeEvent) => {
      onViewStateChange?.({
        zoom: event.zoom,
        pitch: event.pitch || 0,
        bearing: event.bearing || 0,
      });
    },
    [onViewStateChange]
  );

  return (
    <View style={styles.container}>
      <MapLibreMap
        ref={mapRef}
        style={styles.map}
        mapStyle={resolvedMapStyle}
        onPress={handlePress as any}
        onRegionDidChange={handleRegionChange as any}
        compass
        scaleBar
        logo={false}
        attribution={false}
        touchRotate
        touchPitch
        dragPan
        touchZoom
        doubleTapZoom
      >
        <Camera
          ref={cameraRef}
          trackUserLocation={followUser ? 'default' : undefined}
          zoom={NAVIGATION_CONFIG.mapFollowZoom}
          pitch={followUser ? NAVIGATION_CONFIG.mapTiltAngle : 0}
        />

        <UserLocation />

        {/* Alternative route (lighter) */}
        {showRoute && alternativeRoute && alternativeRoute.geometry.coordinates.length > 0 && (
          <>
            <GeoJSONSource
              id="alternative-route-source"
              data={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: alternativeRoute.geometry.coordinates,
                },
                properties: {},
              }}
            />
            <Layer
              id="alternative-route-casing"
              type="line"
              source="alternative-route-source"
              paint={{
                'line-color': '#FFFFFF',
                'line-width': ROUTE_LINE_STYLE.width * 0.7 + 4,
                'line-opacity': 0.4,
              }}
            />
            <Layer
              id="alternative-route-line"
              type="line"
              source="alternative-route-source"
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
              paint={{
                'line-color': ROUTE_COLORS.alternative,
                'line-width': ROUTE_LINE_STYLE.width * 0.7,
                'line-opacity': 0.5,
              }}
            />
          </>
        )}

        {/* Main route */}
        {showRoute && route && route.geometry.coordinates.length > 0 && (
          <>
            <GeoJSONSource
              id="main-route-source"
              data={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: route.geometry.coordinates,
                },
                properties: {},
              }}
            />
            {/* Route casing (white border) */}
            <Layer
              id="main-route-casing"
              type="line"
              source="main-route-source"
              paint={{
                'line-color': ROUTE_LINE_STYLE.casingColor,
                'line-width': ROUTE_LINE_STYLE.width + 4,
                'line-opacity': ROUTE_LINE_STYLE.casingOpacity,
              }}
            />
            {/* Main route line */}
            <Layer
              id="main-route-line"
              type="line"
              source="main-route-source"
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
              paint={{
                'line-color': ROUTE_COLORS.default,
                'line-width': ROUTE_LINE_STYLE.width,
                'line-opacity': ROUTE_LINE_STYLE.opacity,
              }}
            />
          </>
        )}

        {/* Waypoint markers */}
        {showWaypoints && waypoints.map((waypoint) => (
          <Marker
            key={waypoint.id}
            lngLat={[waypoint.longitude, waypoint.latitude] as LngLat}
            onPress={() => onMarkerPress?.(waypoint)}
          >
            <View style={styles.waypointMarker}>
              <Text style={styles.waypointIcon}>
                {waypoint.icon || '📍'}
              </Text>
            </View>
          </Marker>
        ))}
      </MapLibreMap>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  waypointMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  waypointIcon: {
    fontSize: 16,
  },
});
