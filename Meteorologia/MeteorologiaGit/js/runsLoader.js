// Funciones para cargar datos de las runs

// Mapeo de las carpetas a variables
const folderToVariableMap = {
    // Meteorología
    'temp': 't2m',
    'hum': 'rh',
    'psfc': 'psl',
    'wnd': 'wnd', 
    'precacum': 'pre',
    'radsw': 'sw',
    // Calidad del aire
    'CO': 'CO',
    'NO2': 'NO2',
    'O3': 'O3',
    'SO2': 'SO2',
    'PM10': 'PM10',
    'PM25': 'PM25'
};

// Función para cargar el listado de runs disponibles
async function loadAvailableRuns() {
    try {
        const response = await fetch('api/getRuns.php');
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format received from getRuns.php');
        }
        return data.sort((a, b) => b.localeCompare(a)); // Ordenar de más reciente a más antiguo
    } catch (error) {
        console.error('Error loading runs:', error);
        showNotification('Error cargando lista de predicciones', 'error');
        return [];
    }
}

// Función para cargar datos de cabeceras para una run específica
async function loadRunData(runId, tipo) {
    try {
        const subfolder = tipo === 'meteorologia' ? 'meteo' : 'chem';
        const response = await fetch(`runs/${runId}/cabeceras/${subfolder}/data.json`);
        const data = await response.json();
        
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data format received');
        }
        
        return data;
    } catch (error) {
        console.error(`Error loading ${tipo} data for run ${runId}:`, error);
        showNotification(`Error cargando datos de ${tipo}`, 'error');
        return null;
    }
}

// Función para cargar una imagen PNG específica
function loadRunImage(runId, variable, hora) {
    return new Promise((resolve, reject) => {
        const folder = Object.entries(folderToVariableMap).find(([_, v]) => v === variable)?.[0];
        if (!folder) {
            reject(new Error(`Variable ${variable} no encontrada`));
            return;
        }

        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Error cargando imagen para ${variable} hora ${hora}`));
        img.src = `runs/${runId}/${folder}/${hora.toString().padStart(2, '0')}.png`;
    });
}

// Función para cargar los metadatos de una run (información de coordenadas, rangos, etc)
async function loadRunMetadata(runId) {
    try {
        const response = await fetch(`runs/${runId}/metadata.json`);
        const data = await response.json();
        
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid metadata format');
        }
        
        return data;
    } catch (error) {
        console.error('Error loading run metadata:', error);
        showNotification('Error cargando metadatos de predicción', 'error');
        return null;
    }
}

// Función para actualizar los controles del panel con las runs disponibles
async function updateRunControls() {
    const runs = await loadAvailableRuns();
    const runSelect = document.getElementById('run-select');
    if (!runSelect) return;
    
    runSelect.innerHTML = '<option value="">Seleccione una predicción...</option>';
    
    runs.forEach(run => {
        const option = document.createElement('option');
        option.value = run;
        
        // Formatear fecha para mostrar
        const year = run.substring(0, 4);
        const month = run.substring(4, 6);
        const day = run.substring(6, 8);
        const hour = run.substring(8, 10);
        
        option.textContent = `${day}/${month}/${year} ${hour}:00`;
        runSelect.appendChild(option);
    });
    
    // Seleccionar la run más reciente por defecto
    if (runs.length > 0) {
        runSelect.value = runs[0];
        runSelect.dispatchEvent(new Event('change'));
    }
}

// Función para cargar y preparar todos los datos necesarios para una run
async function initializeRunData(runId, tipo) {
    try {
        const [runData, metadata] = await Promise.all([
            loadRunData(runId, tipo),
            loadRunMetadata(runId)
        ]);
        
        if (!runData || !metadata) {
            throw new Error('Failed to load run data or metadata');
        }
        
        window.currentRunData = {
            id: runId,
            data: runData,
            metadata: metadata,
            tipo: tipo
        };
        
        return window.currentRunData;
    } catch (error) {
        console.error('Error initializing run data:', error);
        showNotification('Error inicializando datos de predicción', 'error');
        return null;
    }
}

// Exportar funciones
window.runsLoader = {
    loadAvailableRuns,
    loadRunData,
    loadRunImage,
    loadRunMetadata,
    updateRunControls,
    initializeRunData
};