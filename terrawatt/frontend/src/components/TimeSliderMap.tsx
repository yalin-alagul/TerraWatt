"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateYlGn } from "d3-scale-chromatic";
import { fetchRenewablePct } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ID_TO_CODE, ID_TO_NAME } from '@/lib/countries';

const geoUrl = "/world-110m.json";

interface MapData {
  id: string;
  value: number;
}

export default function TimeSliderMap() {
  const router = useRouter();
  const [year, setYear] = useState(2024);
  const [data, setData] = useState<MapData[]>([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    fetchRenewablePct(year)
      .then((res) => {
        if (active) { setData(res); setLoading(false); }
      })
      .catch(() => {
        if (active) { setError(true); setLoading(false); }
      });
    return () => { active = false; };
  }, [year]);

  const colorScale = useMemo(() => 
    scaleSequential(interpolateYlGn).domain([0, 100]), 
  []);

  const handleMouseMove = (event: React.MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-[600px] border border-slate-800 rounded-xl bg-slate-900 overflow-hidden" onMouseMove={handleMouseMove}>
        <ComposableMap projectionConfig={{ scale: 147 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = ID_TO_CODE[geo.id];
                const cur = data.find((s) => s.id === countryCode);
                const isAvailable = !!countryCode;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={cur ? colorScale(cur.value) : "#334155"}
                    stroke="#0f172a"
                    strokeWidth={0.5}
                    onClick={() => {
                      if (isAvailable) router.push(`/country/${countryCode}`);
                    }}
                    style={{
                      default: { outline: "none" },
                      hover: { 
                        fill: isAvailable ? "#F59E0B" : (cur ? colorScale(cur.value) : "#475569"), 
                        outline: "none", 
                        cursor: isAvailable ? "pointer" : "default" 
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => {
                      const name = ID_TO_NAME[geo.id] || geo.properties?.NAME || geo.properties?.name || `Country ${geo.id}`;
                      const val = cur ? `${cur.value}% Renewable` : "No Data";
                      setTooltipContent(`${name}: ${val}`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
         {loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-40">
               <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
             </div>
         )}
         {error && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-40">
               <p className="text-red-400 text-sm">Failed to load data. Please try again.</p>
             </div>
         )}
         {tooltipContent && (
             <div className="absolute top-4 left-4 bg-slate-900/90 p-2 rounded border border-slate-700 pointer-events-none text-white z-50">
                 {tooltipContent}
             </div>
         )}
      </div>

      <div className="w-full max-w-2xl mt-8 flex flex-col items-center space-y-2">
        <label htmlFor="year-slider" className="text-lg font-semibold text-slate-300">
          Year: <span className="text-green-400 text-2xl">{year}</span>
        </label>
        <input
          id="year-slider"
          type="range"
          min="2000"
          max="2024"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        <div className="w-full flex justify-between text-xs text-slate-500 font-mono">
          <span>2000</span>
          <span>2024</span>
        </div>
      </div>
    </div>
  );
}
