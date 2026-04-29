"""
EdgeVisionNet Platform — Laptop Telemetry Agent
Collects real system metrics using psutil and sends them to the backend
every 2 seconds. Runs as a standalone script on Windows or Linux.

Usage:
    python laptop_agent.py [--backend http://localhost:8000] [--device-id laptop_01]
"""

import argparse
import platform
import socket
import sys
import time
import uuid
from datetime import datetime

import psutil
import requests

# ---------------------------------------------------------------------------
# Configuration (overridable via CLI args)
# ---------------------------------------------------------------------------
DEFAULT_BACKEND  = "http://localhost:8000"
DEFAULT_INTERVAL = 2   # seconds
BASE_WATT        = 15  # Watts — laptop TDP (adjust for your hardware)

# ---------------------------------------------------------------------------
# Device Identity
# ---------------------------------------------------------------------------

def get_device_id(prefix: str = "laptop") -> str:
    """
    Generate a stable unique device ID based on the machine's hostname
    and MAC address.  Falls back to a random UUID on first run.
    """
    hostname = socket.gethostname()
    mac = uuid.getnode()
    return f"{prefix}_{hostname}_{mac & 0xFFFFFF:06x}"


def get_device_name() -> str:
    """Human-readable device name combining hostname + OS."""
    return f"{socket.gethostname()} ({platform.system()} {platform.release()})"


# ---------------------------------------------------------------------------
# Metric Collection
# ---------------------------------------------------------------------------

def collect_metrics() -> dict:
    """
    Collect a comprehensive snapshot of current system telemetry.

    Returns:
        Dict with all telemetry fields expected by POST /device-metrics.
    """
    # CPU
    cpu_pct   = psutil.cpu_percent(interval=None)
    try:
        cpu_freq = psutil.cpu_freq().current if psutil.cpu_freq() else 0.0
    except Exception:
        cpu_freq = 0.0

    # RAM
    ram = psutil.virtual_memory()
    ram_pct = ram.percent

    # Battery
    battery_pct = 0.0
    charging    = False
    try:
        batt = psutil.sensors_battery()
        if batt:
            battery_pct = round(batt.percent, 1)
            charging    = batt.power_plugged
    except (AttributeError, NotImplementedError):
        pass  # Desktop or battery sensor unavailable

    # Temperature
    temp_c = 0.0
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            # Try common sensor keys in priority order
            for key in ["coretemp", "k10temp", "cpu_thermal", "acpitz"]:
                if key in temps and temps[key]:
                    temp_c = temps[key][0].current
                    break
            if temp_c == 0.0:
                # Fall back to first available sensor
                first_sensor = next(iter(temps.values()), [])
                if first_sensor:
                    temp_c = first_sensor[0].current
    except (AttributeError, NotImplementedError):
        pass

    # Disk
    try:
        disk_pct = psutil.disk_usage("/").percent
    except Exception:
        try:
            disk_pct = psutil.disk_usage("C:\\").percent
        except Exception:
            disk_pct = 0.0

    # Network (cumulative bytes since boot)
    net = psutil.net_io_counters()
    net_sent_mb = round(net.bytes_sent / 1024 / 1024, 2)
    net_recv_mb = round(net.bytes_recv / 1024 / 1024, 2)

    return {
        "cpu":      round(cpu_pct, 1),
        "ram":      round(ram_pct, 1),
        "battery":  battery_pct,
        "charging": charging,
        "temp":     round(temp_c, 1),
        "cpu_freq": round(cpu_freq, 1),
        "disk":     round(disk_pct, 1),
        "net_sent": net_sent_mb,
        "net_recv": net_recv_mb,
        "timestamp": datetime.utcnow().isoformat(),
    }


# ---------------------------------------------------------------------------
# Agent Loop
# ---------------------------------------------------------------------------

def run_agent(backend: str, device_id: str, interval: int):
    """
    Main agent loop.  Collects metrics and POSTs to the backend every
    `interval` seconds.  Handles connection errors gracefully.
    """
    device_name = get_device_name()
    endpoint    = f"{backend}/device-metrics"

    print("=" * 60)
    print("  EdgeVisionNet Laptop Telemetry Agent")
    print("=" * 60)
    print(f"  Device ID   : {device_id}")
    print(f"  Device Name : {device_name}")
    print(f"  Backend     : {backend}")
    print(f"  Interval    : {interval}s")
    print("=" * 60)
    print("  Sending telemetry... Press Ctrl+C to stop.\n")

    consecutive_failures = 0

    while True:
        try:
            metrics = collect_metrics()
            payload = {
                "device_id":   device_id,
                "device_type": "laptop",
                "device_name": device_name,
                **metrics,
            }

            resp = requests.post(endpoint, json=payload, timeout=5)
            resp.raise_for_status()
            data = resp.json()

            # Reset failure counter on success
            consecutive_failures = 0

            # Console output
            status_icon = "🔋" if payload["charging"] else "🔌"
            anomaly_icon = " ⚠️ POWER SPIKE" if data.get("anomaly") else ""
            overheat_icon = " 🌡️ OVERHEAT" if data.get("overheat") else ""
            print(
                f"[{datetime.now().strftime('%H:%M:%S')}] "
                f"CPU:{metrics['cpu']:5.1f}%  "
                f"RAM:{metrics['ram']:5.1f}%  "
                f"BAT:{metrics['battery']:5.1f}% {status_icon}  "
                f"TEMP:{metrics['temp']:5.1f}°C  "
                f"PWR:{data['power_w']:5.2f}W"
                f"{anomaly_icon}{overheat_icon}"
            )

        except requests.exceptions.ConnectionError:
            consecutive_failures += 1
            print(
                f"[{datetime.now().strftime('%H:%M:%S')}] "
                f"⚡ Cannot connect to {backend}. "
                f"Retry {consecutive_failures}... (is the backend running?)"
            )
            if consecutive_failures >= 5:
                print("  ⚠️  5 consecutive failures. Check backend and try again.")

        except requests.exceptions.Timeout:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ⏱️  Request timed out.")

        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ Unexpected error: {e}")

        time.sleep(interval)


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="EdgeVisionNet Laptop Telemetry Agent",
    )
    parser.add_argument(
        "--backend",
        default = DEFAULT_BACKEND,
        help    = f"Backend API URL (default: {DEFAULT_BACKEND})",
    )
    parser.add_argument(
        "--device-id",
        default = get_device_id(),
        help    = "Unique device identifier (auto-generated by default)",
    )
    parser.add_argument(
        "--interval",
        type    = int,
        default = DEFAULT_INTERVAL,
        help    = f"Polling interval in seconds (default: {DEFAULT_INTERVAL})",
    )
    args = parser.parse_args()

    try:
        run_agent(args.backend, args.device_id, args.interval)
    except KeyboardInterrupt:
        print("\n\n✅ Agent stopped cleanly.")
        sys.exit(0)
