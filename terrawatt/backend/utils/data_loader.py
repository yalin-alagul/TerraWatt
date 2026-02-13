import pandas as pd
import os
import numpy as np

# Global cache for dataframes
_df_energy = None
_df_emissions = None

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

def load_data():
    global _df_energy, _df_emissions
    if _df_energy is None:
        _df_energy = pd.read_csv(os.path.join(DATA_DIR, 'energy_mix.csv'))
        # Ensure renewable_pct is pre-calculated for internal use
        _df_energy['renewable_pct'] = (
            _df_energy['hydro_pct'] + 
            _df_energy['wind_pct'] + 
            _df_energy['solar_pct'] + 
            _df_energy['other_renewables_pct']
        )
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
    """
    load_data()
    mask = _df_energy['year'] == int(year)
    df_year = _df_energy[mask]
    
    result = []
    for _, row in df_year.iterrows():
        result.append({
            "id": row['country_code'],
            "value": round(row['renewable_pct'], 2)
        })
    return result

def get_leaderboards(year):
    load_data()
    mask_e = _df_energy['year'] == int(year)
    mask_em = _df_emissions['year'] == int(year)
    
    # Renewable Top 10
    top_renewable = _df_energy[mask_e].sort_values('renewable_pct', ascending=False).head(10)
    
    # Lowest Emissions Top 10
    top_clean = _df_emissions[mask_em].sort_values('co2_per_kwh', ascending=True).head(10)
    
    # Fastest Transition (last 5 years)
    current_year = int(year)
    past_year = current_year - 5
    
    past_data = _df_energy[_df_energy['year'] == past_year][['country_code', 'renewable_pct']]
    curr_data = _df_energy[mask_e][['country_code', 'country', 'renewable_pct']]
    
    merged = curr_data.merge(past_data, on='country_code', suffixes=('_now', '_past'))
    merged['improvement'] = merged['renewable_pct_now'] - merged['renewable_pct_past']
    top_improvers = merged.sort_values('improvement', ascending=False).head(10)

    return {
        "renewable": top_renewable[['country', 'country_code', 'renewable_pct']].to_dict(orient='records'),
        "clean": top_clean[['country', 'country_code', 'co2_per_kwh']].to_dict(orient='records'),
        "improvers": top_improvers[['country', 'country_code', 'improvement']].to_dict(orient='records')
    }

def get_regional_aggregates(year):
    load_data()
    mask = _df_energy['year'] == int(year)
    # Weighted average by total generation
    df_year = _df_energy[mask].copy()
    
    regions = df_year.groupby('region').apply(lambda x: pd.Series({
        "renewable_pct": np.average(x['renewable_pct'], weights=x['total_generation_twh']),
        "total_generation_twh": x['total_generation_twh'].sum(),
        "battery_storage_mwh": x['battery_storage_mwh'].sum(),
        "pumped_hydro_mwh": x['pumped_hydro_mwh'].sum()
    }), include_groups=False).reset_index()
    
    return regions.to_dict(orient='records')

def predict_trends(country_code):
    load_data()
    # Simple linear regression for renewable_pct and co2_per_kwh
    country_energy = _df_energy[_df_energy['country_code'] == country_code].sort_values('year')
    country_emissions = _df_emissions[_df_emissions['country_code'] == country_code].sort_values('year')
    
    if len(country_energy) < 5:
        return {"error": "Not enough data for prediction"}
        
    def lin_reg(x, y, target_x):
        coeffs = np.polyfit(x, y, 1)
        return np.polyval(coeffs, target_x)

    years = country_energy['year'].values
    ren_vals = country_energy['renewable_pct'].values
    em_vals = country_emissions['co2_per_kwh'].values
    
    future_years = [2025, 2030, 2040, 2050]
    predictions = []
    
    for fy in future_years:
        predictions.append({
            "year": fy,
            "renewable_pct": max(0, min(100, round(lin_reg(years, ren_vals, fy), 2))),
            "co2_per_kwh": max(0, round(lin_reg(years, em_vals, fy), 2))
        })
        
    return predictions

def get_emissions_comparison(year):
    load_data()
    mask = _df_emissions['year'] == int(year)
    return _df_emissions[mask].to_dict(orient='records')

def to_csv(data):
    if not data:
        return ""
    df = pd.DataFrame(data)
    return df.to_csv(index=False)
