import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MapView } from '../components/MapView';
import { SearchBar } from '../components/SearchBar';
import { NavigationPanel } from '../components/NavigationPanel';
import { MapStyleSelector } from '../components/MapStyleSelector';
import { useLocation } from '../hooks/useLocation';
import { useNavigation } from '../hooks/useNavigation';
import { searchService } from '../services/SearchService';
import { routingService } from '../services/RoutingService';
import { SearchResult, Waypoint, Route, Location } from '../types';
import {
  DEFAULT_SETTINGS,
  WAYPOINT_COLORS,
  WAYPOINT_ICONS,
  MAP_STYLES,
  NAVIGATION_CONFIG,
} from '../constants';

export function MapScreen() {
  const [mapStyle, setMapStyle] = useState<string>(DEFAULT_SETTINGS.mapStyle);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [followUser, setFollowUser] = useState(true);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [destination, setDestination] = useState<SearchResult | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [viewState, setViewState] = useState({ zoom: 14, pitch: 0, bearing: 0 });

  const { location, error: locationError, refresh: refreshLocation } = useLocation(followUser);
  const { navState, startNavigation, stopNavigation, updateLocation } = useNavigation();

  // Update navigation when location changes
  useEffect(() => {
    if (location && navState.isNavigating) {
      updateLocation(location);
    }
  }, [location, navState.isNavigating, updateLocation]);

  // Calculate route when destination is set
  useEffect(() => {
    if (destination && location && !navState.isNavigating) {
      calculateRoute();
    }
  }, [destination, location]);

  const calculateRoute = useCallback(async () => {
    if (!destination || !location) return;

    setIsCalculating(true);
    try {
      const newRoute = await routingService.getRoute(location, {
        latitude: destination.latitude,
        longitude: destination.longitude,
      });
      setRoute(newRoute);
      setShowRoute(true);
    } catch (error) {
      console.error('Route calculation error:', error);
      setRoute(null);
    } finally {
      setIsCalculating(false);
    }
  }, [destination, location]);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    setDestination(result);
    setFollowUser(false);
    setSelectedWaypoint(null);
  }, []);

  const handleMapPress = useCallback(async (latitude: number, longitude: number) => {
    if (navState.isNavigating) return;

    const address = await searchService.reverseSearch(latitude, longitude);
    if (address) {
      const newWaypoint: Waypoint = {
        id: `wp-${Date.now()}`,
        title: address.name,
        description: address.address,
        latitude,
        longitude,
        category: 'manual',
        icon: WAYPOINT_ICONS[waypoints.length % WAYPOINT_ICONS.length],
        color: WAYPOINT_COLORS[waypoints.length % WAYPOINT_COLORS.length],
        createdAt: Date.now(),
      };
      setWaypoints((prev) => [...prev, newWaypoint]);
      setSelectedWaypoint(newWaypoint);
    }
  }, [waypoints.length, navState.isNavigating]);

  const handleStartNavigation = useCallback(async () => {
    if (!location || !destination) {
      Alert.alert('Erro', 'Localização ou destino não definidos');
      return;
    }

    const success = await startNavigation(location, {
      latitude: destination.latitude,
      longitude: destination.longitude,
    });

    if (success) {
      setFollowUser(true);
      setShowRoute(true);
    } else {
      Alert.alert('Erro', 'Não foi possível iniciar a navegação');
    }
  }, [location, destination, startNavigation]);

  const handleStopNavigation = useCallback(() => {
    stopNavigation();
    setDestination(null);
    setRoute(null);
    setFollowUser(true);
  }, [stopNavigation]);

  const handlePreviewRoute = useCallback(() => {
    if (route) {
      setShowRoute(true);
      setFollowUser(false);
    }
  }, [route]);

  const handleCancel = useCallback(() => {
    setDestination(null);
    setRoute(null);
    setFollowUser(true);
  }, []);

  const toggleFollowUser = useCallback(() => {
    setFollowUser((prev) => !prev);
  }, []);

  const toggleRoute = useCallback(() => {
    setShowRoute((prev) => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {!navState.isNavigating && (
        <SearchBar
          currentLocation={location}
          onSelect={handleSearchSelect}
          placeholder="Buscar lugar ou endereço..."
        />
      )}

      <MapView
        location={location}
        waypoints={waypoints}
        route={route}
        alternativeRoute={null}
        followUser={followUser}
        mapStyle={mapStyle}
        showRoute={showRoute && !!route}
        showWaypoints={true}
        onMapPress={handleMapPress}
        onMarkerPress={(wp) => setSelectedWaypoint(wp)}
        onViewStateChange={setViewState}
      />

      {/* Floating controls */}
      {!navState.isNavigating && !destination && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, followUser && styles.controlButtonActive]}
            onPress={toggleFollowUser}
          >
            <Text style={styles.controlIcon}>📍</Text>
            <Text style={styles.controlLabel}>
              {followUser ? 'Seguindo' : 'Centrar'}
            </Text>
          </TouchableOpacity>

          {route && (
            <TouchableOpacity
              style={[styles.controlButton, showRoute && styles.controlButtonActive]}
              onPress={toggleRoute}
            >
              <Text style={styles.controlIcon}>🗺️</Text>
              <Text style={styles.controlLabel}>
                {showRoute ? 'Rota ON' : 'Rota OFF'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowStyleSelector(true)}
          >
            <Text style={styles.controlIcon}>🎨</Text>
            <Text style={styles.controlLabel}>Estilo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={refreshLocation}
          >
            <Text style={styles.controlIcon}>🔄</Text>
            <Text style={styles.controlLabel}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Speed indicator */}
      {location?.speed != null && location.speed > 0 && (
        <View style={styles.speedContainer}>
          <Text style={styles.speedValue}>
            {Math.round(location.speed * 3.6)}
          </Text>
          <Text style={styles.speedUnit}>km/h</Text>
        </View>
      )}

      {/* Waypoint info card */}
      {selectedWaypoint && !navState.isNavigating && (
        <View style={styles.waypointCard}>
          <View style={styles.waypointHeader}>
            <Text style={styles.waypointIcon}>{selectedWaypoint.icon || '📍'}</Text>
            <View style={styles.waypointInfo}>
              <Text style={styles.waypointTitle}>{selectedWaypoint.title}</Text>
              <Text style={styles.waypointDesc} numberOfLines={2}>
                {selectedWaypoint.description}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.waypointClose}
              onPress={() => setSelectedWaypoint(null)}
            >
              <Text style={styles.waypointCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.waypointActions}>
            <TouchableOpacity
              style={styles.waypointNavBtn}
              onPress={() => {
                setDestination({
                  id: selectedWaypoint.id,
                  name: selectedWaypoint.title,
                  address: selectedWaypoint.description || '',
                  latitude: selectedWaypoint.latitude,
                  longitude: selectedWaypoint.longitude,
                  category: 'waypoint',
                });
                setSelectedWaypoint(null);
              }}
            >
              <Text style={styles.waypointNavBtnText}>🚗 Navegar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.waypointDeleteBtn}
              onPress={() => {
                setWaypoints((prev) => prev.filter((w) => w.id !== selectedWaypoint.id));
                setSelectedWaypoint(null);
              }}
            >
              <Text style={styles.waypointDeleteBtnText}>🗑️ Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Navigation panel */}
      <NavigationPanel
        destination={destination}
        route={route}
        navState={navState}
        isNavigating={navState.isNavigating}
        onStartNavigation={handleStartNavigation}
        onStopNavigation={handleStopNavigation}
        onCancel={handleCancel}
        onPreviewRoute={handlePreviewRoute}
        isCalculating={isCalculating}
      />

      {/* Map style selector */}
      <MapStyleSelector
        visible={showStyleSelector}
        currentStyle={mapStyle}
        onSelect={setMapStyle}
        onClose={() => setShowStyleSelector(false)}
      />

      {/* Loading overlay */}
      {isCalculating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Calculando rota...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    flexDirection: 'column',
    gap: 12,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  controlButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  controlIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  controlLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  speedContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: '#2C3E50',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 4,
  },
  speedValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  speedUnit: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  waypointCard: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 80,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  waypointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waypointIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  waypointInfo: {
    flex: 1,
  },
  waypointTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  waypointDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  waypointClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  waypointCloseText: {
    fontSize: 16,
    color: '#666',
  },
  waypointActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  waypointNavBtn: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  waypointNavBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  waypointDeleteBtn: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  waypointDeleteBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
