import { Activity, ActivityMetrics } from '../types/activity';

const METERS_TO_MILES = 0.000621371;

export function calculateMetrics(activities: Activity[]): ActivityMetrics {
  if (activities.length === 0) {
    return {
      totalRuns: 0,
      avgDistance: 0,
      avgPace: '0:00',
      avgHeartRate: 0,
      monthDistance: 0,
      longestRun: 0,
    };
  }

  // Total and average distance (miles)
  const totalDistance = activities.reduce(
    (sum, a) => sum + a.distance_meters * METERS_TO_MILES,
    0
  );
  const avgDistance = totalDistance / activities.length;

  // Average pace (min:sec per mile)
  const avgPace = calculateAveragePace(activities);

  // Average heart rate (excluding undefined)
  const heartRates = activities
    .filter(
      (a) => a.average_heart_rate !== undefined && a.average_heart_rate !== null
    )
    .map((a) => a.average_heart_rate!);
  const avgHeartRate =
    heartRates.length > 0
      ? heartRates.reduce((a, b) => a + b) / heartRates.length
      : 0;

  // Total distance for filtered activities (used for current time period)
  const monthDistance = totalDistance;

  // Longest run
  const longestRun = Math.max(
    ...activities.map((a) => a.distance_meters * METERS_TO_MILES),
    0
  );

  return {
    totalRuns: activities.length,
    avgDistance,
    avgPace,
    avgHeartRate,
    monthDistance,
    longestRun,
  };
}

export function calculateAveragePace(activities: Activity[]): string {
  if (activities.length === 0) return '0:00';

  const totalSeconds = activities.reduce(
    (sum, a) => sum + a.duration_seconds,
    0
  );
  const totalMiles = activities.reduce(
    (sum, a) => sum + a.distance_meters * METERS_TO_MILES,
    0
  );

  if (totalMiles === 0) return '0:00';

  const avgPaceSeconds = totalSeconds / totalMiles;
  const minutes = Math.floor(avgPaceSeconds / 60);
  const seconds = Math.round(avgPaceSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function filterActivitiesByDateRange(
  activities: Activity[],
  range: '7d' | '30d' | '6m' | 'all'
): Activity[] {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'all':
      return activities;
  }

  return activities.filter((a) => new Date(a.start_date) >= startDate);
}

export function getChartData(activities: Activity[]) {
  return activities
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    .map((a) => ({
      date: new Date(a.start_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      fullDate: a.start_date,
      distance: parseFloat((a.distance_meters * METERS_TO_MILES).toFixed(2)),
      pace: calculatePaceMinutesPerMile(a.duration_seconds, a.distance_meters),
      heartRate: a.average_heart_rate || null,
    }));
}

function calculatePaceMinutesPerMile(
  durationSeconds: number,
  distanceMeters: number
): number {
  const miles = distanceMeters * METERS_TO_MILES;
  if (miles === 0) return 0;
  return parseFloat((durationSeconds / 60 / miles).toFixed(2));
}

export function getDateRangeLabel(range: '7d' | '30d' | '6m' | 'all'): string {
  switch (range) {
    case '7d':
      return 'Last 7 Days';
    case '30d':
      return 'Last 30 Days';
    case '6m':
      return 'Last 6 Months';
    case 'all':
      return 'All Time';
  }
}
