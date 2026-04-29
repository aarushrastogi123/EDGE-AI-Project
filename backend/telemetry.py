"""
EdgeVisionNet Platform — Telemetry API Router
Handles real-time device metrics ingestion and retrieval.
"""

from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from auth import get_current_user
from database import Device, Telemetry, User, get_db
from energy import estimate_power, detect_power_anomaly, overheating_alert

router = APIRouter(prefix="", tags=["Telemetry"])

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class DeviceMetricIn(BaseModel):
    """Incoming telemetry payload from a device agent."""
    device_id:   str   = Field(..., example="laptop_01")
    device_type: str   = Field("laptop", example="laptop")
    device_name: str   = Field("My Laptop", example="My Laptop")
    cpu:         float = Field(0.0, ge=0, le=100)
    ram:         float = Field(0.0, ge=0, le=100)
    battery:     float = Field(0.0, ge=0, le=100)
    charging:    bool  = False
    temp:        float = Field(0.0, ge=0)
    cpu_freq:    float = Field(0.0, ge=0)
    disk:        float = Field(0.0, ge=0, le=100)
    net_sent:    float = Field(0.0, ge=0)
    net_recv:    float = Field(0.0, ge=0)
    timestamp:   Optional[str] = None


class TelemetryOut(BaseModel):
    """Telemetry record returned to the frontend."""
    id:        int
    device_id: str
    cpu:       float
    ram:       float
    battery:   float
    temp:      float
    power_w:   float
    charging:  bool
    cpu_freq:  float
    disk:      float
    net_sent:  float
    net_recv:  float
    timestamp: datetime
    anomaly:   bool = False
    overheat:  bool = False

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/device-metrics", summary="Ingest telemetry from a device agent")
def post_device_metrics(
    payload: DeviceMetricIn,
    db: Session = Depends(get_db),
):
    """
    Called by the laptop agent every 2 seconds.
    Auto-registers device on first contact.
    Returns estimated power + anomaly flags.
    """
    # --- Auto-register device if unknown ---
    device = db.query(Device).filter(Device.device_id == payload.device_id).first()
    if not device:
        # Register under a system/anonymous user (device_id is globally unique)
        device = Device(
            user_id     = 1,  # Default to first user; override via auth header
            device_name = payload.device_name,
            device_type = payload.device_type,
            device_id   = payload.device_id,
            status      = "online",
            last_seen   = datetime.utcnow(),
        )
        db.add(device)
        db.commit()
        db.refresh(device)

    # Update device status
    device.status    = "online"
    device.last_seen = datetime.utcnow()

    # Estimate power draw
    power_w = estimate_power(payload.cpu)

    # Persist telemetry row
    record = Telemetry(
        device_id = payload.device_id,
        cpu       = payload.cpu,
        ram       = payload.ram,
        battery   = payload.battery,
        temp      = payload.temp,
        power_w   = power_w,
        charging  = payload.charging,
        cpu_freq  = payload.cpu_freq,
        disk      = payload.disk,
        net_sent  = payload.net_sent,
        net_recv  = payload.net_recv,
        timestamp = datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Anomaly detection on last 10 readings
    recent_power = [
        r.power_w
        for r in db.query(Telemetry)
            .filter(Telemetry.device_id == payload.device_id)
            .order_by(Telemetry.timestamp.desc())
            .limit(10)
            .all()
    ]
    is_anomaly = detect_power_anomaly(recent_power[::-1])
    is_overheat = overheating_alert(payload.temp)

    return {
        "status":    "ok",
        "power_w":   power_w,
        "anomaly":   is_anomaly,
        "overheat":  is_overheat,
        "record_id": record.id,
    }


@router.get("/live-metrics", summary="Latest telemetry snapshot for a device")
def get_live_metrics(
    device_id: str = Query("laptop_01"),
    db: Session = Depends(get_db),
):
    """
    Returns the most recent telemetry record for the specified device.
    Used by the dashboard for live polling every 2 s.
    """
    record = (
        db.query(Telemetry)
        .filter(Telemetry.device_id == device_id)
        .order_by(Telemetry.timestamp.desc())
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="No telemetry found for this device.")

    # Check if device is still online (last 10 seconds)
    device = db.query(Device).filter(Device.device_id == device_id).first()
    online = False
    if device and device.last_seen:
        online = (datetime.utcnow() - device.last_seen).total_seconds() < 10

    return {
        "device_id": record.device_id,
        "cpu":       record.cpu,
        "ram":       record.ram,
        "battery":   record.battery,
        "temp":      record.temp,
        "power_w":   record.power_w,
        "charging":  record.charging,
        "cpu_freq":  record.cpu_freq,
        "disk":      record.disk,
        "net_sent":  record.net_sent,
        "net_recv":  record.net_recv,
        "timestamp": record.timestamp.isoformat(),
        "online":    online,
        "overheat":  overheating_alert(record.temp),
    }


@router.get("/history", summary="Historical telemetry for a device (configurable window)")
def get_history(
    device_id: str  = Query("laptop_01"),
    hours:     float = Query(1.0, ge=0.1, le=168),  # 1 hour default, max 7 days
    limit:     int   = Query(500, ge=10, le=5000),
    db: Session = Depends(get_db),
):
    """
    Returns historical telemetry records within the specified time window.
    Used by the Analytics page.
    """
    since = datetime.utcnow() - timedelta(hours=hours)
    records = (
        db.query(Telemetry)
        .filter(
            Telemetry.device_id == device_id,
            Telemetry.timestamp >= since,
        )
        .order_by(Telemetry.timestamp.asc())
        .limit(limit)
        .all()
    )

    return [
        {
            "timestamp": r.timestamp.isoformat(),
            "cpu":       r.cpu,
            "ram":       r.ram,
            "battery":   r.battery,
            "temp":      r.temp,
            "power_w":   r.power_w,
            "charging":  r.charging,
        }
        for r in records
    ]


@router.get("/devices", summary="List all devices for authenticated user")
def list_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns all devices registered to the logged-in user,
    with live online/offline status.
    """
    devices = db.query(Device).filter(Device.user_id == current_user.id).all()
    now = datetime.utcnow()
    result = []
    for d in devices:
        online = d.last_seen and (now - d.last_seen).total_seconds() < 10
        result.append({
            "id":          d.id,
            "device_id":   d.device_id,
            "device_name": d.device_name,
            "device_type": d.device_type,
            "status":      "online" if online else "offline",
            "last_seen":   d.last_seen.isoformat() if d.last_seen else None,
        })
    return result


@router.post("/devices/register", summary="Register a new device")
def register_device(
    device_id:   str,
    device_name: str,
    device_type: str = "laptop",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register a new device under the authenticated user."""
    existing = db.query(Device).filter(Device.device_id == device_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Device ID already registered.")

    device = Device(
        user_id     = current_user.id,
        device_name = device_name,
        device_type = device_type,
        device_id   = device_id,
        status      = "offline",
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return {"message": "Device registered.", "device_id": device.device_id}
