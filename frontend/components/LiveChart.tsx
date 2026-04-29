'use client'

import React from 'react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { format } from 'date-fns'

interface DataPoint {
  timestamp: string
  [key: string]: number | string
}

interface Series {
  key:   string
  label: string
  color: string
  dashed?: boolean
}

interface LiveChartProps {
  id:       string
  title:    string
  data:     DataPoint[]
  series:   Series[]
  unit?:    string
  type?:    'area' | 'line'
  height?:  number
  referenceValue?: number
  referenceLabel?: string
}

function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs min-w-[140px]">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-semibold ml-auto" style={{ color: p.color }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            {unit && <span className="text-slate-400 ml-0.5">{unit}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function LiveChart({
  id, title, data, series, unit, type = 'area', height = 180,
  referenceValue, referenceLabel,
}: LiveChartProps) {
  // Format timestamps for display
  const formatted = data.map((d) => ({
    ...d,
    time: (() => {
      try { return format(new Date(d.timestamp), 'HH:mm:ss') }
      catch { return d.timestamp }
    })(),
  }))

  const ChartComponent = type === 'area' ? AreaChart : LineChart

  return (
    <div id={id} className="glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={s.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#475569', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} unit={unit} />}
            cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
          />

          {referenceValue !== undefined && (
            <ReferenceLine
              y={referenceValue}
              stroke="rgba(239,68,68,0.5)"
              strokeDasharray="4 4"
              label={{ value: referenceLabel || '', fill: '#EF4444', fontSize: 9 }}
            />
          )}

          {series.map((s) =>
            type === 'area' ? (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${s.key})`}
                dot={false}
                activeDot={{ r: 4, fill: s.color, stroke: '#0A0F1E', strokeWidth: 2 }}
                strokeDasharray={s.dashed ? '5 5' : undefined}
              />
            ) : (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: s.color }}
                strokeDasharray={s.dashed ? '5 5' : undefined}
              />
            )
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
