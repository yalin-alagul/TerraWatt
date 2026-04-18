# TerraWatt

TerraWatt is my **AP Environmental Science yearly project**: an interactive web dashboard for exploring how countries generate electricity, how that changes over time, and what those choices mean for CO₂ emissions.

It combines:
- A **Next.js + React frontend** for visual exploration
- A **Flask + Pandas backend** for data filtering, aggregation, and simulation
- Historical electricity and emissions data from **2000–2024**

## What this project does

TerraWatt helps you answer questions like:
- How much of a country’s grid comes from coal, gas, nuclear, wind, or solar?
- How has renewable adoption changed over the last 25 years?
- Which countries are the cleanest right now, and which are improving fastest?
- What happens to emissions if we change the energy mix?

Main features:
- **Global map** with a year slider (2000–2024) colored by renewable share
- **Country deep-dive pages** with energy-mix and emissions trend charts
- **Compare page** with regional aggregation + country side-by-side comparisons
- **Grid simulator** to test “what-if” policy/energy scenarios
- **Leaderboards** for most renewable, lowest carbon intensity, and fastest transition

## How it works (architecture)

### Frontend (`terrawatt/frontend`)
- Built with Next.js 14 + TypeScript + Tailwind + Recharts + react-simple-maps
- Calls backend endpoints via `src/lib/api.ts`
- Renders:
  - interactive choropleth map
  - country charts
  - simulator controls and results
  - comparison dashboards

### Backend (`terrawatt/backend`)
- Flask app (`app.py`) exposes REST APIs under `/api/*`
- Loads CSV data once and keeps it in memory (`utils/data_loader.py`)
- Uses Pandas/Numpy for filtering, grouped aggregates, weighted averages, and trend prediction

## Data and aggregation pipeline

Primary backend datasets:
- `terrawatt/backend/data/energy_mix.csv`
- `terrawatt/backend/data/co2_emissions.csv`

When data is loaded, backend preprocessing includes:
1. **Caching dataframes** in memory for faster API responses
2. **Computed renewable share** per row:
   - `renewable_pct = hydro_pct + wind_pct + solar_pct + other_renewables_pct`
3. Exposing filtered and aggregated views through endpoints:
   - country/year filtering
   - per-year global snapshots
   - top-10 leaderboards
   - regional weighted metrics

### Examples of aggregation logic
- **Leaderboard queries** sort and rank countries by metrics such as renewable share and carbon intensity
- **Fastest transition** compares current renewable share vs. 5 years earlier
- **Regional overview** computes weighted renewable percentages using total generation as the weight:
  - weighted avg renewable % by region
  - summed storage metrics (battery + pumped hydro)

## Backend calculations (how raw data becomes insights)

### 1) Renewable percentage
Used in map coloring and many summary views:
- `renewable_pct = hydro + wind + solar + other_renewables`

### 2) Grid simulation math
Simulator endpoint: `POST /api/simulate`

The simulator starts from a country’s base-year energy mix and applies user adjustments. Then it computes a new carbon intensity using emissions factors (g CO₂/kWh):

- Coal: 820
- Oil: 720
- Gas: 490
- Nuclear: 12
- Hydro: 24
- Wind: 11
- Solar: 45
- Other renewables: 38

Core calculation:
- `new_co2_per_kwh = sum(source_pct × source_factor) / sum(source_pct)`

Then total emissions are estimated assuming total electricity demand stays constant:
- `new_emissions_mt = (total_generation_twh × 1e9 × new_co2_per_kwh) / 1e12`

Finally, TerraWatt returns useful deltas:
- `co2_saved_mt = original_emissions_mt - new_emissions_mt`
- `co2_per_kwh_reduction = original_co2_per_kwh - new_co2_per_kwh`

### 3) Trend prediction
For country pages, the backend uses simple linear regression (`numpy.polyfit`) on historical data to estimate future renewable share and CO₂/kWh for selected future years.

## API endpoints

Energy:
- `GET /api/energy/mix?country_code=USA&start_year=2000&end_year=2024`
- `GET /api/energy/all?year=2024`
- `GET /api/energy/renewable-pct?year=2024`
- `GET /api/energy/leaderboard?year=2024`
- `GET /api/energy/regional?year=2024`
- `GET /api/energy/predict?country_code=USA`

Emissions:
- `GET /api/emissions/country?country_code=USA&start_year=2000&end_year=2024`
- `GET /api/emissions/compare?year=2024`

Simulation:
- `POST /api/simulate`

## How to run

## 1) Backend
```bash
cd /home/runner/work/TerraWatt/TerraWatt/terrawatt/backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Backend runs at: `http://localhost:5001`

## 2) Frontend
```bash
cd /home/runner/work/TerraWatt/TerraWatt/terrawatt/frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

For local dev API routing, create:
- `/home/runner/work/TerraWatt/TerraWatt/terrawatt/frontend/.env.local`

With:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Educational goal

This project is designed to make energy transition data understandable and actionable for students:
- connecting energy mix choices to measurable climate outcomes
- comparing policy pathways across countries
- turning raw datasets into interpretable environmental insights

---
If you are reviewing this as part of my AP Environmental Science work: TerraWatt is both a data-analysis project and a communication tool for climate and energy literacy.
