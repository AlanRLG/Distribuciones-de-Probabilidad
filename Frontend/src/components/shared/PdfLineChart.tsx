import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PdfPoint } from '../../types/simulation';

interface PdfLineChartProps {
  data: PdfPoint[];
  showCdf?: boolean;
  pdfLineType?: 'monotone' | 'step';
}

export default function PdfLineChart({
  data,
  showCdf = false,
  pdfLineType = 'monotone',
}: PdfLineChartProps) {
  const hasCdf = showCdf && data.some((point) => point.simulated_cdf !== undefined);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 12, right: 20, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
        <XAxis
          dataKey="x"
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 13 }}
          axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
          tickLine={false}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) => value.toFixed(2)}
        />
        {hasCdf && (
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1]}
            stroke="#10b981"
            tick={{ fill: '#6ee7b7', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
        )}
        <Tooltip
          formatter={(value) => (typeof value === 'number' ? value.toFixed(4) : value)}
          contentStyle={{
            background: '#151d2b',
            border: '1px solid rgba(148,163,184,0.15)',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
          labelFormatter={(label) => `x = ${label}`}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: '0.75rem', color: '#94a3b8' }}
        />
        <Line
          type={pdfLineType}
          dataKey="simulated"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Simulado (PDF)"
        />
        <Line
          type={pdfLineType}
          dataKey="theoretical"
          stroke="#f97316"
          strokeWidth={2}
          dot={false}
          name="Teórico (PDF)"
        />
        {hasCdf && (
          <>
            <Line
              type="monotone"
              yAxisId="right"
              dataKey="simulated_cdf"
              stroke="#a7f3d0"
              strokeDasharray="5 5"
              dot={false}
              name="CDF Simulado"
            />
            <Line
              type="monotone"
              yAxisId="right"
              dataKey="theoretical_cdf"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="CDF Teórico"
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
