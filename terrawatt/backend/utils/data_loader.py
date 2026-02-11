import pandas as pd
import os

# Global cache for dataframes
_df_energy = None
_df_emissions = None

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

def load_data():
    global _df_energy, _df_emissions
    if _df_energy is None:
        _df_energy = pd.read_csv(os.path.join(DATA_DIR, 'energy_mix.csv'))
    if _df_emissions is None:
        _df_emissions = pd.read_csv(os.path.join(DATA_DIR, 'co2_emissions.csv'))

def get_country_data(country_code, start_year=2000, end_year=2024):
    load_data()
    mask = (
        (_df_energy['country_code'] == country_code) & 
        (_df_energy['year'] >= int(start_year)) & 
        (_df_energy['year'] <= int(end_year))
    )
    return _df_energy[mask].to_dict(orient='records')

def get_emissions_data(country_code, start_year=2000, end_year=2024):
    load_data()
    mask = (
        (_df_emissions['country_code'] == country_code) & 
        (_df_emissions['year'] >= int(start_year)) & 
        (_df_emissions['year'] <= int(end_year))
    )
    return _df_emissions[mask].to_dict(orient='records')

def get_all_countries_for_year(year):
    load_data()
    mask = _df_energy['year'] == int(year)
    return _df_energy[mask].to_dict(orient='records')

def get_renewable_pct(year):
    """
    Returns a list of {id: country_code, value: renewable_pct} for the map.
    Renewable = Hydro + Wind + Solar + Other
    """
    load_data()
    mask = _df_energy['year'] == int(year)
    df_year = _df_energy[mask].copy()
    
    # Calculate total renewable percentage
    df_year['renewable_pct'] = (
        df_year['hydro_pct'] + 
        df_year['wind_pct'] + 
        df_year['solar_pct'] + 
        df_year['other_renewables_pct']
    )
    
    result = []
    for _, row in df_year.iterrows():
        result.append({
            "id": row['country_code'],
            "value": round(row['renewable_pct'], 2)
        })
    return result

def get_emissions_comparison(year):
    load_data()
    mask = _df_emissions['year'] == int(year)
    return _df_emissions[mask].to_dict(orient='records')
