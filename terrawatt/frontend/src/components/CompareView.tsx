"use client";
import React, { useState, useEffect } from 'react';
import { fetchEnergyMix, fetchEmissions } from '@/lib/api';
import { EnergyMix, Emissions } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const COUNTRIES = [
  { code: "FRA", name: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "DEU", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "CHN", name: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "USA", name: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "TUR", name: "Turkey", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "ISL", name: "Iceland", flag: "\u{1F1EE}\u{1F1F8}" },
];

const SOURCE_LABELS: Record<string, string> = {
  coal_pct: "Coal", oil_pct: "Oil", gas_pct: "Gas", nuclear_pct: "Nuclear",
  hydro_pct: "Hydro", wind_pct: "Wind", solar_pct: "Solar", other_renewables_pct: "Other Renewables"
};

const SOURCES = Object.keys(SOURCE_LABELS);

const COLORS: Record<string, string> = {
  coal_pct: "#4a4a4a", oil_pct: "#8B4513", gas_pct: "#DAA520", nuclear_pct: "#9B59B6",
  hydro_pct: "#3498DB", wind_pct: "#1ABC9C", solar_pct: "#F39C12", other_renewables_pct: "#2ECC71"
};

const COUNTRY_COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

export default function CompareView() {
  const [selected, setSelected] = useState<string[]>(["FRA", "DEU"]);
  const [energyData, setEnergyData] = useState<Record<string, EnergyMix[]>>({});
  const [emissionsData, setEmissionsData] = useState<Record<string, Emissions[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected.length === 0) return;
    setLoading(true);
    Promise.all(
      selected.map(async (code) => {
        const [energy, emissions] = await Promise.all([
          fetchEnergyMix(code),
          fetchEmissions(code),
        ]);
        return { code, energy, emissions };
      })
    ).then((results) => {
      const eMap: Record<string, EnergyMix[]> = {};
      const emMap: Record<string, Emissions[]> = {};
      results.forEach(({ code, energy, emissions }) => {
        eMap[code] = energy;
        emMap[code] = emissions;
      });
      setEnergyData(eMap);
      setEmissionsData(emMap);
      setLoading(false);
    });
  }, [selected]);

  const toggleCountry = (code: string) => {
    setSelected((prev) => {
      if (prev.includes(code)) return prev.filter((c) => c !== code);
      if (prev.length >= 3) return prev;
      return [...prev, code];
    });
  };

  // Build bar chart data for latest year energy mix comparison
  const latestMixData = SOURCES.map((source) => {
    const row: Record<string, string | number> = { name: SOURCE_LABELS[source] };
    selected.forEach((code) => {
      const data = energyData[code];
      if (data && data.length > 0) {
        const latest = data[data.length - 1];
        row[code] = (latest as unknown as Record<string, number>)[source] || 0;
      }
    });
    return row;
  });

  // Build emissions trend data (merge by year)
  const emissionsByYear: Record<number, Record<string, number>> = {};
  selected.forEach((code) => {
    const data = emissionsData[code] || [];
    data.forEach((d) => {
      if (!emissionsByYear[d.year]) emissionsByYear[d.year] = { year: d.year };
      emissionsByYear[d.year][code] = d.co2_per_kwh;
    });
  });
  const emissionsTrendData = Object.values(emissionsByYear).sort((a, b) => a.year - b.year);

  const getName = (code: string) => COUNTRIES.find((c) => c.code === code)?.name || code;
  const getFlag = (code: string) => COUNTRIES.find((c) => c.code === code)?.flag || "";

  return (
    <div className="space-y-8">
      {/* Country Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-sm text-slate-400 mb-4">Select up to 3 countries to compare:</p>
        <div className="flex flex-wrap gap-3">
          {COUNTRIES.map((c) => {
            const isSelected = selected.includes(c.code);
            return (
              <button
                key={c.code}
                onClick={() => toggleCountry(c.code)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  isSelected
                    ? "bg-green-600 text-white border border-green-500 shadow-lg shadow-green-900/20"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500"
                } ${!isSelected && selected.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!isSelected && selected.length >= 3}
              >
                {c.flag} {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && selected.length > 0 && (
        <>
          {/* Energy Mix Comparison (Bar Chart) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-1">Energy Mix Comparison (2024)</h3>
            <p className="text-sm text-slate-400 mb-4">Side-by-side breakdown of each country&apos;s electricity generation sources.</p>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latestMixData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  {selected.map((code, i) => (
                    <Bar key={code} dataKey={code} name={`${getFlag(code)} ${getName(code)}`} fill={COUNTRY_COLORS[i]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Carbon Intensity Trend (Line Chart) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-1">Carbon Intensity Over Time</h3>
            <p className="text-sm text-slate-400 mb-4">CO&#x2082; grams per kWh of electricity generated, 2000&ndash;2024.</p>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emissionsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" unit=" g" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  {selected.map((code, i) => (
                    <Line
                      key={code}
                      type="monotone"
                      dataKey={code}
                      name={`${getFlag(code)} ${getName(code)}`}
                      stroke={COUNTRY_COLORS[i]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">2024 Snapshot</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-left py-3 pr-4">Metric</th>
                  {selected.map((code) => (
                    <th key={code} className="text-right py-3 px-4">{getFlag(code)} {getName(code)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {SOURCES.map((source) => (
                  <tr key={source} className="border-b border-slate-800">
                    <td className="py-2 pr-4 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS[source] }} />
                      {SOURCE_LABELS[source]}
                    </td>
                    {selected.map((code) => {
                      const data = energyData[code];
                      const latest = data && data.length > 0 ? data[data.length - 1] : null;
                      const val = latest ? (latest as unknown as Record<string, number>)[source] : 0;
                      return (
                        <td key={code} className="text-right py-2 px-4 font-mono">
                          {val?.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-4 font-semibold">Total Generation</td>
                  {selected.map((code) => {
                    const data = energyData[code];
                    const latest = data && data.length > 0 ? data[data.length - 1] : null;
                    return (
                      <td key={code} className="text-right py-2 px-4 font-mono font-semibold">
                        {latest?.total_generation_twh?.toFixed(0)} TWh
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-4 font-semibold text-red-400">CO&#x2082; per kWh</td>
                  {selected.map((code) => {
                    const data = emissionsData[code];
                    const latest = data && data.length > 0 ? data[data.length - 1] : null;
                    return (
                      <td key={code} className="text-right py-2 px-4 font-mono font-semibold text-red-400">
                        {latest?.co2_per_kwh?.toFixed(0)} g
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-orange-400">Total CO&#x2082;</td>
                  {selected.map((code) => {
                    const data = emissionsData[code];
                    const latest = data && data.length > 0 ? data[data.length - 1] : null;
                    return (
                      <td key={code} className="text-right py-2 px-4 font-mono font-semibold text-orange-400">
                        {latest?.co2_emissions_mt?.toFixed(1)} MT
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
