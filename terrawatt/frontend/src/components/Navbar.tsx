import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-500 hover:text-green-400">
          TerraWatt
        </Link>
        <div className="flex space-x-6 text-slate-300">
          <Link href="/map" className="hover:text-white transition-colors">Map</Link>
          <Link href="/simulator" className="hover:text-white transition-colors">Simulator</Link>
          <div className="group relative">
            <button className="hover:text-white transition-colors">Countries</button>
            <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
              <Link href="/country/FRA" className="block px-4 py-2 hover:bg-slate-700">France 🇫🇷</Link>
              <Link href="/country/DEU" className="block px-4 py-2 hover:bg-slate-700">Germany 🇩🇪</Link>
              <Link href="/country/CHN" className="block px-4 py-2 hover:bg-slate-700">China 🇨🇳</Link>
              <Link href="/country/USA" className="block px-4 py-2 hover:bg-slate-700">USA 🇺🇸</Link>
              <Link href="/country/TUR" className="block px-4 py-2 hover:bg-slate-700">Turkey 🇹🇷</Link>
              <Link href="/country/ISL" className="block px-4 py-2 hover:bg-slate-700">Iceland 🇮🇸</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
