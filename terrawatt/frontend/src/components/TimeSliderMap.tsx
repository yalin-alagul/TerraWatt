"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateYlGn } from "d3-scale-chromatic";
import { fetchRenewablePct } from '@/lib/api';
import { useRouter } from 'next/navigation';

const geoUrl = "/world-110m.json";

interface MapData {
  id: string;
  value: number;
}

const ID_TO_CODE: Record<string, string> = {
    "004": "AFG", "008": "ALB", "012": "DZA", "016": "ASM", "020": "AND", "024": "AGO", "028": "ATG", "031": "AZE", "032": "ARG", "036": "AUS",
    "040": "AUT", "044": "BHS", "048": "B Bahrain", "050": "BGD", "051": "ARM", "052": "BRB", "056": "BEL", "060": "BMU", "064": "BTN", "068": "BOL",
    "070": "BIH", "072": "BWA", "076": "BRA", "084": "BLZ", "090": "SLB", "096": "BRN", "100": "BGR", "104": "MMR", "108": "BDI", "112": "BLR",
    "116": "KHM", "120": "CMR", "124": "CAN", "132": "CPV", "136": "CYM", "140": "CAF", "144": "LKA", "148": "TCD", "152": "CHL", "156": "CHN",
    "170": "COL", "174": "COM", "178": "COG", "180": "COD", "184": "COK", "188": "CRI", "191": "HRV", "192": "CUB", "196": "CYP", "203": "CZE",
    "204": "BEN", "208": "DNK", "212": "DMA", "214": "DOM", "218": "ECU", "222": "SLV", "226": "GNQ", "231": "ETH", "232": "ERI", "233": "EST",
    "242": "FJI", "246": "FIN", "250": "FRA", "254": "GUF", "258": "PYF", "262": "DJI", "266": "GAB", "268": "GMB", "270": "GMB", "276": "DEU",
    "288": "GHA", "292": "GIB", "296": "KIR", "300": "GRC", "304": "GRL", "308": "GRD", "312": "GLP", "316": "GUM", "320": "GTM", "324": "GIN",
    "328": "GNB", "332": "HTI", "340": "HND", "344": "HKG", "348": "HUN", "352": "ISL", "356": "IND", "360": "IDN", "364": "IRN", "368": "IRQ",
    "372": "IRL", "376": "ISR", "380": "ITA", "384": "CIV", "388": "JAM", "392": "JPN", "398": "KAZ", "400": "JOR", "404": "KEN", "408": "PRK",
    "410": "KOR", "414": "KWT", "417": "KGZ", "418": "LAO", "422": "LBN", "426": "LSO", "428": "LVA", "430": "LBR", "434": "LBY", "440": "LTU",
    "442": "LUX", "446": "MAC", "450": "MDG", "454": "MWI", "458": "MYS", "462": "MDV", "466": "MLI", "470": "MLT", "474": "MTQ", "478": "MRT",
    "480": "MUS", "484": "MEX", "496": "MNG", "498": "MDA", "500": "MSR", "504": "MAR", "508": "MOZ", "512": "OMN", "516": "NAM", "520": "NRU",
    "524": "NPL", "528": "NLD", "531": "CUW", "533": "ABW", "540": "NCL", "548": "VUT", "554": "NZL", "558": "NIC", "562": "NER", "566": "NGA",
    "570": "NIU", "578": "NOR", "586": "PAK", "591": "PAN", "598": "PNG", "600": "PRY", "604": "PER", "608": "PHL", "616": "POL", "620": "PRT",
    "630": "PRI", "634": "QAT", "642": "ROU", "643": "RUS", "646": "RWA", "659": "KNA", "662": "LCA", "666": "SPM", "670": "VCT", "678": "STP",
    "682": "SAU", "686": "SEN", "688": "SRB", "690": "SYC", "694": "SLE", "702": "SGP", "703": "SVK", "704": "VNM", "705": "SVN", "706": "SOM",
    "710": "ZAF", "716": "ZWE", "724": "ESP", "728": "SSD", "729": "SDN", "740": "SUR", "748": "SWZ", "752": "SWE", "756": "CHE", "760": "SYR",
    "762": "TJK", "764": "THA", "768": "TGO", "776": "TON", "780": "TTO", "784": "ARE", "788": "TUN", "792": "TUR", "795": "TKM", "800": "UGA",
    "804": "UKR", "807": "MKD", "818": "EGY", "826": "GBR", "834": "TZA", "840": "USA", "854": "BFA", "858": "URY", "860": "UZB", "862": "VEN",
    "882": "WSM", "887": "YEM", "894": "ZMB"
};

export default function TimeSliderMap() {
  const router = useRouter();
  const [year, setYear] = useState(2024);
  const [data, setData] = useState<MapData[]>([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let active = true;
    fetchRenewablePct(year).then((res) => {
      if (active) setData(res);
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
                      const name = geo.properties?.NAME || geo.properties?.name || `Country ${geo.id}`;
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
