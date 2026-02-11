from flask import Blueprint, request, jsonify
from utils.data_loader import get_country_data, get_emissions_data

simulator_bp = Blueprint('simulator', __name__)

# Emissions factors (g CO2/kWh) - approximate
EMISSIONS_FACTORS = {
    "coal_pct": 820,
    "oil_pct": 720,
    "gas_pct": 490,
    "nuclear_pct": 12,
    "hydro_pct": 24,
    "wind_pct": 11,
    "solar_pct": 45,
    "other_renewables_pct": 38
}

@simulator_bp.route('/simulate', methods=['POST'])
def simulate_grid():
    try:
        data = request.get_json()
        country_code = data.get('country_code')
        base_year = data.get('base_year', 2024)
        adjustments = data.get('adjustments', {}) # Dictionary of source -> new_pct (or delta, but instruction implies absolute or delta? "adjustments" usually implies delta, but Grid Sim UI usually sets absolute pct. Let's look at the instruction payload example. 
        # Example: "adjustments": { "coal_pct": -20, "nuclear_pct": +15 ... } -> It seems these are deltas. 
        # However, the instruction for the UI says "Source sliders... Each slider goes from 0-100%". 
        # And "Constraint: Sliders must sum to 100%". 
        # If the UI sends the FINAL percentages, that is easier and more robust.
        # But the example JSON payload in the instructions shows: "adjustments": { "coal_pct": -20 ... }
        # I will support absolute values if the user sends a full set that sums to ~100, or apply deltas if provided.
        # Actually, let's look closely at the prompt's example response:
        # "simulated": { "energy_mix": { "coal_pct": 0, "nuclear_pct": 33 ... } }
        # And the request: "adjustments": { "coal_pct": -20, "nuclear_pct": +15 ... }
        # It seems the backend logic is expected to apply these deltas to the base year.
        
        # HOWEVER, typically a frontend slider state is "current value".
        # If the frontend calculates the deltas, that's fine.
        # Let's assume the frontend sends the *target* percentages if the keys are plain like "coal_pct".
        # Or if the values are small integers like -20, +15, it's deltas.
        # Let's stick to the prompt's explicit request format: "adjustments": { "coal_pct": -20 ... }
        
        # Get original data
        original_energy_list = get_country_data(country_code, base_year, base_year)
        if not original_energy_list:
            return jsonify({"error": "Data not found for country/year"}), 404
        
        original_energy = original_energy_list[0]
        original_emissions_list = get_emissions_data(country_code, base_year, base_year)
        original_emissions = original_emissions_list[0] if original_emissions_list else {"co2_emissions_mt": 0, "co2_per_kwh": 0}

        # Calculate Simulated Mix
        simulated_mix = original_energy.copy()
        
        # We need to handle the case where the user sends the NEW percentages directly (which is easier for the UI state).
        # If the values in 'adjustments' look like full percentages (sum to ~100), use them.
        # If they look like deltas, apply them.
        # Let's support the prompt's "adjustments" strictly for now, but also be robust.
        
        # Actually, let's re-read the prompt carefully.
        # "Grid Sim POST body: ... adjustments: { coal_pct: -20, ... }"
        # Okay, I will implement applying deltas.
        
        for source, value in adjustments.items():
            if source in simulated_mix:
                simulated_mix[source] = simulated_mix[source] + value
                if simulated_mix[source] < 0: simulated_mix[source] = 0
                if simulated_mix[source] > 100: simulated_mix[source] = 100
        
        # Normalize to ensure sum is 100% (or trust the user input? Instructions say "Constraint: Sliders must sum to 100%").
        # If we just apply deltas, we might drift. Let's normalize just in case, but respect the inputs mostly.
        # The prompt instruction says "Constraint: ... display a warning if total != 100%".
        # So the backend should probably just calculate based on what it gets, or maybe normalize.
        # Let's calculate new weighted average CO2/kWh.
        
        new_weighted_sum = 0
        total_pct = 0
        
        for source, factor in EMISSIONS_FACTORS.items():
            pct = simulated_mix.get(source, 0)
            new_weighted_sum += pct * factor
            total_pct += pct
            
        # If total_pct is not 100, we scale the result or just accept it? 
        # Let's scale the per_kwh to reflect the mix accurately.
        # co2_per_kwh = (sum(pct * factor)) / sum(pct)
        
        if total_pct > 0:
            new_co2_per_kwh = new_weighted_sum / total_pct
        else:
            new_co2_per_kwh = 0
            
        # Calculate new total emissions
        # Original: emissions_mt = (total_gen_twh * 1e9 * original_co2_kwh) / 1e12
        # We keep total_generation_twh constant (assumption: demand doesn't change, just mix).
        
        total_gen_twh = original_energy['total_generation_twh']
        new_emissions_mt = (total_gen_twh * 1e9 * new_co2_per_kwh) / 1e12
        
        result = {
            "country_code": country_code,
            "base_year": base_year,
            "original": {
                "co2_emissions_mt": original_emissions['co2_emissions_mt'],
                "co2_per_kwh": original_emissions['co2_per_kwh'],
                "energy_mix": {k: original_energy[k] for k in EMISSIONS_FACTORS.keys()}
            },
            "simulated": {
                "co2_emissions_mt": round(new_emissions_mt, 2),
                "co2_per_kwh": round(new_co2_per_kwh, 2),
                "energy_mix": {k: simulated_mix[k] for k in EMISSIONS_FACTORS.keys()}
            },
            "delta": {
                "co2_saved_mt": round(original_emissions['co2_emissions_mt'] - new_emissions_mt, 2),
                "co2_per_kwh_reduction": round(original_emissions['co2_per_kwh'] - new_co2_per_kwh, 2)
            }
        }
        
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
