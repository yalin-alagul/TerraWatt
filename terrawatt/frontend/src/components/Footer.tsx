import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-green-500">TerraWatt</h3>
            <p className="text-sm text-slate-400">
              Analyzing the global energy transition through data, visualization, and simulation.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Explore</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/map" className="text-sm text-slate-400 hover:text-green-400 transition-colors">Interactive Map</Link>
              <Link href="/compare" className="text-sm text-slate-400 hover:text-green-400 transition-colors">Country Comparison</Link>
              <Link href="/simulator" className="text-sm text-slate-400 hover:text-green-400 transition-colors">Grid Simulator</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Countries</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/country/FRA" className="text-sm text-slate-400 hover:text-green-400 transition-colors">France</Link>
              <Link href="/country/DEU" className="text-sm text-slate-400 hover:text-green-400 transition-colors">Germany</Link>
              <Link href="/country/CHN" className="text-sm text-slate-400 hover:text-green-400 transition-colors">China</Link>
              <Link href="/country/USA" className="text-sm text-slate-400 hover:text-green-400 transition-colors">USA</Link>
              <Link href="/country/TUR" className="text-sm text-slate-400 hover:text-green-400 transition-colors">Turkey</Link>
              <Link href="/country/ISL" className="text-sm text-slate-400 hover:text-green-400 transition-colors">Iceland</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">About</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-slate-400 hover:text-green-400 transition-colors">Project Info</Link>
              <p className="text-xs text-slate-500 leading-relaxed">
                Built with Next.js, Flask, and Recharts. Data sourced from Our World in Data and Ember Energy.
              </p>
              <div className="pt-2">
                <a 
                  href="https://www.buymeacoffee.com/yalin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 text-sm"
                >
                  <span className="text-lg">☕</span>
                  Buy me a coffee
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>TerraWatt &mdash; Global Energy Transition Dashboard</p>
        </div>
      </div>
    </footer>
  );
}
