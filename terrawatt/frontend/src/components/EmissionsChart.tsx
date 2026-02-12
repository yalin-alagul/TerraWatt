"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Emissions } from '@/types';

interface EmissionsChartProps {
  data: Emissions[];
}

export default function EmissionsChart({ data }: EmissionsChartProps) {
  return (
    <div className="w-full h-[400px] bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">Emissions Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="year" stroke="#94a3b8" />
          <YAxis yAxisId="left" stroke="#ef4444" label={{ value: 'CO2 (g/kWh)', angle: -90, position: 'insideLeft', fill: '#ef4444' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#f97316" label={{ value: 'Total CO2 (MT)', angle: 90, position: 'insideRight', fill: '#f97316' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} itemStyle={{ color: '#e2e8f0' }} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="co2_per_kwh" stroke="#ef4444" activeDot={{ r: 8 }} name="CO2 g/kWh" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="co2_emissions_mt" stroke="#f97316" name="Total Emissions (MT)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
