import { SimulationRequest, SimulationResult, EnergyMix, Emissions } from "@/types";

const IS_SERVER = typeof window === "undefined";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || (IS_SERVER ? "http://localhost:5001/api" : "/api");

export async function fetchEnergyMix(countryCode: string, startYear = 2000, endYear = 2024): Promise<EnergyMix[]> {
  const res = await fetch(`${API_BASE}/energy/mix?country_code=${countryCode}&start_year=${startYear}&end_year=${endYear}`);
  if (!res.ok) throw new Error("Failed to fetch energy mix");
  return res.json();
}

export async function fetchRenewablePct(year: number): Promise<{ id: string; value: number }[]> {
  const res = await fetch(`${API_BASE}/energy/renewable-pct?year=${year}`);
  if (!res.ok) throw new Error("Failed to fetch renewable pct");
  return res.json();
}

export async function fetchEmissions(countryCode: string, startYear = 2000, endYear = 2024): Promise<Emissions[]> {
  const res = await fetch(`${API_BASE}/emissions/country?country_code=${countryCode}&start_year=${startYear}&end_year=${endYear}`);
  if (!res.ok) throw new Error("Failed to fetch emissions");
  return res.json();
}

export async function simulate(request: SimulationRequest): Promise<SimulationResult> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Failed to simulate");
  return res.json();
}