// Global variables for storing JSON data
let municipalitiesData = null;
let stationsData = null;
let mapInitialized = false;
let mapIsReady = false; // <-- Add this line
const initialCenter = [-98.2063, 19.0414];
const initialZoom = 8.5;
let colorFilter = null;
let activeLayer = null;
let animationInterval = null;
let isPlaying = false;
let currentTimeStep = 0;
// MODIFICATION: Added a new global variable for your custom boundary data
let pueblaBoundaryData = null; 
let pueblaSimpleBoundaryData = null; // <-- Add this line

// ADDED: Historial functions
function createVariableToggles(type) {
    const container = document.getElementById('variable-toggles');
    container.innerHTML = '';
    selectedVariables.clear();
    
    const variables = type === 'meteo' ? meteorologicalVariables : airQualityVariables;
    
    Object.entries(variables).forEach(([key, config]) => {
        const toggle = document.createElement('div');
        toggle.className = 'variable-toggle active';
        toggle.dataset.variable = key;
        toggle.innerHTML = `
            <div class="icon">${config.icon}</div>
            <div class="label">${config.label}</div>
        `;
        
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            if (toggle.classList.contains('active')) {
                selectedVariables.add(key);
            } else {
                selectedVariables.delete(key);
            }
            updateHistoricalChart();
        });
        
        container.appendChild(toggle);
        selectedVariables.add(key);
    });
}

function destroyHistCharts(){
    if (currentHistCharts && currentHistCharts.length){
        currentHistCharts.forEach(ch => { try { ch.destroy(); } catch(e){} });
    }
    currentHistCharts = [];
}

function renderGroupedCharts(groups, labels, titlePrefix){
    const host = document.getElementById('chartsHost');
    if (!host) return;
    host.innerHTML = '';
    destroyHistCharts();

    groups.forEach((grp, idx) => {
        const card = document.createElement('div');
        card.className = 'chart-card';
        const cv = document.createElement('canvas');
        card.appendChild(cv);
        host.appendChild(card);

        const chart = new Chart(cv.getContext('2d'), {
            type: 'line',
            data: { labels, datasets: grp },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: titlePrefix }
                },
                scales: {
                    y: { beginAtZero: false },
                    x: { ticks: { autoSkip: true, maxRotation: 0 } }
                }
            }
        });
        currentHistCharts.push(chart);
    });
}

async function loadHistoricalCabeceras() {
    try {
        if (!municipalitiesData) return;

        const select = document.getElementById('hist-cabecera-select');
        select.innerHTML = '<option value="">Seleccione un municipio</option>';
        
        const cabeceras = municipalitiesData.features
            .sort((a, b) => a.properties.nombre.localeCompare(b.properties.nombre));

        cabeceras.forEach(feature => {
            const option = document.createElement('option');
            option.value = feature.properties.clave;
            option.textContent = feature.properties.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando cabeceras:', error);
    }
}
        // Load JSON data
// REPLACE this function
async function loadJSONData() {
    try {
        // MODIFICATION: Added your 'puebla_state_boundary.json' to the files being fetched
        const [municipalitiesResponse, stationsResponse, pueblaResponse, pueblaStateResponse] = await Promise.all([
            fetch('./cabeceras.json'),
            fetch('./estaciones.json'),
            fetch('./puebla_coordinates.json'),
            fetch('./puebla_state_boundary.json') // <-- Add this line for your new file
        ]);
        
        municipalitiesData = await municipalitiesResponse.json();
        stationsData = await stationsResponse.json();
        pueblaBoundaryData = await pueblaResponse.json(); 
        pueblaSimpleBoundaryData = await pueblaStateResponse.json(); // <-- Store the new data
        
        console.log('JSON data loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        showNotification('Error cargando datos de municipios', 'error');
        return false;
    }
}

// Enhanced function to add realistic air quality data to municipalities
function enrichMunicipalityData(municipality) {
    const coords = municipality.geometry.coordinates;
    const lng = coords[0];
    const lat = coords[1];
    
    let baseMultiplier = 1;
    
    const majorCities = ['Heroica Puebla de Zaragoza', 'TehuacÃ¡n', 'Atlixco', 'San MartÃ­n Texmelucan de Labastida'];
    if (majorCities.some(city => municipality.properties.nombre.includes(city.split(' ')[0]))) {
        baseMultiplier = 2.5;
    }
    
    const distanceFromCenter = Math.sqrt(Math.pow(lat - 19.04, 2) + Math.pow(lng + 98.2, 2));
    const urbanEffect = Math.max(0.5, 2 - distanceFromCenter * 2);
    
    const randomFactor = 0.8 + Math.random() * 0.4;
    const multiplier = baseMultiplier * urbanEffect * randomFactor;
    
    return {
        ...municipality.properties,
        population: estimatePopulation(municipality.properties.nombre),
        airQuality: {
            co: Math.round((0.5 + Math.random() * 2) * multiplier * 10) / 10,
            no2: Math.round((0.1 + Math.random() * 0.8) * multiplier * 10) / 10,
            o3: Math.round((5 + Math.random() * 15) * multiplier * 10) / 10,
            so2: Math.round(Math.random() * 0.3 * multiplier * 10) / 10,
            pm10: Math.round((0.05 + Math.random() * 0.4) * multiplier * 100) / 100,
            pm25: Math.round((0.02 + Math.random() * 0.2) * multiplier * 100) / 100
        }
    };
}

// Estimate population based on city name and type
function estimatePopulation(cityName) {
    const majorCities = {
        'Heroica Puebla de Zaragoza': 1576259,
        'TehuacÃ¡n': 274906,
        'Atlixco': 127062,
        'San MartÃ­n Texmelucan de Labastida': 141112
    };
    
    for (const [name, pop] of Object.entries(majorCities)) {
        if (cityName.includes(name.split(' ')[0])) {
            return pop;
        }
    }
    
    if (cityName.includes('Ciudad de')) {
        return 50000 + Math.random() * 100000;
    } else if (cityName.includes('San ') || cityName.includes('Santa ')) {
        return 20000 + Math.random() * 60000;
    } else {
        return 10000 + Math.random() * 40000;
    }
}



// REPLACE this function to use your new file
function getSimplifiedPueblaStateBoundary() {
    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": pueblaSimpleBoundaryData // Use the data loaded from your new file
        }
    };
}

// More accurate Puebla state boundary coordinates
// NEW, CORRECTED FUNCTION
function getAccuratePueblaStateBoundary() {
    // This adds the extra layer of nesting required for a valid GeoJSON MultiPolygon
    const validMultiPolygonCoords = pueblaBoundaryData.map(linearRing => [linearRing]);

    return {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": { "name": "Puebla" },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": validMultiPolygonCoords // Use the new, correctly formatted data
            }
        }]
    };
}
// Add this new helper function
// UPDATED FUNCTION
function getPueblaBoundingBox() {
    // Using the simple boundary is much faster for this.
    const coords = getSimplifiedPueblaStateBoundary().geometry.coordinates[0];
    
    let minLng = coords[0][0], maxLng = coords[0][0];
    let minLat = coords[0][1], maxLat = coords[0][1];

    for (const coord of coords) {
        if (coord[0] < minLng) minLng = coord[0];
        if (coord[0] > maxLng) maxLng = coord[0];
        if (coord[1] < minLat) minLat = coord[1];
        if (coord[1] > maxLat) maxLat = coord[1];
    }
    
    return [[minLng - 0.1, minLat - 0.1], [maxLng + 0.1, maxLat + 0.1]];
}


// UPDATED FUNCTION
function addMapMask() {
    // This now uses the simple boundary, which will work correctly.
    const pueblaBoundary = getSimplifiedPueblaStateBoundary().geometry.coordinates[0];
    const worldWithPueblaHole = [
        [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
        pueblaBoundary
    ];

    map.addSource('puebla-mask', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': worldWithPueblaHole
            }
        }
    });

    map.addLayer({
        'id': 'puebla-mask-layer',
        'type': 'fill',
        'source': 'puebla-mask',
        'layout': {},
        'paint': {
            'fill-color': '#000',
            'fill-opacity': 0.7 
        }
    });
}

// UPDATED FUNCTION
function addAccuratePueblaStateBoundary() {
    // SOURCE 1: The detailed MultiPolygon for the borders (your original file)
    map.addSource('puebla-municipalities-boundary', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: pueblaBoundaryData.map(ring => [ring])
            }
        }
    });

    // SOURCE 2: The simple Polygon for the fast-rendering fill
    map.addSource('puebla-simple-boundary', {
        type: 'geojson',
        data: getSimplifiedPueblaStateBoundary()
    });
    
    // LAYER 1: The transparent fill based on the SIMPLE source
    map.addLayer({
        id: 'puebla-fill',
        type: 'fill',
        source: 'puebla-simple-boundary', // Use simple source
        paint: {
            'fill-color': 'rgba(90, 27, 48, 0.08)',
            'fill-opacity': 1 // Opacity can be 1 since color has alpha
        }
    });

    // LAYER 2: The border lines based on the DETAILED source
    map.addLayer({
        id: 'puebla-border',
        type: 'line',
        source: 'puebla-municipalities-boundary', // Use detailed source
        paint: {
            'line-color': '#FFFFFF',
            'line-width': 1.5, // Made it slightly thinner
            'line-opacity': 0.6
        }
    });
}

// Updated function to add municipalities from JSON
function addPueblaMunicipalities() {
    if (!municipalitiesData) {
        console.error('Municipality data not loaded');
        return;
    }

    const enrichedFeatures = municipalitiesData.features.map(feature => ({
        ...feature,
        properties: enrichMunicipalityData(feature)
    }));

    const enrichedData = {
        ...municipalitiesData,
        features: enrichedFeatures
    };

    map.addSource('puebla-municipalities', {
        type: 'geojson',
        data: enrichedData
    });

    map.addLayer({
        id: 'municipality-points',
        type: 'circle',
        source: 'puebla-municipalities',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'population'],
                10000, 4,
                50000, 8,
                100000, 12,
                500000, 16,
                1500000, 20
            ],
            'circle-color': '#c19862', // Use fixed color instead of complex expression
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            'circle-opacity': 0.8
        }
    });

    map.addLayer({
        id: 'municipality-labels',
        type: 'symbol',
        source: 'puebla-municipalities',
        layout: {
            'text-field': ['get', 'nombre'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': [
                'interpolate',
                ['linear'],
                ['get', 'population'],
                10000, 10,
                50000, 12,
                100000, 14,
                500000, 16,
                1500000, 18
            ],
            'text-offset': [0, 2.5],
            'text-anchor': 'top'
        },
        paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 2
        }
    });

    map.on('click', 'municipality-points', (e) => {
        console.log('Municipality clicked:', e.features[0]); // Debug log
        const properties = e.features[0].properties;
        console.log('Properties:', properties); // Debug log
        showMunicipalityModal(properties);
    });

    map.on('mouseenter', 'municipality-points', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'municipality-points', () => {
        map.getCanvas().style.cursor = '';
    });
}

// Add monitoring stations from JSON
function addMonitoringStations() {
    if (!stationsData) {
        console.error('Stations data not loaded');
        return;
    }

    map.addSource('monitoring-stations', {
        type: 'geojson',
        data: stationsData
    });

    map.addLayer({
        id: 'station-points',
        type: 'circle',
        source: 'monitoring-stations',
        paint: {
            'circle-radius': 8,
            'circle-color': '#5a1b30',
            'circle-stroke-color': '#c19862',
            'circle-stroke-width': 3,
            'circle-opacity': 0.9
        }
    });

    map.addLayer({
        id: 'station-labels',
        type: 'symbol',
        source: 'monitoring-stations',
        layout: {
            'text-field': ['get', 'nombre'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-offset': [0, -2.5],
            'text-anchor': 'bottom'
        },
        paint: {
            'text-color': '#5a1b30',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
        }
    });

    map.on('click', 'station-points', (e) => {
        const properties = e.features[0].properties;
        showStationModal(properties);
    });
}
//--------------------------------------------------------------------------
// Mapeo de claves para meteorología y calidad del aire
const meteoKeyMap = {
    t2m: 'temperature',
    rh: 'humidity',
    psl: 'pressure',
    wnd: 'wind',
    pre: 'precipitation',
    sw: 'radiation'
};
const chemKeyMap = {
    CO: 'co',
    NO2: 'no2',
    O3: 'o3',
    SO2: 'so2',
    PM10: 'pm10',
    PM25: 'pm25'
};

// ---- MODAL MUNICIPIO PROFESIONAL ----
function showMunicipalityModal(properties) {
    const modal = document.getElementById('municipalityModal');
    const title = document.getElementById('modalTitle');
    const summary = document.getElementById('pollutantSummary');
    const chartsContainer = document.getElementById('modalChartsHost');
    if (chartsContainer) chartsContainer.innerHTML = '';

    title.textContent = properties.nombre;
    summary.innerHTML = '';

    // Detecta tipo de mapa y variables
    const tipo = tipoMapa === 'meteorologia' ? 'meteo' : 'calidad';
    const variables = tipo === 'meteo' ? meteorologicalVariables : airQualityVariables;
    const keyMap = tipo === 'meteo' ? meteoKeyMap : chemKeyMap;

    // Obtén las variables seleccionadas si existen, si no usa todas
    const selected = (typeof selectedVariables !== 'undefined' && selectedVariables.size)
        ? Array.from(selectedVariables).filter(v => variables[v])
        : Object.keys(variables);

    // Obtiene coordenadas (si existen en geometry, si no lat/lng)
    let coords;
    if (properties.geometry && properties.geometry.coordinates) {
        coords = properties.geometry.coordinates;
    } else if (properties.lat && properties.lng) {
        coords = [properties.lng, properties.lat];
    } else {
        // fallback (no debería pasar)
        coords = [-98.2063, 19.0414];
    }
    const lat = coords[1];
    const lng = coords[0];

    // --- 1. Tarjetas de resumen de promedios ---
    selected.forEach(key => {
        const config = variables[key];
        const weatherKey = keyMap[key];
        if (!weatherKey || !weatherLayers[weatherKey]) return; // Salta si no existe

        // Obtén el valor promedio del municipio (simula con la función del mapa)
        const value = generateRealisticValue(weatherKey, lat, lng, 0, 0);

        // Si tienes thresholds, puedes usarlos para el semáforo
        let qualityLevel = 'good';
        // Define thresholds por variable si quieres semáforo (ejemplo para aire)
        const thresholds = {
            co: { good: 1, moderate: 2, bad: 3 },
            no2: { good: 0.3, moderate: 0.6, bad: 1.0 },
            o3: { good: 8, moderate: 15, bad: 25 },
            so2: { good: 0.1, moderate: 0.2, bad: 0.5 },
            pm10: { good: 0.15, moderate: 0.3, bad: 0.5 },
            pm25: { good: 0.1, moderate: 0.2, bad: 0.3 }
        };
        const th = thresholds[weatherKey] || { good: 0.4, moderate: 0.7, bad: 1.1 };
        if (value > th.bad) qualityLevel = 'bad';
        else if (value > th.moderate) qualityLevel = 'moderate';

        const qualityColors = {
            good: '#00b894',
            moderate: '#fdcb6e',
            bad: '#d63031'
        };

        // Tarjeta resumen visual
        const item = document.createElement('div');
        item.className = 'pollutant-item';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '10px';
        item.innerHTML = `
            <div class="pollutant-color" style="background-color:${qualityColors[qualityLevel]};width:24px;height:24px;border-radius:50%;"></div>
            <div class="pollutant-info" style="flex:1;">
                <div class="pollutant-name" style="font-weight:bold;">${config.icon} ${config.label} (${config.unit})</div>
                <div class="pollutant-value" style="font-size:1.1em;color:#333;">${value.toFixed(2)}</div>
            </div>
        `;
        summary.appendChild(item);
    });

    // --- 2. Gráficas limpias y profesionales ---
    selected.forEach(key => {
        const config = variables[key];
        const weatherKey = keyMap[key];
        if (!weatherKey || !weatherLayers[weatherKey]) return;

        // Genera 24 datos horarios con la función del mapa
        const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
        const dataValues = [];
        for (let hour = 0; hour < 24; hour++) {
            const timeStep = hour;
            const timeVariation = Math.sin(timeStep * 0.3) * 0.3;
            dataValues.push(
                generateRealisticValue(weatherKey, lat, lng, timeStep, timeVariation)
            );
        }

        // Crea una gráfica por variable (profesional, solo una variable por chart)
        createSingleVariableChart(
            chartsContainer,
            config,
            timeLabels,
            dataValues,
            properties.nombre
        );
    });

    window.currentMunicipality = properties;
    modal.style.display = 'flex';
}

// Gráfica profesional por variable (solo una por chart, limpia)
function createSingleVariableChart(container, config, labels, data, municipioName) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    card.style.flex = '1 1 350px';
    card.style.minWidth = '320px';
    card.style.maxWidth = '500px';
    card.style.background = '#fff';
    card.style.borderRadius = '12px';
    card.style.padding = '16px';
    card.style.boxShadow = '0 3px 12px rgba(0,0,0,0.08)';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.marginBottom = '12px';

    const header = document.createElement('div');
    header.style.marginBottom = '8px';
    header.innerHTML = `<span style="font-size:1.3em">${config.icon}</span> <strong>${config.label}</strong> <span style="color:#666">(${config.unit})</span>`;
    card.appendChild(header);

    const canvas = document.createElement('canvas');
    canvas.height = 220;
    card.appendChild(canvas);
    container.appendChild(card);

    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${config.label} (${config.unit})`,
                data: data,
                borderColor: config.color,
                backgroundColor: hexToRgba(config.color, 0.08),
                borderWidth: 3,
                pointRadius: 3,
                pointBackgroundColor: config.color,
                pointBorderColor: '#fff',
                fill: true,
                tension: 0.32,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: '#efefef' },
                    ticks: { color: '#444', font: { size: 13 } },
                    title: { display: true, text: config.unit, color: '#444', font: { weight: 'bold' } }
                },
                x: {
                    grid: { color: '#f6f6f6' },
                    ticks: { color: '#888', font: { size: 11 } },
                    title: { display: true, text: 'Hora del día', color: '#888', font: { weight: 'bold' } }
                }
            },
            elements: {
                line: { tension: 0.32 }
            }
        }
    });
}

// Utilidad para color rgba
function hexToRgba(hex, alpha) {
    // hex: #RRGGBB
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return hex;
    return `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${alpha})`;
}
//---------------------------------------------------------------------------


// Enhanced chart creation with realistic data patterns
function createEnhancedPollutantChart(pollutants, cityName) {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        showNotification('Error: Chart.js no está disponible', 'error');
        return;
    }

    const ctx = document.getElementById('pollutantChart').getContext('2d');
    
    // Destroy existing chart if it exists and has destroy method
    if (window.pollutantChart && typeof window.pollutantChart.destroy === 'function') {
        window.pollutantChart.destroy();
    }
    
    const timeLabels = [];
    const datasets = [];
    
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0') + ':00';
        timeLabels.push(hour);
    }
    
    pollutants.forEach(pollutant => {
        const data = generateRealistic24HourData(pollutant);
        
        datasets.push({
            label: `${pollutant.name} (${pollutant.unit})`,
            data: data,
            borderColor: pollutant.color,
            backgroundColor: pollutant.color + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: pollutant.color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4
        });
    });
    
    window.pollutantChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Niveles de Contaminantes - ${cityName}`,
                    font: { size: 16, weight: 'bold' },
                    color: '#5a1b30'
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Concentración',
                        color: '#666'
                    },
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Hora del día',
                        color: '#666'
                    },
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    });
}

// Generate realistic 24-hour pollution data patterns
function generateRealistic24HourData(pollutant) {
    const data = [];
    const baseValue = pollutant.value;
    
    for (let hour = 0; hour < 24; hour++) {
        let multiplier = 1;
        
        if (hour >= 6 && hour <= 9) {
            multiplier = 1.4; // Morning rush
        } else if (hour >= 17 && hour <= 20) {
            multiplier = 1.3; // Evening rush
        } else if (hour >= 22 || hour <= 5) {
            multiplier = 0.7; // Night time
        }
        
        const variation = 0.8 + Math.random() * 0.4;
        const noiseFactor = Math.sin(hour * 0.5) * 0.1 + 1;
        
        let value = baseValue * multiplier * variation * noiseFactor;
        value = Math.max(value, baseValue * 0.3);
        
        if (pollutant.unit === 'ppm' || pollutant.unit === 'ppb') {
            value = Math.round(value * 10) / 10;
        } else {
            value = Math.round(value * 100) / 100;
        }
        
        data.push(value);
    }
    
    return data;
}

// Enhanced CSV download with proper data structure
function downloadMunicipalityCSV(properties) {
    const airQuality = typeof properties.airQuality === 'string' 
        ? JSON.parse(properties.airQuality) 
        : properties.airQuality;
    
    const csvContent = [
        ['Municipio', 'Población', 'Contaminante', 'Concentración', 'Unidad'],
        [properties.nombre, properties.population, 'Monóxido de Carbono', airQuality.co, 'ppm'],
        [properties.nombre, properties.population, 'Dióxido de Nitrógeno', airQuality.no2, 'ppb'],
        [properties.nombre, properties.population, 'Ozono', airQuality.o3, 'ppb'],
        [properties.nombre, properties.population, 'Dióxido de Azufre', airQuality.so2, 'ppb'],
        [properties.nombre, properties.population, 'PM 10', airQuality.pm10, 'μg/m³'],
        [properties.nombre, properties.population, 'PM 2.5', airQuality.pm25, 'μg/m³']
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calidad_aire_${properties.nombre.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Weather layers configuration
const weatherLayers = {
    temperature: { 
        name: 'Temperatura', 
        unit: '°C', 
        gradient: 'linear-gradient(to right, #1e3c72, #2a5298, #74b9ff, #00b894, #fdcb6e, #e17055, #d63031)', 
        range: [-10, 40],
        heatmapColors: [
            0, 'rgba(30, 60, 114, 0)',
            0.1, '#1e3c72',
            0.3, '#2a5298', 
            0.5, '#74b9ff',
            0.7, '#fdcb6e',
            0.9, '#e17055',
            1, '#d63031'
        ]
    },
    humidity: { 
        name: 'Humedad', 
        unit: '%', 
        gradient: 'linear-gradient(to right, #dfe6e9, #74b9ff, #0984e3, #2d3436)', 
        range: [0, 100],
        heatmapColors: [
            0, 'rgba(223, 230, 233, 0)',
            0.3, '#dfe6e9',
            0.6, '#74b9ff',
            0.8, '#0984e3',
            1, '#2d3436'
        ]
    },
    precipitation: { 
        name: 'Precipitación', 
        unit: 'mm', 
        gradient: 'linear-gradient(to right, #f8f9fa, #74b9ff, #0984e3, #2d3436)', 
        range: [0, 100],
        heatmapColors: [
            0, 'rgba(248, 249, 250, 0)',
            0.2, '#f8f9fa',
            0.4, '#74b9ff',
            0.7, '#0984e3',
            1, '#2d3436'
        ]
    },
    wind: { 
        name: 'Viento', 
        unit: 'km/h', 
        gradient: 'linear-gradient(to right, #f8f9fa, #fdcb6e, #e17055, #d63031, #74b9ff)', 
        range: [0, 150],
        heatmapColors: [
            0, 'rgba(248, 249, 250, 0)',
            0.2, '#f8f9fa',
            0.4, '#fdcb6e',
            0.6, '#e17055',
            0.8, '#d63031',
            1, '#74b9ff'
        ]
    },
    pressure: { 
        name: 'Presión', 
        unit: 'hPa', 
        gradient: 'linear-gradient(to right, #6c5ce7, #a29bfe, #fd79a8, #fdcb6e, #00b894)', 
        range: [980, 1040],
        heatmapColors: [
            0, 'rgba(108, 92, 231, 0)',
            0.25, '#6c5ce7',
            0.5, '#a29bfe',
            0.75, '#fdcb6e',
            1, '#00b894'
        ]
    },
    radiation: { 
        name: 'Radiación', 
        unit: 'W/m²', 
        gradient: 'linear-gradient(to right, #2d3436, #636e72, #fdcb6e, #e17055, #fff)', 
        range: [0, 1000],
        heatmapColors: [
            0, 'rgba(45, 52, 54, 0)',
            0.2, '#2d3436',
            0.4, '#636e72',
            0.6, '#fdcb6e',
            0.8, '#e17055',
            1, '#ffffff'
        ]
    },
    co: { 
        name: 'Monóxido de Carbono', 
        unit: 'ppm', 
        gradient: 'linear-gradient(to right, #00b894, #fdcb6e, #e17055, #d63031, #2d3436)', 
        range: [0, 10],
        heatmapColors: [
            0, 'rgba(0, 184, 148, 0)',
            0.25, '#00b894',
            0.5, '#fdcb6e',
            0.75, '#e17055',
            1, '#d63031'
        ]
    },
    no2: { 
        name: 'Dióxido de Nitrógeno', 
        unit: 'ppb', 
        gradient: 'linear-gradient(to right, #74b9ff, #0984e3, #fdcb6e, #e17055, #d63031)', 
        range: [0, 200],
        heatmapColors: [
            0, 'rgba(116, 185, 255, 0)',
            0.25, '#74b9ff',
            0.5, '#0984e3',
            0.75, '#e17055',
            1, '#d63031'
        ]
    },
    o3: { 
        name: 'Ozono', 
        unit: 'ppb', 
        gradient: 'linear-gradient(to right, #a29bfe, #6c5ce7, #fd79a8, #e84393, #2d3436)', 
        range: [0, 150],
        heatmapColors: [
            0, 'rgba(162, 155, 254, 0)',
            0.25, '#a29bfe',
            0.5, '#6c5ce7',
            0.75, '#e84393',
            1, '#2d3436'
        ]
    },
    pm25: { 
        name: 'PM2.5', 
        unit: 'μg/m³', 
        gradient: 'linear-gradient(to right, #00b894, #fdcb6e, #e17055, #d63031, #2d3436)', 
        range: [0, 200],
        heatmapColors: [
            0, 'rgba(0, 184, 148, 0)',
            0.2, '#00b894',
            0.4, '#fdcb6e',
            0.6, '#e17055',
            0.8, '#d63031',
            1, '#2d3436'
        ]
    }
};

// Generate smooth, interpolated weather data
function generateSmoothWeatherData(type, timeStep = 0) {
    const data = [];
    const gridSize = 50;
    const range = weatherLayers[type].range;
    
    const pueblaBounds = {
        minLat: 17.6,
        maxLat: 20.4,
        minLng: -99.1,
        maxLng: -96.9
    };
    
    const weatherCenters = [
        { lat: 19.0414, lng: -98.2063, intensity: 0.8 },
        { lat: 18.4622, lng: -97.3953, intensity: 0.6 },
        { lat: 19.9311, lng: -97.9578, intensity: 0.7 },
        { lat: 18.9117, lng: -98.4307, intensity: 0.5 }
    ];
    
    const timeVariation = Math.sin(timeStep * 0.2) * 0.3;
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const lat = pueblaBounds.minLat + (i / gridSize) * (pueblaBounds.maxLat - pueblaBounds.minLat);
            const lng = pueblaBounds.minLng + (j / gridSize) * (pueblaBounds.maxLng - pueblaBounds.minLng);
            
            if (isPointInPueblaAccurate(lat, lng)) {
                let value = generateSmootherValue(type, lat, lng, timeStep, timeVariation, weatherCenters);
                value = Math.max(range[0], Math.min(range[1], value));
                
                if (colorFilter && !isValueInColorFilter(value, range)) {
                    continue;
                }
                
                data.push({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [lng, lat] },
                    properties: { 
                        value: value, 
                        intensity: (value - range[0]) / (range[1] - range[0]),
                        weight: Math.random() * 0.5 + 0.5
                    }
                });
            }
        }
    }
    return { type: 'FeatureCollection', features: data };
}

function isValueInColorFilter(value, range) {
    if (!colorFilter) return true;
    const normalizedValue = (value - range[0]) / (range[1] - range[0]);
    return normalizedValue >= colorFilter.min && normalizedValue <= colorFilter.max;
}

function generateSmootherValue(type, lat, lng, timeStep, timeVariation, weatherCenters) {
    const range = weatherLayers[type].range;
    let baseValue = range[0] + (range[1] - range[0]) * 0.5;
    
    let centerInfluence = 0;
    weatherCenters.forEach(center => {
        const distance = Math.sqrt(
            Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2)
        );
        const influence = center.intensity * Math.exp(-distance * 5);
        centerInfluence += influence;
    });
    
    const altitudeEffect = (lat - 18.5) * 0.1;
    const coastDistance = Math.abs(lng + 97.5);
    
    const noise1 = Math.sin(lat * 5 + lng * 4 + timeStep * 0.3) * 0.2;
    const noise2 = Math.sin(lat * 8 + lng * 6 + timeStep * 0.5) * 0.1;
    const noise3 = Math.sin(lat * 12 + lng * 10 + timeStep * 0.7) * 0.05;
    const totalNoise = noise1 + noise2 + noise3;
    
    switch (type) {
        case 'temperature':
            baseValue = 22 + altitudeEffect * -2 + centerInfluence * 5 + timeVariation * 6 + totalNoise * 4;
            break;
        case 'humidity':
            baseValue = 60 + coastDistance * -8 + centerInfluence * 15 + timeVariation * 15 + totalNoise * 10;
            break;
        case 'precipitation':
            baseValue = Math.max(0, 3 + centerInfluence * 20 + timeVariation * 25 + totalNoise * 15);
            break;
        case 'wind':
            baseValue = 12 + centerInfluence * 10 + Math.abs(timeVariation) * 15 + totalNoise * 8;
            break;
        case 'pressure':
            baseValue = 1013 + altitudeEffect * -3 + centerInfluence * 8 + timeVariation * 10 + totalNoise * 5;
            break;
        case 'radiation':
            baseValue = 500 + centerInfluence * 200 + timeVariation * 250 + totalNoise * 100;
            break;
        default:
            baseValue = baseValue + centerInfluence * (range[1] - range[0]) * 0.4 + 
                               timeVariation * (range[1] - range[0]) * 0.25 + 
                               totalNoise * (range[1] - range[0]) * 0.15;
    }
    
    return baseValue;
}

// Replace the old function with this one
// NEW, CORRECTED FUNCTION
// UPDATED FUNCTION
function isPointInPueblaAccurate(lat, lng) {
    // This is the biggest performance fix: check against one simple shape, not hundreds.
    const polygonBoundary = getSimplifiedPueblaStateBoundary().geometry.coordinates[0];
    let inside = false;
    for (let i = 0, j = polygonBoundary.length - 1; i < polygonBoundary.length; j = i++) {
        const xi = polygonBoundary[i][0], yi = polygonBoundary[i][1];
        const xj = polygonBoundary[j][0], yj = polygonBoundary[j][1];
        
        const intersect = ((yi > lat) !== (yj > lat))
            && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}
        
// REPLACE this entire function
function addEnhancedWeatherLayer(type) {
    if (!map || !mapIsReady) { return; } 

    if (activeLayer) {
        if (map.getLayer(activeLayer)) map.removeLayer(activeLayer);
        if (map.getLayer(activeLayer + '-points')) map.removeLayer(activeLayer + '-points');
        if (map.getSource(activeLayer)) map.removeSource(activeLayer);
    }
    
    const layerConfig = weatherLayers[type];
    const data = generateSmoothWeatherData(type, currentTimeStep);
    
    map.addSource(type, { type: 'geojson', data: data });
    
    // This layer draws the main heatmap
    map.addLayer({
        id: type,
        type: 'heatmap',
        source: type,
        paint: {
            'heatmap-weight': ['interpolate',['linear'],['get', 'weight'],0, 0.1,1, 1],
            'heatmap-intensity': ['interpolate',['exponential', 1.5],['zoom'],6, 0.8,10, 1.2,14, 1.8],
            'heatmap-color': ['interpolate',['linear'],['heatmap-density'],...layerConfig.heatmapColors],
            'heatmap-radius': ['interpolate',['exponential', 1.75],['zoom'],6, 25,10, 45,14, 80],
            'heatmap-opacity': ['interpolate',['linear'],['zoom'],6, 0.9,10, 0.8,14, 0.7]
        }
    }, 'puebla-border'); // <-- THE FIX: Draw heatmap UNDER the red borders

    // This layer draws the small circles when you zoom in
    map.addLayer({
        id: type + '-points',
        type: 'circle',
        source: type,
        minzoom: 10,
        paint: {
            'circle-radius': ['interpolate',['linear'],['zoom'],10, 2,14, 4],
            'circle-color': ['interpolate',['linear'],['get', 'intensity'],0, layerConfig.heatmapColors[1],1, layerConfig.heatmapColors[layerConfig.heatmapColors.length - 1]],
            'circle-opacity': ['interpolate',['linear'],['zoom'],10, 0.3,14, 0.6],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.2
        }
    }, 'puebla-border'); // <-- ALSO FIX: Draw points UNDER the red borders
    
    activeLayer = type;
    updateLegend(layerConfig);
    updateDataPanel(type);
}
        
function updateLegend(config) {
    const legend = document.getElementById('legend');
    legend.style.display = 'block';
    legend.querySelector('.legend-title').textContent = config.name;
    legend.querySelector('.legend-gradient').style.background = config.gradient;
    
    const labels = legend.querySelector('.legend-labels');
    labels.innerHTML = '';
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        const value = config.range[0] + (config.range[1] - config.range[0]) * (i / steps);
        const span = document.createElement('span');
        span.textContent = `${value.toFixed(0)}${i === steps ? " "+config.unit : ''}`;
        labels.appendChild(span);
    }
}

function updateDataPanel(type = 'temperature') {
    const config = weatherLayers[type] || weatherLayers.temperature;
    const centerLat = 19.0414;
    const centerLng = -98.2063;
    const timeVariation = Math.sin(currentTimeStep * 0.3) * 0.3;
    
    const tempValue = generateRealisticValue('temperature', centerLat, centerLng, currentTimeStep, timeVariation);
    const humidityValue = generateRealisticValue('humidity', centerLat, centerLng, currentTimeStep, timeVariation);
    const windValue = generateRealisticValue('wind', centerLat, centerLng, currentTimeStep, timeVariation);
    const pressureValue = generateRealisticValue('pressure', centerLat, centerLng, currentTimeStep, timeVariation);
    
    document.getElementById('tempValue').textContent = `${tempValue.toFixed(1)}°C`;
    document.getElementById('humidityValue').textContent = `${Math.max(0, Math.min(100, humidityValue)).toFixed(0)}%`;
    document.getElementById('windValue').textContent = `${Math.max(0, windValue).toFixed(1)} km/h`;
    document.getElementById('pressureValue').textContent = `${pressureValue.toFixed(0)} hPa`;
}

function generateRealisticValue(type, lat, lng, timeStep, timeVariation) {
    const range = weatherLayers[type].range;
    const baseValue = range[0] + (range[1] - range[0]) * 0.5;
    
    const altitudeEffect = (lat - 18.5) * 0.1;
    const coastDistance = Math.abs(lng + 97.5);
    
    const noise1 = Math.sin(lat * 10 + lng * 8 + timeStep * 0.5) * 0.3;
    const noise2 = Math.cos(lat * 7 + lng * 12 + timeStep * 0.3) * 0.2;
    
    let value = baseValue;
    
    switch (type) {
        case 'temperature':
            value = 22 + altitudeEffect * -3 + coastDistance * 2 + timeVariation * 8 + noise1 * 5;
            break;
        case 'humidity':
            value = 60 + coastDistance * -10 + altitudeEffect * 5 + timeVariation * 20 + noise1 * 15;
            break;
        case 'precipitation':
            value = Math.max(0, 5 + altitudeEffect * 10 + timeVariation * 30 + noise1 * 20);
            break;
        case 'wind':
            value = 15 + coastDistance * 5 + Math.abs(timeVariation) * 20 + noise1 * 10;
            break;
        case 'pressure':
            value = 1013 + altitudeEffect * -5 + timeVariation * 15 + noise1 * 8;
            break;
        case 'radiation':
            value = 500 + timeVariation * 300 + noise1 * 100;
            break;
        default:
            value = baseValue + timeVariation * (range[1] - range[0]) * 0.3 + noise1 * (range[1] - range[0]) * 0.2;
    }
    
    return value;
}

function startAnimation() {
    if (isPlaying || !activeLayer) return;
    isPlaying = true;
    document.getElementById('playIcon').classList.replace('fa-play', 'fa-pause');
    
    const speed = 2100 - document.getElementById('speedSlider').value;
    
    animationInterval = setInterval(() => {
        currentTimeStep += 1;
        const data = generateSmoothWeatherData(activeLayer, currentTimeStep);
        if(map && map.getSource(activeLayer)) {
            map.getSource(activeLayer).setData(data);
        }
        updateDataPanel(activeLayer);
        
        if (map.getLayer(activeLayer)) {
            map.setPaintProperty(activeLayer, 'heatmap-opacity', 0.6);
            setTimeout(() => {
                if (map.getLayer(activeLayer)) {
                    map.setPaintProperty(activeLayer, 'heatmap-opacity', 0.8);
                }
            }, 100);
        }
    }, speed);
}
        
function stopAnimation() {
    isPlaying = false;
    document.getElementById('playIcon').classList.replace('fa-pause', 'fa-play');
    clearInterval(animationInterval);
    animationInterval = null;
}

function setupMapControls() {
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        if (map) map.zoomIn({ duration: 300 });
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        if (map) map.zoomOut({ duration: 300 });
    });

    document.getElementById('reset-north-btn').addEventListener('click', () => {
        if (map) {
            map.easeTo({
                bearing: 0,
                pitch: map.getPitch(),
                duration: 800,
                essential: true,
                easing: (t) => t * (2 - t)
            });
        }
    });

    document.getElementById('reset-position-btn').addEventListener('click', () => {
        if (map) {
            map.flyTo({
                center: initialCenter,
                zoom: initialZoom,
                bearing: 0,
                pitch: 0,
                duration: 1500,
                essential: true
            });
        }
    });
}

function setupLegendClickFilter() {
    const legendGradient = document.getElementById('legend-gradient');
    const filterIndicator = document.getElementById('filter-indicator');
    
    let isSelecting = false;
    let startX = 0;
    
    legendGradient.addEventListener('mousedown', (e) => {
        isSelecting = true;
        startX = e.offsetX;
        filterIndicator.style.left = startX + 'px';
        filterIndicator.style.width = '2px';
        filterIndicator.style.display = 'block';
        e.preventDefault();
    });
    
    legendGradient.addEventListener('mousemove', (e) => {
        if (!isSelecting) return;
        
        const currentX = e.offsetX;
        const width = Math.abs(currentX - startX);
        const left = Math.min(startX, currentX);
        
        filterIndicator.style.left = left + 'px';
        filterIndicator.style.width = width + 'px';
    });
    
    legendGradient.addEventListener('mouseup', (e) => {
        if (!isSelecting) return;
        isSelecting = false;
        
        const endX = e.offsetX;
        const gradientWidth = legendGradient.offsetWidth;
        
        const minPercent = Math.min(startX, endX) / gradientWidth;
        const maxPercent = Math.max(startX, endX) / gradientWidth;
        
        if (Math.abs(endX - startX) > 5) {
            colorFilter = { min: minPercent, max: maxPercent };
            applyColorFilter();
        } else {
            colorFilter = null;
            filterIndicator.style.display = 'none';
            applyColorFilter();
        }
    });
    
    legendGradient.addEventListener('mouseleave', () => {
        if (isSelecting) {
            isSelecting = false;
            if (!colorFilter) {
                filterIndicator.style.display = 'none';
            }
        }
    });
}

function applyColorFilter() {
    if (activeLayer) {
        const data = generateSmoothWeatherData(activeLayer, currentTimeStep);
        if (map && map.getSource(activeLayer)) {
            map.getSource(activeLayer).setData(data);
        }
    }
}

// Updated map initialization to load JSON data first
async function initializeMap() {
    if (mapInitialized) return;
    
    showLoadingIndicator();
    
    const dataLoaded = await loadJSONData();
    if (!dataLoaded) {
        hideLoadingIndicator();
        return;
    }
    
    mapboxgl.accessToken = 'pk.eyJ1IjoidGlsaW4yIiwiYSI6ImNtOG9wMzU4ZjAybnAyanE0dDdmY2x4cncifQ.YxHF3nxLS7LQX6ZlofvnGQ';
    
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: initialCenter,
        zoom: initialZoom,
        pitch: 0,
        bearing: 0,
        minZoom: 7.5,
        // Use the new function to set the map's navigation boundaries
        maxBounds: getPueblaBoundingBox()
    });
    
    map.on('load', () => {
        map.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1' });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.2 });
        map.addLayer({ 'id': 'sky', 'type': 'sky', 'paint': { 'sky-type': 'atmosphere', 'sky-atmosphere-sun-intensity': 15 } });
        
        // Call the new mask function first
        addMapMask(); 
        // Then call the rest
        addAccuratePueblaStateBoundary();
        addPueblaMunicipalities();
        addMonitoringStations();
        
        hideLoadingIndicator();
        mapIsReady = true; // <-- Add this line
    });
    
    map.on('error', () => {
        hideLoadingIndicator();
        console.error('Error loading map');
    });
    
    mapInitialized = true;
}

//cerrar el panel cuando se da clic fuera de este
document.addEventListener("click",function(event){
    const panel = document.getElementById("weather-controls");
    const toggleBtn = document.getElementById("toggle-controls-btn");

    //si el panel esta abierto
    if (panel.classList.contains("is-open")) {
        //click no fue dentro ni en el boton que lo abre
        if(!panel.contains(event.target) && !toggleBtn.contains(event.target)){
            panel.classList.remove("is-open"); //cierre del panel
        }
    }
});

//cerrar el navlinks cuando se da clic fuera de este
document.addEventListener('click',(event) =>{
    const panel = document.getElementById('nav-links');
    const toggleBtn = document.querySelector('.hamburger-menu');

    if (!panel || !toggleBtn) return;

    //si el panel esta abierto
    if (panel.classList.contains('active') && !panel.contains(event.target) && !toggleBtn.contains(event.target)){
        panel.classList.remove('active');
    }
});

function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}
let tipoMapa = 'meteorologia'; // Valor por defecto
function activateMap(type) {
    document.body.classList.add('map-active');
    initializeMap();
    
    if (type === 'meteorologia') {
        tipoMapa = 'meteorologia';
        setTimeout(() => {
            const tempBtn = document.querySelector('[data-layer="temperature"]');
            if (tempBtn) tempBtn.click();
        }, 500);
    } else if (type === 'calidad') {
        tipoMapa = 'calidad';
        setTimeout(() => {
            const pm25Btn = document.querySelector('[data-layer="pm25"]');
            if (pm25Btn) pm25Btn.click();
        }, 500);
    }
}

function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'map-loader';
    loader.innerHTML = `
        <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,255,255,0.9);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        ">
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #5a1b30;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            "></div>
            <p style="margin: 0; color: #5a1b30; font-weight: 500;">Cargando mapa...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    loader.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(248,249,250,0.8);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.getElementById('main-content').appendChild(loader);
}

// Add this function to your JavaScript code
function updateHistoricalChart() {
    if (!currentHistData) return;
    
    const tipoSeleccionado = document.getElementById('hist-tipo-select').value;
    if (tipoSeleccionado === 'meteo') {
        createMeteoHistoricalChart(currentHistData);
    } else {
        createChemHistoricalChart(currentHistData);
    }
    
    updateStatsTable(tipoSeleccionado);
}

// You also need this function
function updateStatsTable(tipo) {
    if (!currentHistData) return;
    
    const tbody = document.getElementById('histStatsTable');
    tbody.innerHTML = '';
    
    const variables = tipo === 'meteo' ? meteorologicalVariables : airQualityVariables;
    
    selectedVariables.forEach(key => {
        if (currentHistData[key] && variables[key]) {
            const values = currentHistData[key];
            const stats = calculateStats(values);
            const { label, unit, icon } = variables[key];
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="margin-right: 8px">${icon}</span>${label}</td>
                <td>${stats.avg.toFixed(2)}</td>
                <td>${stats.max.toFixed(2)}</td>
                <td>${stats.min.toFixed(2)}</td>
                <td>${unit}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

// And this helper function
function calculateStats(values) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    return { avg, max, min };
}

// You also need these chart creation functions
function createMeteoHistoricalChart(data) {
    currentHistData = data;
    
    const datasets = [];
    Object.entries(meteorologicalVariables).forEach(([key, cfg]) => {
        if (selectedVariables.has(key) && Array.isArray(data[key])) {
            datasets.push({
                label: `${cfg.icon} ${cfg.label} (${cfg.unit})`,
                data: data[key],
                borderColor: cfg.color,
                backgroundColor: `${cfg.color}20`,
                borderWidth: 2,
                tension: 0.35,
                fill: false
            });
        }
    });

    if (!datasets.length) return;

    const labels = currentHistLabels && currentHistLabels.length === datasets[0].data.length
        ? currentHistLabels
        : Array(datasets[0].data.length).fill('').map((_, i) => `Hora ${i*3}`);

    const groups = groupDatasetsByRange(datasets, 30);
    renderGroupedCharts(groups, labels, 'Tendencias de Variables Meteorológicas');
}

function createChemHistoricalChart(data) {
    currentHistData = data;

    const datasets = [];
    Object.entries(airQualityVariables).forEach(([key, cfg]) => {
        if (selectedVariables.has(key) && Array.isArray(data[key])) {
            datasets.push({
                label: `${cfg.icon} ${cfg.label} (${cfg.unit})`,
                data: data[key],
                borderColor: cfg.color,
                backgroundColor: `${cfg.color}20`,
                borderWidth: 2,
                tension: 0.35,
                fill: false
            });
        }
    });

    if (!datasets.length) return;

    const labels = currentHistLabels && currentHistLabels.length === datasets[0].data.length
        ? currentHistLabels
        : Array(datasets[0].data.length).fill('').map((_, i) => `Hora ${i*3}`);

    const groups = groupDatasetsByRange(datasets, 30);
    renderGroupedCharts(groups, labels, 'Tendencias de Calidad del Aire');
}

// And this grouping function
function groupDatasetsByRange(datasets, threshold = 30){
    const groups = [];
    const fits = (grp, ds) => {
        const all = grp.concat([ds]).flatMap(d => d.data).filter(v => Number.isFinite(v));
        const min = Math.min(...all), max = Math.max(...all);
        return (max - min) <= threshold;
    };
    datasets.forEach(ds => {
        let placed = false;
        for (const g of groups){
            if (fits(g, ds)){ g.push(ds); placed = true; break; }
        }
        if (!placed) groups.push([ds]);
    });
    return groups;
}

function hideLoadingIndicator() {
    const loader = document.getElementById('map-loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#d63031' : type === 'success' ? '#00b894' : '#0984e3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Event Listeners Setup
document.addEventListener('DOMContentLoaded', () => {
    setupMapControls();
    setupLegendClickFilter();

    const controlsPanel = document.getElementById('weather-controls');

    document.querySelectorAll('.layer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const layerType = this.getAttribute('data-layer');
            currentTimeStep = 0;
            colorFilter = null;
            document.getElementById('filter-indicator').style.display = 'none';
            addEnhancedWeatherLayer(layerType);
        });
    });
    
    document.getElementById('playBtn').addEventListener('click', () => {
        isPlaying ? stopAnimation() : startAnimation();
    });
    
    document.getElementById('speedSlider').addEventListener('input', () => {
        if (isPlaying) {
            stopAnimation();
            startAnimation();
        }
    });
    
    document.getElementById('toggle-controls-btn').addEventListener('click', () => {
        controlsPanel.classList.add('is-open');
    });
    
    document.getElementById('close-controls-btn').addEventListener('click', () => {
        controlsPanel.classList.remove('is-open');
    });

    // Modal event listeners
    document.getElementById('modalClose').addEventListener('click', () => {
        document.getElementById('municipalityModal').style.display = 'none';
    });

    document.getElementById('glossaryClose').addEventListener('click', () => {
        document.getElementById('glossaryModal').style.display = 'none';
    });

    document.getElementById('downloadCsvBtn').addEventListener('click', () => {
        if (window.currentMunicipality) {
            downloadMunicipalityCSV(window.currentMunicipality);
        } else {
            showNotification('No hay datos disponibles para descargar', 'error');
        }
    });

    // Footer button event listeners
    document.getElementById('btn_glosario').addEventListener('click', () => {
        document.getElementById('glossaryModal').style.display = 'flex';
    });

    document.getElementById('btn_datos').addEventListener('click', () => {
        if (activeLayer) {
            downloadLayerData(activeLayer);
        } else {
            showNotification('Selecciona una capa primero para descargar los datos.', 'info');
        }
    });

    document.getElementById('btn_recarga').addEventListener('click', () => {
        if (activeLayer) {
            currentTimeStep = 0;
            colorFilter = null;
            document.getElementById('filter-indicator').style.display = 'none';
            addEnhancedWeatherLayer(activeLayer);
        }
    });

    // Back button functionality
    document.getElementById('btn_back').addEventListener('click', () => {
        document.body.classList.remove('map-active');
        document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        stopAnimation();
        currentTimeStep = 0;
        colorFilter = null;
        document.getElementById('legend').style.display = 'none';
        document.getElementById('filter-indicator').style.display = 'none';
        controlsPanel.classList.remove('is-open');
        // Hide historial dashboard properly
        document.getElementById('historial-dashboard').classList.remove('active');
        document.getElementById('main-content').style.display = 'block';
    });

    // Sidebar button functionality
    document.getElementById('btn_atmos').addEventListener('click', function() {
        if (!mapInitialized) activateMap('meteorologia');
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        setTimeout(() => {
            tipoMapa = 'meteorologia';
            const tempBtn = document.querySelector('[data-layer="temperature"]');
            if (tempBtn) tempBtn.click();
        }, 300);
    });

    document.getElementById('btn_aire').addEventListener('click', function() {
        if (!mapInitialized) activateMap('calidad');
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        setTimeout(() => {
            tipoMapa = 'calidad';
            const pm25Btn = document.querySelector('[data-layer="pm25"]');
            if (pm25Btn) pm25Btn.click();
        }, 300);
    });

 document.getElementById('btn_hist').addEventListener('click', function() {
        document.body.classList.add('map-active');
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Hide map content and show the dashboard
        document.getElementById('main-content').style.display = 'none';
        const dashboard = document.getElementById('historial-dashboard');
        dashboard.style.display = 'block'; // Use 'block' or 'flex' based on your layout needs
        dashboard.classList.add('active');
        
        // Populate municipality dropdown if it's empty
        const cabeceraSelect = document.getElementById('hist-cabecera-select');
        if (cabeceraSelect.options.length <= 1 && municipalitiesData) { // Check if already populated
            cabeceraSelect.innerHTML = '<option value="">Seleccione un municipio...</option>';
            municipalitiesData.features
                .sort((a, b) => a.properties.nombre.localeCompare(b.properties.nombre))
                .forEach(feature => {
                    const option = document.createElement('option');
                    option.value = feature.properties.clave;
                    option.textContent = feature.properties.nombre;
                    cabeceraSelect.appendChild(option);
                });
        }

         // ADD these new listeners for the dashboard controls
    document.getElementById('hist-cabecera-select').addEventListener('change', async function() {
        const muncipalityId = this.value;
        const type = document.getElementById('hist-tipo-select').value;
        if (!muncipalityId) return;

        // Show a loading indicator
        document.getElementById('chartsHost').innerHTML = '<p style="text-align:center; color:#777;">Cargando datos...</p>';

        currentHistData = await fetchHistoricalData(muncipalityId, type);
        updateHistoricalChart();
    });

    document.getElementById('hist-tipo-select').addEventListener('change', function() {
        const type = this.value;
        createVariableToggles(type);
        // If a municipality is already selected, refetch and update data for the new type
        const cabeceraSelect = document.getElementById('hist-cabecera-select');
        if (cabeceraSelect.value) {
            cabeceraSelect.dispatchEvent(new Event('change'));
        }
    });
    // END: New event listener block
        
        // Initial setup
        createVariableToggles('meteo');
        // Clear previous charts and table
        document.getElementById('chartsHost').innerHTML = '<p style="text-align:center; color:#777;">Seleccione un municipio para ver los datos.</p>';
        document.getElementById('histStatsTable').innerHTML = '';
    });

    // ADDED: Event handlers for historial controls
    document.getElementById('hist-tipo-select').addEventListener('change', function() {
        const tipo = this.value;
        createVariableToggles(tipo);
    });

    // Mobile menu buttons
    document.getElementById('btn_atmos_mobile')?.addEventListener('click', (e) => {
        e.preventDefault();
        activateMap('meteorologia');
        toggleMenu();
    });

    document.getElementById('btn_aire_mobile')?.addEventListener('click', (e) => {
        e.preventDefault();
        activateMap('calidad');
        toggleMenu();
    });

    document.getElementById('btn_hist_mobile')?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
        showNotification('Funcionalidad de Historial en desarrollo', 'info');
    });

    // Update parameter selection functionality
    document.getElementById('select_dat').addEventListener('change', function() {
        const parameter = this.value;
        const subParamSelect = document.getElementById('select_var');
        
        subParamSelect.innerHTML = '';
        
        if (parameter === 'meteorologia') {
            const meteorologicalParams = [
                { value: 'temperature', text: 'Temperatura' },
                { value: 'humidity', text: 'Humedad' },
                { value: 'precipitation', text: 'Precipitación' },
                { value: 'wind', text: 'Viento' },
                { value: 'pressure', text: 'Presión' },
                { value: 'radiation', text: 'Radiación' }
            ];
            
            meteorologicalParams.forEach(param => {
                const option = document.createElement('option');
                option.value = param.value;
                option.textContent = param.text;
                subParamSelect.appendChild(option);
            });
        } else if (parameter === 'calidad') {
            const airQualityParams = [
                { value: 'co', text: 'Monóxido de Carbono (CO)' },
                { value: 'no2', text: 'Dióxido de Nitrógeno (NO₂)' },
                { value: 'o3', text: 'Ozono (O₃)' },
                { value: 'pm25', text: 'Partículas PM2.5' }
            ];
            
            airQualityParams.forEach(param => {
                const option = document.createElement('option');
                option.value = param.value;
                option.textContent = param.text;
                subParamSelect.appendChild(option);
            });
        }
    });

    // Update sub-parameter selection
    document.getElementById('select_var').addEventListener('change', function() {
        const selectedParam = this.value;
        if (selectedParam && weatherLayers[selectedParam]) {
            const layerBtn = document.querySelector(`[data-layer="${selectedParam}"]`);
            if (layerBtn) {
                layerBtn.click();
            }
        }
    });

    // Initialize parameter dropdowns
    document.getElementById('select_dat').dispatchEvent(new Event('change'));

    // Close modals when clicking outside
    document.getElementById('municipalityModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.style.display = 'none';
        }
    });

    document.getElementById('glossaryModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.style.display = 'none';
        }
    });
});

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    //if (!document.body.classList.contains('map-active')) return;
    
    switch(e.key) {
        case 'Escape':
            const controlsPanel = document.getElementById('weather-controls');
            if (controlsPanel.classList.contains('is-open')) {
                controlsPanel.classList.remove('is-open');
            } else if (document.getElementById('municipalityModal').style.display === 'flex') {
                document.getElementById('municipalityModal').style.display = 'none';
            } else if (document.getElementById('glossaryModal').style.display === 'flex') {
                document.getElementById('glossaryModal').style.display = 'none';
            } else{
                const navLinks = document.getElementById('nav-links'); 
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                } else {
                    document.getElementById('btn_back').click();
                }
            }
            break;
        case ' ':
            e.preventDefault();
            document.getElementById('playBtn').click();
            break;
        case 'r':
            document.getElementById('reset-position-btn').click();
            break;
        case 'n':
            document.getElementById('reset-north-btn').click();
            break;
        case '+':
        case '=':
            document.getElementById('zoom-in-btn').click();
            break;
        case '-':
            document.getElementById('zoom-out-btn').click();
            break;
        case 'f':
            colorFilter = null;
            document.getElementById('filter-indicator').style.display = 'none';
            applyColorFilter();
            break;
        case 'g':
            document.getElementById('btn_glosario').click();
            break;
        case 'd':
            document.getElementById('btn_datos').click();
            break;
        case 'a':
            //ir a la atmosfera
            document.getElementById('btn_atmos').click();
            break;
        case 'c':
            //ir a calidad dle aire
            document.getElementById('btn_aire').click();
            break;
        case 'h':
            //regresar al inicio
            document.getElementById('btn_hist').click();
            break;
    }
});

// Enhanced touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    if (!document.body.classList.contains('map-active')) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!document.body.classList.contains('map-active')) return;
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (!document.body.classList.contains('map-active')) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const controlsPanel = document.getElementById('weather-controls');
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
        if (deltaX > 0 && controlsPanel.classList.contains('is-open')) {
            controlsPanel.classList.remove('is-open');
        } else if (deltaX < 0 && !controlsPanel.classList.contains('is-open')) {
            controlsPanel.classList.add('is-open');
        }
    }
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (map && mapInitialized) {
            map.resize();
        }
    }, 250);
});

// Download layer data functionality
function downloadLayerData(layerType) {
    const config = weatherLayers[layerType];
    const data = generateSmoothWeatherData(layerType, currentTimeStep);
    
    const csvRows = [
        ['Latitud', 'Longitud', config.name + ' (' + config.unit + ')']
    ];
    
    data.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const value = feature.properties.value;
        csvRows.push([coords[1].toFixed(4), coords[0].toFixed(4), value.toFixed(2)]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${layerType}_puebla.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Error handling for missing resources
window.addEventListener('error', (e) => {
    console.error('Error loading resource:', e.filename, e.message);
    if (e.filename && (e.filename.includes('images/') || e.filename.includes('.svg'))) {
        showNotification('Algunas imágenes no se pudieron cargar', 'error');
    }
});

// Add notification for filter usage
let filterNotificationShown = false;
document.getElementById('legend-gradient').addEventListener('mouseenter', () => {
    if (!filterNotificationShown) {
        showNotification('Haz clic y arrastra para filtrar por rangos de color. Presiona F para limpiar filtros.', 'info');
        filterNotificationShown = true;
    }
});

// ===================================================================
// START: New History Dashboard Functions
// ===================================================================

// --- 1. Data Definitions & State ---
// These objects define the properties for each variable, making the code cleaner.
const meteorologicalVariables = {
    t2m: { label: 'Temperatura', color: '#FF6384', unit: '°C', icon: '🌡️' },
    rh: { label: 'Humedad', color: '#36A2EB', unit: '%', icon: '💧' },
    psl: { label: 'Presión', color: '#4BC0C0', unit: 'hPa', icon: '📊' },
    wnd: { label: 'Viento', color: '#9966FF', unit: 'km/h', icon: '🌪️' },
    pre: { label: 'Precipitación', color: '#4BC0C0', unit: 'mm', icon: '🌧️' },
    sw: { label: 'Radiación', color: '#FFCD56', unit: 'w/m²', icon: '☀️' }
};

const airQualityVariables = {
    CO: { label: 'Monóxido de Carbono', color: '#FF6384', unit: 'ppm', icon: '🟤' },
    NO2: { label: 'Dióxido de Nitrógeno', color: '#36A2EB', unit: 'ppb', icon: '🟣' },
    O3: { label: 'Ozono', color: '#4BC0C0', unit: 'ppb', icon: '🟢' },
    SO2: { label: 'Dióxido de Azufre', color: '#9966FF', unit: 'ppb', icon: '🔵' },
    PM10: { label: 'PM10', color: '#FF9F40', unit: 'µg/m³', icon: '⚫' },
    PM25: { label: 'PM2.5', color: '#FFCD56', unit: 'µg/m³', icon: '⚪' }
};

let currentHistData = null; // Holds the fetched data for the selected town
let selectedVariables = new Set(); // Tracks which variables are toggled on/off
let currentHistCharts = []; // Holds the Chart.js instances to manage them

// --- 2. Mock Data Function ---
// Since we don't have a backend, this function simulates fetching historical data.
function fetchHistoricalData(municipalityId, type) {
    console.log(`Fetching mock data for ${municipalityId}, type: ${type}`);
    // In a real app, this would be an API call: await fetch(...)
    return new Promise(resolve => {
        setTimeout(() => {
            const generateData = (min, max, length = 49) => Array.from({ length }, () => min + Math.random() * (max - min));
            
            const labels = Array.from({length: 49}, (_, i) => `2025-08-${18 + Math.floor(i/8)} ${String(i*3 % 24).padStart(2, '0')}:00`);

            let data;
            if (type === 'meteo') {
                data = {
                    labels: labels,
                    t2m: generateData(12, 22),
                    rh: generateData(70, 100),
                    psl: generateData(840, 860),
                    wnd: generateData(2, 15),
                    pre: generateData(0, 1).map(v => v > 0.8 ? v * 5 : 0), // Simulates sparse rain
                    sw: generateData(0, 900).map(v => Math.sin((Math.random() * Math.PI)) * v) // Simulates daytime radiation
                };
            } else { // chem
                data = {
                    labels: labels,
                    CO: generateData(0, 8),
                    NO2: generateData(0, 6),
                    O3: generateData(0, 60),
                    SO2: generateData(0, 0.2),
                    PM10: generateData(0, 1),
                    PM25: generateData(0, 0.6)
                };
            }
            resolve(data);
        }, 250); // Simulate network delay
    });
}


// --- 3. Charting Logic ---
// **The key function**: Groups variables onto different charts based on their value range.
function groupDatasetsByRange(datasets, threshold = 30) {
    const groups = [];
    datasets.forEach(ds => {
        let placed = false;
        for (const group of groups) {
            const allValues = group.concat([ds]).flatMap(d => d.data);
            const min = Math.min(...allValues);
            const max = Math.max(...allValues);
            if ((max - min) <= threshold) {
                group.push(ds);
                placed = true;
                break;
            }
        }
        if (!placed) {
            groups.push([ds]);
        }
    });
    return groups;
}

// Renders the charts based on the groups generated above.
function renderGroupedCharts(groups, labels, titlePrefix) {
    const host = document.getElementById('chartsHost');
    host.innerHTML = '';
    currentHistCharts.forEach(chart => chart.destroy());
    currentHistCharts = [];

    groups.forEach(group => {
        const card = document.createElement('div');
        card.className = 'chart-card';
        const canvas = document.createElement('canvas');
        card.appendChild(canvas);
        host.appendChild(card);

        const chart = new Chart(canvas, {
            type: 'line',
            data: { labels, datasets: group },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: titlePrefix }
                },
                scales: { y: { beginAtZero: false } }
            }
        });
        currentHistCharts.push(chart);
    });
}

// --- 4. Statistical Logic ---
function calculateStats(values) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { avg, max, min };
}

function updateStatsTable(type) {
    const tbody = document.getElementById('histStatsTable');
    tbody.innerHTML = '';
    const variables = type === 'meteo' ? meteorologicalVariables : airQualityVariables;

    selectedVariables.forEach(key => {
        if (currentHistData[key] && variables[key]) {
            const stats = calculateStats(currentHistData[key]);
            const config = variables[key];
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${config.icon} ${config.label}</td>
                <td>${stats.avg.toFixed(2)}</td>
                <td>${stats.max.toFixed(2)}</td>
                <td>${stats.min.toFixed(2)}</td>
                <td>${config.unit}</td>
            `;
        }
    });
}

// --- 5. UI Functions ---
function createVariableToggles(type) {
    const container = document.getElementById('variable-toggles');
    container.innerHTML = '';
    selectedVariables.clear();
    const variables = type === 'meteo' ? meteorologicalVariables : airQualityVariables;

    Object.entries(variables).forEach(([key, config]) => {
        const toggle = document.createElement('div');
        toggle.className = 'variable-toggle active'; // Active by default
        toggle.dataset.variable = key;
        toggle.innerHTML = `<div class="icon">${config.icon}</div><div class="label">${config.label}</div>`;
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            toggle.classList.contains('active') ? selectedVariables.add(key) : selectedVariables.delete(key);
            updateHistoricalChart();
        });
        container.appendChild(toggle);
        selectedVariables.add(key); // Start with all variables selected
    });
}

function createMeteoHistoricalChart(data) {
    const datasets = [];
    Object.entries(meteorologicalVariables).forEach(([key, cfg]) => {
        if (selectedVariables.has(key) && data[key]) {
            datasets.push({
                label: `${cfg.icon} ${cfg.label} (${cfg.unit})`,
                data: data[key],
                borderColor: cfg.color,
                backgroundColor: `${cfg.color}20`,
                borderWidth: 2,
                tension: 0.4
            });
        }
    });
    // Group Pressure (psl) separately because its range is huge
    const pslDataset = datasets.find(d => d.label.includes('Presión'));
    const otherDatasets = datasets.filter(d => !d.label.includes('Presión'));
    const groups = groupDatasetsByRange(otherDatasets, 50);
    if (pslDataset) groups.push([pslDataset]);
    
    renderGroupedCharts(groups, data.labels, 'Tendencias de Variables Meteorológicas');
}

function createChemHistoricalChart(data) {
    const datasets = [];
    Object.entries(airQualityVariables).forEach(([key, cfg]) => {
        if (selectedVariables.has(key) && data[key]) {
            datasets.push({
                label: `${cfg.icon} ${cfg.label} (${cfg.unit})`,
                data: data[key],
                borderColor: cfg.color,
                backgroundColor: `${cfg.color}20`,
                borderWidth: 2,
                tension: 0.4
            });
        }
    });
    // Group Ozone (O3) separately
    const o3Dataset = datasets.find(d => d.label.includes('Ozono'));
    const otherDatasets = datasets.filter(d => !d.label.includes('Ozono'));
    const groups = [otherDatasets];
    if (o3Dataset) groups.push([o3Dataset]);

    renderGroupedCharts(groups, data.labels, 'Tendencias de Calidad del Aire');
}

function updateHistoricalChart() {
    if (!currentHistData) return;
    const type = document.getElementById('hist-tipo-select').value;
    type === 'meteo' ? createMeteoHistoricalChart(currentHistData) : createChemHistoricalChart(currentHistData);
    updateStatsTable(type);
}

// ===================================================================
// END: New History Dashboard Functions
// ===================================================================
