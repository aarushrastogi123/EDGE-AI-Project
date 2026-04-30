'use client'

import React from 'react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend, Dot,
} from 'recharts'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'

interface Series {
  key:    string
  label:  string
  color:  string
  dashed?: boolean
}

interface LiveChartProps {
  id:              string
  title:           string
  data:            Record<string, unknown>[]
  series:          Series[]
  unit?:           string
  type?:           'area' | 'line'
  referenceValue?: number
  referenceLabel?: string
  height?:         number
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null
  let display = label
  try { display = format(parseISO(label), 'HH:mm:ss') } catch {}
  return (
    <div className="glass-card px-4 py-3 text-xs border border-cyan-500/20"
         style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: 140 }}>
      <p className="text-slate-500 mb-2 font-mono">{display}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-semibold" style={{ color: p.color }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  )
}

const gradientDefs = (series: Series[]) => (
  <defs>
    {series.map(s => (
      <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%"  stopColor={s.color} stopOpacity={0.3} />
        <stop offset="95%" stopColor={s.color} stopOpacity={0.0} />
      </linearGradient>
    ))}
  </defs>
)

const tickStyle = { fill: '#475569', fontSize: 11 }

export default function LiveChart({
  id, title, data, series, unit = '', type = 'area',
  referenceValue, referenceLabel, height = 200,
}: LiveChartProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
        <div className="flex items-center gap-3">
          {series.length > 1 && series.map(s => (
            <div key={s.key} className="flex items-center gap-1.5">
              <div
                className="w-6 h-0.5 rounded"
                style={{
                  background: s.dashed ? 'none' : s.color,
                  borderTop: s.dashed ? `2px dashed ${s.color}` : 'none',
                }}
              />
              <span className="text-[10px] text-slate-500">{s.label}</span>
            </div>
          ))}
          {data.length > 0 && (
            <span className="text-[10px] text-slate-600 font-mono">{data.length} pts</span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            {gradientDefs(series)}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v) => { try { return format(parseISO(v), 'HH:mm') } catch { return '' } }}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} unit={unit} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {referenceValue !== undefined && (
              <ReferenceLine
                y={referenceValue}
                stroke="rgba(239,68,68,0.4)"
                strokeDasharray="5 5"
                label={{ value: referenceLabel ?? `${referenceValue}${unit}`, fill: '#ef4444', fontSize: 10 }}
              />
            )}
            {series.map(s => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${s.key})`}
                dot={false}
                isAnimationActive
                animationDuration={600}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            {gradientDefs(series)}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v) => { try { return format(parseISO(v), 'HH:mm') } catch { return '' } }}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} unit={unit} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {referenceValue !== undefined && (
              <ReferenceLine
                y={referenceValue}
                stroke="rgba(239,68,68,0.4)"
                strokeDasharray="5 5"
                label={{ value: referenceLabel ?? `${referenceValue}${unit}`, fill: '#ef4444', fontSize: 10 }}
              />
            )}
            {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />}
            {series.map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? '5 5' : undefined}
                dot={false}
                isAnimationActive
                animationDuration={600}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
