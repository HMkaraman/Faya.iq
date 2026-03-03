/**
 * Haversine distance between two coordinates (in km).
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns the index of the nearest branch given user coordinates.
 * Each branch must have a `coordinates: { lat, lng }` field.
 */
export function findNearestBranchIndex(
  userLat: number,
  userLng: number,
  branches: { coordinates: { lat: number; lng: number } }[]
): number {
  let minDist = Infinity;
  let nearest = 0;
  for (let i = 0; i < branches.length; i++) {
    const { lat, lng } = branches[i].coordinates;
    const dist = haversineDistance(userLat, userLng, lat, lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  }
  return nearest;
}
