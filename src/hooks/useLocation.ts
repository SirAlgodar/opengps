import { useState, useEffect, useCallback, useRef } from 'react';
import { Location } from '../types';
import { locationService } from '../services/LocationService';

export function useLocation(follow: boolean = true) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const watchRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const hasPermission = await locationService.requestPermissions();
      if (!mounted) return;

      if (!hasPermission) {
        setError('Permissão de localização negada');
        setLoading(false);
        return;
      }

      const current = await locationService.getCurrentLocation();
      if (!mounted) return;

      if (current) {
        setLocation(current);
      }
      setLoading(false);
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (follow && !watchRef.current) {
      watchRef.current = true;
      locationService.startWatching((newLocation) => {
        setLocation(newLocation);
      });
    } else if (!follow && watchRef.current) {
      locationService.stopWatching();
      watchRef.current = false;
    }

    return () => {
      if (watchRef.current) {
        locationService.stopWatching();
        watchRef.current = false;
      }
    };
  }, [follow]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const current = await locationService.getCurrentLocation();
    if (current) setLocation(current);
    setLoading(false);
  }, []);

  return { location, error, loading, refresh };
}
