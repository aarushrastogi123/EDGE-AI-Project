'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface EnergyOrbProps {
  size?: number        // diameter in px of core
  className?: string
  showOrbit?: boolean
}

export default function EnergyOrb({ size = 120, className = '', showOrbit = true }: EnergyOrbProps) {
  const ring1 = size * 1.5
  const ring2 = size * 2.2
  const ring3 = size * 3.0

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: ring3, height: ring3 }}
    >
      {/* Outermost ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width:  ring3,
          height: ring3,
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Ring 3 — slowest pulse */}
      <motion.div
        className="absolute rounded-full border border-cyan-400/10"
        style={{ width: ring3, height: ring3 }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />

      {/* Ring 2 */}
      <motion.div
        className="absolute rounded-full border border-purple-400/15"
        style={{ width: ring2, height: ring2 }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      {/* Ring 1 */}
      <motion.div
        className="absolute rounded-full border border-cyan-400/25"
        style={{ width: ring1, height: ring1 }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbiting dot 1 */}
      {showOrbit && (
        <motion.div
          className="absolute"
          style={{ width: ring2, height: ring2 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 8px rgba(0,212,255,0.8)' }}
          />
        </motion.div>
      )}

      {/* Orbiting dot 2 (reverse) */}
      {showOrbit && (
        <motion.div
          className="absolute"
          style={{ width: ring1, height: ring1 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400"
            style={{ boxShadow: '0 0 6px rgba(124,58,237,0.8)' }}
          />
        </motion.div>
      )}

      {/* Core */}
      <motion.div
        className="relative rounded-full z-10"
        style={{ width: size, height: size }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Core gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(0,212,255,0.9) 0%, rgba(124,58,237,0.8) 50%, rgba(10,15,30,0.9) 100%)',
            boxShadow: '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(124,58,237,0.3), inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        />

        {/* Rotating inner pattern */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,212,255,0.3) 25%, transparent 50%, rgba(124,58,237,0.3) 75%, transparent 100%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center bright spot */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.4) 0%, transparent 40%)',
          }}
        />
      </motion.div>
    </div>
  )
}
