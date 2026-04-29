"""
EdgeVisionNet Platform — Future Android Phone Agent (Phase 2)
=============================================================

STATUS: PLACEHOLDER — Phase 2 Implementation

This module defines the schema, architecture, and reference implementation
for collecting telemetry from Android devices and sending it to the
EdgeVisionNet backend.

Phase 2 Integration Plan:
--------------------------
1. Build an Android app (Kotlin/Flutter) that:
   - Reads BatteryManager, ActivityManager, ThermalService
   - Runs TFLite inference via Android Neural Networks API (NNAPI)
   - POSTs telemetry to POST /device-metrics every 2–5 seconds

2. OR: Run this Python agent via Termux / ADB bridge on rooted Android.

Expected Payload (device_type = "android"):
-------------------------------------------
{
    "device_id":   "phone_01",
    "device_type": "android",
    "device_name": "Pixel 7 Pro",
    "cpu":         28.0,      // CPU usage %
    "ram":         61.0,      // RAM usage %
    "battery":     71.0,      // Battery %
    "charging":    false,
    "temp":        39.0,      // Battery/CPU temperature °C
    "cpu_freq":    1800.0,    // MHz
    "disk":        45.0,      // Internal storage %
    "net_sent":    12.4,      // MB since boot
    "net_recv":    88.2,      // MB since boot
    "timestamp":   "2024-01-01T00:00:00"
}

The backend POST /device-metrics endpoint already accepts this schema.
No backend changes needed for Phase 2.

ADB Bridge Usage (for testing without a native app):
------------------------------------------------------
# Connect phone via USB or WiFi ADB
# Run on laptop: python future_phone_agent.py --adb

NNAPI / TFLite Integration:
-----------------------------
Android apps can run EdgeVisionNet TFLite model using:
    Interpreter interpreter = new Interpreter(model_file, options);
    interpreter.run(input_buffer, output_buffer);

See: https://www.tensorflow.org/lite/guide/android
"""

import argparse
import sys
import time
from datetime import datetime

import requests

# ---------------------------------------------------------------------------
# Phase 2 Configuration
# ---------------------------------------------------------------------------
DEFAULT_BACKEND  = "http://localhost:8000"
DEFAULT_INTERVAL = 3  # seconds (phones have slower sensor update rates)
PHONE_DEVICE_ID  = "phone_01"
PHONE_DEVICE_NAME = "Android Phone (Phase 2)"


# ---------------------------------------------------------------------------
# ADB Bridge (simulated / real via adb shell)
# ---------------------------------------------------------------------------

def collect_android_metrics_via_adb() -> dict:
    """
    Collect Android device metrics via ADB shell commands.
    Requires 'adb' installed and device connected.

    Returns:
        Dict with telemetry fields.

    NOTE: This is a Phase 2 implementation stub.
          Replace subprocess calls with real ADB queries.
    """
    import subprocess

    def adb_shell(cmd: str) -> str:
        """Run an adb shell command and return stdout."""
        result = subprocess.run(
            ["adb", "shell", cmd],
            capture_output=True, text=True, timeout=5,
        )
        return result.stdout.strip()

    try:
        # Battery level: /sys/class/power_supply/battery/capacity
        battery = float(adb_shell("cat /sys/class/power_supply/battery/capacity") or "0")
        charging_str = adb_shell("cat /sys/class/power_supply/battery/status")
        charging = "Charging" in charging_str

        # Temperature: /sys/class/thermal/thermal_zone0/temp (in millidegrees)
        temp_raw = adb_shell("cat /sys/class/thermal/thermal_zone0/temp")
        temp = float(temp_raw) / 1000.0 if temp_raw.isdigit() else 0.0

        # CPU: average from /proc/stat (simplified)
        cpu = 30.0   # Placeholder — implement /proc/stat diff for accuracy
        ram = 60.0   # Placeholder — implement /proc/meminfo for accuracy

        return {
            "device_id":   PHONE_DEVICE_ID,
            "device_type": "android",
            "device_name": PHONE_DEVICE_NAME,
            "cpu":         cpu,
            "ram":         ram,
            "battery":     battery,
            "charging":    charging,
            "temp":        temp,
            "cpu_freq":    0.0,
            "disk":        0.0,
            "net_sent":    0.0,
            "net_recv":    0.0,
            "timestamp":   datetime.utcnow().isoformat(),
        }
    except Exception as e:
        print(f"⚠️  ADB error: {e}")
        return {}


def collect_simulated_android_metrics() -> dict:
    """
    Generate realistic simulated Android telemetry for testing purposes.
    Uses gradually changing values to simulate a real device.
    """
    import random
    import math

    t = time.time()
    return {
        "device_id":   PHONE_DEVICE_ID,
        "device_type": "android",
        "device_name": PHONE_DEVICE_NAME,
        "cpu":         round(20 + 15 * abs(math.sin(t / 30)), 1),
        "ram":         round(55 + 10 * abs(math.sin(t / 60)), 1),
        "battery":     round(max(10, 80 - (t % 3600) / 3600 * 40), 1),
        "charging":    False,
        "temp":        round(35 + 8 * abs(math.sin(t / 45)), 1),
        "cpu_freq":    round(1800 + random.uniform(-200, 400), 1),
        "disk":        45.0,
        "net_sent":    round(10 + t / 100, 1),
        "net_recv":    round(80 + t / 50, 1),
        "timestamp":   datetime.utcnow().isoformat(),
    }


# ---------------------------------------------------------------------------
# Agent Loop (Phase 2 ready)
# ---------------------------------------------------------------------------

def run_phone_agent(backend: str, interval: int, use_adb: bool = False):
    """
    Phase 2 phone agent loop.

    Args:
        backend:  Backend API URL.
        interval: Polling interval in seconds.
        use_adb:  If True, use real ADB bridge; else simulate.
    """
    endpoint = f"{backend}/device-metrics"
    mode = "ADB Bridge" if use_adb else "Simulation Mode"

    print("=" * 60)
    print("  EdgeVisionNet Android Phone Agent — Phase 2")
    print("=" * 60)
    print(f"  Mode        : {mode}")
    print(f"  Device ID   : {PHONE_DEVICE_ID}")
    print(f"  Backend     : {backend}")
    print(f"  Interval    : {interval}s")
    print("=" * 60)

    if not use_adb:
        print("  ⚠️  Running in SIMULATION MODE.")
        print("  For real Android telemetry, use --adb flag with USB-connected phone.\n")

    while True:
        try:
            metrics = (
                collect_android_metrics_via_adb()
                if use_adb
                else collect_simulated_android_metrics()
            )

            if not metrics:
                print("⚠️  No metrics collected. Retrying...")
                time.sleep(interval)
                continue

            resp = requests.post(endpoint, json=metrics, timeout=5)
            resp.raise_for_status()
            data = resp.json()

            print(
                f"[{datetime.now().strftime('%H:%M:%S')}] 📱 "
                f"CPU:{metrics['cpu']:5.1f}%  "
                f"RAM:{metrics['ram']:5.1f}%  "
                f"BAT:{metrics['battery']:5.1f}%  "
                f"TEMP:{metrics['temp']:5.1f}°C  "
                f"PWR:{data.get('power_w', 0):5.2f}W"
            )

        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ {e}")

        time.sleep(interval)


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="EdgeVisionNet Android Phone Agent (Phase 2)",
    )
    parser.add_argument("--backend",  default=DEFAULT_BACKEND)
    parser.add_argument("--interval", type=int, default=DEFAULT_INTERVAL)
    parser.add_argument(
        "--adb",
        action  = "store_true",
        help    = "Use real ADB bridge (requires USB-connected Android device)",
        default = False,
    )
    args = parser.parse_args()

    try:
        run_phone_agent(args.backend, args.interval, args.adb)
    except KeyboardInterrupt:
        print("\n✅ Phone agent stopped.")
        sys.exit(0)
