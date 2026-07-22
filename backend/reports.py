"""
EdgeVisionNet Platform — Reports Export API Router
Generates downloadable CSV datasets for telemetry metrics and prediction logs.
"""

import io
import csv
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import Telemetry, Prediction, get_db

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/export/telemetry", summary="Export telemetry data as CSV")
def export_telemetry_csv(
    device_id: str = Query("laptop_01"),
    hours: float = Query(24.0, ge=0.5, le=168.0),
    db: Session = Depends(get_db),
):
    """Generates a downloadable CSV file containing telemetry logs."""
    since = datetime.utcnow() - timedelta(hours=hours)
    records = (
        db.query(Telemetry)
        .filter(Telemetry.device_id == device_id, Telemetry.timestamp >= since)
        .order_by(Telemetry.timestamp.asc())
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "Timestamp", "Device ID", "CPU (%)", "RAM (%)", "Battery (%)", 
        "Temperature (°C)", "Power (Watts)", "CPU Freq (MHz)", "Disk (%)", "Charging"
    ])

    for r in records:
        writer.writerow([
            r.timestamp.isoformat(),
            r.device_id,
            r.cpu,
            r.ram,
            r.battery,
            r.temp,
            r.power_w,
            r.cpu_freq,
            r.disk,
            r.charging,
        ])

    output.seek(0)
    filename = f"telemetry_{device_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/export/predictions", summary="Export AI prediction logs as CSV")
def export_predictions_csv(
    limit: int = Query(200, ge=10, le=5000),
    db: Session = Depends(get_db),
):
    """Generates a downloadable CSV file containing AI prediction history."""
    records = (
        db.query(Prediction)
        .order_by(Prediction.timestamp.desc())
        .limit(limit)
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "ID", "Timestamp", "Model Name", "Predicted Class", 
        "Confidence Score", "Latency (ms)", "Energy (Wh)", "Device ID"
    ])

    for r in records:
        writer.writerow([
            r.id,
            r.timestamp.isoformat(),
            r.model_name,
            r.predicted_class,
            r.confidence,
            r.latency_ms,
            r.energy_wh,
            r.device_id or "laptop_01",
        ])

    output.seek(0)
    filename = f"ai_predictions_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
