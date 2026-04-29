// EdgeVisionNet — Axios API Client
// All requests go to FastAPI backend at localhost:8000

import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Bearer token on every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('evn_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('evn_token')
        localStorage.removeItem('evn_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    api.post('/signup', { name, email, password }),

  login: (email: string, password: string) =>
    api.post('/login', { email, password }),

  me: () => api.get('/me'),
}

// ---------------------------------------------------------------------------
// Telemetry
// ---------------------------------------------------------------------------

export const telemetryAPI = {
  live: (deviceId = 'laptop_01') =>
    api.get('/live-metrics', { params: { device_id: deviceId } }),

  history: (deviceId = 'laptop_01', hours = 1) =>
    api.get('/history', { params: { device_id: deviceId, hours } }),

  devices: () => api.get('/devices'),

  registerDevice: (deviceId: string, deviceName: string, deviceType = 'laptop') =>
    api.post('/devices/register', null, {
      params: { device_id: deviceId, device_name: deviceName, device_type: deviceType },
    }),
}

// ---------------------------------------------------------------------------
// Prediction
// ---------------------------------------------------------------------------

export const predictionAPI = {
  predict: (file: File, modelName = 'MobileNetV2', deviceId = 'laptop_01') => {
    const form = new FormData()
    form.append('file', file)
    form.append('model_name', modelName)
    form.append('device_id', deviceId)
    return api.post('/predict', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  history: (limit = 50) => api.get('/predictions', { params: { limit } }),

  modelStats: () => api.get('/model-stats'),
}

// ---------------------------------------------------------------------------
// Energy / Comparison
// ---------------------------------------------------------------------------

export const energyAPI = {
  comparison: (deviceId = 'laptop_01') =>
    api.get('/comparison', { params: { device_id: deviceId } }),

  report: () => api.get('/energy-report'),
}
