import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, NativeSyntheticEvent } from 'react-native';
import {
  Map as MapLibreMap,
  Camera,
  UserLocation,
  MapRef,
  CameraRef,
  ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native';
import { Location, Waypoint, Route } from '../types';
import {
  MAP_STYLES,
  NAVIGATION_CONFIG,
  ROUTE_COLORS,
  ROUTE_LINE_STYLE,
  resolveMapStyle,
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
    // Check if it's a custom style key
    const customStyleKeys = Object.keys(CUSTOM_MAP_STYLES) as CustomMapStyleKey[];
    if (customStyleKeys.includes(mapStyle as CustomMapStyleKey)) {
      return CUSTOM_MAP_STYLES[mapStyle as CustomMapStyleKey] as any;
    }
    // Return URL string
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
});
