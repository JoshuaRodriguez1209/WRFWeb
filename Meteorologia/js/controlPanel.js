// Funciones para manejar el panel de control

const horasDisponibles = Array.from({ length: 25 }, (_, i) => i); // 0 a 24 horas

// Variables globales para el estado del panel
let currentRun = null;
let currentHour = 0;
let currentVariable = null;
let currentSubParam = null;

// Función para inicializar los controles del panel
async function initializeControlPanel() {
    // Inicializar el selector de runs
    const runSelect = document.getElementById('select_run');
    const horaSelect = document.getElementById('selectHora');
    
    if (!runSelect || !horaSelect) {
        console.error('Control panel elements not found');
        return;
    }
    
    // Cargar las runs disponibles
    const runs = await window.runsLoader.loadAvailableRuns();
    runSelect.innerHTML = '<option value="">Seleccione una fecha...</option>';
    
    runs.forEach(run => {
        const option = document.createElement('option');
        option.value = run;
        
        // Formatear fecha
        const year = run.substring(0, 4);
        const month = run.substring(4, 6);
        const day = run.substring(6, 8);
        const hour = run.substring(8, 10);
        
        option.textContent = `${day}/${month}/${year} ${hour}:00`;
        runSelect.appendChild(option);
    });
    
    // Inicializar selector de horas
    horaSelect.innerHTML = '<option value="">Seleccione hora...</option>';
    horasDisponibles.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = `${hora} horas`;
        horaSelect.appendChild(option);
    });
    
    // Event listeners
    runSelect.addEventListener('change', handleRunChange);
    horaSelect.addEventListener('change', handleHourChange);
    
    // Seleccionar la run más reciente por defecto
    if (runs.length > 0) {
        runSelect.value = runs[0];
        runSelect.dispatchEvent(new Event('change'));
    }
}

// Manejador de cambio de run
async function handleRunChange(event) {
    const runId = event.target.value;
    if (!runId) return;
    
    currentRun = runId;
    
    // Cargar datos de la run
    const tipo = window.tipoMapa || 'meteorologia';
    const runData = await window.runsLoader.initializeRunData(runId, tipo);
    
    if (!runData) {
        console.error('Failed to load run data');
        return;
    }
    
    // Actualizar hora si es necesario
    const horaSelect = document.getElementById('selectHora');
    if (horaSelect.value === '') {
        horaSelect.value = '0';
        horaSelect.dispatchEvent(new Event('change'));
    } else {
        // Recargar datos con la hora actual
        updateMapLayer();
    }
}

// Manejador de cambio de hora
function handleHourChange(event) {
    const hora = parseInt(event.target.value);
    if (isNaN(hora)) return;
    
    currentHour = hora;
    updateMapLayer();
}

// Manejador de cambio de variable (cuando se hace clic en un botón de capa)
function handleLayerButtonClick(variable) {
    currentVariable = variable;
    
    // Mostrar/ocultar subparámetros según la variable
    updateSubParams(variable);
    
    // Actualizar la capa en el mapa
    updateMapLayer();
}

// Actualizar la visualización de subparámetros
function updateSubParams(variable) {
    const subparamLabel = document.getElementById('label-subparam');
    const subparamPoker = document.getElementById('subparam-poker');
    
    // Limpiar subparámetros anteriores
    subparamPoker.innerHTML = '';
    
    // Configurar subparámetros según la variable
    const subparams = getSubParamsForVariable(variable);
    
    if (subparams.length > 0) {
        subparamLabel.style.display = 'block';
        subparamPoker.style.display = 'flex';
        
        subparams.forEach(param => {
            const button = document.createElement('button');
            button.className = 'subparam-btn';
            button.textContent = param.label;
            button.onclick = () => {
                currentSubParam = param.value;
                // Desactivar todos los botones
                document.querySelectorAll('.subparam-btn').forEach(btn => 
                    btn.classList.remove('active'));
                // Activar el botón seleccionado
                button.classList.add('active');
                updateMapLayer();
            };
            subparamPoker.appendChild(button);
        });
        
        // Seleccionar el primer subparámetro por defecto
        subparamPoker.firstChild.click();
    } else {
        subparamLabel.style.display = 'none';
        subparamPoker.style.display = 'none';
        currentSubParam = null;
        updateMapLayer();
    }
}

// Obtener subparámetros según la variable
function getSubParamsForVariable(variable) {
    const subparams = {
        'wind': [
            { label: 'Velocidad', value: 'speed' },
            { label: 'Dirección', value: 'direction' }
        ],
        'radiation': [
            { label: 'Onda corta', value: 'sw' },
            { label: 'Onda larga', value: 'lw' }
        ]
        // Agregar más subparámetros según sea necesario
    };
    
    return subparams[variable] || [];
}

// Actualizar la capa en el mapa
function updateMapLayer() {
    if (!currentRun || !currentVariable) return;
    
    // Construir la ruta de la imagen según los parámetros actuales
    const imageInfo = {
        runId: currentRun,
        variable: currentVariable,
        hora: currentHour,
        subParam: currentSubParam
    };
    
    // Emitir evento para actualizar el mapa
    const event = new CustomEvent('updateMapLayer', { detail: imageInfo });
    window.dispatchEvent(event);
}

// Exportar funciones
window.controlPanel = {
    initialize: initializeControlPanel,
    handleLayerButtonClick
};