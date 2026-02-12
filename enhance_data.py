import pandas as pd
import numpy as np

# Load the data
energy_path = 'terrawatt/backend/data/energy_mix.csv'
df = pd.read_csv(energy_path)

# 1. Define Regions
country_to_region = {
    "FRA": "Europe", "DEU": "Europe", "GBR": "Europe", "ESP": "Europe", "ITA": "Europe", "ISL": "Europe", "NOR": "Europe", "SWE": "Europe",
    "USA": "North America", "CAN": "North America", "MEX": "North America",
    "CHN": "Asia", "IND": "Asia", "JPN": "Asia", "KOR": "Asia", "VNM": "Asia", "TUR": "Asia",
    "BRA": "South America", "ARG": "North America", "CHL": "South America",
    "ZAF": "Africa", "EGY": "Africa", "NGA": "Africa", "KEN": "Africa", "MAR": "Africa", "GMB": "Africa",
    "AUS": "Oceania", "NZL": "Oceania"
}

def get_region(code):
    return country_to_region.get(code, "Other")

df['region'] = df['country_code'].apply(get_region)

# 2. Add Synthetic Storage Data
# We'll base storage on total generation and year (growing over time)
# Battery storage exploded after 2015
# Pumped hydro was more stable but also grew

def gen_storage(row):
    # Base capacity factor based on country size (total_generation)
    base = row['total_generation_twh'] * 0.5 
    
    # Growth factors
    year_factor_battery = max(0, (row['year'] - 2010) ** 2) if row['year'] > 2010 else 0
    year_factor_hydro = (row['year'] - 2000) * 2 + 10
    
    # Random variance
    rng = np.random.default_rng(seed=hash(row['country_code']) % 10**8 + row['year'])
    
    battery = base * (year_factor_battery / 100) * rng.uniform(0.8, 1.2)
    p_hydro = base * (year_factor_hydro / 50) * rng.uniform(0.9, 1.1)
    
    # Special boosts for leaders
    if row['country_code'] == 'CHN': battery *= 3; p_hydro *= 4
    if row['country_code'] == 'USA': battery *= 2; p_hydro *= 2
    if row['country_code'] == 'DEU': battery *= 1.5
    
    return round(battery, 2), round(p_hydro, 2)

storage_data = df.apply(gen_storage, axis=1)
df['battery_storage_mwh'], df['pumped_hydro_mwh'] = zip(*storage_data)

# Save back
df.to_csv(energy_path, index=False)
print("Updated energy_mix.csv with region and storage data.")
