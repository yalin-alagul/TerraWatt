'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchEnergyMix, fetchEmissions, fetchPredictions } from '@/lib/api';
import { EnergyMix, Emissions } from '@/types';
import EnergyMixChart from '@/components/EnergyMixChart';
import EmissionsChart from '@/components/EmissionsChart';

interface Profile {
  name: string;
  archetype: string;
  flag: string;
  description: string;
  insights: string[];
}

const COUNTRIES_DATA: Record<string, Profile> = {
  FRA: {
    name: "France",
    archetype: "The Nuclear Baseline",
    flag: "\u{1F1EB}\u{1F1F7}",
    description: "France relies heavily on nuclear power, providing a stable low-carbon baseline.",
    insights: [
        "Maintains one of the lowest carbon intensities in the G20 due to its 70% nuclear share.",
        "Currently facing challenges with aging reactors and increasing maintenance downtime.",
        "Aims to increase wind and solar capacity to diversify its low-carbon mix."
    ]
  },
  DEU: {
    name: "Germany",
    archetype: "The Energiewende Experiment",
    flag: "\u{1F1E9}\u{1F1EA}",
    description: "Germany is aggressively phasing out nuclear and coal in favor of wind and solar.",
    insights: [
        "Successfully grew renewable share from ~6% in 2000 to over 45% today.",
        "The nuclear phase-out (Atomausstieg) necessitated a temporary increase in coal and gas usage.",
        "Focusing heavily on hydrogen infrastructure and grid-scale storage to manage intermittency."
    ]
  },
  CHN: {
    name: "China",
    archetype: "The Industrial Giant",
    flag: "\u{1F1E8}\u{1F1F3}",
    description: "China is the world's largest consumer of coal but also the leading investor in solar and wind.",
    insights: [
        "Installed more solar capacity in 2023 than the US has in its entire history.",
        "Coal still accounts for over 50% of generation to support massive industrial demand.",
        "Rapidly scaling up ultra-high-voltage (UHV) transmission to move green energy from the west to the east."
    ]
  },
  USA: {
    name: "United States",
    archetype: "The Mixed Economy",
    flag: "\u{1F1FA}\u{1F1F8}",
    description: "The US has a diverse energy mix with growing gas and renewables displacing coal.",
    insights: [
        "The 'Shale Gale' led to a massive shift from coal to natural gas, reducing CO2 intensity.",
        "Solar and wind are the fastest-growing sources, particularly in the Midwest and Southwest.",
        "The Inflation Reduction Act (IRA) is driving unprecedented investment in domestic clean tech."
    ]
  },
  TUR: {
    name: "Turkey",
    archetype: "The Rising Bridge",
    flag: "\u{1F1F9}\u{1F1F7}",
    description: "Turkey is rapidly expanding its wind and solar capacity while leveraging its unique geographic position as an energy corridor.",
    insights: [
        "Turkey has become a regional leader in geothermal energy, ranking in the top 5 globally.",
        "Hydropower remains the backbone of Turkey's renewable grid, accounting for roughly 20-25% of generation.",
        "The start of the Akkuyu Nuclear Plant marks a significant shift toward a diversified low-carbon base load."
    ]
  },
  ISL: {
    name: "Iceland",
    archetype: "The Geothermal Ideal",
    flag: "\u{1F1EE}\u{1F1F8}",
    description: "Iceland generates nearly 100% of its electricity from geothermal and hydro sources.",
    insights: [
        "One of the only countries in the world to achieve a fully renewable power and heat grid.",
        "Leverages abundant volcanic activity for high-enthalpy geothermal energy.",
        "Attracts energy-intensive industries like aluminum smelting and data centers due to low costs."
    ]
  }
};

export default function CountryClient() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();

  const [energyData, setEnergyData] = useState<EnergyMix[]>([]);
  const [emissionsData, setEmissionsData] = useState<Emissions[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const profile = COUNTRIES_DATA[code] || {
    name: code,
    archetype: "Energy Profile",
    flag: "\u{1F310}",
    description: `Analysis of the energy transition and environmental impact for ${code}.`,
    insights: [
        "Historical data shows the evolution of the energy grid from 2000 to 2024.",
        "Correlate the rise in renewables with the trend in CO2 emissions per kWh.",
        "Compare the base load stability vs. intermittent sources."
    ]
  };

  useEffect(() => {
    async function loadData() {
      const [energy, emissions, preds] = await Promise.all([
        fetchEnergyMix(code),
        fetchEmissions(code),
        fetchPredictions(code),
      ]);
      setEnergyData(energy);
      setEmissionsData(emissions);
      setPredictions(preds);
      setLoading(false);
    }
    loadData();
  }, [code]);

  if (loading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-6xl">{profile.flag}</span>
              <div>
                <h1 className="text-4xl font-bold text-white">{profile.name}</h1>
                <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm font-mono border border-green-800">
                  {code}
                </span>
              </div>
            </div>
            <h2 className="text-xl text-slate-300 font-semibold mt-4">{profile.archetype}</h2>
            <p className="text-slate-400 mt-2 max-w-2xl">{profile.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400 text-sm">Loading energy data...</div>
        </div>
      </div>
    );
  }

  const hasData = energyData && energyData.length > 0;
  const latestYear = hasData ? energyData[energyData.length - 1] : null;

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <span className="text-6xl">{profile.flag}</span>
            <div>
              <h1 className="text-4xl font-bold text-white">{profile.name}</h1>
              <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm font-mono border border-green-800">
                {code}
              </span>
            </div>
          </div>
          <h2 className="text-xl text-slate-300 font-semibold mt-4">{profile.archetype}</h2>
          <p className="text-slate-400 mt-2 max-w-2xl">{profile.description}</p>
        </div>

        {hasData && (
          <div className="flex gap-4">
            <a
              href={`/api/energy/mix?country_code=${code}`}
              download={`${code}_energy_data.json`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export JSON
            </a>
            <a
              href={`/api/energy/mix?country_code=${code}&format=csv`}
              download={`${code}_energy_data.csv`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Export CSV
            </a>
          </div>
        )}
      </div>

      {hasData ? (
        <>
          {/* Storage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h4 className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Battery Storage</h4>
              <p className="text-3xl font-mono text-green-400">
                {latestYear?.battery_storage_mwh !== undefined ? latestYear.battery_storage_mwh.toLocaleString() : 0}
                <span className="text-sm text-slate-600 ml-1">MWh</span>
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h4 className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Pumped Hydro</h4>
              <p className="text-3xl font-mono text-blue-400">
                {latestYear?.pumped_hydro_mwh !== undefined ? latestYear.pumped_hydro_mwh.toLocaleString() : 0}
                <span className="text-sm text-slate-600 ml-1">MWh</span>
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h4 className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Region</h4>
              <p className="text-3xl font-bold text-slate-200">{latestYear?.region || 'Other'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EnergyMixChart data={energyData} />
            <EmissionsChart data={emissionsData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Predictions */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <svg className="w-5 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                2030-2050 Predictions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {predictions.map((p: any) => (
                  <div key={p.year} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 mb-2">{p.year}</p>
                    <div className="space-y-1">
                      <p className="text-lg font-mono text-green-400">{p.renewable_pct}%</p>
                      <p className="text-[10px] text-slate-500 uppercase">Renewable</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-lg font-mono text-blue-400">{p.co2_per_kwh}g</p>
                      <p className="text-[10px] text-slate-500 uppercase">CO₂/kWh</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-slate-600 italic">
                * Based on linear trend projection from 2000-2024. Actual outcomes may vary significantly due to policy changes.
              </p>
            </div>

            {/* Insights */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Key Insights</h3>
              <ul className="space-y-4">
                {profile.insights.map((insight, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-300">
                      <span className="text-green-500 mt-1">✦</span>
                      <span>{insight}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Data Available</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Energy data is currently unavailable for this country. This may be because the backend
            server is not running or data for this region has not been loaded yet.
          </p>
        </div>
      )}
    </div>
  );
}
