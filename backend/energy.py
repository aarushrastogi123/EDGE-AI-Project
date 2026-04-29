"""
EdgeVisionNet Platform — Energy Intelligence Module
Real-time power estimation, edge vs cloud comparison, CO₂ calculation,
and anomaly detection for power spikes.
"""

from typing import List

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
BASE_WATT_LAPTOP     = 15.0   # Watts — typical laptop TDP at full load
IDLE_FRACTION        = 0.30   # Fraction of base power at 0% CPU
DYNAMIC_FRACTION     = 0.70   # Fraction that scales with CPU load
CLOUD_INFERENCE_WATT = 12.0   # Watts — estimated cloud server power per request
CO2_KG_PER_KWH       = 0.233  # kg CO₂ per kWh (global average grid intensity)

# Anomaly detection: reading is anomalous if > threshold × rolling mean
ANOMALY_THRESHOLD = 2.0


# ---------------------------------------------------------------------------
# Power Estimation
# ---------------------------------------------------------------------------

def estimate_power(cpu_pct: float, base_watt: float = BASE_WATT_LAPTOP) -> float:
    """
    Estimate current power draw in Watts.

    Formula:
        P(W) = base_watt × (idle_fraction + dynamic_fraction × cpu_pct/100)

    Example at 40% CPU with 15W base:
        P = 15 × (0.30 + 0.70 × 0.40) = 15 × 0.58 = 8.70 W

    Args:
        cpu_pct:   CPU utilisation 0–100.
        base_watt: Device TDP in Watts.

    Returns:
        Estimated power draw in Watts.
    """
    power = base_watt * (IDLE_FRACTION + DYNAMIC_FRACTION * (cpu_pct / 100.0))
    return round(power, 3)


def estimate_inference_energy(latency_ms: float, power_w: float) -> float:
    """
    Estimate energy consumed during a single inference run.

    Formula:
        E(Wh) = P(W) × t(h)  where t = latency_ms / 1000 / 3600

    Args:
        latency_ms: Inference duration in milliseconds.
        power_w:    Device power draw during inference in Watts.

    Returns:
        Energy in Watt-hours (Wh).
    """
    latency_hours = (latency_ms / 1000.0) / 3600.0
    return round(power_w * latency_hours, 8)


# ---------------------------------------------------------------------------
# Edge vs Cloud Comparison
# ---------------------------------------------------------------------------

def calculate_savings_per_inference(
    edge_watt: float,
    cloud_watt: float = CLOUD_INFERENCE_WATT,
) -> float:
    """
    Calculate per-inference power savings (Watts) of edge over cloud.

    Returns:
        Watts saved (clamped to ≥ 0).
    """
    return max(round(cloud_watt - edge_watt, 3), 0.0)


def calculate_co2(energy_kwh: float) -> float:
    """
    Convert kWh of energy to kg CO₂ equivalent.

    Args:
        energy_kwh: Energy in kilowatt-hours.

    Returns:
        kg CO₂.
    """
    return round(energy_kwh * CO2_KG_PER_KWH, 6)


def projection(
    edge_watt: float,
    daily_inferences: int = 1000,
    avg_latency_ms: float = 50.0,
) -> dict:
    """
    Project daily and monthly energy + CO₂ savings vs cloud baseline.

    Args:
        edge_watt:         Current edge device power draw (W).
        daily_inferences:  Assumed number of inferences per day.
        avg_latency_ms:    Average inference latency in ms.

    Returns:
        Dict with projected savings metrics.
    """
    watt_saved = calculate_savings_per_inference(edge_watt)
    inference_hours = (avg_latency_ms / 1000.0) / 3600.0

    daily_wh     = watt_saved * inference_hours * daily_inferences
    monthly_wh   = daily_wh * 30
    daily_kwh    = daily_wh / 1000.0
    monthly_kwh  = monthly_wh / 1000.0

    return {
        "cloud_watt":       CLOUD_INFERENCE_WATT,
        "edge_watt":        round(edge_watt, 2),
        "saved_watt":       watt_saved,
        "daily_kwh":        round(daily_kwh, 6),
        "monthly_kwh":      round(monthly_kwh, 4),
        "daily_co2_kg":     calculate_co2(daily_kwh),
        "monthly_co2_kg":   calculate_co2(monthly_kwh),
        "daily_inferences": daily_inferences,
    }


# ---------------------------------------------------------------------------
# Anomaly Detection
# ---------------------------------------------------------------------------

def detect_power_anomaly(
    readings: List[float],
    threshold: float = ANOMALY_THRESHOLD,
) -> bool:
    """
    Detect if the latest power reading is an anomalous spike.

    A reading is anomalous if it exceeds (threshold × rolling mean of
    all previous readings).  Requires ≥ 3 readings.

    Args:
        readings:  Recent power-draw values in Watts (chronological order).
        threshold: Multiplier above which a reading is flagged.

    Returns:
        True if the latest reading is anomalous.
    """
    if len(readings) < 3:
        return False
    history = readings[:-1]
    rolling_mean = sum(history) / len(history)
    return readings[-1] > rolling_mean * threshold


def overheating_alert(temp_c: float, limit: float = 85.0) -> bool:
    """
    Return True if CPU/GPU temperature exceeds the safety limit.

    Args:
        temp_c: Current temperature in °C.
        limit:  Overheating threshold (default 85 °C).
    """
    return temp_c >= limit
