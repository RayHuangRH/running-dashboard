/**
 * Decodes a polyline string from Google's polyline algorithm format
 * @param polylineString - Encoded polyline string
 * @returns Array of [lat, lng] coordinates
 */
export function decodePolyline(
  polylineString: string
): Array<[number, number]> {
  if (!polylineString) return [];

  const path: Array<[number, number]> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < polylineString.length) {
    let result = 0;
    let shift = 0;
    let byte: number;

    do {
      byte = polylineString.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    result = 0;
    shift = 0;

    do {
      byte = polylineString.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    path.push([lat / 1e5, lng / 1e5]);
  }

  return path;
}

/**
 * Aggregates multiple polylines into heatmap intensity data
 * Counts how many times each point/area has been traversed
 * @param polylines - Array of encoded polyline strings
 * @returns Array of [lat, lng, intensity] for heatmap
 */
export function createHeatmapData(
  polylines: (string | null | undefined)[]
): Array<[number, number, number]> {
  // Create a map to count occurrences of coordinate pairs (with rounded precision)
  const coordMap = new Map<string, number>();
  const precision = 4; // Round to 4 decimal places for grouping

  polylines.forEach((polylineString) => {
    if (!polylineString) return;

    const coords = decodePolyline(polylineString);
    coords.forEach(([lat, lng]) => {
      // Round coordinates to group nearby points
      const key = `${lat.toFixed(precision)},${lng.toFixed(precision)}`;
      coordMap.set(key, (coordMap.get(key) || 0) + 1);
    });
  });

  // Convert map to heatmap format [lat, lng, intensity]
  // Normalize intensity to 0-1 range
  const maxIntensity = Math.max(...Array.from(coordMap.values()));

  return Array.from(coordMap.entries()).map(([key, count]) => {
    const [lat, lng] = key.split(',').map(Number);
    const intensity = maxIntensity > 0 ? count / maxIntensity : 0;
    return [lat, lng, intensity];
  });
}
