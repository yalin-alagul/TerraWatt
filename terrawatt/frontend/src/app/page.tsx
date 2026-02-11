import CountryCard from '@/components/CountryCard';
import { CountryProfile } from '@/types';

const countries: CountryProfile[] = [
  { code: "FRA", name: "France", archetype: "The Nuclear Baseline", description: "", flagEmoji: "🇫🇷" },
  { code: "DEU", name: "Germany", archetype: "The Energiewende Experiment", description: "", flagEmoji: "🇩🇪" },
  { code: "CHN", name: "China", archetype: "The Industrial Giant", description: "", flagEmoji: "🇨🇳" },
  { code: "USA", name: "United States", archetype: "The Mixed Economy", description: "", flagEmoji: "🇺🇸" },
  { code: "TUR", name: "Turkey", archetype: "The Rising Bridge", description: "", flagEmoji: "🇹🇷" },
  { code: "ISL", name: "Iceland", archetype: "The Geothermal Ideal", description: "", flagEmoji: "🇮🇸" },
];

const stats: Record<string, string> = {
  FRA: "~70% Nuclear Power",
  DEU: "Rapid Renewables Growth",
  CHN: "Top Solar Investor",
  USA: "Diverse Energy Mix",
  TUR: "Expanding Wind & Solar",
  ISL: "100% Renewable Grid"
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent pb-2">
          TerraWatt
        </h1>
        <p className="text-xl text-slate-400">
          Analyze the efficiency and environmental impact of the global energy transition.
          Explore scenarios, visualize trends, and compare the key nations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-full">
        {countries.map((country) => (
          <CountryCard key={country.code} country={country} keyStat={stats[country.code]} />
        ))}
      </div>
    </div>
  );
}
