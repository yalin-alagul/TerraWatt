import { fetchEnergyMix, fetchEmissions } from '@/lib/api';
import EnergyMixChart from '@/components/EnergyMixChart';
import EmissionsChart from '@/components/EmissionsChart';
import { notFound } from 'next/navigation';

const COUNTRIES_DATA: Record<string, { name: string, archetype: string, flag: string, description: string }> = {
  FRA: { name: "France", archetype: "The Nuclear Baseline", flag: "🇫🇷", description: "France relies heavily on nuclear power, providing a stable low-carbon baseline." },
  DEU: { name: "Germany", archetype: "The Energiewende Experiment", flag: "🇩🇪", description: "Germany is aggressively phasing out nuclear and coal in favor of wind and solar." },
  CHN: { name: "China", archetype: "The Industrial Giant", flag: "🇨🇳", description: "China is the world's largest consumer of coal but also the leading investor in solar and wind." },
  USA: { name: "United States", archetype: "The Mixed Economy", flag: "🇺🇸", description: "The US has a diverse energy mix with growing gas and renewables displacing coal." },
  TUR: { name: "Turkey", archetype: "The Rising Bridge", flag: "🇹🇷", description: "Turkey is rapidly expanding its wind and solar capacity while leveraging its unique geographic position as an energy corridor." },
  ISL: { name: "Iceland", archetype: "The Geothermal Ideal", flag: "🇮🇸", description: "Iceland generates nearly 100% of its electricity from geothermal and hydro sources." }
};

const ALL_CODES = ["ABW", "AFG", "AGO", "ALB", "AND", "ARE", "ARG", "ARM", "ASM", "ATG", "AUS", "AUT", "AZE", "BDI", "BEL", "BEN", "BFA", "BGD", "BGR", "BHR", "BHS", "BIH", "BLR", "BLZ", "BMU", "BOL", "BRA", "BRB", "BRN", "BTN", "BWA", "CAF", "CAN", "CHE", "CHL", "CHN", "CIV", "CMR", "COD", "COG", "COK", "COL", "COM", "CPV", "CRI", "CUB", "CUW", "CYM", "CYP", "CZE", "DEU", "DJI", "DMA", "DNK", "DOM", "DZA", "ECU", "EGY", "ERI", "ESP", "EST", "ETH", "FIN", "FJI", "FRA", "GAB", "GBR", "GHA", "GIB", "GIN", "GLP", "GMB", "GNB", "GNQ", "GRC", "GRD", "GRL", "GTM", "GUF", "GUM", "HKG", "HND", "HRV", "HTI", "HUN", "IDN", "IND", "IRL", "IRN", "IRQ", "ISL", "ISR", "ITA", "JAM", "JOR", "JPN", "KAZ", "KEN", "KGZ", "KHM", "KIR", "KNA", "KOR", "KWT", "LAO", "LBN", "LBR", "LBY", "LCA", "LKA", "LSO", "LTU", "LUX", "LVA", "MAC", "MAR", "MDA", "MDG", "MDV", "MEX", "MKD", "MLI", "MLT", "MMR", "MNG", "MOZ", "MRT", "MSR", "MTQ", "MUS", "MWI", "MYS", "NAM", "NCL", "NER", "NGA", "NIC", "NIU", "NLD", "NOR", "NPL", "NRU", "NZL", "OMN", "PAK", "PAN", "PER", "PHL", "PNG", "POL", "PRI", "PRK", "PRT", "PRY", "PYF", "QAT", "ROU", "RUS", "RWA", "SAU", "SDN", "SEN", "SGP", "SLB", "SLE", "SLV", "SOM", "SPM", "SRB", "SSD", "STP", "SUR", "SVK", "SVN", "SWE", "SWZ", "SYC", "SYR", "TCD", "TGO", "THA", "TJK", "TKM", "TON", "TTO", "ARE", "TUN", "TUR", "TZA", "UGA", "UKR", "URY", "USA", "UZB", "VCT", "VEN", "VNM", "VUT", "WSM", "YEM", "ZAF", "ZMB", "ZWE"];

export async function generateStaticParams() {
  return ALL_CODES.map((code) => ({ code }));
}

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const profile = COUNTRIES_DATA[code] || {
    name: code,
    archetype: "Energy Profile",
    flag: "🌐",
    description: `Analysis of the energy transition and environmental impact for ${code}.`
  };

  const energyData = await fetchEnergyMix(code);
  const emissionsData = await fetchEmissions(code);

  if (!energyData || energyData.length === 0) {
      return notFound();
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-start justify-between">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EnergyMixChart data={energyData} />
        <EmissionsChart data={emissionsData} />
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Key Insights</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li>Historical data shows the evolution of the energy grid from 2000 to 2024.</li>
          <li>Correlate the rise in renewables with the trend in CO2 emissions per kWh.</li>
          <li>Compare the base load stability vs. intermittent sources.</li>
        </ul>
      </div>
    </div>
  );
}
