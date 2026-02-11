from flask import Blueprint, request, jsonify
from utils.data_loader import get_emissions_data, get_emissions_comparison

emissions_bp = Blueprint('emissions', __name__)

@emissions_bp.route('/emissions/country', methods=['GET'])
def get_country_emissions():
    country_code = request.args.get('country_code')
    start_year = request.args.get('start_year', 2000)
    end_year = request.args.get('end_year', 2024)
    
    if not country_code:
        return jsonify({"error": "country_code is required"}), 400
        
    data = get_emissions_data(country_code, start_year, end_year)
    return jsonify(data)

@emissions_bp.route('/emissions/compare', methods=['GET'])
def get_emissions_compare():
    year = request.args.get('year')
    if not year:
        return jsonify({"error": "year is required"}), 400
        
    data = get_emissions_comparison(year)
    return jsonify(data)
