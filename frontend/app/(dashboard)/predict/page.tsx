'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { predictionAPI } from '@/lib/api'
import type { PredictionResult, ModelStat } from '@/lib/types'
import {
  Upload, Brain, Zap, Clock, Leaf, Camera, X, CheckCircle,
  ChevronDown, AlertCircle, BarChart3,
} from 'lucide-react'

const MODELS = ['MobileNetV2', 'EfficientNet-B0', 'ShuffleNet', 'EdgeVisionNet']

export default function PredictPage() {
  const [selectedModel, setSelectedModel] = useState('MobileNetV2')
  const [file,          setFile]          = useState<File | null>(null)
  const [preview,       setPreview]       = useState<string | null>(null)
  const [result,        setResult]        = useState<PredictionResult | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [webcamActive,  setWebcamActive]  = useState(false)
  const fileRef   = useRef<HTMLInputElement>(null)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setWebcamActive(true)
    } catch { setError('Cannot access webcam. Allow camera permission.') }
  }

  const captureWebcam = () => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const f = new File([blob], 'webcam.jpg', { type: 'image/jpeg' })
        handleFile(f)
        setWebcamActive(false)
        const stream = videoRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach((t) => t.stop())
      }
    }, 'image/jpeg', 0.9)
  }

  const runInference = async () => {
    if (!file) { setError('Please select an image first.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await predictionAPI.predict(file, selectedModel)
      setResult(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Inference failed. Is the backend running?')
    } finally { setLoading(false) }
  }

  const confidencePct = (result?.confidence ?? 0) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          AI <span className="gradient-text">Prediction</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Upload an image and run EdgeVisionNet inference</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload + Config */}
        <div className="space-y-4">
          {/* Model Selector */}
          <div className="glass-card p-4">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 block">Select Model</label>
            <div className="grid grid-cols-2 gap-2">
              {MODELS.map((m) => (
                <button
                  key={m}
                  id={`model-btn-${m.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedModel(m)}
                  className={`p-3 rounded-xl text-xs font-medium border transition-all text-left ${
                    selectedModel === m
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                      : 'bg-white/3 border-white/8 text-slate-400 hover:border-white/15'
                  }`}
                >
                  <div className="font-semibold mb-0.5">{m}</div>
                  <div className="text-[10px] opacity-70">
                    {m === 'MobileNetV2' && '14MB · 42ms · 71.8%'}
                    {m === 'EfficientNet-B0' && '21MB · 68ms · 77.1%'}
                    {m === 'ShuffleNet' && '8MB · 31ms · 69.4%'}
                    {m === 'EdgeVisionNet' && '11MB · 38ms · 74.2%'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="glass-card border-2 border-dashed border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <input
              id="file-input"
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-2xl" />
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null) }}
                  className="absolute top-3 right-3 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="p-10 text-center">
                <Upload size={36} className="text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">Drop image here or click to browse</p>
                <p className="text-xs text-slate-600 mt-1">JPEG, PNG, WebP supported</p>
              </div>
            )}
          </div>

          {/* Webcam */}
          {webcamActive ? (
            <div className="glass-card p-4 space-y-3">
              <video ref={videoRef} className="w-full rounded-xl" autoPlay muted />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2">
                <motion.button
                  id="webcam-capture-btn"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={captureWebcam}
                  className="btn-primary flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 relative z-10"
                >
                  <Camera size={16} /> Capture
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setWebcamActive(false)
                    const stream = videoRef.current?.srcObject as MediaStream
                    stream?.getTracks().forEach((t) => t.stop())
                  }}
                  className="btn-secondary px-4 py-2.5 text-sm rounded-xl"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>
          ) : (
            <button
              id="webcam-btn"
              onClick={startWebcam}
              className="btn-secondary w-full py-2.5 text-sm rounded-xl flex items-center justify-center gap-2"
            >
              <Camera size={16} /> Use Webcam
            </button>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <motion.button
            id="run-inference-btn"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={runInference}
            disabled={!file || loading}
            className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 relative z-10"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running inference…</>
            ) : (
              <><Brain size={18} /> Run {selectedModel} Inference</>
            )}
          </motion.button>
        </div>

        {/* Right: Results */}
        <div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Main result */}
                <div className="glass-card p-6 border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={20} className="text-emerald-400" />
                    <h3 className="font-semibold text-slate-200">Inference Complete</h3>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-4xl font-bold gradient-text mb-1">{result.predicted_class}</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
                          style={{ width: `${confidencePct}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-cyan-400 w-14 text-right">
                        {confidencePct.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Confidence score</p>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Latency',   value: `${result.latency_ms.toFixed(1)}ms`, icon: <Clock size={16} />,    color: 'text-purple-400' },
                    { label: 'Energy',    value: `${(result.energy_wh * 1e6).toFixed(2)}µWh`, icon: <Zap size={16} />, color: 'text-amber-400' },
                    { label: 'Device W',  value: `${result.device_power_w.toFixed(2)}W`, icon: <Leaf size={16} />,   color: 'text-emerald-400' },
                  ].map((m) => (
                    <div key={m.label} className="glass-card p-3 text-center">
                      <div className={`flex justify-center mb-1 ${m.color}`}>{m.icon}</div>
                      <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                      <p className="text-[10px] text-slate-500">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Top-5 */}
                {result.top5 && (
                  <div className="glass-card p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Top 5 Predictions</h4>
                    <div className="space-y-2">
                      {result.top5.map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                          <span className="text-sm text-slate-300 flex-1">{p.class}</span>
                          <div className="w-24 bg-white/5 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${Math.max(p.confidence * 100, 2)}%`,
                                background: i === 0 ? '#00D4FF' : '#7C3AED',
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-12 text-right">
                            {(p.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="glass-card p-4 border border-emerald-500/20">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Recommendation</p>
                  <p className="text-sm text-slate-300">{result.recommendation}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center h-full flex flex-col items-center justify-center gap-4"
              >
                <Brain size={56} className="text-slate-700" />
                <p className="text-slate-500">Upload an image and click Run Inference to see results</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
