/**
 * @fileoverview Manejo de escalas de color para variables meteorológicas
 */

class ColorScale {
    constructor() {
        this.scales = {};
        this.loaded = false;
    }

    /**
     * Carga las escalas de color desde el archivo CSV
     * @returns {Promise} Promesa que se resuelve cuando las escalas están cargadas
     */
    async loadScales() {
        try {
            const response = await fetch('color_scale.csv');
            const text = await response.text();
            this.parseCSV(text);
            this.loaded = true;
        } catch (error) {
            console.error('Error loading color scales:', error);
            throw error;
        }
    }

    /**
     * Parsea el contenido del CSV y organiza las escalas
     * @param {string} csv - Contenido del archivo CSV
     */
    parseCSV(csv) {
        const lines = csv.split('\n');
        // Saltar la primera línea (encabezados)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [color, value, variable] = line.split(',');
            if (!color || !value || !variable) continue;

            if (!this.scales[variable]) {
                this.scales[variable] = [];
            }

            this.scales[variable].push({
                color: color,
                value: parseFloat(value)
            });
        }

        // Ordenar las escalas por valor
        for (const variable in this.scales) {
            this.scales[variable].sort((a, b) => a.value - b.value);
        }
    }

    /**
     * Obtiene el color para un valor específico
     * @param {string} variable - Nombre de la variable (TEMP, HUM, etc.)
     * @param {number} value - Valor para el cual obtener el color
     * @returns {string} Color en formato hexadecimal
     */
    getColor(variable, value) {
        if (!this.loaded || !this.scales[variable]) {
            return '#FFFFFF';
        }

        const scale = this.scales[variable];
        
        // Si el valor está fuera de rango, usar el color más cercano
        if (value <= scale[0].value) return scale[0].color;
        if (value >= scale[scale.length - 1].value) return scale[scale.length - 1].color;

        // Encontrar los dos valores más cercanos
        for (let i = 0; i < scale.length - 1; i++) {
            if (value >= scale[i].value && value <= scale[i + 1].value) {
                // Interpolación lineal entre los dos colores
                return this.interpolateColor(
                    scale[i].color,
                    scale[i + 1].color,
                    (value - scale[i].value) / (scale[i + 1].value - scale[i].value)
                );
            }
        }

        return scale[0].color;
    }

    /**
     * Obtiene los colores y valores para una variable específica
     * @param {string} variable - Nombre de la variable
     * @returns {Array} Array de objetos {color, value}
     */
    getScale(variable) {
        return this.scales[variable] || [];
    }

    /**
     * Interpola entre dos colores hexadecimales
     * @param {string} color1 - Color inicial en formato hex
     * @param {string} color2 - Color final en formato hex
     * @param {number} factor - Factor de interpolación (0-1)
     * @returns {string} Color interpolado en formato hex
     */
    interpolateColor(color1, color2, factor) {
        const r1 = parseInt(color1.substr(1, 2), 16);
        const g1 = parseInt(color1.substr(3, 2), 16);
        const b1 = parseInt(color1.substr(5, 2), 16);

        const r2 = parseInt(color2.substr(1, 2), 16);
        const g2 = parseInt(color2.substr(3, 2), 16);
        const b2 = parseInt(color2.substr(5, 2), 16);

        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        return '#' + 
            r.toString(16).padStart(2, '0') +
            g.toString(16).padStart(2, '0') +
            b.toString(16).padStart(2, '0');
    }

    /**
     * Obtiene el rango de valores para una variable
     * @param {string} variable - Nombre de la variable
     * @returns {Object} Objeto con min y max
     */
    getRange(variable) {
        const scale = this.scales[variable];
        if (!scale || scale.length === 0) {
            return { min: 0, max: 100 };
        }
        return {
            min: scale[0].value,
            max: scale[scale.length - 1].value
        };
    }
}

// Exportar la clase
window.ColorScale = ColorScale;