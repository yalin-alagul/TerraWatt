import CountryClient from './CountryClient';

const ALL_CODES = ["ABW", "AFG", "AGO", "ALB", "AND", "ARE", "ARG", "ARM", "ASM", "ATG", "AUS", "AUT", "AZE", "BDI", "BEL", "BEN", "BFA", "BGD", "BGR", "BHR", "BHS", "BIH", "BLR", "BLZ", "BMU", "BOL", "BRA", "BRB", "BRN", "BTN", "BWA", "CAF", "CAN", "CHE", "CHL", "CHN", "CIV", "CMR", "COD", "COG", "COK", "COL", "COM", "CPV", "CRI", "CUB", "CUW", "CYM", "CYP", "CZE", "DEU", "DJI", "DMA", "DNK", "DOM", "DZA", "ECU", "EGY", "ERI", "ESP", "EST", "ETH", "FIN", "FJI", "FRA", "GAB", "GBR", "GHA", "GIB", "GIN", "GLP", "GMB", "GNB", "GNQ", "GRC", "GRD", "GRL", "GTM", "GUF", "GUM", "HKG", "HND", "HRV", "HTI", "HUN", "IDN", "IND", "IRL", "IRN", "IRQ", "ISL", "ISR", "ITA", "JAM", "JOR", "JPN", "KAZ", "KEN", "KGZ", "KHM", "KIR", "KNA", "KOR", "KWT", "LAO", "LBN", "LBR", "LBY", "LCA", "LKA", "LSO", "LTU", "LUX", "LVA", "MAC", "MAR", "MDA", "MDG", "MDV", "MEX", "MKD", "MLI", "MLT", "MMR", "MNG", "MOZ", "MRT", "MSR", "MTQ", "MUS", "MWI", "MYS", "NAM", "NCL", "NER", "NGA", "NIC", "NIU", "NLD", "NOR", "NPL", "NRU", "NZL", "OMN", "PAK", "PAN", "PER", "PHL", "PNG", "POL", "PRI", "PRK", "PRT", "PRY", "PYF", "QAT", "ROU", "RUS", "RWA", "SAU", "SDN", "SEN", "SGP", "SLB", "SLE", "SLV", "SOM", "SPM", "SRB", "SSD", "STP", "SUR", "SVK", "SVN", "SWE", "SWZ", "SYC", "SYR", "TCD", "TGO", "THA", "TJK", "TKM", "TON", "TTO", "TUN", "TUR", "TZA", "UGA", "UKR", "URY", "USA", "UZB", "VEN", "WSM", "YEM", "ZAF", "ZMB", "ZWE"];

export async function generateStaticParams() {
  return ALL_CODES.map((code) => ({ code }));
}

export default function Page() {
  return <CountryClient />;
}
