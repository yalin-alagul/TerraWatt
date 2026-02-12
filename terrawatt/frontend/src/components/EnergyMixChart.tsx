"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EnergyMix } from '@/types';

interface EnergyMixChartProps {
  data: EnergyMix[];
}

const COLORS = {
  coal_pct: "#4a4a4a",
  oil_pct: "#8B4513",
  gas_pct: "#DAA520",
  nuclear_pct: "#9B59B6",
  hydro_pct: "#3498DB",
  wind_pct: "#1ABC9C",
  solar_pct: "#F39C12",
  other_renewables_pct: "#2ECC71"
};

export default function EnergyMixChart({ data }: EnergyMixChartProps) {
  return (
    <div className="w-full h-[400px] bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">Energy Mix (2000-2024)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="year" stroke="#94a3b8" />
          <YAxis unit="%" stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          <Area type="monotone" dataKey="coal_pct" stackId="1" stroke={COLORS.coal_pct} fill={COLORS.coal_pct} name="Coal" />
          <Area type="monotone" dataKey="oil_pct" stackId="1" stroke={COLORS.oil_pct} fill={COLORS.oil_pct} name="Oil" />
          <Area type="monotone" dataKey="gas_pct" stackId="1" stroke={COLORS.gas_pct} fill={COLORS.gas_pct} name="Gas" />
          <Area type="monotone" dataKey="nuclear_pct" stackId="1" stroke={COLORS.nuclear_pct} fill={COLORS.nuclear_pct} name="Nuclear" />
          <Area type="monotone" dataKey="hydro_pct" stackId="1" stroke={COLORS.hydro_pct} fill={COLORS.hydro_pct} name="Hydro" />
          <Area type="monotone" dataKey="wind_pct" stackId="1" stroke={COLORS.wind_pct} fill={COLORS.wind_pct} name="Wind" />
          <Area type="monotone" dataKey="solar_pct" stackId="1" stroke={COLORS.solar_pct} fill={COLORS.solar_pct} name="Solar" />
          <Area type="monotone" dataKey="other_renewables_pct" stackId="1" stroke={COLORS.other_renewables_pct} fill={COLORS.other_renewables_pct} name="Other" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
