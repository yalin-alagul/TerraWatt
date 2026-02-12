export interface EnergyMix {
  country: string;
  country_code: string;
  year: number;
  coal_pct: number;
  oil_pct: number;
  gas_pct: number;
  nuclear_pct: number;
  hydro_pct: number;
  wind_pct: number;
  solar_pct: number;
  other_renewables_pct: number;
  total_generation_twh: number;
  battery_storage_mwh?: number;
  pumped_hydro_mwh?: number;
  region?: string;
}

export interface Emissions {
  country: string;
  country_code: string;
  year: number;
  co2_emissions_mt: number;
  co2_per_kwh: number;
}

export interface SimulationRequest {
  country_code: string;
  base_year: number;
  adjustments: Record<string, number>;
}

export interface SimulationResult {
  country_code: string;
  base_year: number;
  original: { co2_emissions_mt: number; co2_per_kwh: number; energy_mix: Record<string, number> };
  simulated: { co2_emissions_mt: number; co2_per_kwh: number; energy_mix: Record<string, number> };
  delta: { co2_saved_mt: number; co2_per_kwh_reduction: number };
}

export interface CountryProfile {
  code: string;
  name: string;
  archetype: string;
  description: string;
  flagEmoji: string;
}
