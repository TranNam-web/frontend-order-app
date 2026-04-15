'use client'

import Snowfall from 'react-snowfall'
import { useState } from 'react'

export default function SnowEffect() {
  const [showSnow, setShowSnow] = useState(true)

  return (
    <>
      <button
        onClick={() => setShowSnow(!showSnow)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10000,
          padding: '8px 12px',
          borderRadius: '8px',
          background: '#000',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        ❄️
      </button>

      {showSnow && (
        <Snowfall
          snowflakeCount={40}
          speed={[0.2, 0.8]}
          radius={[1, 3]}
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
      )}
    </>
  )
}