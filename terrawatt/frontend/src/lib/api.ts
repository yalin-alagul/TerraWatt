import { SimulationRequest, SimulationResult, EnergyMix, Emissions } from "@/types";

const IS_SERVER = typeof window === "undefined";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || (IS_SERVER ? "http://localhost:5001/api" : "/api");

export async function fetchEnergyMix(countryCode: string, startYear = 2000, endYear = 2024): Promise<EnergyMix[]> {
  try {
    const res = await fetch(`${API_BASE}/energy/mix?country_code=${countryCode}&start_year=${startYear}&end_year=${endYear}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchRenewablePct(year: number): Promise<{ id: string; value: number }[]> {
  const res = await fetch(`${API_BASE}/energy/renewable-pct?year=${year}`);
  if (!res.ok) throw new Error("Failed to fetch renewable pct");
  return res.json();
}

export async function fetchLeaderboards(year: number): Promise<any> {
  const res = await fetch(`${API_BASE}/energy/leaderboard?year=${year}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchRegional(year: number): Promise<any[]> {
  const res = await fetch(`${API_BASE}/energy/regional?year=${year}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPredictions(countryCode: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/energy/predict?country_code=${countryCode}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchEmissions(countryCode: string, startYear = 2000, endYear = 2024): Promise<Emissions[]> {
  try {
    const res = await fetch(`${API_BASE}/emissions/country?country_code=${countryCode}&start_year=${startYear}&end_year=${endYear}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchEmissionsCompare(year: number): Promise<Emissions[]> {
  try {
    const res = await fetch(`${API_BASE}/emissions/compare?year=${year}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchAllEnergy(year: number): Promise<EnergyMix[]> {
  try {
    const res = await fetch(`${API_BASE}/energy/all?year=${year}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
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