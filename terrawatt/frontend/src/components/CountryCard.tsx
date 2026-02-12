import Link from 'next/link';
import { CountryProfile } from '@/types';

interface CountryCardProps {
  country: CountryProfile;
  keyStat: string;
}

export default function CountryCard({ country, keyStat }: CountryCardProps) {
  return (
    <Link href={`/country/${country.code}`} className="block group">
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 hover:-translate-y-1 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-4xl">{country.flagEmoji}</span>
          <span className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded">{country.code}</span>
        </div>
        <h3 className="text-xl font-bold mb-1 group-hover:text-green-400 transition-colors">{country.name}</h3>
        <p className="text-sm text-green-500/80 font-medium mb-2">{country.archetype}</p>
        {country.description && (
          <p className="text-xs text-slate-400 mb-4 line-clamp-2">{country.description}</p>
        )}
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 mt-auto">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">2024 Snapshot</p>
          <p className="font-semibold text-green-400 text-sm">{keyStat}</p>
        </div>
        <div className="mt-4 flex items-center text-sm text-slate-500 group-hover:text-green-400 transition-colors">
          <span>View profile</span>
          <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
