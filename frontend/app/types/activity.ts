export interface Activity {
  id: number;
  user_id: string;
  name: string;
  type: string;
  start_date: string;
  duration_seconds: number;
  distance_meters: number;
  average_speed?: number;
  max_speed?: number;
  elevation_gain_meters?: number;
  average_heart_rate?: number;
  max_heart_rate?: number;
  gps_polyline?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityMetrics {
  totalRuns: number;
  avgDistance: number;
  avgPace: string;
  avgHeartRate: number;
  monthDistance: number;
  longestRun: number;
}

export type DateRange = '7d' | '30d' | '6m' | 'all';
