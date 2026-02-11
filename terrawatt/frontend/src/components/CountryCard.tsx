import Link from 'next/link';
import { CountryProfile } from '@/types';

interface CountryCardProps {
  country: CountryProfile;
  keyStat: string;
}

export default function CountryCard({ country, keyStat }: CountryCardProps) {
  return (
    <Link href={`/country/${country.code}`} className="block group">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-900/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl">{country.flagEmoji}</span>
          <span className="text-sm font-mono text-slate-400">{country.code}</span>
        </div>
        <h3 className="text-xl font-bold mb-1 group-hover:text-green-400 transition-colors">{country.name}</h3>
        <p className="text-sm text-slate-400 mb-4 h-10">{country.archetype}</p>
        <div className="bg-slate-900/50 rounded p-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Key Stat</p>
          <p className="font-semibold text-green-400">{keyStat}</p>
        </div>
      </div>
    </Link>
  );
}
