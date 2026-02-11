from flask import Blueprint, request, jsonify
from utils.data_loader import get_country_data, get_all_countries_for_year, get_renewable_pct

energy_bp = Blueprint('energy', __name__)

@energy_bp.route('/energy/mix', methods=['GET'])
def get_energy_mix():
    country_code = request.args.get('country_code')
    start_year = request.args.get('start_year', 2000)
    end_year = request.args.get('end_year', 2024)
    
    if not country_code:
        return jsonify({"error": "country_code is required"}), 400
        
    data = get_country_data(country_code, start_year, end_year)
    return jsonify(data)

@energy_bp.route('/energy/all', methods=['GET'])
def get_energy_all():
    year = request.args.get('year')
    if not year:
        return jsonify({"error": "year is required"}), 400
        
    data = get_all_countries_for_year(year)
    return jsonify(data)

@energy_bp.route('/energy/renewable-pct', methods=['GET'])
def get_renewable_percentage():
    year = request.args.get('year')
    if not year:
        return jsonify({"error": "year is required"}), 400
        
    data = get_renewable_pct(year)
    return jsonify(data)
