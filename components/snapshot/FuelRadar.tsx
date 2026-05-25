'use client';

// FuelRadar: a small recharts radar that visualises a mix of habits/inputs.
// Recharts handles the polar math; we feed it a tiny dataset and theme the
// axis ticks with mono type so it sits inside the cream "card" cohesively.

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { axis: '[YOUR_FUEL_1]', label: 'coffee', value: 88 },
  { axis: '[YOUR_FUEL_2]', label: 'music', value: 92 },
  { axis: '[YOUR_FUEL_3]', label: 'books', value: 70 },
  { axis: '[YOUR_FUEL_4]', label: 'walks', value: 75 },
  { axis: '[YOUR_FUEL_5]', label: 'sleep', value: 65 },
];

function FuelRadar() {
  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-lg p-4">
      <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60 mb-3">
        Fuel mix
      </div>
      <div style={{ width: '100%', height: 160 }}>
        <ResponsiveContainer width="100%" height={160}>
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="#3D3830" strokeOpacity={0.15} />
            <PolarAngleAxis
              dataKey="label"
              tick={{
                fontSize: 10,
                fill: '#3D3830',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <Radar
              dataKey="value"
              stroke="#FF8C7A"
              fill="rgba(255,140,122,0.25)"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FuelRadar;
