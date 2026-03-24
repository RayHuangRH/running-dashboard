from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from schemas.activity import Activity
from services.activity_service import get_user_activities
from db.supabase import supabase

router = APIRouter(prefix="/api/activities", tags=["activities"])


@router.get("/user/{user_id}")
async def get_activities_by_user(user_id: str) -> List[dict]:
    """
    Get all activities for a specific user.
    """
    try:
        activities = get_user_activities(user_id)
        # Convert to dict for JSON serialization
        return [
            {
                "id": a.id,
                "user_id": str(a.user_id),
                "name": a.name,
                "type": a.type,
                "start_date": a.start_date.isoformat(),
                "duration_seconds": a.duration_seconds,
                "distance_meters": a.distance_meters,
                "average_speed": a.average_speed,
                "max_speed": a.max_speed,
                "elevation_gain_meters": a.elevation_gain_meters,
                "average_heart_rate": a.average_heart_rate,
                "max_heart_rate": a.max_heart_rate,
                "gps_polyline": a.gps_polyline,
                "created_at": a.created_at.isoformat(),
                "updated_at": a.updated_at.isoformat(),
            }
            for a in activities
        ]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id format")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching activities: {str(e)}"
        )
