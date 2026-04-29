// EdgeVisionNet — TypeScript API types

export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Telemetry {
  device_id: string
  cpu: number
  ram: number
  battery: number
  temp: number
  power_w: number
  charging: boolean
  cpu_freq: number
  disk: number
  net_sent: number
  net_recv: number
  timestamp: string
  online: boolean
  overheat: boolean
}

export interface TelemetryHistory {
  timestamp: string
  cpu: number
  ram: number
  battery: number
  temp: number
  power_w: number
  charging: boolean
}

export interface Device {
  id: number
  device_id: string
  device_name: string
  device_type: string
  status: 'online' | 'offline'
  last_seen: string | null
}

export interface PredictionResult {
  prediction_id: number
  model: string
  predicted_class: string
  confidence: number
  latency_ms: number
  energy_wh: number
  device_power_w: number
  top5: Array<{ class: string; confidence: number }>
  timestamp: string
  recommendation: string
}

export interface ModelStat {
  model: string
  accuracy: number
  avg_latency_ms: number
  model_size_mb: number
  energy_wh: number
  description: string
}

export interface Comparison {
  cloud_watt: number
  edge_watt: number
  saved_watt: number
  daily_kwh: number
  monthly_kwh: number
  daily_co2_kg: number
  monthly_co2_kg: number
  daily_inferences: number
}

export interface EnergyReport {
  total_predictions: number
  total_energy_wh: number
  avg_latency_ms: number
  cloud_equiv_wh: number
  energy_saved_wh: number
  co2_saved_kg: number
}

export interface HistoryFilter {
  hours: number
  deviceId: string
}
