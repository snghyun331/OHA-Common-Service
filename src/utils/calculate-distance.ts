import { EarthRadiusKm } from './constant';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const earthRadiusKm = EarthRadiusKm;

  const lat1 = degreesToRadians(coord1.latitude);
  const lat2 = degreesToRadians(coord2.latitude);
  const deltaLat = degreesToRadians(coord2.latitude - coord1.latitude);
  const deltaLng = degreesToRadians(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 100);
}
