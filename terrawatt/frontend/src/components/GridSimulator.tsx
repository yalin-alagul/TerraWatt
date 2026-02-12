"use client";
import React, { useState, useEffect } from 'react';
import { simulate, fetchEnergyMix } from '@/lib/api';
import { SimulationResult } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const SOURCES = ["coal_pct", "oil_pct", "gas_pct", "nuclear_pct", "hydro_pct", "wind_pct", "solar_pct", "other_renewables_pct"];
const SOURCE_LABELS: Record<string, string> = {
  coal_pct: "Coal", oil_pct: "Oil", gas_pct: "Gas", nuclear_pct: "Nuclear",
  hydro_pct: "Hydro", wind_pct: "Wind", solar_pct: "Solar", other_renewables_pct: "Other"
};
const COLORS: Record<string, string> = {
  coal_pct: "#4a4a4a", oil_pct: "#8B4513", gas_pct: "#DAA520", nuclear_pct: "#9B59B6",
  hydro_pct: "#3498DB", wind_pct: "#1ABC9C", solar_pct: "#F39C12", other_renewables_pct: "#2ECC71"
};

const COUNTRIES = [
    { code: "USA", name: "United States" },
    { code: "CHN", name: "China" },
    { code: "DEU", name: "Germany" },
    { code: "FRA", name: "France" },
    { code: "TUR", name: "Turkey" },
    { code: "ISL", name: "Iceland" },
];

export default function GridSimulator() {
  const [country, setCountry] = useState("USA");
  const [mix, setMix] = useState<Record<string, number>>({});
  const [baseMix, setBaseMix] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnergyMix(country, 2024, 2024).then(data => {
      if (data && data.length > 0) {
        const latest = data[0];
        const newMix: Record<string, number> = {};
        SOURCES.forEach(k => newMix[k] = (latest as any)[k]);
        setMix(newMix);
        setBaseMix(newMix);
        setResult(null);
      }
    });
  }, [country]);

  const handleSliderChange = (source: string, val: number) => {
    setMix(prev => ({ ...prev, [source]: val }));
  };

  const total = Object.values(mix).reduce((a, b) => a + b, 0);
  const isValid = Math.abs(total - 100) < 1.0;

  const handleSimulate = async () => {
    setLoading(true);
    setError("");
    try {
        // Calculate deltas or just send the new mix?
        // My backend implementation supports deltas.
        // adjustments = new - old
        const adjustments: Record<string, number> = {};
        SOURCES.forEach(k => {
            adjustments[k] = mix[k] - baseMix[k];
        });
        
        const res = await simulate({
            country_code: country,
            base_year: 2024,
            adjustments
        });
        setResult(res);
    } catch (err) {
        setError("Simulation failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const chartData = SOURCES.map(key => ({
    name: SOURCE_LABELS[key],
    Original: baseMix[key],
    Simulated: result ? result.simulated.energy_mix[key] : mix[key], // Show current slider state if no result yet? Or stick to result?
    // Let's show slider state as "Planned" if not simulated, but better to compare Original vs Result after simulation.
    // For now, let's just show Original vs Current (Slider) if no result, or Original vs Simulated if result.
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Controls */}
        <div className="w-full md:w-1/3 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Select Country</label>
                <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="font-semibold">Energy Source</span>
                    <span className="font-semibold">%</span>
                </div>
                {SOURCES.map(source => (
                    <div key={source} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span style={{ color: COLORS[source] }}>{SOURCE_LABELS[source]}</span>
                            <span>{mix[source]?.toFixed(1)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100" step="0.5"
                            value={mix[source] || 0}
                            onChange={(e) => handleSliderChange(source, parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: COLORS[source] }}
                        />
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">Total:</span>
                    <span className={`text-xl font-bold ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                        {total.toFixed(1)}%
                    </span>
                </div>
                {!isValid && <p className="text-red-400 text-xs mb-4">Total must be ~100%</p>}
                
                <button 
                    onClick={handleSimulate}
                    disabled={!isValid || loading}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                        isValid && !loading 
                        ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' 
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {loading ? "Simulating..." : "Run Simulation"}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>

        {/* Results */}
        <div className="w-full md:w-2/3 space-y-6">
             {/* Chart */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[400px]">
                <h3 className="text-lg font-semibold mb-4">Projected Energy Mix</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} itemStyle={{ color: '#e2e8f0' }} />
                        <Legend />
                        <Bar dataKey="Original" fill="#64748b" />
                        <Bar dataKey="Simulated" fill="#22c55e" />
                    </BarChart>
                </ResponsiveContainer>
             </div>

             {/* KPIs */}
             {result && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-slate-800 rounded-xl p-6 border border-green-500/30 bg-green-900/10">
                         <p className="text-sm text-slate-400">CO2 Saved</p>
                         <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-green-400">{result.delta.co2_saved_mt > 0 ? result.delta.co2_saved_mt : 0}</span>
                            <span className="text-xl text-green-500 mb-1">MT</span>
                         </div>
                         {result.delta.co2_saved_mt < 0 && <p className="text-red-400 text-xs mt-1">Warning: Emissions increased!</p>}
                     </div>
                     <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                         <p className="text-sm text-slate-400">Carbon Intensity</p>
                         <div className="flex items-end gap-2">
                             <span className="text-3xl font-bold text-white">{result.simulated.co2_per_kwh}</span>
                             <span className="text-sm text-slate-400 mb-1">g/kWh</span>
                         </div>
                         <p className="text-xs text-green-400 mt-1">-{result.delta.co2_per_kwh_reduction} g/kWh reduction</p>
                     </div>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
}
