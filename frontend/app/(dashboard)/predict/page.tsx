'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { predictionAPI } from '@/lib/api'
import type { PredictionResult, ModelStat } from '@/lib/types'
import {
  Upload, Brain, Zap, Clock, Leaf, Camera, X, CheckCircle,
  AlertCircle, BarChart3, ChevronRight, Sparkles, Target,
  TrendingUp,
} from 'lucide-react'

const MODELS = ['MobileNetV2', 'EfficientNet-B0', 'ShuffleNet', 'EdgeVisionNet']
const MODEL_META: Record<string, { size: string; ms: string; acc: string; color: string }> = {
  'MobileNetV2':    { size: '14MB', ms: '42ms', acc: '71.8%', color: '#8b5cf6' },
  'EfficientNet-B0':{ size: '21MB', ms: '68ms', acc: '77.1%', color: '#10b981' },
  'ShuffleNet':     { size: '8MB',  ms: '31ms', acc: '69.4%', color: '#f59e0b' },
  'EdgeVisionNet':  { size: '11MB', ms: '38ms', acc: '74.2%', color: '#00d4ff' },
}

const SAMPLE_IMAGES = [
  { name: 'Laptop',     file: 'laptop.jpg', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80' },
  { name: 'Sports Car', file: 'car.jpg',    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80' },
  { name: 'Retriever',  file: 'dog.jpg',    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=80' },
  { name: 'Coffee',     file: 'coffee.jpg', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80' },
]

export default function PredictPage() {
  const [selectedModel, setSelectedModel] = useState('MobileNetV2')
  const [file,          setFile]          = useState<File | null>(null)
  const [preview,       setPreview]       = useState<string | null>(null)
  const [result,        setResult]        = useState<PredictionResult | null>(null)
  const [multiResult,   setMultiResult]   = useState<any | null>(null)
  const [isMultiMode,   setIsMultiMode]   = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [loadingStage,  setLoadingStage]  = useState('')
  const [error,         setError]         = useState('')
  const [webcamActive,  setWebcamActive]  = useState(false)
  const [isDragOver,    setIsDragOver]    = useState(false)
  const fileRef   = useRef<HTMLInputElement>(null)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    setMultiResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const loadSample = async (sample: typeof SAMPLE_IMAGES[0]) => {
    setLoading(true)
    setLoadingStage('Loading sample…')
    setError('')
    try {
      const res  = await fetch(sample.url)
      const blob = await res.blob()
      handleFile(new File([blob], sample.file, { type: 'image/jpeg' }))
    } catch {
      setError('Failed to load demo image.')
    } finally { setLoading(false); setLoadingStage('') }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
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
        handleFile(new File([blob], 'webcam.jpg', { type: 'image/jpeg' }))
        setWebcamActive(false)
        const stream = videoRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach((t) => t.stop())
      }
    }, 'image/jpeg', 0.9)
  }

  const LOADING_STAGES = isMultiMode
    ? ['Uploading image…', 'Validating format…', 'Running 4 models…', 'Comparing results…']
    : ['Uploading image…', 'Validating format…', 'Preprocessing…', `Running ${selectedModel}…`, 'Generating result…']

  const runInference = async () => {
    if (!file) { setError('Please select or capture an image first.'); return }
    setLoading(true)
    setError('')
    let stageIdx = 0
    setLoadingStage(LOADING_STAGES[0])
    const stageTimer = setInterval(() => {
      stageIdx = (stageIdx + 1) % LOADING_STAGES.length
      setLoadingStage(LOADING_STAGES[stageIdx])
    }, 600)

    try {
      if (isMultiMode) {
        const res = await predictionAPI.predictMulti(file)
        setMultiResult(res.data)
        setResult(null)
      } else {
        const res = await predictionAPI.predict(file, selectedModel)
        setResult(res.data)
        setMultiResult(null)
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Inference failed. Is the backend running?')
    } finally {
      clearInterval(stageTimer)
      setLoading(false)
      setLoadingStage('')
    }
  }

  const confidencePct = (result?.confidence ?? 0) * 100
  const meta = MODEL_META[selectedModel]

  return (
    <div className="space-y-6">
      {/* Header + Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">AI Prediction Engine</h1>
          <p className="page-subtitle">Upload an image or select a sample to run EdgeVisionNet inference</p>
        </div>
        <div className="flex items-center gap-1 glass-card p-1 rounded-xl">
          <button
            id="single-mode-btn"
            onClick={() => setIsMultiMode(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !isMultiMode
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Model
          </button>
          <button
            id="multi-mode-btn"
            onClick={() => setIsMultiMode(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isMultiMode
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={14} /> Compare All 4
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload + Config */}
        <div className="space-y-4">
          {/* Model Selector */}
          {!isMultiMode && (
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Select Model</p>
              <div className="grid grid-cols-2 gap-2">
                {MODELS.map((m) => {
                  const info = MODEL_META[m]
                  const active = selectedModel === m
                  return (
                    <motion.button
                      key={m}
                      id={`model-btn-${m.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => setSelectedModel(m)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`p-3 rounded-lg text-left transition-all border ${
                        active
                          ? 'border-current bg-current/10'
                          : 'border-white/6 bg-white/3 hover:border-white/12'
                      }`}
                      style={active ? { color: info.color, borderColor: `${info.color}40`, background: `${info.color}12` } : undefined}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {active && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: info.color }} />}
                        <span className={`text-xs font-semibold truncate ${active ? '' : 'text-slate-300'}`}>{m}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{info.size} · {info.ms} · {info.acc}</p>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upload Zone */}
          <motion.div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            animate={{ borderColor: isDragOver ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.08)' }}
            className={`glass-card border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
              isDragOver ? 'bg-cyan-500/5' : ''
            }`}
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
                <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); setMultiResult(null) }}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-3 left-3">
                  <p className="text-xs text-white font-medium">{file?.name}</p>
                  <p className="text-[10px] text-white/60">{file ? (file.size / 1024).toFixed(0) : 0} KB</p>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center">
                <motion.div
                  animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-4"
                >
                  <Upload size={24} className="text-slate-500" />
                </motion.div>
                <p className="text-sm font-medium text-slate-300 mb-1">Drop image here or click to browse</p>
                <p className="text-xs text-slate-600">JPEG, PNG, WebP supported</p>
              </div>
            )}
          </motion.div>

          {/* Quick Presets */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">⚡ Quick Presets</p>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_IMAGES.map((s) => (
                <button
                  key={s.name}
                  id={`sample-btn-${s.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => loadSample(s)}
                  className="rounded-lg overflow-hidden border border-white/6 hover:border-cyan-500/40 transition-all group"
                >
                  <img src={s.url} alt={s.name} className="w-full h-14 object-cover opacity-60 group-hover:opacity-90 transition-opacity" />
                  <div className="px-1 py-1 bg-white/3">
                    <span className="text-[9px] text-slate-500 group-hover:text-slate-300 truncate block text-center transition-colors">{s.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Webcam */}
          {webcamActive ? (
            <div className="glass-card p-4 space-y-3">
              <video ref={videoRef} className="w-full rounded-lg" autoPlay muted />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2">
                <motion.button
                  id="webcam-capture-btn"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={captureWebcam}
                  className="btn-primary flex-1 py-2.5"
                >
                  <Camera size={15} /> Capture
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setWebcamActive(false)
                    const stream = videoRef.current?.srcObject as MediaStream
                    stream?.getTracks().forEach((t) => t.stop())
                  }}
                  className="btn-secondary px-4"
                >
                  <X size={15} />
                </motion.button>
              </div>
            </div>
          ) : (
            <button
              id="webcam-btn"
              onClick={startWebcam}
              className="btn-secondary w-full py-2.5 text-sm"
            >
              <Camera size={15} /> Use Webcam
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-sm">
              <AlertCircle size={15} className="flex-shrink-0" /> {error}
            </div>
          )}

          {/* Run Button */}
          <motion.button
            id="run-inference-btn"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={runInference}
            disabled={!file || loading}
            className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-40"
            style={!loading && file ? { boxShadow: '0 0 24px rgba(0,212,255,0.25)' } : undefined}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin flex-shrink-0" />
                <span className="text-sm">{loadingStage}</span>
              </span>
            ) : isMultiMode ? (
              <><BarChart3 size={18} /> Run Multi-Model Comparison</>
            ) : (
              <><Brain size={18} /> Run {selectedModel} Inference</>
            )}
          </motion.button>
        </div>

        {/* Right: Results */}
        <div>
          <AnimatePresence mode="wait">
            {multiResult ? (
              <motion.div
                key="multi"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="glass-card p-5 border border-purple-500/25">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={18} className="text-purple-400" />
                      <h3 className="font-semibold text-white">Multi-Model Benchmark</h3>
                    </div>
                    <span className="text-xs text-slate-500 glass-card px-2 py-1">4 Models Evaluated</span>
                  </div>

                  <div className="space-y-3">
                    {multiResult.results.map((r: any) => {
                      const isFastest = r.model === multiResult.fastest_model
                      const isLowest  = r.model === multiResult.lowest_energy_model
                      const isHighest = r.model === multiResult.highest_conf_model
                      const color = MODEL_META[r.model]?.color ?? '#00d4ff'
                      return (
                        <motion.div
                          key={r.model}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg border"
                          style={{ background: `${color}08`, borderColor: `${color}25` }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="font-bold text-sm text-white">{r.model}</span>
                                {isFastest  && <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full">⚡ Fastest</span>}
                                {isLowest   && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">🌿 Eco</span>}
                                {isHighest  && <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">🎯 Best</span>}
                              </div>
                              <p className="text-xs text-slate-400 font-mono truncate">{r.predicted_class}</p>
                              {/* Confidence bar */}
                              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${r.confidence * 100}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                />
                              </div>
                            </div>
                            <div className="text-right text-xs font-mono space-y-1 flex-shrink-0">
                              <p className="font-bold text-sm" style={{ color }}>{(r.confidence * 100).toFixed(1)}%</p>
                              <p className="text-purple-300">{r.latency_ms.toFixed(1)} ms</p>
                              <p className="text-amber-300 text-[10px]">{(r.energy_wh * 1e6).toFixed(1)} µWh</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <div className="mt-4 p-3 bg-cyan-500/8 border border-cyan-500/20 rounded-lg text-xs text-cyan-300">
                    <Sparkles size={12} className="inline mr-1" />
                    <strong>Insight:</strong> {multiResult.recommendation}
                  </div>
                </div>
              </motion.div>

            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Main result card */}
                <div className="glass-card p-6 border border-emerald-500/25">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <CheckCircle size={17} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Inference Complete</h3>
                      <p className="text-[11px] text-slate-500">{selectedModel} · ID #{result.prediction_id}</p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-3xl font-bold text-white capitalize mb-4"
                    >
                      {result.predicted_class}
                    </motion.p>

                    <div className="flex items-center gap-3 px-4">
                      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${meta?.color ?? '#00d4ff'}, ${meta?.color ?? '#00d4ff'}88)` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${confidencePct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-lg font-bold w-16 text-right" style={{ color: meta?.color ?? '#00d4ff' }}>
                        {confidencePct.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Confidence Score</p>
                  </div>
                </div>

                {/* Metric pills */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Latency',  value: `${result.latency_ms.toFixed(1)}ms`,              icon: <Clock size={15} />,  color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                    { label: 'Energy',   value: `${(result.energy_wh * 1e6).toFixed(2)}µWh`,      icon: <Zap size={15} />,    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
                    { label: 'Device',   value: `${result.device_power_w.toFixed(2)}W`,            icon: <Leaf size={15} />,   color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
                  ].map((m) => (
                    <div key={m.label} className={`glass-card p-3 text-center border ${m.border}`}>
                      <div className={`flex justify-center mb-1.5 ${m.color}`}>{m.icon}</div>
                      <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Top-5 */}
                {result.top5 && result.top5.length > 0 && (
                  <div className="glass-card p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Target size={12} /> Top 5 Predictions
                    </h4>
                    <div className="space-y-2.5">
                      {result.top5.map((p: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-600 w-4 flex-shrink-0">{i + 1}</span>
                          <span className="text-sm text-slate-300 flex-1 capitalize">{p.class}</span>
                          <div className="w-24 bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: i === 0 ? (meta?.color ?? '#00d4ff') : '#8b5cf6' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(p.confidence * 100, 2)}%` }}
                              transition={{ duration: 0.7, delay: i * 0.08 }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-10 text-right">
                            {(p.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="glass-card p-4 border border-cyan-500/15">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp size={12} /> Recommendation
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.recommendation}</p>
                </div>
              </motion.div>

            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center gap-5 text-center p-12"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center">
                  <Brain size={36} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-400 mb-2">Ready to Analyze</p>
                  <p className="text-sm text-slate-600">Upload an image or pick a demo sample,<br />then click Run Inference</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
