"""
Regenerate energy_mix.csv and co2_emissions.csv with realistic data based on
real-world baselines from IEA, Ember, and other sources.

The original data was randomly generated for nearly all 203 countries.
This script replaces it with data anchored to real 2024 values for ~40 key
countries and realistic estimates for the rest, with smooth 2000-2024 trends.
"""

import os
import shutil
import numpy as np
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, '..', 'data')

ENERGY_MIX_PATH = os.path.join(DATA_DIR, 'energy_mix.csv')
EMISSIONS_PATH = os.path.join(DATA_DIR, 'co2_emissions.csv')

YEARS = list(range(2000, 2025))
NUM_YEARS = len(YEARS)

EMISSIONS_FACTORS = {
    "coal_pct": 820,
    "oil_pct": 720,
    "gas_pct": 490,
    "nuclear_pct": 12,
    "hydro_pct": 24,
    "wind_pct": 11,
    "solar_pct": 45,
    "other_renewables_pct": 38,
}

MIX_COLS = list(EMISSIONS_FACTORS.keys())

# ──────────────────────────────────────────────────────────────
# Real-world baseline data for 2024 (from Ember, IEA, etc.)
# Format: (gen_twh_2024, coal, oil, gas, nuclear, hydro, wind, solar, other_ren, region)
# ──────────────────────────────────────────────────────────────
COUNTRY_BASELINES = {
    # Major economies
    "USA": (4450, 16, 1, 42, 18, 6, 10, 7, 2, "North America"),
    "CHN": (10066, 58, 1, 3, 5, 13, 9, 9, 2, "Asia"),
    "IND": (1960, 74, 1, 3, 3, 9, 5, 5, 1, "Asia"),
    "JPN": (940, 30, 3, 33, 9, 8, 1, 11, 6, "Asia"),
    "DEU": (489, 20, 1, 13, 0, 4, 33, 14, 9, "Europe"),
    "FRA": (537, 1, 1, 3, 67, 14, 9, 4, 2, "Europe"),
    "GBR": (285, 1, 1, 29, 14, 2, 30, 5, 13, "Europe"),
    "BRA": (740, 4, 1, 9, 2, 55, 15, 10, 8, "South America"),
    "CAN": (650, 5, 1, 12, 14, 59, 6, 2, 1, "North America"),
    "RUS": (1180, 16, 1, 47, 20, 18, 0, 1, 1, "Europe"),
    "KOR": (600, 32, 1, 30, 28, 1, 2, 6, 1, "Asia"),
    "AUS": (265, 44, 1, 17, 0, 5, 13, 19, 1, "Oceania"),
    "MEX": (340, 5, 7, 55, 4, 10, 7, 8, 4, "North America"),
    "IDN": (330, 62, 2, 18, 0, 7, 0, 2, 9, "Asia"),
    "TUR": (350, 34, 1, 20, 0, 19, 11, 9, 3, "Asia"),
    "SAU": (400, 0, 38, 57, 0, 0, 0, 4, 1, "Asia"),
    "IRN": (380, 0, 5, 80, 1, 10, 1, 1, 2, "Asia"),
    "ITA": (280, 4, 3, 42, 0, 13, 9, 13, 10, "Europe"),
    "ESP": (280, 2, 2, 20, 20, 8, 24, 19, 5, "Europe"),
    "POL": (175, 63, 1, 10, 0, 1, 14, 7, 4, "Europe"),
    "NLD": (120, 8, 1, 44, 3, 0, 23, 14, 3, "Europe"),
    "SWE": (170, 0, 0, 1, 29, 42, 20, 3, 5, "Europe"),
    "NOR": (155, 0, 0, 2, 0, 88, 8, 0, 2, "Europe"),
    "ISL": (20, 0, 0, 0, 0, 72, 0, 0, 28, "Europe"),
    "CHE": (68, 0, 0, 2, 33, 55, 2, 6, 2, "Europe"),
    "AUT": (72, 3, 1, 13, 0, 56, 13, 8, 6, "Europe"),
    "BEL": (85, 1, 0, 25, 40, 1, 15, 10, 5, "Europe"),
    "FIN": (72, 5, 0, 5, 33, 20, 18, 2, 17, "Europe"),
    "DNK": (40, 5, 1, 8, 0, 0, 58, 12, 16, "Europe"),
    "PRT": (55, 0, 1, 18, 0, 12, 30, 10, 10, "Europe"),
    "GRC": (52, 8, 2, 38, 0, 8, 20, 18, 6, "Europe"),
    "CZE": (83, 37, 0, 9, 37, 3, 2, 5, 7, "Europe"),
    "IRL": (35, 0, 1, 45, 0, 3, 36, 2, 8, "Europe"),

    # Africa
    "ZAF": (236, 82, 1, 1, 3, 1, 5, 9, 0, "Africa"),
    "EGY": (210, 0, 9, 77, 0, 6, 5, 3, 0, "Africa"),
    "NGA": (41, 0, 1, 77, 0, 23, 0, 0, 0, "Africa"),
    "KEN": (14, 0, 6, 0, 0, 26, 18, 3, 47, "Africa"),
    "ETH": (16, 0, 1, 0, 0, 88, 7, 1, 3, "Africa"),
    "MAR": (42, 35, 1, 18, 0, 5, 19, 9, 4, "Africa"),
    "GHA": (20, 0, 2, 55, 0, 38, 0, 3, 2, "Africa"),
    "TZA": (8, 4, 3, 48, 0, 30, 0, 5, 10, "Africa"),
    "SEN": (6, 6, 1, 62, 0, 0, 5, 16, 10, "Africa"),
    "MOZ": (18, 3, 0, 15, 0, 72, 0, 3, 7, "Africa"),
    "AGO": (10, 0, 1, 45, 0, 50, 0, 2, 2, "Africa"),
    "CMR": (9, 0, 3, 18, 0, 68, 0, 2, 9, "Africa"),
    "CIV": (12, 0, 1, 60, 0, 18, 0, 5, 16, "Africa"),
    "ZMB": (16, 2, 1, 0, 0, 82, 0, 8, 7, "Africa"),
    "ZWE": (8, 30, 1, 0, 0, 55, 1, 8, 5, "Africa"),
    "SDN": (14, 0, 5, 20, 0, 60, 1, 8, 6, "Africa"),
    "UGA": (5, 0, 2, 0, 0, 80, 0, 5, 13, "Africa"),
    "RWA": (1, 0, 5, 5, 0, 45, 0, 10, 35, "Africa"),
    "GMB": (0.4, 0, 25, 55, 0, 0, 0, 15, 5, "Africa"),
    "MWI": (2, 3, 3, 0, 0, 65, 0, 15, 14, "Africa"),

    # South America
    "ARG": (155, 2, 5, 50, 6, 18, 12, 4, 3, "South America"),
    "CHL": (85, 16, 1, 18, 0, 22, 14, 22, 7, "South America"),
    "COL": (80, 8, 0, 20, 0, 63, 3, 3, 3, "South America"),
    "PER": (58, 3, 3, 30, 0, 48, 5, 6, 5, "South America"),
    "VEN": (75, 0, 5, 20, 0, 65, 0, 2, 8, "South America"),
    "ECU": (32, 0, 5, 15, 0, 70, 2, 3, 5, "South America"),
    "URY": (14, 0, 2, 5, 0, 30, 40, 8, 15, "South America"),
    "BOL": (11, 0, 3, 60, 0, 22, 3, 8, 4, "South America"),
    "PRY": (63, 0, 0, 0, 0, 99, 0, 1, 0, "South America"),

    # Asia & Middle East
    "PAK": (165, 12, 6, 35, 7, 25, 3, 5, 7, "Asia"),
    "BGD": (90, 5, 2, 68, 0, 1, 0, 2, 22, "Asia"),
    "VNM": (270, 30, 1, 13, 0, 30, 5, 17, 4, "Asia"),
    "THA": (200, 17, 1, 58, 0, 4, 4, 6, 10, "Asia"),
    "MYS": (180, 25, 1, 44, 0, 15, 0, 5, 10, "Asia"),
    "PHL": (110, 43, 2, 20, 0, 7, 3, 5, 20, "Asia"),
    "TWN": (280, 32, 2, 38, 8, 3, 3, 8, 6, "Asia"),  # not in CSV but ok
    "SGP": (55, 0, 1, 94, 0, 0, 0, 4, 1, "Asia"),
    "MMR": (25, 10, 2, 25, 0, 52, 1, 3, 7, "Asia"),
    "KHM": (10, 22, 1, 5, 0, 50, 0, 15, 7, "Asia"),
    "LAO": (42, 18, 0, 0, 0, 72, 2, 5, 3, "Asia"),
    "NPL": (7, 0, 0, 0, 0, 90, 0, 5, 5, "Asia"),
    "LKA": (18, 7, 5, 0, 0, 32, 10, 8, 38, "Asia"),
    "KAZ": (115, 65, 1, 20, 0, 9, 3, 2, 0, "Asia"),
    "UZB": (70, 4, 1, 82, 0, 9, 0, 3, 1, "Asia"),
    "KGZ": (16, 5, 0, 5, 0, 84, 0, 3, 3, "Asia"),
    "TJK": (22, 2, 0, 1, 0, 93, 0, 2, 2, "Asia"),
    "TKM": (25, 0, 0, 98, 0, 0, 0, 1, 1, "Asia"),
    "IRQ": (90, 0, 8, 85, 0, 4, 0, 3, 0, "Asia"),
    "JOR": (22, 0, 1, 72, 0, 0, 8, 17, 2, "Asia"),
    "ISR": (75, 15, 0, 55, 0, 0, 1, 14, 15, "Asia"),
    "ARE": (160, 0, 0, 90, 5, 0, 0, 4, 1, "Asia"),
    "KWT": (75, 0, 15, 80, 0, 0, 0, 4, 1, "Asia"),
    "QAT": (50, 0, 0, 97, 0, 0, 0, 2, 1, "Asia"),
    "OMN": (42, 0, 0, 95, 0, 0, 0, 4, 1, "Asia"),
    "BHR": (18, 0, 0, 97, 0, 0, 0, 2, 1, "Asia"),
    "MNG": (8, 85, 1, 2, 0, 0, 7, 4, 1, "Asia"),

    # Oceania
    "NZL": (44, 3, 0, 10, 0, 55, 8, 2, 22, "Oceania"),
    "FJI": (1, 0, 16, 0, 0, 50, 5, 5, 24, "Oceania"),
    "PNG": (5, 0, 10, 15, 0, 25, 0, 1, 49, "Oceania"),

    # Caribbean & Central America
    "CUB": (20, 0, 30, 55, 0, 1, 2, 8, 4, "North America"),
    "DOM": (22, 9, 6, 30, 0, 5, 10, 5, 35, "North America"),
    "GTM": (14, 8, 1, 7, 0, 25, 6, 5, 48, "North America"),
    "HND": (11, 5, 5, 5, 0, 35, 12, 15, 23, "North America"),
    "CRI": (12, 0, 1, 1, 0, 65, 16, 2, 15, "North America"),
    "PAN": (13, 3, 2, 8, 0, 50, 10, 8, 19, "North America"),
    "SLV": (7, 0, 5, 15, 0, 20, 0, 10, 50, "North America"),
    "NIC": (6, 0, 6, 10, 0, 5, 17, 2, 60, "North America"),
    "JAM": (5, 0, 30, 45, 0, 3, 5, 8, 9, "North America"),
    "TTO": (10, 0, 0, 96, 0, 0, 0, 3, 1, "North America"),
    "BLZ": (0.6, 0, 10, 0, 0, 30, 0, 5, 55, "North America"),
    "HTI": (1.2, 0, 45, 0, 0, 20, 0, 10, 25, "North America"),

    # Eastern Europe / Balkans
    "UKR": (130, 25, 1, 8, 52, 5, 4, 3, 2, "Europe"),
    "ROU": (58, 14, 1, 15, 18, 25, 14, 5, 8, "Europe"),
    "BGR": (44, 30, 1, 5, 35, 8, 6, 10, 5, "Europe"),
    "HUN": (35, 7, 0, 25, 45, 1, 6, 12, 4, "Europe"),
    "SRB": (37, 60, 1, 5, 0, 22, 5, 2, 5, "Europe"),
    "HRV": (14, 4, 2, 20, 0, 35, 15, 3, 21, "Europe"),
    "SVN": (16, 20, 0, 3, 37, 25, 0, 5, 10, "Europe"),
    "SVK": (28, 5, 1, 10, 55, 12, 0, 4, 13, "Europe"),
    "BIH": (17, 55, 1, 3, 0, 30, 5, 2, 4, "Europe"),
    "ALB": (8, 0, 0, 0, 0, 97, 0, 3, 0, "Europe"),
    "MKD": (6, 45, 2, 10, 0, 15, 8, 8, 12, "Europe"),
    "MDA": (5, 0, 0, 85, 0, 3, 5, 4, 3, "Europe"),
    "LTU": (5, 0, 1, 20, 0, 5, 40, 8, 26, "Europe"),
    "LVA": (7, 0, 0, 30, 0, 35, 10, 3, 22, "Europe"),
    "EST": (7, 0, 0, 10, 0, 0, 35, 3, 52, "Europe"),
    "BLR": (40, 0, 1, 90, 5, 1, 1, 1, 1, "Europe"),
    "GEO": (13, 1, 0, 12, 0, 75, 5, 3, 4, "Europe"),
    "LUX": (3, 0, 0, 30, 0, 8, 15, 12, 35, "Europe"),
    "MLT": (3, 0, 2, 80, 0, 0, 0, 15, 3, "Europe"),
    "CYP": (5, 0, 3, 70, 0, 0, 4, 18, 5, "Europe"),

    # North Africa
    "DZA": (80, 0, 1, 93, 0, 1, 1, 3, 1, "Africa"),
    "TUN": (22, 0, 2, 90, 0, 1, 3, 3, 1, "Africa"),
    "LBY": (35, 0, 10, 85, 0, 0, 0, 3, 2, "Africa"),

    # Small/Micro countries & territories - tiny generation
    "AFG": (7, 1, 1, 0, 0, 85, 0, 1, 12, "Asia"),
    "AND": (0.5, 0, 0, 0, 0, 85, 0, 10, 5, "Europe"),
    "ABW": (1, 0, 30, 0, 0, 0, 25, 10, 35, "South America"),
    "ATG": (0.4, 0, 60, 0, 0, 0, 5, 15, 20, "North America"),
    "BHS": (2, 0, 65, 10, 0, 0, 2, 12, 11, "North America"),
    "BRB": (1, 0, 55, 0, 0, 0, 5, 15, 25, "North America"),
    "BMU": (0.7, 0, 60, 0, 0, 0, 5, 10, 25, "North America"),
    "BRN": (4.5, 0, 0, 98, 0, 0, 0, 1, 1, "Asia"),
    "BTN": (8, 0, 0, 0, 0, 95, 0, 2, 3, "Asia"),
    "BWA": (3, 80, 2, 0, 0, 0, 0, 12, 6, "Africa"),
    "BDI": (0.5, 0, 5, 0, 0, 45, 0, 15, 35, "Africa"),
    "CAF": (0.2, 0, 5, 0, 0, 60, 0, 10, 25, "Africa"),
    "CPV": (0.5, 0, 35, 0, 0, 0, 20, 12, 33, "Africa"),
    "TCD": (0.3, 0, 75, 0, 0, 0, 0, 15, 10, "Africa"),
    "COM": (0.1, 0, 60, 0, 0, 5, 0, 20, 15, "Africa"),
    "COG": (3, 0, 5, 50, 0, 35, 0, 5, 5, "Africa"),
    "COD": (12, 0, 1, 2, 0, 90, 0, 2, 5, "Africa"),
    "COK": (0.04, 0, 50, 0, 0, 0, 0, 30, 20, "Oceania"),
    "CUW": (1, 0, 50, 0, 0, 0, 15, 10, 25, "South America"),
    "CYM": (0.7, 0, 70, 0, 0, 0, 0, 15, 15, "North America"),
    "DJI": (0.6, 0, 30, 0, 0, 0, 15, 30, 25, "Africa"),
    "DMA": (0.1, 0, 40, 0, 0, 15, 0, 10, 35, "North America"),
    "ERI": (0.4, 0, 65, 0, 0, 0, 5, 15, 15, "Africa"),
    "SWZ": (0.5, 10, 0, 0, 0, 30, 0, 40, 20, "Africa"),
    "GAB": (3, 0, 10, 45, 0, 40, 0, 3, 2, "Africa"),
    "GIB": (0.2, 0, 10, 75, 0, 0, 5, 8, 2, "Europe"),
    "GIN": (2, 0, 15, 0, 0, 55, 0, 10, 20, "Africa"),
    "GNB": (0.1, 0, 70, 0, 0, 0, 0, 15, 15, "Africa"),
    "GNQ": (1, 0, 10, 55, 0, 25, 0, 5, 5, "Africa"),
    "GRD": (0.25, 0, 60, 0, 0, 0, 5, 15, 20, "North America"),
    "GRL": (0.5, 0, 15, 0, 0, 70, 0, 0, 15, "North America"),
    "GLP": (2, 0, 20, 0, 0, 5, 10, 15, 50, "North America"),
    "GUF": (1, 0, 20, 0, 0, 35, 0, 15, 30, "South America"),
    "GUM": (2, 0, 60, 0, 0, 0, 0, 8, 32, "Oceania"),
    "HKG": (40, 25, 0, 50, 0, 0, 1, 1, 23, "Asia"),
    "KIR": (0.03, 0, 80, 0, 0, 0, 0, 15, 5, "Oceania"),
    "KNA": (0.2, 0, 60, 0, 0, 0, 5, 15, 20, "North America"),
    "LBN": (18, 0, 10, 78, 0, 4, 1, 5, 2, "Asia"),
    "LBR": (0.4, 0, 50, 0, 0, 20, 0, 15, 15, "Africa"),
    "LCA": (0.4, 0, 55, 0, 0, 0, 0, 20, 25, "North America"),
    "LSO": (0.5, 0, 5, 0, 0, 75, 0, 10, 10, "Africa"),
    "MAC": (5, 0, 0, 80, 0, 0, 0, 2, 18, "Asia"),
    "MDG": (2, 5, 25, 0, 0, 40, 0, 15, 15, "Africa"),
    "MDV": (0.7, 0, 70, 0, 0, 0, 0, 15, 15, "Asia"),
    "MLI": (3, 0, 15, 0, 0, 30, 0, 35, 20, "Africa"),
    "MRT": (2, 0, 20, 30, 0, 5, 20, 15, 10, "Africa"),
    "MSR": (0.02, 0, 60, 0, 0, 0, 0, 15, 25, "North America"),
    "MTQ": (2, 0, 25, 0, 0, 3, 5, 10, 57, "North America"),
    "MUS": (3, 15, 5, 0, 0, 3, 2, 10, 65, "Africa"),
    "NAM": (2, 10, 2, 5, 0, 30, 0, 25, 28, "Africa"),
    "NCL": (3.5, 15, 5, 0, 0, 20, 15, 12, 33, "Oceania"),
    "NER": (0.6, 5, 5, 0, 0, 0, 0, 60, 30, "Africa"),
    "NIU": (0.003, 0, 50, 0, 0, 0, 0, 30, 20, "Oceania"),
    "NRU": (0.05, 0, 80, 0, 0, 0, 0, 15, 5, "Oceania"),
    "PRK": (20, 40, 2, 0, 0, 50, 1, 2, 5, "Asia"),
    "PRI": (20, 5, 15, 50, 0, 1, 2, 15, 12, "North America"),
    "PYF": (0.7, 0, 35, 0, 0, 25, 0, 15, 25, "Oceania"),
    "SLB": (0.1, 0, 60, 0, 0, 10, 0, 15, 15, "Oceania"),
    "SLE": (0.5, 0, 40, 0, 0, 30, 0, 15, 15, "Africa"),
    "SOM": (0.5, 0, 70, 0, 0, 0, 5, 15, 10, "Africa"),
    "SPM": (0.05, 0, 50, 0, 0, 0, 20, 5, 25, "North America"),
    "SSD": (0.3, 0, 75, 0, 0, 5, 0, 10, 10, "Africa"),
    "STP": (0.1, 0, 50, 0, 0, 10, 0, 20, 20, "Africa"),
    "SUR": (2, 0, 15, 0, 0, 55, 0, 10, 20, "South America"),
    "SYC": (0.5, 0, 60, 0, 0, 0, 5, 20, 15, "Africa"),
    "SYR": (20, 0, 15, 55, 0, 15, 1, 5, 9, "Asia"),
    "TGO": (1, 0, 5, 30, 0, 25, 0, 20, 20, "Africa"),
    "TON": (0.08, 0, 60, 0, 0, 0, 0, 25, 15, "Oceania"),
    "VCT": (0.15, 0, 55, 0, 0, 10, 0, 15, 20, "North America"),
    "VUT": (0.08, 0, 45, 0, 0, 10, 10, 10, 25, "Oceania"),
    "WSM": (0.15, 0, 40, 0, 0, 25, 0, 10, 25, "Oceania"),
    "YEM": (5, 0, 55, 30, 0, 0, 0, 10, 5, "Asia"),
    "ASM": (0.3, 0, 65, 0, 0, 0, 0, 15, 20, "Oceania"),
    "BEN": (1.5, 0, 5, 55, 0, 0, 0, 20, 20, "Africa"),
    "BFA": (2, 0, 10, 0, 0, 5, 0, 55, 30, "Africa"),
}

# Realistic 2000 baselines: more fossil-heavy, less renewables than 2024
# We'll derive 2000 values by adjusting from 2024 baselines


def get_region(code):
    """Get region for a country code."""
    if code in COUNTRY_BASELINES:
        return COUNTRY_BASELINES[code][9]
    # Fallback region assignment by code patterns
    european = {"AZE","ARM","GEO","BLR","MDA","UKR","RUS","ALB","AND","AUT","BEL","BIH","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA","DEU","GRC","HUN","ISL","IRL","ITA","LVA","LTU","LUX","MLT","MKD","NLD","NOR","POL","PRT","ROU","SRB","SVK","SVN","ESP","SWE","CHE","GBR","GIB"}
    asian = {"AFG","BHR","BGD","BTN","BRN","KHM","CHN","HKG","IND","IDN","IRN","IRQ","ISR","JPN","JOR","KAZ","KWT","KGZ","LAO","LBN","MAC","MYS","MDV","MNG","MMR","NPL","OMN","PAK","PHL","QAT","SAU","SGP","KOR","LKA","SYR","TJK","THA","TKM","TUR","ARE","UZB","VNM","YEM","PRK"}
    african = {"DZA","AGO","BEN","BWA","BFA","BDI","CMR","CPV","CAF","TCD","COM","COG","COD","CIV","DJI","EGY","GNQ","ERI","ETH","GAB","GMB","GHA","GIN","GNB","KEN","LSO","LBR","LBY","MDG","MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA","RWA","STP","SEN","SYC","SLE","SOM","ZAF","SSD","SDN","SWZ","TZA","TGO","TUN","UGA","ZMB","ZWE"}
    south_american = {"ARG","BOL","BRA","CHL","COL","ECU","GUF","PRY","PER","SUR","URY","VEN","ABW","CUW"}
    north_american = {"CAN","USA","MEX","CUB","DOM","GTM","HND","SLV","NIC","CRI","PAN","JAM","TTO","BHS","BRB","BLZ","HTI","ATG","DMA","GRD","KNA","LCA","VCT","BMU","CYM","GLP","MTQ","PRI","SPM","MSR","GUM","ASM"}
    oceanian = {"AUS","NZL","FJI","PNG","SLB","VUT","WSM","TON","KIR","NRU","COK","NIU","PYF","NCL","GUM","ASM"}

    if code in european: return "Europe"
    if code in asian: return "Asia"
    if code in african: return "Africa"
    if code in south_american: return "South America"
    if code in north_american: return "North America"
    if code in oceanian: return "Oceania"
    return "Other"


def get_baseline(code):
    """Get or estimate 2024 baseline for a country."""
    if code in COUNTRY_BASELINES:
        b = COUNTRY_BASELINES[code]
        return {
            "gen_twh": b[0],
            "coal_pct": b[1], "oil_pct": b[2], "gas_pct": b[3],
            "nuclear_pct": b[4], "hydro_pct": b[5], "wind_pct": b[6],
            "solar_pct": b[7], "other_renewables_pct": b[8],
            "region": b[9],
        }
    # Default: small country, mostly fossil (oil + gas) or hydro
    region = get_region(code)
    return {
        "gen_twh": 2.0,
        "coal_pct": 5, "oil_pct": 20, "gas_pct": 30,
        "nuclear_pct": 0, "hydro_pct": 20, "wind_pct": 5,
        "solar_pct": 10, "other_renewables_pct": 10,
        "region": region,
    }


def generate_country_data(code, rng):
    """Generate 25 years of realistic data for a single country."""
    baseline = get_baseline(code)
    region = baseline["region"]
    gen_2024 = baseline["gen_twh"]

    # --- Total generation trajectory ---
    # Growth rate: larger countries grow slower, small countries faster
    if gen_2024 > 1000:
        growth = rng.uniform(0.015, 0.025)
    elif gen_2024 > 100:
        growth = rng.uniform(0.02, 0.035)
    elif gen_2024 > 10:
        growth = rng.uniform(0.025, 0.045)
    else:
        growth = rng.uniform(0.02, 0.05)

    # Work backwards from 2024 to get 2000 value
    gen_2000 = gen_2024 / ((1 + growth) ** 24)
    gen_values = np.array([gen_2000 * (1 + growth) ** i for i in range(NUM_YEARS)])
    # Add tiny jitter - skip for very small countries to avoid rounding volatility
    if gen_2024 >= 0.1:
        gen_values *= rng.normal(1.0, 0.005, NUM_YEARS)
    gen_values = np.maximum(gen_values, 0.01)
    gen_values = np.round(gen_values, 2)

    # --- Energy mix trajectory ---
    # 2024 values from baseline
    mix_2024 = {
        "coal_pct": baseline["coal_pct"],
        "oil_pct": baseline["oil_pct"],
        "gas_pct": baseline["gas_pct"],
        "nuclear_pct": baseline["nuclear_pct"],
        "hydro_pct": baseline["hydro_pct"],
        "wind_pct": baseline["wind_pct"],
        "solar_pct": baseline["solar_pct"],
        "other_renewables_pct": baseline["other_renewables_pct"],
    }

    # Normalize 2024 mix to 100
    total = sum(mix_2024.values())
    if total > 0 and abs(total - 100) > 0.01:
        for k in mix_2024:
            mix_2024[k] = mix_2024[k] / total * 100

    # Estimate 2000 mix: more fossil, less wind/solar
    mix_2000 = dict(mix_2024)
    # Wind and solar were much smaller in 2000
    wind_reduction = mix_2024["wind_pct"] * rng.uniform(0.80, 0.95)  # wind was 5-20% of 2024 level
    solar_reduction = mix_2024["solar_pct"] * rng.uniform(0.90, 0.99)  # solar was ~1-10% of 2024

    mix_2000["wind_pct"] = max(mix_2024["wind_pct"] - wind_reduction, 0)
    mix_2000["solar_pct"] = max(mix_2024["solar_pct"] - solar_reduction, 0)

    # Redistribute reduction to fossils
    freed = wind_reduction + solar_reduction
    # Coal gets 50%, gas gets 35%, oil gets 15% of the redistribution
    mix_2000["coal_pct"] += freed * 0.50
    mix_2000["gas_pct"] += freed * 0.35
    mix_2000["oil_pct"] += freed * 0.15

    # Other renewables were also lower
    other_ren_reduction = mix_2024["other_renewables_pct"] * rng.uniform(0.2, 0.5)
    mix_2000["other_renewables_pct"] -= other_ren_reduction
    mix_2000["coal_pct"] += other_ren_reduction * 0.6
    mix_2000["gas_pct"] += other_ren_reduction * 0.4

    # Normalize 2000 mix
    total = sum(mix_2000.values())
    for k in mix_2000:
        mix_2000[k] = mix_2000[k] / total * 100

    # Interpolate linearly between 2000 and 2024
    mix_data = {col: np.zeros(NUM_YEARS) for col in MIX_COLS}
    for col in MIX_COLS:
        values = np.linspace(mix_2000[col], mix_2024[col], NUM_YEARS)
        # Add small jitter (0.2 ppt)
        values += rng.normal(0, 0.2, NUM_YEARS)
        values = np.maximum(values, 0)
        mix_data[col] = values

    # Normalize each year to 100%
    for i in range(NUM_YEARS):
        total = sum(mix_data[col][i] for col in MIX_COLS)
        if total > 0:
            for col in MIX_COLS:
                mix_data[col][i] = mix_data[col][i] / total * 100

    # Keep nuclear at 0 if baseline has 0
    if baseline["nuclear_pct"] == 0:
        for i in range(NUM_YEARS):
            nuc_val = mix_data["nuclear_pct"][i]
            mix_data["nuclear_pct"][i] = 0
            # Redistribute to largest source
            largest = max(MIX_COLS, key=lambda c: mix_data[c][i] if c != "nuclear_pct" else -1)
            mix_data[largest][i] += nuc_val
            # Re-normalize
            total = sum(mix_data[col][i] for col in MIX_COLS)
            if total > 0:
                for col in MIX_COLS:
                    mix_data[col][i] = mix_data[col][i] / total * 100

    # Round and fix to sum to 100
    for i in range(NUM_YEARS):
        for col in MIX_COLS:
            mix_data[col][i] = round(mix_data[col][i], 2)
        row_sum = sum(mix_data[col][i] for col in MIX_COLS)
        diff = 100.0 - row_sum
        largest = max(MIX_COLS, key=lambda c: mix_data[c][i])
        mix_data[largest][i] = round(mix_data[largest][i] + diff, 2)

    # --- Battery storage ---
    battery = np.zeros(NUM_YEARS)
    # Scale battery by generation size
    battery_2024 = gen_2024 * rng.uniform(1.5, 4.0)  # MWh per TWh roughly
    battery_start = max(battery_2024 / (1.35 ** 13), 0.01)
    for i in range(11, NUM_YEARS):  # Start 2011
        years_since = i - 11
        battery[i] = battery_start * (1.35 ** years_since)
        battery[i] *= rng.normal(1.0, 0.02)
    battery = np.maximum(battery, 0)
    battery = np.round(battery, 2)

    # --- Pumped hydro ---
    hydro_2024 = gen_2024 * rng.uniform(0.5, 2.0) if baseline["hydro_pct"] > 1 else gen_2024 * rng.uniform(0, 0.3)
    hydro_2000 = hydro_2024 * rng.uniform(0.2, 0.5)
    pumped_hydro = np.linspace(hydro_2000, hydro_2024, NUM_YEARS)
    pumped_hydro *= rng.normal(1.0, 0.015, NUM_YEARS)
    pumped_hydro = np.maximum(pumped_hydro, 0)
    pumped_hydro = np.round(pumped_hydro, 2)

    # Build rows
    rows = []
    for i, year in enumerate(YEARS):
        row = {
            "country": code,
            "country_code": code,
            "year": year,
            "total_generation_twh": gen_values[i],
            "region": region,
            "battery_storage_mwh": battery[i],
            "pumped_hydro_mwh": pumped_hydro[i],
        }
        for col in MIX_COLS:
            row[col] = mix_data[col][i]
        rows.append(row)

    return pd.DataFrame(rows)


def calculate_emissions(df_energy):
    """Calculate co2_per_kwh and co2_emissions_mt from energy mix."""
    co2_per_kwh = np.zeros(len(df_energy))
    for col, factor in EMISSIONS_FACTORS.items():
        co2_per_kwh += df_energy[col].values * factor
    co2_per_kwh /= 100.0
    co2_emissions_mt = df_energy["total_generation_twh"].values * co2_per_kwh / 1000.0

    return pd.DataFrame({
        "country": df_energy["country_code"].values,
        "country_code": df_energy["country_code"].values,
        "year": df_energy["year"].values.astype(int),
        "co2_emissions_mt": np.round(co2_emissions_mt, 2),
        "co2_per_kwh": np.round(co2_per_kwh, 2),
    })


def validate(df_energy, df_emissions):
    """Validate the regenerated data."""
    issues = []
    n_countries = df_energy["country_code"].nunique()

    if len(df_energy) != n_countries * NUM_YEARS:
        issues.append(f"Energy row count: {len(df_energy)} (expected {n_countries * NUM_YEARS})")
    if len(df_emissions) != n_countries * NUM_YEARS:
        issues.append(f"Emissions row count: {len(df_emissions)} (expected {n_countries * NUM_YEARS})")

    for col in MIX_COLS + ["total_generation_twh"]:
        if (df_energy[col] < -0.01).any():
            issues.append(f"Negative values in {col}")

    # Check percentage sums
    pct_sums = df_energy[MIX_COLS].sum(axis=1)
    bad = (pct_sums - 100).abs() > 0.15
    if bad.any():
        n_bad = bad.sum()
        issues.append(f"{n_bad} rows where mix doesn't sum to 100")

    # Check smoothness (skip micro-countries where rounding dominates)
    for code, grp in df_energy.groupby("country_code"):
        series = grp.sort_values("year")["total_generation_twh"].values
        if np.mean(series) < 0.1:
            continue  # too small for meaningful smoothness check
        deltas = np.diff(series)
        if np.std(deltas) > np.mean(series) * 0.1:
            issues.append(f"{code}: generation too volatile")

    return issues


def main():
    print("Loading original data to get country list...")
    df_orig = pd.read_csv(ENERGY_MIX_PATH)
    all_codes = sorted(df_orig["country_code"].unique())
    print(f"Found {len(all_codes)} countries")

    print(f"Have baselines for {len(COUNTRY_BASELINES)} countries")
    missing = [c for c in all_codes if c not in COUNTRY_BASELINES]
    print(f"Using defaults for {len(missing)} countries: {missing[:20]}...")

    all_dfs = []
    for code in all_codes:
        seed = int.from_bytes(code.encode(), "big") % (2**31)
        rng = np.random.default_rng(seed)
        df_country = generate_country_data(code, rng)
        all_dfs.append(df_country)

    df_energy = pd.concat(all_dfs, ignore_index=True)
    df_energy = df_energy.sort_values(["country_code", "year"]).reset_index(drop=True)

    # Ensure column order
    energy_cols = ["country", "country_code", "year", "coal_pct", "oil_pct", "gas_pct",
                   "nuclear_pct", "hydro_pct", "wind_pct", "solar_pct", "other_renewables_pct",
                   "total_generation_twh", "region", "battery_storage_mwh", "pumped_hydro_mwh"]
    df_energy = df_energy[energy_cols]

    print("\nCalculating emissions...")
    df_emissions = calculate_emissions(df_energy)

    print("Validating...")
    issues = validate(df_energy, df_emissions)
    if issues:
        print(f"\n{len(issues)} issues:")
        for issue in issues[:30]:
            print(f"  - {issue}")
    else:
        print("All validations passed!")

    # Spot checks
    for code in ["USA", "CHN", "IND", "BRA", "DEU", "FRA", "AFG", "ALB", "NGA", "ZAF", "AUS", "JPN"]:
        if code not in all_codes:
            continue
        c = df_energy[df_energy["country_code"] == code].sort_values("year")
        e = df_emissions[df_emissions["country_code"] == code].sort_values("year")
        row_2024 = c[c["year"] == 2024].iloc[0]
        em_2024 = e[e["year"] == 2024].iloc[0]
        row_2000 = c[c["year"] == 2000].iloc[0]
        em_2000 = e[e["year"] == 2000].iloc[0]
        print(f"\n{code}: gen={row_2024['total_generation_twh']:.1f}TWh "
              f"coal={row_2024['coal_pct']:.1f}% gas={row_2024['gas_pct']:.1f}% "
              f"nuclear={row_2024['nuclear_pct']:.1f}% hydro={row_2024['hydro_pct']:.1f}% "
              f"wind={row_2024['wind_pct']:.1f}% solar={row_2024['solar_pct']:.1f}% "
              f"CO2={em_2024['co2_emissions_mt']:.1f}MT ({em_2024['co2_per_kwh']:.0f}g/kWh)")
        print(f"     2000: gen={row_2000['total_generation_twh']:.1f}TWh "
              f"coal={row_2000['coal_pct']:.1f}% CO2={em_2000['co2_emissions_mt']:.1f}MT "
              f"({em_2000['co2_per_kwh']:.0f}g/kWh)")

    # Backup & write
    print("\nBacking up originals...")
    for path in [ENERGY_MIX_PATH, EMISSIONS_PATH]:
        bak = path + ".bak"
        if not os.path.exists(bak):
            shutil.copy2(path, bak)

    print("Writing new CSVs...")
    df_energy.to_csv(ENERGY_MIX_PATH, index=False)
    df_emissions.to_csv(EMISSIONS_PATH, index=False)

    print(f"\nDone! {len(df_energy)} rows in energy_mix.csv, {len(df_emissions)} rows in co2_emissions.csv")


if __name__ == "__main__":
    main()
