import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { MapView } from '../components/MapView';
import { SearchBar } from '../components/SearchBar';
import { NavigationBanner } from '../components/NavigationBanner';
import { useLocation } from '../hooks/useLocation';
import { useNavigation } from '../hooks/useNavigation';
import { searchService } from '../services/SearchService';
import { SearchResult, Waypoint, Location } from '../types';
import { DEFAULT_SETTINGS, WAYPOINT_COLORS } from '../constants';

export function MapScreen() {
  const [mapStyle, setMapStyle] = useState(DEFAULT_SETTINGS.mapStyle);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [followUser, setFollowUser] = useState(true);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);

  const { location, error: locationError, refresh: refreshLocation } = useLocation(followUser);
  const { navState, startNavigation, stopNavigation, updateLocation } = useNavigation();

  useEffect(() => {
    if (location && navState.isNavigating) {
      updateLocation(location);
    }
  }, [location, navState.isNavigating, updateLocation]);

  const handleSearchSelect = useCallback(async (result: SearchResult) => {
    setDestination({ latitude: result.latitude, longitude: result.longitude });
    setFollowUser(false);
  }, []);

  const handleMapPress = useCallback(async (latitude: number, longitude: number) => {
    const address = await searchService.reverseSearch(latitude, longitude);
    if (address) {
      const newWaypoint: Waypoint = {
        id: `wp-${Date.now()}`,
        title: address.name,
        description: address.address,
        latitude,
        longitude,
        category: 'manual',
        color: WAYPOINT_COLORS[waypoints.length % WAYPOINT_COLORS.length],
        createdAt: Date.now(),
      };
      setWaypoints((prev) => [...prev, newWaypoint]);
    }
  }, [waypoints.length]);

  const handleNavigate = useCallback(async () => {
    if (!location || !destination) {
      Alert.alert('Erro', 'Localização ou destino não definidos');
      return;
    }

    const success = await startNavigation(location, destination);
    if (!success) {
      Alert.alert('Erro', 'Não foi possível calcular a rota');
    }
  }, [location, destination, startNavigation]);

  const handleStopNavigation = useCallback(() => {
    stopNavigation();
    setDestination(null);
    setFollowUser(true);
  }, [stopNavigation, setFollowUser]);

  const toggleFollowUser = useCallback(() => {
    setFollowUser((prev) => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {navState.isNavigating ? (
        <NavigationBanner navState={navState} onStop={handleStopNavigation} />
      ) : (
        <SearchBar
          currentLocation={location}
          onSelect={handleSearchSelect}
          placeholder="Buscar lugar ou endereço..."
        />
      )}

      <MapView
        location={location}
        waypoints={waypoints}
        route={navState.currentRoute}
        followUser={followUser}
        mapStyle={mapStyle}
        onMapPress={handleMapPress}
        onMarkerPress={(wp) => setSelectedWaypoint(wp)}
      />

      {!navState.isNavigating && (
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

          {destination && (
            <TouchableOpacity
              style={[styles.controlButton, styles.navigateButton]}
              onPress={handleNavigate}
            >
              <Text style={styles.controlIcon}>🧭</Text>
              <Text style={styles.controlLabel}>Navegar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.controlButton}
            onPress={refreshLocation}
          >
            <Text style={styles.controlIcon}>🔄</Text>
            <Text style={styles.controlLabel}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedWaypoint && (
        <View style={styles.waypointInfo}>
          <Text style={styles.waypointTitle}>{selectedWaypoint.title}</Text>
          <Text style={styles.waypointDesc} numberOfLines={2}>
            {selectedWaypoint.description}
          </Text>
          <TouchableOpacity
            style={styles.waypointNavButton}
            onPress={() => {
              setDestination({
                latitude: selectedWaypoint.latitude,
                longitude: selectedWaypoint.longitude,
              });
              setSelectedWaypoint(null);
            }}
          >
            <Text style={styles.waypointNavText}>Navegar até aqui</Text>
          </TouchableOpacity>
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
    bottom: 100,
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
  navigateButton: {
    backgroundColor: '#2C3E50',
    width: 64,
    height: 64,
    borderRadius: 32,
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
  waypointInfo: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 80,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  waypointTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  waypointDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  waypointNavButton: {
    marginTop: 12,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  waypointNavText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
