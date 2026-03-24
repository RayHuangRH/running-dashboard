import { Activity } from '../types/activity';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getUserActivities(userId: string): Promise<Activity[]> {
  try {
    const response = await fetch(`${API_BASE}/api/activities/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

export async function syncActivities(
  userId: string
): Promise<{ status: string; progress: number }> {
  try {
    const response = await fetch(
      `${API_BASE}/api/auth/sync/progress/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch sync progress: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking sync progress:', error);
    return { status: 'error', progress: 0 };
  }
}
