# TerraWatt — Build Instructions for Claude Code

## Project Overview

TerraWatt is an interactive dashboard that analyzes the efficiency and environmental impact of the global energy transition. Users can simulate energy scenarios, visualize historical trends, and compare national energy profiles across five distinct countries.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | **Next.js 14** (App Router) + React 18 | Interactive UI, routing, SSR |
| Visualization | **Recharts** | Line charts, bar charts, area charts |
| Maps | **React-Simple-Maps** | Geospatial choropleth map with time slider |
| Styling | **Tailwind CSS** | Utility-first styling |
| Backend | **Python Flask** | REST API, data processing, scenario calculations |
| Data Processing | **Pandas** | CSV ingestion, filtering, aggregation |
| Data Source | Static **CSV** files | Our World in Data + Ember Energy datasets |

---

## Project Structure

```
terrawatt/
├── backend/
│   ├── app.py                    # Flask entry point
│   ├── requirements.txt          # Python dependencies
│   ├── data/
│   │   ├── energy_mix.csv        # Energy mix data by country/year
│   │   └── co2_emissions.csv     # CO2 emissions data by country/year
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── energy.py             # /api/energy endpoints
│   │   ├── emissions.py          # /api/emissions endpoints
│   │   └── simulator.py          # /api/simulate endpoint (Grid Sim)
│   └── utils/
│       ├── __init__.py
│       └── data_loader.py        # CSV loading + Pandas processing
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── public/
│   │   └── world-110m.json       # TopoJSON world map (for react-simple-maps)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout with global styles + nav
│   │   │   ├── page.tsx          # Landing / home page
│   │   │   ├── globals.css       # Tailwind imports + custom CSS
│   │   │   ├── map/
│   │   │   │   └── page.tsx      # Time-Slider Map page
│   │   │   ├── country/
│   │   │   │   └── [code]/
│   │   │   │       └── page.tsx  # Country Deep-Dive profile page
│   │   │   └── simulator/
│   │   │       └── page.tsx      # Grid Sim (Scenario Planner) page
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── TimeSliderMap.tsx       # Choropleth map + year slider
│   │   │   ├── CountryHoverCard.tsx    # Quick-stat popup on hover
│   │   │   ├── EnergyMixChart.tsx      # Stacked area/bar chart
│   │   │   ├── EmissionsChart.tsx      # Line chart for CO2
│   │   │   ├── GridSimulator.tsx       # Sliders + real-time output graph
│   │   │   └── CountryCard.tsx         # Summary card for Power 5
│   │   ├── lib/
│   │   │   └── api.ts            # Fetch helpers for backend API
│   │   └── types/
│   │       └── index.ts          # TypeScript interfaces
│   └── tsconfig.json
└── README.md
```

---

## The "Power 5" Countries

These five nations represent distinct energy archetypes and are the core of the analysis:

| Country | Code | Archetype | Why Included |
|---------|------|-----------|-------------|
| **France** | FRA | The Nuclear Baseline | Low carbon, high nuclear reliance (~70% nuclear) |
| **Germany** | DEU | The Energiewende Experiment | High renewables but phasing out nuclear; intermittency issues |
| **China** | CHN | The Industrial Giant | Largest solar/wind investor AND largest coal consumer |
| **United States** | USA | The Mixed Economy | Regionally diverse; heavy fossil legacy with rapid renewable growth |
| **Iceland** | ISL | The Geothermal Ideal | Nearly 100% renewable; "control group" for ideal geography |

---

## Backend Implementation

### 1. Flask App Setup (`backend/app.py`)

```python
from flask import Flask
from flask_cors import CORS
from routes.energy import energy_bp
from routes.emissions import emissions_bp
from routes.simulator import simulator_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.register_blueprint(energy_bp, url_prefix="/api")
app.register_blueprint(emissions_bp, url_prefix="/api")
app.register_blueprint(simulator_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
```

### 2. Data Layer

**CSV files** should be stored in `backend/data/`. Use representative sample data if you cannot download the real datasets. The data must cover years **2000–2024** for the Power 5 countries.

**Required columns for `energy_mix.csv`:**
- `country`, `country_code` (ISO 3-letter), `year`
- `coal_pct`, `oil_pct`, `gas_pct`, `nuclear_pct`, `hydro_pct`, `wind_pct`, `solar_pct`, `other_renewables_pct`
- `total_generation_twh`

**Required columns for `co2_emissions.csv`:**
- `country`, `country_code`, `year`
- `co2_emissions_mt` (megatonnes)
- `co2_per_kwh` (grams CO2 per kWh)

**Data Loader (`backend/utils/data_loader.py`):**
- Load CSVs into Pandas DataFrames on startup (cache in memory).
- Provide helper functions: `get_country_data(country_code, start_year, end_year)`, `get_all_countries_for_year(year)`, `get_renewable_pct(country_code, year)`.

### 3. API Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|-------------|
| GET | `/api/energy/mix` | Energy mix for a country over time | `country_code`, `start_year`, `end_year` |
| GET | `/api/energy/all` | All Power 5 energy data for a single year | `year` |
| GET | `/api/energy/renewable-pct` | Renewable % for all countries for a given year (for map coloring) | `year` |
| GET | `/api/emissions/country` | CO2 emissions for a country over time | `country_code`, `start_year`, `end_year` |
| GET | `/api/emissions/compare` | Compare CO2/kWh across Power 5 | `year` |
| POST | `/api/simulate` | Grid Sim calculation | JSON body (see below) |

**Grid Sim POST body:**
```json
{
  "country_code": "USA",
  "base_year": 2024,
  "adjustments": {
    "coal_pct": -20,
    "nuclear_pct": +15,
    "solar_pct": +5
  }
}
```

**Grid Sim Response:**
```json
{
  "country_code": "USA",
  "base_year": 2024,
  "original": {
    "co2_emissions_mt": 1500,
    "co2_per_kwh": 380,
    "energy_mix": { "coal_pct": 20, "nuclear_pct": 18, "solar_pct": 5, ... }
  },
  "simulated": {
    "co2_emissions_mt": 1120,
    "co2_per_kwh": 285,
    "energy_mix": { "coal_pct": 0, "nuclear_pct": 33, "solar_pct": 10, ... }
  },
  "delta": {
    "co2_saved_mt": 380,
    "co2_per_kwh_reduction": 95
  }
}
```

**Simulation math:** Each energy source has an emissions factor (g CO2/kWh). When the user shifts percentages, recalculate the weighted average CO2/kWh and scale to total generation for absolute emissions.

Approximate emissions factors:
- Coal: 820 g/kWh
- Gas: 490 g/kWh
- Oil: 720 g/kWh
- Nuclear: 12 g/kWh
- Wind: 11 g/kWh
- Solar: 45 g/kWh
- Hydro: 24 g/kWh
- Other renewables: 38 g/kWh

### 4. Requirements (`backend/requirements.txt`)

```
flask==3.1.0
flask-cors==5.0.1
pandas==2.2.3
```

---

## Frontend Implementation

### 1. Dependencies (`frontend/package.json` key deps)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "recharts": "^2.13.0",
    "react-simple-maps": "^3.0.0",
    "d3-scale-chromatic": "^3.1.0",
    "topojson-client": "^3.1.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/react": "^18.3.0",
    "@types/d3-scale-chromatic": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 2. TypeScript Types (`frontend/src/types/index.ts`)

```typescript
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
```

### 3. Pages & Features

#### A. Landing Page (`/`)
- Hero section with project title "TerraWatt" and tagline.
- Grid of 5 **CountryCard** components for the Power 5, each showing: flag emoji, country name, archetype subtitle, a key stat (e.g., "70% Nuclear" for France).
- Navigation links to Map, individual country profiles, and Simulator.

#### B. Time-Slider Map (`/map`)
- **Full-width choropleth world map** using `react-simple-maps` with `world-110m.json` TopoJSON.
- **Year slider** (range input) from 2000 to 2024 at the bottom.
- As the user drags the slider, the map re-renders: each country's fill color is determined by its **% renewable energy** for that year, using a sequential color scale (e.g., `d3-scale-chromatic` → `interpolateGreens` or `interpolateYlGn`). Countries not in the dataset get a neutral gray.
- **Hover interaction on Power 5 countries:** When hovering over France, Germany, China, USA, or Iceland, show a **CountryHoverCard** tooltip with:
  - Country name + flag emoji
  - Key stat (e.g., "France: 70% Nuclear, 58g CO₂/kWh")
  - "Click for details" prompt
- **Click interaction:** Clicking a Power 5 country navigates to `/country/[code]`.
- Fetch data from `GET /api/energy/renewable-pct?year={year}` on slider change (debounced).

#### C. Country Deep-Dive (`/country/[code]`)
- **Header:** Country name, flag, archetype badge (e.g., "The Nuclear Baseline").
- **Energy Mix Chart:** Stacked area chart (Recharts `AreaChart`) showing all energy source percentages from 2000–2024. Each source is a different color.
- **Emissions Trend Chart:** Line chart (Recharts `LineChart`) showing CO₂/kWh and total CO₂ emissions over time. Dual Y-axis.
- **Key Insights Panel:** 2–3 bullet points auto-generated or hardcoded per country explaining their energy story (e.g., for Germany: "Solar and wind grew from 5% to 40%, but coal remained high due to nuclear phase-out").
- Fetch data from `GET /api/energy/mix` and `GET /api/emissions/country`.

#### D. Grid Sim / Scenario Planner (`/simulator`)
- **Country selector** dropdown (Power 5 only).
- **Source sliders:** One range slider per energy source (Coal, Oil, Gas, Nuclear, Hydro, Wind, Solar, Other Renewables). Each slider goes from 0–100%.
- **Constraint:** Sliders must sum to 100%. When one slider moves, proportionally adjust the others OR display a warning if the total != 100%. Simplest approach: show a live "Total: X%" indicator and disable the "Simulate" button if total ≠ 100%.
- **Simulate button:** Sends POST to `/api/simulate` with the adjusted percentages.
- **Results panel** (appears after simulation):
  - Side-by-side **bar chart** comparing original vs. simulated energy mix.
  - **CO₂ savings** displayed prominently: "You saved **380 MT** of CO₂!" with a big number and a delta arrow.
  - CO₂/kWh comparison: original vs. simulated.

### 4. Component Specifications

**`TimeSliderMap.tsx`:**
- Use `ComposableMap`, `Geographies`, `Geography` from react-simple-maps.
- Color scale: `scaleSequential(interpolateYlGn).domain([0, 100])` where the input is renewable %.
- Tooltip: Use a simple absolutely-positioned div that follows the mouse on hover.
- Debounce the API call on slider change (300ms).

**`GridSimulator.tsx`:**
- State: `adjustments` object with all 8 source percentages.
- Default values: pre-populated from the selected country's actual latest-year data.
- Use Recharts `BarChart` with two data groups (Original, Simulated) for the comparison view.

**`EnergyMixChart.tsx`:**
- Recharts `AreaChart` with `stackId="1"` on each `Area` component.
- Color palette: Coal=#4a4a4a, Oil=#8B4513, Gas=#DAA520, Nuclear=#9B59B6, Hydro=#3498DB, Wind=#1ABC9C, Solar=#F39C12, Other=#2ECC71.

### 5. API Helper (`frontend/src/lib/api.ts`)

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchEnergyMix(countryCode: string, startYear = 2000, endYear = 2024) {
  const res = await fetch(`${API_BASE}/energy/mix?country_code=${countryCode}&start_year=${startYear}&end_year=${endYear}`);
  return res.json();
}

export async function fetchRenewablePct(year: number) {
  const res = await fetch(`${API_BASE}/energy/renewable-pct?year=${year}`);
  return res.json();
}

export async function fetchEmissions(countryCode: string, startYear = 2000, endYear = 2024) {
  const res = await fetch(`${API_BASE}/emissions/country?country_code=${countryCode}&start_year=${startYear}&end_year=${endYear}`);
  return res.json();
}

export async function simulate(request: SimulationRequest) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return res.json();
}
```

---

## Design & UX Guidelines

- **Color scheme:** Dark background (#0f172a slate-900), with vibrant data visualization colors. Accent: electric green (#22c55e) for renewable energy, warm red (#ef4444) for fossil fuels.
- **Typography:** System font stack or Inter. Large, bold numbers for key statistics.
- **Layout:** Full-width map on the map page. Dashboard-style grid layouts for country profiles and simulator.
- **Responsiveness:** Must be usable on desktop (primary) and tablet. Mobile is nice-to-have.
- **Animations:** Smooth color transitions on the map when the slider moves. Subtle fade-in for chart data.
- **Loading states:** Show skeleton loaders or spinners while fetching API data.

---

## Data Generation

If you cannot download the real CSV datasets, **generate realistic synthetic data** that follows these guidelines:

- **France:** Nuclear ~65-75%, low coal (<5%), growing wind/solar (5% → 15%), CO₂/kWh ~50-70g.
- **Germany:** Coal declining (40% → 25%), nuclear declining (25% → 0% by 2023), wind/solar growing (5% → 40%), CO₂/kWh ~350-450g.
- **China:** Coal dominant but declining (75% → 55%), solar/wind growing rapidly (1% → 20%), CO₂/kWh ~550-650g.
- **USA:** Gas growing (20% → 40%), coal declining (50% → 15%), solar/wind growing (2% → 20%), nuclear stable ~18-20%, CO₂/kWh ~450-380g.
- **Iceland:** Hydro ~70%, geothermal ~25-30%, fossil <5%, CO₂/kWh ~15-30g.

Generate 25 rows per country (2000–2024). Ensure all percentages sum to ~100% per row.

---

## Build & Run Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py              # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # Runs on http://localhost:3000
```

### Environment Variables
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Acceptance Criteria

1. **Map page works:** Dragging the year slider updates country colors in real time based on renewable %.
2. **Hover cards appear** on Power 5 countries with correct stats.
3. **Country deep-dive** shows stacked area chart of energy mix and line chart of emissions.
4. **Grid Simulator** lets the user adjust sliders, enforces 100% total, and shows CO₂ savings after simulation.
5. **All API endpoints** return correct, filtered JSON data.
6. **No crashes** — handle missing data gracefully with fallbacks.
7. **Clean, professional UI** with the dark theme and vibrant chart colors.

---

## Implementation Order (Suggested)

1. **Backend first:** Set up Flask, generate/load CSV data, implement all API endpoints. Test with curl/Postman.
2. **Frontend skeleton:** Next.js app with Tailwind, create all pages and routing, build Navbar.
3. **Map page:** Implement TimeSliderMap with react-simple-maps, connect to API.
4. **Country profiles:** Build EnergyMixChart and EmissionsChart, wire to API.
5. **Grid Simulator:** Build slider UI, connect to simulation endpoint, render results.





















6. **Polish:** Loading states, error handling, responsive tweaks, animations.
