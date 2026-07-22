'use client'

import React, { useMemo } from 'react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { TelemetryHistory } from '@/lib/types'

interface Series {
  key:    keyof TelemetryHistory
  label:  string
  color:  string
  dashed?: boolean
}

interface LiveChartProps {
  id?:             string
  title:           string
  data:            TelemetryHistory[]
  series:          Series[]
  unit?:           string
  type?:           'area' | 'line'
  referenceValue?: number
  referenceLabel?: string
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null
  const time = label ? new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''
  return (
    <div className="scifi-card px-3 py-2.5 text-xs min-w-[110px]">
      <p className="text-slate-500 mb-1.5 font-mono text-[10px]">{time}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold font-mono" style={{ color: p.color }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function LiveChart({
  id, title, data, series, unit = '', type = 'area', referenceValue, referenceLabel,
}: LiveChartProps) {
  const gradientIds = useMemo(
    () => series.map((_, i) => `grad-${id ?? 'chart'}-${i}`),
    [id, series]
  )

  const tickFormatter = (val: string) => {
    try { return new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    catch { return val }
  }

  const Chart = type === 'area' ? AreaChart : LineChart

  return (
    <div id={id} className="scifi-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <div className="flex items-center gap-3">
          {series.map((s) => (
            <span key={s.key as string} className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span
                className="w-2 h-0.5 rounded-full inline-block"
                style={{ background: s.color, border: s.dashed ? '1px dashed' : 'none' }}
              />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <Chart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key as string} id={gradientIds[i]} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={s.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

          <XAxis
            dataKey="timestamp"
            tickFormatter={tickFormatter}
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}${unit}`}
          />

          <Tooltip
            content={<CustomTooltip unit={unit} />}
            cursor={{ stroke: 'rgba(0,212,255,0.15)', strokeWidth: 1 }}
          />

          {referenceValue !== undefined && (
            <ReferenceLine
              y={referenceValue}
              stroke="rgba(239,68,68,0.5)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: referenceLabel ?? `${referenceValue}${unit}`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
            />
          )}

          {series.map((s, i) =>
            type === 'area' ? (
              <Area
                key={s.key as string}
                type="monotone"
                dataKey={s.key as string}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#${gradientIds[i]})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                strokeDasharray={s.dashed ? '5 5' : undefined}
              />
            ) : (
              <Line
                key={s.key as string}
                type="monotone"
                dataKey={s.key as string}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                strokeDasharray={s.dashed ? '5 5' : undefined}
              />
            )
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
