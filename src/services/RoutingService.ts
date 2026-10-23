import { Route, RouteStep, Location } from '../types';
import { ROUTING_API } from '../constants';

class RoutingService {
  async getRoute(
    origin: Location,
    destination: { latitude: number; longitude: number }
  ): Promise<Route | null> {
    try {
      const url = `${ROUTING_API.osrm}/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes?.length) return null;

      const route = data.routes[0];
      const steps: RouteStep[] = route.legs[0]?.steps?.map((step: any) => ({
        instruction: this.formatInstruction(step.maneuver, step.name),
        distance: step.distance,
        duration: step.duration,
        maneuver: {
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
          location: step.maneuver.location,
        },
      })) ?? [];

      return {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
        steps,
      };
    } catch (error) {
      console.error('Routing error:', error);
      return null;
    }
  }

  async getWalkingRoute(
    origin: Location,
    destination: { latitude: number; longitude: number }
  ): Promise<Route | null> {
    try {
      const url = `${ROUTING_API.osrm}/route/v1/walking/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes?.length) return null;

      const route = data.routes[0];
      const steps: RouteStep[] = route.legs[0]?.steps?.map((step: any) => ({
        instruction: this.formatInstruction(step.maneuver, step.name),
        distance: step.distance,
        duration: step.duration,
        maneuver: {
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
          location: step.maneuver.location,
        },
      })) ?? [];

      return {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
        steps,
      };
    } catch (error) {
      console.error('Walking routing error:', error);
      return null;
    }
  }

  private formatInstruction(maneuver: any, roadName: string): string {
    const road = roadName ? ` em ${roadName}` : '';
    switch (maneuver.type) {
      case 'depart':
        return `Iniciar navegação${road}`;
      case 'turn':
        switch (maneuver.modifier) {
          case 'left': return `Vire à esquerda${road}`;
          case 'right': return `Vire à direita${road}`;
          case 'slight left': return `Mantenha à esquerda${road}`;
          case 'slight right': return `Mantenha à direita${road}`;
          case 'sharp left': return `Vire bruscamente à esquerda${road}`;
          case 'sharp right': return `Vire bruscamente à direita${road}`;
          default: return `Vire${road}`;
        }
      case 'new name':
        return `Continue${road}`;
      case 'merge':
        return `Entre na via${road}`;
      case 'on ramp':
        return `Pegue a rampa${road}`;
      case 'off ramp':
        return `Saia da via${road}`;
      case 'fork':
        return `Mantenha ${maneuver.modifier === 'left' ? 'à esquerda' : 'à direita'}${road}`;
      case 'end of road':
        return `Vire ${maneuver.modifier === 'left' ? 'à esquerda' : 'à direita'}${road}`;
      case 'continue':
        return `Continue${road}`;
      case 'roundabout':
      case 'rotary':
        return `Pegue a rotatória${road}`;
      case 'arrive':
        return `Você chegou ao destino`;
      default:
        return `Continue${road}`;
    }
  }

  calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

export const routingService = new RoutingService();
