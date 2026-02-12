import Link from 'next/link';
import CountryCard from '@/components/CountryCard';
import { CountryProfile } from '@/types';

const countries: CountryProfile[] = [
  { code: "FRA", name: "France", archetype: "The Nuclear Baseline", description: "Low-carbon baseline powered by ~70% nuclear energy", flagEmoji: "\u{1F1EB}\u{1F1F7}" },
  { code: "DEU", name: "Germany", archetype: "The Energiewende Experiment", description: "Phasing out nuclear while scaling wind and solar to 50%", flagEmoji: "\u{1F1E9}\u{1F1EA}" },
  { code: "CHN", name: "China", archetype: "The Industrial Giant", description: "World's largest coal consumer and biggest clean energy investor", flagEmoji: "\u{1F1E8}\u{1F1F3}" },
  { code: "USA", name: "United States", archetype: "The Mixed Economy", description: "Diverse grid with gas dominance and rapid renewable growth", flagEmoji: "\u{1F1FA}\u{1F1F8}" },
  { code: "TUR", name: "Turkey", archetype: "The Rising Bridge", description: "Emerging economy bridging fossil fuels and renewables", flagEmoji: "\u{1F1F9}\u{1F1F7}" },
  { code: "ISL", name: "Iceland", archetype: "The Geothermal Ideal", description: "Nearly 100% renewable electricity from hydro and geothermal", flagEmoji: "\u{1F1EE}\u{1F1F8}" },
];

const stats: Record<string, string> = {
  FRA: "~70% Nuclear  ·  ~55 g CO\u2082/kWh",
  DEU: "~45% Renewables  ·  ~380 g CO\u2082/kWh",
  CHN: "~55% Coal  ·  ~560 g CO\u2082/kWh",
  USA: "~40% Gas  ·  ~390 g CO\u2082/kWh",
  TUR: "~45% Renewables  ·  ~370 g CO\u2082/kWh",
  ISL: "~100% Renewable  ·  ~15 g CO\u2082/kWh",
};

const definitions = [
  {
    term: "Energy Mix",
    definition: "The composition of a country's electricity generation broken down by source: coal, gas, oil, nuclear, hydro, wind, solar, and other renewables. Expressed as percentages of total generation.",
    color: "border-green-500",
  },
  {
    term: "Carbon Intensity",
    definition: "The amount of CO\u2082 emitted per unit of electricity generated, measured in grams of CO\u2082 per kilowatt-hour (g/kWh). Lower values indicate cleaner grids.",
    color: "border-red-500",
  },
  {
    term: "Renewable Energy",
    definition: "Energy generated from naturally replenishing sources: hydro, wind, solar, geothermal, and biomass. These sources produce little to no direct CO\u2082 emissions during generation.",
    color: "border-emerald-500",
  },
  {
    term: "Grid Simulation",
    definition: "A what-if scenario tool that lets you adjust a country's energy mix and calculates the resulting change in CO\u2082 emissions based on each source's emissions factor.",
    color: "border-blue-500",
  },
  {
    term: "Total Generation (TWh)",
    definition: "The total amount of electricity a country produces in a year, measured in terawatt-hours. One TWh can power roughly 150,000 European homes for a year.",
    color: "border-amber-500",
  },
  {
    term: "Emissions Factor",
    definition: "The lifecycle CO\u2082 emissions per kWh for each energy source. Coal emits ~820 g/kWh while wind emits only ~11 g/kWh \u2014 a 75x difference.",
    color: "border-purple-500",
  },
];

export default function Home() {
  return (
    <div className="space-y-0">
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] text-center py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-green-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent pb-2 animate-fade-in-up">
            TerraWatt
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 opacity-0 animate-fade-in-up animation-delay-200">
            Analyze the efficiency and environmental impact of the global energy transition.
          </p>
          <p className="text-base text-slate-400 max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-300">
            Explore 25 years of energy data across 200+ countries. Compare grid compositions,
            visualize CO&#x2082; trends, and simulate your own energy scenarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 opacity-0 animate-fade-in-up animation-delay-400">
            <Link href="/map" className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-green-900/30 hover:shadow-green-900/50">
              Explore the Map
            </Link>
            <Link href="/simulator" className="px-8 py-3 border border-slate-600 hover:border-green-500 text-slate-200 font-bold rounded-lg transition-all hover:text-green-400">
              Try the Simulator
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT IS TERRAWATT? */}
      <section className="py-16 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">What is TerraWatt?</h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            TerraWatt is an interactive energy dashboard that tracks how nations generate electricity
            and the carbon footprint of their grids. Using data from 2000 to 2024, it lets you
            explore how the global energy mix has evolved &mdash; from coal-dominated grids to the rise
            of wind, solar, and nuclear power.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
              title="200+ Countries"
              description="Visualize renewable energy adoption across the entire world with our interactive choropleth map."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              }
              title="25 Years of Data"
              description="Track the energy transition from 2000 to 2024 with detailed breakdowns by source."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              }
              title="Grid Simulator"
              description="Adjust a country's energy mix and instantly see the impact on CO&#x2082; emissions."
            />
          </div>
        </div>
      </section>

      {/* KEY CONCEPTS */}
      <section className="py-16 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Key Concepts</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Understanding the metrics behind the global energy transition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {definitions.map((def) => (
              <div key={def.term} className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 border-l-4 ${def.color}`}>
                <h3 className="text-lg font-bold text-white mb-2">{def.term}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{def.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className="py-16 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="200+" label="Countries Tracked" />
            <StatCard number="25" label="Years of Data (2000\u20132024)" />
            <StatCard number="6" label="Deep-Dive Profiles" />
            <StatCard number="8" label="Energy Sources Analyzed" />
          </div>
        </div>
      </section>

      {/* THE POWER 6 */}
      <section className="py-16 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold text-white">The Power 6</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Six nations that represent fundamentally different approaches to the energy transition.
              Each one is an archetype &mdash; from nuclear-heavy France to fully renewable Iceland &mdash;
              offering unique lessons about how the world can decarbonize its grid.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <CountryCard key={country.code} country={country} keyStat={stats[country.code]} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE TERRAWATT */}
      <section className="py-16 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Explore TerraWatt</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExploreCard
              href="/map"
              title="Interactive Map"
              description="Visualize how renewable energy adoption has spread across the globe from 2000 to 2024."
              icon={
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              }
            />
            <ExploreCard
              href="/simulator"
              title="Grid Simulator"
              description="Design your own energy mix and see how it affects a country's carbon footprint."
              icon={
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              }
            />
            <ExploreCard
              href="/country/FRA"
              title="Country Profiles"
              description="Deep-dive into the energy story of each nation with charts, data, and key insights."
              icon={
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* Inline helper components (only used on this page) */

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center space-y-3">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="space-y-2">
      <p className="text-4xl md:text-5xl font-extrabold text-green-400">{number}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

function ExploreCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="group block bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <span className="inline-flex items-center text-green-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
        Explore &rarr;
      </span>
    </Link>
  );
}
