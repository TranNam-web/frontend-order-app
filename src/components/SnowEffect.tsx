'use client'

import Snowfall from 'react-snowfall'

export default function SnowEffect() {
  return (
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
  )
}