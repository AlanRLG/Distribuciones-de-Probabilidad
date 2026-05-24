import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PmfPoint } from '../../types/simulation';

interface PmfBarChartProps {
  data: PmfPoint[];
}

export default function PmfBarChart({ data }: PmfBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 12, right: 20, left: 4, bottom: 4 }}
        barGap={6}
        barCategoryGap="32%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
        <XAxis
          dataKey="k"
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 13 }}
          axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
          tickLine={false}
          label={{ value: 'k', position: 'insideBottomRight', offset: -2, fill: '#64748b' }}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) => value.toFixed(2)}
          label={{
            value: 'Probabilidad',
            angle: -90,
            position: 'insideLeft',
            fill: '#64748b',
            style: { textAnchor: 'middle' },
          }}
        />
        <Tooltip
          formatter={(value) => (typeof value === 'number' ? value.toFixed(4) : value)}
          contentStyle={{
            background: '#151d2b',
            border: '1px solid rgba(148,163,184,0.15)',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
          labelFormatter={(label) => `k = ${label}`}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: '0.75rem', color: '#94a3b8' }}
          iconType="square"
        />
        <Bar dataKey="simulated" fill="#3b82f6" name="Simulado" radius={[4, 4, 0, 0]} maxBarSize={56} />
        <Bar dataKey="theoretical" fill="#f97316" name="Teórico" radius={[4, 4, 0, 0]} maxBarSize={56} />
      </BarChart>
    </ResponsiveContainer>
  );
}
