import { useState, useCallback, useRef, useEffect } from 'react';
import { Route, NavigationState, Location } from '../types';
import { routingService } from '../services/RoutingService';
import { NAVIGATION_CONFIG } from '../constants';

export function useNavigation() {
  const [navState, setNavState] = useState<NavigationState>({
    isNavigating: false,
    currentRoute: null,
    currentStepIndex: 0,
    remainingDistance: 0,
    remainingDuration: 0,
    nextManeuver: null,
  });

  const routeRef = useRef<Route | null>(null);
  const locationRef = useRef<Location | null>(null);

  const startNavigation = useCallback(async (
    origin: Location,
    destination: { latitude: number; longitude: number }
  ): Promise<boolean> => {
    const route = await routingService.getRoute(origin, destination);
    if (!route) return false;

    routeRef.current = route;
    locationRef.current = origin;

    setNavState({
      isNavigating: true,
      currentRoute: route,
      currentStepIndex: 0,
      remainingDistance: route.distance,
      remainingDuration: route.duration,
      nextManeuver: route.steps[0]
        ? {
            type: route.steps[0].maneuver.type,
            modifier: route.steps[0].maneuver.modifier,
            distance: route.steps[0].distance,
          }
        : null,
    });

    return true;
  }, []);

  const stopNavigation = useCallback(() => {
    routeRef.current = null;
    locationRef.current = null;
    setNavState({
      isNavigating: false,
      currentRoute: null,
      currentStepIndex: 0,
      remainingDistance: 0,
      remainingDuration: 0,
      nextManeuver: null,
    });
  }, []);

  const updateLocation = useCallback((location: Location) => {
    const route = routeRef.current;
    if (!route || !navState.isNavigating) return;

    locationRef.current = location;

    const currentStep = route.steps[navState.currentStepIndex];
    if (!currentStep) return;

    const distanceToManeuver = routingService.calculateDistance(
      location.latitude,
      location.longitude,
      currentStep.maneuver.location[1],
      currentStep.maneuver.location[0]
    );

    const shouldAdvance = distanceToManeuver < NAVIGATION_CONFIG.arrivalThreshold;
    const nextIndex = shouldAdvance
      ? Math.min(navState.currentStepIndex + 1, route.steps.length - 1)
      : navState.currentStepIndex;

    const totalRemaining = route.steps
      .slice(nextIndex)
      .reduce((sum, step) => sum + step.distance, 0);

    const totalRemainingDuration = route.steps
      .slice(nextIndex)
      .reduce((sum, step) => sum + step.duration, 0);

    const nextStep = route.steps[nextIndex];

    setNavState((prev) => ({
      ...prev,
      currentStepIndex: nextIndex,
      remainingDistance: totalRemaining,
      remainingDuration: totalRemainingDuration,
      nextManeuver: nextStep
        ? {
            type: nextStep.maneuver.type,
            modifier: nextStep.maneuver.modifier,
            distance: distanceToManeuver,
          }
        : null,
    }));

    const isArrived = totalRemaining < NAVIGATION_CONFIG.arrivalThreshold;
    if (isArrived) {
      stopNavigation();
    }
  }, [navState.isNavigating, navState.currentStepIndex, stopNavigation]);

  return {
    navState,
    startNavigation,
    stopNavigation,
    updateLocation,
  };
}
