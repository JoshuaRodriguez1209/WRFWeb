/**
 * @fileoverview Funciones para actualizar las capas del mapa
 */

class MapLayerUpdater {
    constructor(map) {
        this.map = map;
        this.layerManager = null;
        this.currentRunId = null;
        this.currentVariable = null;
        this.currentHour = null;
        this.isAnimating = false;
    }

    initialize() {
        this.layerManager = new MapLayerManager(this.map);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Escuchar cambios de run
        document.getElementById('select_run')?.addEventListener('change', (e) => {
            this.currentRunId = e.target.value;
            this.updateLayerIfComplete();
        });

        // Escuchar cambios de hora
        document.getElementById('selectHora')?.addEventListener('change', (e) => {
            this.currentHour = e.target.value;
            this.updateLayerIfComplete();
        });

        // Escuchar clicks en botones de variable
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentVariable = btn.dataset.layer;
                this.updateLayerIfComplete();
            });
        });
    }

    updateLayerIfComplete() {
        if (this.currentRunId && this.currentVariable && this.currentHour !== null) {
            this.updateLayer();
        }
    }

    async updateLayer() {
        try {
            // Construir ruta de la imagen
            const folder = this.getFolderForVariable(this.currentVariable);
            const imagePath = `runs/${this.currentRunId}/${folder}/${this.currentHour.toString().padStart(2, '0')}.png`;
            
            // Agregar capa al mapa
            await this.layerManager.addImageLayer(
                `${this.currentVariable}-layer`,
                imagePath,
                window.tipoMapa || 'meteorologia'
            );
            
            // Actualizar controles visuales
            this.updateControls();
            
        } catch (error) {
            console.error('Error updating map layer:', error);
            showNotification('Error actualizando la capa del mapa', 'error');
        }
    }

    getFolderForVariable(variable) {
        const folderMap = {
            // Meteorología
            'temperature': 'temp',
            'humidity': 'hum',
            'precipitation': 'preacum',
            'wind': 'wnd',
            'pressure': 'psfc',
            'radiation': 'radsw',
            // Calidad del aire
            'co': 'CO',
            'no2': 'NO2',
            'o3': 'O3',
            'pm25': 'PM25',
            'so2': 'SO2',
            'pm10': 'PM10'
        };
        return folderMap[variable] || variable;
    }

    updateControls() {
        // Actualizar leyenda y panel de datos
        const configs = {
            temperature: { name: 'Temperatura', range: [-10, 40], unit: '°C' },
            humidity: { name: 'Humedad', range: [0, 100], unit: '%' },
            precipitation: { name: 'Precipitación', range: [0, 100], unit: 'mm' },
            wind: { name: 'Viento', range: [0, 150], unit: 'km/h' },
            pressure: { name: 'Presión', range: [980, 1040], unit: 'hPa' },
            radiation: { name: 'Radiación', range: [0, 1000], unit: 'W/m²' },
            co: { name: 'CO', range: [0, 10], unit: 'ppm' },
            no2: { name: 'NO₂', range: [0, 200], unit: 'ppb' },
            o3: { name: 'O₃', range: [0, 150], unit: 'ppb' },
            pm25: { name: 'PM2.5', range: [0, 200], unit: 'μg/m³' },
            so2: { name: 'SO₂', range: [0, 150], unit: 'ppb' },
            pm10: { name: 'PM10', range: [0, 200], unit: 'μg/m³' }
        };

        const config = configs[this.currentVariable];
        if (!config) return;

        // Actualizar leyenda
        const legend = document.getElementById('legend');
        if (legend) {
            legend.style.display = 'block';
            legend.querySelector('.legend-title').textContent = config.name;
            const labels = legend.querySelector('.legend-labels');
            labels.innerHTML = '';

            // Obtener escala de colores para la variable
            const variableMap = {
                temperature: 'TEMP',
                humidity: 'HUM',
                precipitation: 'RAIN',
                wind: 'WIND',
                radiation: 'SRAD',
                co: 'CO',
                no2: 'NO2',
                o3: 'O3',
            };

            const colorScale = window.colorScale;
            const scale = colorScale.getScale(variableMap[this.currentVariable]);
            
            if (scale && scale.length > 0) {
                // Mostrar algunos valores representativos de la escala
                const steps = Math.min(4, scale.length - 1);
                const step = Math.floor(scale.length / steps);
                
                for (let i = 0; i <= steps; i++) {
                    const index = Math.min(i * step, scale.length - 1);
                    const item = scale[index];
                    
                    const label = document.createElement('div');
                    label.className = 'legend-label';
                    label.style.display = 'flex';
                    label.style.alignItems = 'center';
                    label.style.marginBottom = '5px';
                    
                    const colorBox = document.createElement('span');
                    colorBox.style.width = '20px';
                    colorBox.style.height = '20px';
                    colorBox.style.backgroundColor = item.color;
                    colorBox.style.display = 'inline-block';
                    colorBox.style.marginRight = '5px';
                    
                    const text = document.createElement('span');
                    text.textContent = `${item.value}${i === steps ? ` ${config.unit}` : ''}`;
                    
                    label.appendChild(colorBox);
                    label.appendChild(text);
                    labels.appendChild(label);
                }
            } else {
                // Fallback al método anterior si no hay escala definida
                const steps = 4;
                for (let i = 0; i <= steps; i++) {
                    const value = config.range[0] + (config.range[1] - config.range[0]) * (i / steps);
                    const label = document.createElement('span');
                    label.textContent = `${value.toFixed(0)}${i === steps ? ` ${config.unit}` : ''}`;
                    labels.appendChild(label);
                }
            }
        }

        // Actualizar panel de datos
        updateDataPanel(this.currentVariable);
    }

    startAnimation(speed = 1000) {
        if (!this.currentRunId || !this.currentVariable) return;

        const imageUrls = [];
        for (let i = 0; i <= 72; i += 3) {  // 0 a 72 horas, cada 3 horas
            const folder = this.getFolderForVariable(this.currentVariable);
            imageUrls.push(`runs/${this.currentRunId}/${folder}/${i.toString().padStart(2, '0')}.png`);
        }

        this.layerManager.startAnimation(imageUrls, speed);
    }

    stopAnimation() {
        this.layerManager.stopAnimation();
    }
}

// Exportar la clase
window.MapLayerUpdater = MapLayerUpdater;