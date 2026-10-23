import * as Location from 'expo-location';
import { Location as LocationType } from '../types';

class LocationService {
  private watchId: { remove: () => void } | null = null;
  private lastKnownLocation: LocationType | null = null;

  async requestPermissions(): Promise<boolean> {
    const { status: foreground } = await Location.requestForegroundPermissionsAsync();
    if (foreground !== 'granted') return false;

    const { status: background } = await Location.requestBackgroundPermissionsAsync();
    return background === 'granted';
  }

  async getCurrentLocation(): Promise<LocationType | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const result = this.formatLocation(location);
      this.lastKnownLocation = result;
      return result;
    } catch {
      return this.lastKnownLocation;
    }
  }

  startWatching(callback: (location: LocationType) => void): void {
    this.watchId?.remove();
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        timeInterval: 1000,
      },
      (location) => {
        const result = this.formatLocation(location);
        this.lastKnownLocation = result;
        callback(result);
      }
    ).then((sub) => {
      this.watchId = sub;
    });
  }

  stopWatching(): void {
    this.watchId?.remove();
    this.watchId = null;
  }

  getLastKnownLocation(): LocationType | null {
    return this.lastKnownLocation;
  }

  private formatLocation(location: Location.LocationObject): LocationType {
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude ?? undefined,
      accuracy: location.coords.accuracy ?? undefined,
      heading: location.coords.heading ?? undefined,
      speed: location.coords.speed ?? undefined,
      timestamp: location.timestamp,
    };
  }

  async geocode(address: string): Promise<LocationType | null> {
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        return {
          latitude: results[0].latitude,
          longitude: results[0].longitude,
          timestamp: Date.now(),
        };
      }
    } catch {}
    return null;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results.length > 0) {
        const r = results[0];
        return [r.street, r.city, r.region].filter(Boolean).join(', ');
      }
    } catch {}
    return null;
  }
}

export const locationService = new LocationService();
