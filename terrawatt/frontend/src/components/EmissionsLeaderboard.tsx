"use client";
import React, { useState, useEffect } from 'react';
import { fetchLeaderboards } from '@/lib/api';
import Link from 'next/link';

interface LeaderboardProps {
  year: number;
}

export default function EmissionsLeaderboard({ year }: LeaderboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'renewable' | 'clean' | 'improvers'>('renewable');

  useEffect(() => {
    setLoading(true);
    fetchLeaderboards(year).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [year]);

  if (loading) return (
    <div className="w-full h-64 bg-slate-900/50 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-slate-500">Loading rankings...</span>
    </div>
  );

  if (!data) return null;

  const currentList = data[tab];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex border-b border-slate-800">
        <button 
          onClick={() => setTab('renewable')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${tab === 'renewable' ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Most Green
        </button>
        <button 
          onClick={() => setTab('clean')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${tab === 'clean' ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Lowest CO₂
        </button>
        <button 
          onClick={() => setTab('improvers')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${tab === 'improvers' ? 'bg-amber-500/10 text-amber-400 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Fastest Transition
        </button>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {currentList.map((item: any, idx: number) => (
            <Link 
              key={item.country_code} 
              href={`/country/${item.country_code}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 text-sm font-mono ${idx < 3 ? 'text-green-400 font-bold' : 'text-slate-600'}`}>
                  {idx + 1}
                </span>
                <span className="text-sm text-slate-200 group-hover:text-white transition-colors">{item.country}</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {tab === 'renewable' && `${item.renewable_pct}%`}
                {tab === 'clean' && `${item.co2_per_kwh}g/kWh`}
                {tab === 'improvers' && `+${item.improvement.toFixed(1)}%`}
              </span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-800/30 p-3 text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          Top 10 Global Performers &bull; {year}
        </p>
      </div>
    </div>
  );
}
