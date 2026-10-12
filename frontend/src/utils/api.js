const API_BASE = '/api';

export const predictEnvironment = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/predict/environment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error in predictEnvironment:', error);
    // Mock response for testing frontend without backend
    return {
      score: 87,
      resources: [
        { name: 'Water Ice', available: true, confidence: 92 },
        { name: 'Solar', available: true, confidence: 85 },
        { name: 'Geothermal', available: false, confidence: 10 }
      ],
      risks: {
        radiation: 'LOW',
        thermal: 'MODERATE',
        atmospheric: 'HIGH',
        dust: 'LOW'
      },
      margin: 94,
      explanation: 'Analysis indicates stable atmospheric pressure relative to local norm. Surface thermal anomalies within bounds.'
    };
  }
};

export const predictSuit = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/predict/suit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error in predictSuit:', error);
    return {
      convergenceMatrix: 'STABLE',
      synthesis: 'NOMINAL PREDICTIVE HORIZON',
      ingressRisk: 'LOW',
      contingency: 'STANDBY',
      margin: 78
    };
  }
};

export const getMissionStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/mission/status`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return {
      id: 'ATLAS-SAFE 2047',
      module: 'ARES-07 EVA-04',
      sol: 184,
      status: 'NOMINAL'
    };
  }
};

export const getPlanets = async () => {
  try {
    const response = await fetch(`${API_BASE}/planets`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return [
      { id: 'mars', name: 'Mars' },
      { id: 'europa', name: 'Europa' },
      { id: 'titan', name: 'Titan' },
      { id: 'venus', name: 'Venus' },
      { id: 'enceladus', name: 'Enceladus' }
    ];
  }
};
