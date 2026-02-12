"use client";
import React, { useState, useEffect } from 'react';
import { fetchRegional } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const REGION_COLORS: Record<string, string> = {
  "Europe": "#3b82f6",
  "Asia": "#ef4444",
  "North America": "#f59e0b",
  "Africa": "#10b981",
  "Oceania": "#8b5cf6",
  "South America": "#ec4899",
  "Other": "#64748b"
};

export default function RegionalOverview() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegional(2024).then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="w-full h-64 bg-slate-900/50 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-slate-500">Loading regional trends...</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Renewable share by region */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-1">Renewable Energy by Region</h3>
        <p className="text-xs text-slate-500 mb-6">Weighted average renewable % based on total generation.</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" unit="%" domain={[0, 100]} />
              <YAxis dataKey="region" type="category" stroke="#94a3b8" width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="renewable_pct" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={REGION_COLORS[entry.region] || REGION_COLORS.Other} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Storage by region */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-1">Grid Storage Capacity</h3>
        <p className="text-xs text-slate-500 mb-6">Combined Battery + Pumped Hydro storage (MWh).</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="region" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="battery_storage_mwh" name="Battery" fill="#22c55e" stackId="a" />
              <Bar dataKey="pumped_hydro_mwh" name="Pumped Hydro" fill="#3b82f6" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
