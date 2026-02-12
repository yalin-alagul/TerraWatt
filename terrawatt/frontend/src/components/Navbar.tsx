"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const COUNTRIES = [
  { code: "FRA", name: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "DEU", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "CHN", name: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "USA", name: "USA", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "TUR", name: "Turkey", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "ISL", name: "Iceland", flag: "\u{1F1EE}\u{1F1F8}" },
];

// Simple mapping for search (can be expanded)
const SEARCH_DATA = [
    { code: "AFG", name: "Afghanistan" }, { code: "ALB", name: "Albania" }, { code: "DZA", name: "Algeria" },
    { code: "ARG", name: "Argentina" }, { code: "AUS", name: "Australia" }, { code: "AUT", name: "Austria" },
    { code: "BGD", name: "Bangladesh" }, { code: "BEL", name: "Belgium" }, { code: "BRA", name: "Brazil" },
    { code: "CAN", name: "Canada" }, { code: "CHL", name: "Chile" }, { code: "CHN", name: "China" },
    { code: "COL", name: "Colombia" }, { code: "DNK", name: "Denmark" }, { code: "EGY", name: "Egypt" },
    { code: "FIN", name: "Finland" }, { code: "FRA", name: "France" }, { code: "GEO", name: "Georgia" },
    { code: "DEU", name: "Germany" }, { code: "GRC", name: "Greece" }, { code: "IND", name: "India" },
    { code: "IDN", name: "Indonesia" }, { code: "IRN", name: "Iran" }, { code: "IRL", name: "Ireland" },
    { code: "ISR", name: "Israel" }, { code: "ITA", name: "Italy" }, { code: "JPN", name: "Japan" },
    { code: "KAZ", name: "Kazakhstan" }, { code: "MEX", name: "Mexico" }, { code: "NLD", name: "Netherlands" },
    { code: "NZL", name: "New Zealand" }, { code: "NOR", name: "Norway" }, { code: "PAK", name: "Pakistan" },
    { code: "PHL", name: "Philippines" }, { code: "POL", name: "Poland" }, { code: "PRT", name: "Portugal" },
    { code: "RUS", name: "Russia" }, { code: "SAU", name: "Saudi Arabia" }, { code: "ZAF", name: "South Africa" },
    { code: "KOR", name: "South Korea" }, { code: "ESP", name: "Spain" }, { code: "SWE", name: "Sweden" },
    { code: "CHE", name: "Switzerland" }, { code: "THA", name: "Thailand" }, { code: "TUR", name: "Turkey" },
    { code: "UKR", name: "Ukraine" }, { code: "ARE", name: "United Arab Emirates" }, { code: "GBR", name: "United Kingdom" },
    { code: "USA", name: "United States" }, { code: "VNM", name: "Vietnam" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const linkClass = (path: string) =>
    `transition-colors ${isActive(path) ? 'text-green-400 font-semibold' : 'text-slate-300 hover:text-white'}`;

  const filteredResults = searchQuery.length > 1 
    ? SEARCH_DATA.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-green-500 hover:text-green-400 transition-colors">
            TerraWatt
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:block relative w-64" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              />
              <svg className="absolute left-3 top-2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {isSearchFocused && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {filteredResults.map(res => (
                  <button
                    key={res.code}
                    onClick={() => {
                      router.push(`/country/${res.code}`);
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    {res.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/map" className={linkClass('/map')}>Map</Link>
          <Link href="/compare" className={linkClass('/compare')}>Compare</Link>
          <Link href="/simulator" className={linkClass('/simulator')}>Simulator</Link>
          <Link href="/about" className={linkClass('/about')}>About</Link>
          <div className="group relative">
            <button className={`transition-colors flex items-center gap-1 ${pathname.startsWith('/country') ? 'text-green-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
              Countries
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 hidden group-hover:block z-50">
              {COUNTRIES.map(c => (
                <Link key={c.code} href={`/country/${c.code}`}
                      className={`block px-4 py-2 text-sm hover:bg-slate-700 transition-colors ${
                        pathname === `/country/${c.code}` ? 'text-green-400 bg-slate-700/50' : 'text-slate-300'
                      }`}>
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pb-4">
          <Link href="/map"
                className={`block py-3 border-b border-slate-800 ${linkClass('/map')}`}
                onClick={() => setMobileMenuOpen(false)}>
            Map
          </Link>
          <Link href="/compare"
                className={`block py-3 border-b border-slate-800 ${linkClass('/compare')}`}
                onClick={() => setMobileMenuOpen(false)}>
            Compare
          </Link>
          <Link href="/simulator"
                className={`block py-3 border-b border-slate-800 ${linkClass('/simulator')}`}
                onClick={() => setMobileMenuOpen(false)}>
            Simulator
          </Link>
          <button
            className="w-full text-left py-3 border-b border-slate-800 text-slate-300 flex items-center justify-between"
            onClick={() => setCountriesOpen(!countriesOpen)}
          >
            <span>Countries</span>
            <svg className={`w-4 h-4 transition-transform ${countriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {countriesOpen && (
            <div className="pl-4 space-y-1 py-2">
              {COUNTRIES.map(c => (
                <Link key={c.code} href={`/country/${c.code}`}
                      className="block py-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}>
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
