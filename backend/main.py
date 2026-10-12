import asyncio
import json
import random
import time
from datetime import datetime
from typing import Dict, List, Optional

import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="ATLAS Space Monitoring Platform API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Planet(BaseModel):
    name: str
    display_title: str
    surface_temp_base: float
    temp_range: List[float]
    pressure_base: float  # kPa
    radiation_base: float  # mSv/day
    dust_base: float  # particles/cm3 or optical depth
    solar_irradiance: float  # W/m2
    gravity: float  # m/s2
    magnetic_field: float  # micro-Tesla
    atmosphere: Dict[str, float]
    resources: List[Dict[str, str]]
    recommended_suit_mode: str
    description: str

PLANETS: Dict[str, Planet] = {
    "Earth": Planet(
        name="Earth",
        display_title="Earth (Baseline Terra)",
        surface_temp_base=15.0,
        temp_range=[-10.0, 35.0],
        pressure_base=101.3,
        radiation_base=0.003,
        dust_base=15.0,
        solar_irradiance=1361.0,
        gravity=9.807,
        magnetic_field=45.0,
        atmosphere={"N2": 78.08, "O2": 20.95, "Ar": 0.93, "CO2": 0.04},
        resources=[
            {"name": "Potable Liquid H2O", "abundance": "Abundant", "utility": "Life Support & Fuel Hydration"},
            {"name": "Atmospheric Diatomic O2", "abundance": "Abundant", "utility": "Breathing Gas Feedstock"},
            {"name": "Geothermal & Solar Energy", "abundance": "High", "utility": "Base Power Generation"}
        ],
        recommended_suit_mode="Standard EVA IVA-1 Atmospheric",
        description="Terrestrial baseline reference. Optimal atmospheric pressure and active geomagnetic magnetosphere shield."
    ),
    "Mars": Planet(
        name="Mars",
        display_title="Mars (Jezero / Gale Crater)",
        surface_temp_base=-63.0,
        temp_range=[-125.0, 20.0],
        pressure_base=0.63,
        radiation_base=0.67,
        dust_base=1450.0,
        solar_irradiance=590.0,
        gravity=3.72,
        magnetic_field=0.5,
        atmosphere={"CO2": 95.32, "N2": 2.6, "Ar": 1.9, "O2": 0.13, "CO": 0.05},
        resources=[
            {"name": "Subsurface Regolith Ice (H2O)", "abundance": "Moderate (Glacial Permafrost)", "utility": "Sabtier ISRU Propellant & Water"},
            {"name": "Atmospheric CO2 Cracking", "abundance": "Very High", "utility": "MOXIE O2 Production"},
            {"name": "Basalt & Regolith Iron/Silicon", "abundance": "Abundant", "utility": "3D Sintered Habitat Construction"}
        ],
        recommended_suit_mode="ATLAS MK-IX Thermal Polar Regolith Deflector",
        description="High perchlorate regolith, atmospheric thinness, diurnal temperature swings, and seasonal dust storms."
    ),
    "Moon": Planet(
        name="Moon",
        display_title="Moon (Luna / Shackleton Crater)",
        surface_temp_base=-20.0,
        temp_range=[-173.0, 117.0],
        pressure_base=0.00000000001,
        radiation_base=1.36,
        dust_base=850.0,
        solar_irradiance=1361.0,
        gravity=1.62,
        magnetic_field=0.01,
        atmosphere={"He": 45.0, "Ne": 35.0, "H2": 20.0},
        resources=[
            {"name": "Permanent Cold Trap Water Ice", "abundance": "High in PSR Craters", "utility": "Cryogenic Rocket Fuel (LH2/LOX)"},
            {"name": "Helium-3 Regolith Deposit", "abundance": "Trace / Strategic", "utility": "Clean Nuclear Fusion Power"},
            {"name": "Ilmenite & Anorthosite Ores", "abundance": "High", "utility": "Metals Extraction & Titanium Alloys"}
        ],
        recommended_suit_mode="MK-IX Lunar Electrostatic Dust-Repel Seal",
        description="Zero atmospheric insulation, razor-sharp jagged regolith dust particles, and extreme solar thermal contrast."
    ),
    "Europa": Planet(
        name="Europa",
        display_title="Europa (Jovian Ocean Moon)",
        surface_temp_base=-160.0,
        temp_range=[-220.0, -140.0],
        pressure_base=0.0000001,
        radiation_base=5400.0,  # Lethal Jovian rad belt
        dust_base=5.0,
        solar_irradiance=50.0,
        gravity=1.315,
        magnetic_field=400.0,  # Induced by Jupiter
        atmosphere={"O2": 99.0, "H2": 1.0},
        resources=[
            {"name": "Global Subsurface Liquid Salt Ocean", "abundance": "Infinite Reservoir", "utility": "Aqueous Chemistry & Astrobiology"},
            {"name": "Pure Cryogenic Surface Ice", "abundance": "Immense", "utility": "Direct Thermal Melter Extraction"},
            {"name": "Jovian Magnetosphere Energy Flux", "abundance": "Extreme", "utility": "Tether Induction Harvesting"}
        ],
        recommended_suit_mode="Radiation Heavy Tungsten-Boron Exoskeleton",
        description="Subjected to Jupiter's brutal radiation belts. Vast subsurface ocean beneath 15-25 km icy crust."
    ),
    "Titan": Planet(
        name="Titan",
        display_title="Titan (Saturnian Cryo-Atmosphere)",
        surface_temp_base=-179.5,
        temp_range=[-182.0, -177.0],
        pressure_base=146.7,  # 1.45 Earth atm
        radiation_base=0.01,  # Thick atmosphere shields cosmic rays
        dust_base=80.0,
        solar_irradiance=15.0,
        gravity=1.352,
        magnetic_field=0.1,
        atmosphere={"N2": 97.0, "CH4": 2.7, "H2": 0.2, "Tholins": 0.1},
        resources=[
            {"name": "Liquid Hydrocarbon Seas (Kraken Mare)", "abundance": "Vast Ocean Pools", "utility": "Cryogenic Methane-Ethane Super-Fuel"},
            {"name": "Dense Nitrogen Atmosphere", "abundance": "Unlimited", "utility": "Buffer Gas, Low-Energy Flight Propulsion"},
            {"name": "Complex Organic Tholins", "abundance": "High", "utility": "Synthetic Polymer & Chemical Manufacturing"}
        ],
        recommended_suit_mode="Cryogenic Thermal Sub-Zero Insulator Layer-4",
        description="Dense orange photochemical smog, hydrocarbon rainfall, low gravity, and cryogenic liquid lakes."
    ),
    "Venus": Planet(
        name="Venus",
        display_title="Venus (Ishtar Terra / Upper Clouds)",
        surface_temp_base=464.0,
        temp_range=[440.0, 480.0],
        pressure_base=9200.0,  # 92 bar!
        radiation_base=0.05,
        dust_base=5200.0,
        solar_irradiance=2610.0,
        gravity=8.87,
        magnetic_field=0.05,
        atmosphere={"CO2": 96.5, "N2": 3.5, "SO2": 0.015},
        resources=[
            {"name": "Solar Irradiance Flux (Upper Cloud Base)", "abundance": "Super-Abundant", "utility": "High-Efficiency Aerostat Solar Arrays"},
            {"name": "Sulfuric Acid Cloud Droplets", "abundance": "High", "utility": "Sulfur & Water Catalytic Extraction"},
            {"name": "Atmospheric Super-Buoyancy", "abundance": "Continuous", "utility": "Floating Cloud Cities at 55km Altitude"}
        ],
        recommended_suit_mode="High-Pressure Aerostat Cloud-Layer IVA (55km alt)",
        description="Runaway greenhouse effect at surface; upper atmosphere (55km) exhibits Earth-like pressure and benign temperatures."
    ),
    "Enceladus": Planet(
        name="Enceladus",
        display_title="Enceladus (Tiger Stripe Geysers)",
        surface_temp_base=-201.0,
        temp_range=[-209.0, -190.0],
        pressure_base=0.000001,
        radiation_base=850.0,
        dust_base=120.0,
        solar_irradiance=15.0,
        gravity=0.113,
        magnetic_field=0.2,
        atmosphere={"H2O": 91.0, "N2": 4.0, "CO2": 3.2, "CH4": 1.7},
        resources=[
            {"name": "Cryovolcanic Geyser Plume Ejecta", "abundance": "Continuous Geysers", "utility": "Direct Flyby Water/Organic Sampling"},
            {"name": "Hydrothermal Silica Core Minerals", "abundance": "High Subsurface", "utility": "Mineral Catalysis & Nutrients"}
        ],
        recommended_suit_mode="Microgravity Tether Anchor Suit Mk-IX",
        description="South polar cryovolcanoes vent water vapor and ice crystals directly into Saturn's E-ring."
    )
}

class EnvironmentData(BaseModel):
    planet_name: str
    display_title: str
    surface_temp: float
    pressure: float
    radiation: float
    dust_density: float
    solar_irradiance: float
    atmosphere_composition: Dict[str, float]
    wind_speed: float
    gravity: float
    magnetic_field: float
    timestamp: str

class BioChipTelemetry(BaseModel):
    chip_id: str = "ATLAS-NEUROBIO-X1"
    firmware: str = "v4.9.2-RTOS"
    chip_temp: float
    impedance_kohm: float
    neural_latency_ms: float
    sweat_lactate_mmol: float
    sweat_electrolytes_na: float
    polling_rate_hz: int = 500
    connection_integrity: float = 99.8
    piezo_ecg_buffer: List[float]

class AstronautData(BaseModel):
    astronaut_id: str = "ARES-07 // CMDR. SHEPARD"
    heart_rate: float
    respiration_rate: float
    core_temperature: float
    spo2: float
    blood_pressure_systolic: float
    blood_pressure_diastolic: float
    hydration_level: float
    metabolic_rate: float
    suit_internal_pressure: float
    suit_o2_percentage: float
    suit_co2_level: float
    cooling_system_status: float
    battery_level: float
    comms_latency: float
    helmet_integrity: float
    glove_temperature_differential: float
    eva_duration: float
    alert_messages: List[str]
    status: str
    eva_margin: float
    bio_chip: BioChipTelemetry
    timestamp: str

class EnvPredictRequest(BaseModel):
    planet_name: str
    surface_temp: Optional[float] = None
    pressure: Optional[float] = None
    radiation: Optional[float] = None
    dust_density: Optional[float] = None

class SuitPredictRequest(BaseModel):
    heart_rate: float
    core_temperature: float
    hydration_level: float
    suit_internal_pressure: float
    battery_level: float

# Global client preference for active planet
CURRENT_ACTIVE_PLANET = "Mars"

@app.get("/api/planets")
async def get_planets():
    return list(PLANETS.values())

@app.post("/api/planets/select/{planet_name}")
async def select_planet(planet_name: str):
    global CURRENT_ACTIVE_PLANET
    if planet_name in PLANETS:
        CURRENT_ACTIVE_PLANET = planet_name
        return {"status": "success", "active_planet": planet_name}
    return {"status": "error", "message": "Planet not found"}

@app.websocket("/ws/environment")
async def websocket_environment(websocket: WebSocket, planet: Optional[str] = None):
    await websocket.accept()
    current_planet_key = planet if (planet and planet in PLANETS) else CURRENT_ACTIVE_PLANET
    try:
        while True:
            # Check if client sent an update command
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                data = json.loads(msg)
                if data.get("action") == "set_planet" and data.get("planet") in PLANETS:
                    current_planet_key = data.get("planet")
            except (asyncio.TimeoutError, json.JSONDecodeError):
                pass

            p = PLANETS.get(current_planet_key, PLANETS["Mars"])
            
            # Dynamic fluctuations
            cur_temp = p.surface_temp_base + random.uniform(-2.5, 2.5)
            cur_pressure = max(0.000001, p.pressure_base + random.uniform(-0.02, 0.02) * p.pressure_base)
            cur_rad = max(0.001, p.radiation_base + random.uniform(-0.03, 0.03) * p.radiation_base)
            cur_dust = max(0.0, p.dust_base + random.uniform(-15.0, 15.0))
            wind = random.uniform(2.0, 24.0) if p.pressure_base > 0.1 else 0.0

            env_msg = EnvironmentData(
                planet_name=p.name,
                display_title=p.display_title,
                surface_temp=round(cur_temp, 2),
                pressure=round(cur_pressure, 4),
                radiation=round(cur_rad, 4),
                dust_density=round(cur_dust, 1),
                solar_irradiance=round(p.solar_irradiance + random.uniform(-5.0, 5.0), 1),
                atmosphere_composition=p.atmosphere,
                wind_speed=round(wind, 1),
                gravity=p.gravity,
                magnetic_field=p.magnetic_field,
                timestamp=datetime.utcnow().isoformat() + "Z"
            )
            await websocket.send_text(env_msg.model_dump_json())
            await asyncio.sleep(1.5)
    except WebSocketDisconnect:
        pass

@app.websocket("/ws/astronaut")
async def websocket_astronaut(websocket: WebSocket):
    await websocket.accept()
    eva_duration = 2470.0  # T+ 00:41:10
    hydration = 84.0
    battery = 88.5
    
    # Generate ECG pulse waveform
    def generate_ecg_burst(hr: float):
        # returns 20 points of a cardiac cycle
        base = [0.0, 0.02, -0.01, 0.05, 0.12, -0.15, 1.25, -0.45, 0.05, 0.25, 0.18, 0.08, 0.02, 0.0, 0.0, 0.01, 0.0, -0.01, 0.0, 0.0]
        return [round(pt + random.uniform(-0.03, 0.03), 3) for pt in base]

    try:
        while True:
            eva_duration += 1.2
            hydration = max(40.0, hydration - 0.008)
            battery = max(15.0, battery - 0.012)

            hr = 94.0 + random.uniform(-4.0, 6.0)
            core_temp = 37.1 + random.uniform(-0.15, 0.25)
            o2_mix = 98.2 + random.uniform(-0.2, 0.1)
            suit_p = 4.31 + random.uniform(-0.02, 0.03)

            alerts = []
            if core_temp > 37.45:
                alerts.append("Thermal Drift Detected in Right Glove (+1.8°C)")
            if hr > 105:
                alerts.append("Metabolic Exertion Spike (>240W)")
            if battery < 30:
                alerts.append("PLSS Secondary Power Cell Low")

            status = "NOMINAL"
            if len(alerts) > 0:
                status = "CAUTION"
            if hr > 118 or suit_p < 4.10:
                status = "CRITICAL"

            # Dynamic margin forecast based on bio-factors
            margin = max(45.0, min(95.0, 78.0 + (battery - 80) * 0.2 - (hr - 90) * 0.15))

            chip = BioChipTelemetry(
                chip_temp=round(core_temp - 0.3 + random.uniform(-0.05, 0.05), 2),
                impedance_kohm=round(12.4 + random.uniform(-0.3, 0.3), 1),
                neural_latency_ms=round(3.8 + random.uniform(-0.2, 0.4), 1),
                sweat_lactate_mmol=round(1.4 + random.uniform(-0.1, 0.1), 2),
                sweat_electrolytes_na=round(48.2 + random.uniform(-0.8, 0.8), 1),
                polling_rate_hz=500,
                connection_integrity=99.8,
                piezo_ecg_buffer=generate_ecg_burst(hr)
            )

            astro = AstronautData(
                astronaut_id="ARES-07 // CMDR. SHEPARD",
                heart_rate=round(hr, 1),
                respiration_rate=round(21.0 + random.uniform(-1.5, 1.5), 1),
                core_temperature=round(core_temp, 2),
                spo2=round(98.4 + random.uniform(-0.4, 0.6), 1),
                blood_pressure_systolic=round(122 + random.uniform(-3, 3), 1),
                blood_pressure_diastolic=round(78 + random.uniform(-2, 2), 1),
                hydration_level=round(hydration, 1),
                metabolic_rate=round(240.0 + (hr - 90) * 4.5, 1),
                suit_internal_pressure=round(suit_p, 2),
                suit_o2_percentage=round(o2_mix, 1),
                suit_co2_level=round(0.042 + random.uniform(-0.005, 0.005), 3),
                cooling_system_status=round(82.0 + random.uniform(-2, 2), 1),
                battery_level=round(battery, 1),
                comms_latency=round(12.0 + random.uniform(-1, 2), 1),
                helmet_integrity=99.9,
                glove_temperature_differential=round(1.8 + random.uniform(-0.2, 0.2), 1),
                eva_duration=round(eva_duration, 1),
                alert_messages=alerts,
                status=status,
                eva_margin=round(margin, 1),
                bio_chip=chip,
                timestamp=datetime.utcnow().isoformat() + "Z"
            )

            await websocket.send_text(astro.model_dump_json())
            await asyncio.sleep(1.2)
    except WebSocketDisconnect:
        pass

@app.post("/api/predict/environment")
async def predict_environment(req: EnvPredictRequest):
    p = PLANETS.get(req.planet_name, PLANETS["Mars"])
    temp = req.surface_temp if req.surface_temp is not None else p.surface_temp_base
    pressure = req.pressure if req.pressure is not None else p.pressure_base
    rad = req.radiation if req.radiation is not None else p.radiation_base
    dust = req.dust_density if req.dust_density is not None else p.dust_base

    # Advanced Multi-Vector Habitability & In-Situ Score Calculation
    temp_factor = max(0.0, 100.0 - abs(temp - 15.0) * 0.7)
    press_factor = 100.0 if (70.0 <= pressure <= 120.0) else max(5.0, 100.0 - abs(pressure - 101.3) * 0.6)
    rad_factor = max(0.0, 100.0 - rad * 15.0)
    dust_factor = max(10.0, 100.0 - (dust / 30.0))

    habitability = round(float(np.clip(
        temp_factor * 0.25 + press_factor * 0.30 + rad_factor * 0.30 + dust_factor * 0.15,
        2.0, 99.0
    )), 1)

    # Risk synthesis
    rad_risk = "LOW" if rad < 0.1 else "MODERATE" if rad < 1.0 else "SEVERE" if rad < 50.0 else "LETHAL"
    thermal_risk = "NOMINAL" if (-20 <= temp <= 35) else "WARNING" if (-80 <= temp <= 70) else "EXTREME"
    atmos_risk = "LOW" if (50 <= pressure <= 150) else "HIGH (HYPOBARIC)" if pressure < 50 else "SUPERCRITICAL HIGH"
    dust_risk = "NOMINAL" if dust < 100 else "ELEVATED" if dust < 1000 else "SEVERE REGOLITH HAZARD"

    resource_recs = []
    for r in p.resources:
        score = random.randint(84, 98) if "Water" in r["name"] or "O2" in r["name"] else random.randint(72, 92)
        resource_recs.append({
            "resource_name": r["name"],
            "suitability_score": score,
            "extraction_method": r["utility"]
        })

    return {
        "planet": p.name,
        "habitability_score": habitability,
        "mission_margin_forecast": round(float(np.clip(habitability * 0.8 + 20, 30.0, 94.0)), 1),
        "confidence_level": 96.4,
        "recommended_suit_configuration": p.recommended_suit_mode,
        "resource_recommendations": resource_recs,
        "risk_assessment": {
            "radiation_hazard": rad_risk,
            "thermal_hazard": thermal_risk,
            "atmospheric_hazard": atmos_risk,
            "dust_hazard": dust_risk
        },
        "explainability_reasons": [
            f"Local magnetic shielding measures {p.magnetic_field} µT resulting in {rad_risk} radiation vector.",
            f"Atmosphere is primarily composed of {list(p.atmosphere.keys())[0]} ({list(p.atmosphere.values())[0]}%).",
            f"Thermal delta of {temp:.1f}°C dictates {p.recommended_suit_mode} active garment regulation.",
            f"In-Situ Resource extraction potential identified {len(resource_recs)} prioritized payloads."
        ]
    }

@app.post("/api/predict/suit")
async def predict_suit(req: SuitPredictRequest):
    status = "NOMINAL"
    issues = []
    if req.heart_rate > 105:
        issues.append("Metabolic Demand Surge (+18%)")
        status = "CAUTION"
    if req.battery_level < 35:
        issues.append("Primary O2 loop switchover shrinks ingress margin")
        status = "WARNING"
    if req.suit_internal_pressure < 4.10:
        issues.append("Suit Cabin Pressure Anomaly")
        status = "CRITICAL"

    return {
        "overall_status": status,
        "individual_system_assessments": {
            "cardiovascular": "ELEVATED" if req.heart_rate > 100 else "NOMINAL",
            "thermal_regulation": "DRIFT (+1.8°C)" if req.core_temperature > 37.3 else "NOMINAL",
            "power_reserves": "SUFFICIENT" if req.battery_level > 50 else "DRAINING",
            "pneumatics_gas_loop": "STABLE" if 4.2 <= req.suit_internal_pressure <= 4.45 else "ANOMALY"
        },
        "eva_operational_margin": round(float(np.clip(req.battery_level * 0.7 + (100 - (req.heart_rate - 70)) * 0.3, 30.0, 98.0)), 1),
        "recommended_actions": [
            "Order 10-minute mandatory rest stop at Waypoint Delta",
            "Activate sublimator economizer loop (-15% water consumption)",
            "Telemetry check: 78.4% nominal, consumption delta within limits"
        ],
        "time_to_critical_estimates": {
            "battery_hours": round(req.battery_level * 0.065, 2),
            "o2_hours": 4.12,
            "water_sublimator_hours": 3.85
        },
        "contingency_ingress_path": "Nominal ingress path Alpha-South recommended. Airlock hatch prep initiated."
    }

@app.get("/api/mission/status")
async def mission_status():
    return {
        "mission_name": "ARES-07 EVA-04",
        "sol_number": 184,
        "section_sector": "Sector Delta-9",
        "crew_member_name": "Cmdr. Shepard",
        "start_time": datetime.utcnow().isoformat() + "Z",
        "current_status": "NOMINAL",
        "eva_clock": "02:41:17 CURRENT",
        "propagation_lag_ms": 142
    }
