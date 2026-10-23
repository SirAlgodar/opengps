import { SearchResult, Location } from '../types';
import { SEARCH_API } from '../constants';

class SearchService {
  private cache: Map<string, SearchResult[]> = new Map();

  async search(
    query: string,
    near?: Location,
    limit: number = 10
  ): Promise<SearchResult[]> {
    const cacheKey = `${query}:${near?.latitude},${near?.longitude}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      let url = `${SEARCH_API.nominatim}/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`;
      if (near) {
        url += `&lat=${near.latitude}&lon=${near.longitude}&bounded=1&viewbox=${near.longitude - 0.5},${near.latitude + 0.5},${near.longitude + 0.5},${near.latitude - 0.5}`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'OpenGPS/1.0 (Open Source GPS)',
        },
      });
      const data = await response.json();

      const results: SearchResult[] = data.map((item: any, index: number) => ({
        id: item.place_id?.toString() || `search-${index}`,
        name: item.name || item.display_name?.split(',')[0] || 'Unknown',
        address: item.display_name || '',
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        category: item.type || item.category || 'place',
        distance: near
          ? this.calculateDistance(
              near.latitude,
              near.longitude,
              parseFloat(item.lat),
              parseFloat(item.lon)
            )
          : undefined,
      }));

      this.cache.set(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async reverseSearch(latitude: number, longitude: number): Promise<SearchResult | null> {
    try {
      const url = `${SEARCH_API.nominatim}/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'OpenGPS/1.0 (Open Source GPS)',
        },
      });
      const data = await response.json();

      if (!data || data.error) return null;

      return {
        id: data.place_id?.toString() || 'reverse',
        name: data.name || data.display_name?.split(',')[0] || 'Current Location',
        address: data.display_name || '',
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
        category: data.type || 'place',
      };
    } catch (error) {
      console.error('Reverse search error:', error);
      return null;
    }
  }

  async searchNearby(
    latitude: number,
    longitude: number,
    category: string,
    radius: number = 1000
  ): Promise<SearchResult[]> {
    try {
      const url = `${SEARCH_API.nominatim}/search?format=json&q=${encodeURIComponent(category)}&limit=20&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude - 0.01},${latitude + 0.01},${longitude + 0.01},${latitude - 0.01}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'OpenGPS/1.0 (Open Source GPS)',
        },
      });
      const data = await response.json();

      return data
        .map((item: any, index: number) => ({
          id: item.place_id?.toString() || `nearby-${index}`,
          name: item.name || item.display_name?.split(',')[0] || 'Unknown',
          address: item.display_name || '',
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          category: item.type || item.category || category,
          distance: this.calculateDistance(
            latitude,
            longitude,
            parseFloat(item.lat),
            parseFloat(item.lon)
          ),
        }))
        .filter((r: SearchResult) => r.distance! <= radius)
        .sort((a: SearchResult, b: SearchResult) => a.distance! - b.distance!);
    } catch (error) {
      console.error('Nearby search error:', error);
      return [];
    }
  }

  private calculateDistance(
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

  clearCache(): void {
    this.cache.clear();
  }
}

export const searchService = new SearchService();
