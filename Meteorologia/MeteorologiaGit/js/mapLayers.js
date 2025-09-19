/**
 * @fileoverview Manejo de capas de imágenes en el mapa
 */

// Configuración global de las capas
const layerConfig = {
    bounds: {
        meteorologia: [
            [-100.5, 20.5],  // Top-left
            [-95.5, 20.5],   // Top-right
            [-95.5, 17.5],   // Bottom-right
            [-100.5, 17.5]   // Bottom-left
        ],
        calidad: [
            [-100.5, 20.5],  // Top-left
            [-95.5, 20.5],   // Top-right
            [-95.5, 17.5],   // Bottom-right
            [-100.5, 17.5]   // Bottom-left
        ]
    },
    defaultOpacity: 0.8,
    fadeInDuration: 300
};

class MapLayerManager {
    constructor(map) {
        this.map = map;
        this.currentLayer = null;
        this.currentSource = null;
        this.isAnimating = false;
        this.frames = [];
        this.currentFrame = 0;
        this.animationSpeed = 1000;
    }

    /**
     * Elimina la capa y fuente actual del mapa
     */
    clearCurrentLayer() {
        if (this.currentLayer && this.map.getLayer(this.currentLayer)) {
            this.map.removeLayer(this.currentLayer);
        }
        if (this.currentSource && this.map.getSource(this.currentSource)) {
            this.map.removeSource(this.currentSource);
        }
    }

    /**
     * Agrega una nueva imagen al mapa
     * @param {string} layerId - Identificador único para la capa
     * @param {string} imageUrl - URL de la imagen PNG
     * @param {string} tipo - 'meteorologia' o 'calidad'
     * @returns {Promise} Promesa que se resuelve cuando la imagen está cargada
     */
    addImageLayer(layerId, imageUrl, tipo = 'meteorologia') {
        return new Promise((resolve, reject) => {
            this.clearCurrentLayer();

            // Crear elemento de imagen para precargar
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            img.onload = () => {
                // Agregar la fuente de la imagen
                this.map.addSource(layerId, {
                    'type': 'image',
                    'url': imageUrl,
                    'coordinates': layerConfig.bounds[tipo]
                });

                // Agregar la capa de imagen
                this.map.addLayer({
                    'id': layerId,
                    'source': layerId,
                    'type': 'raster',
                    'layout': {
                        'visibility': 'visible'
                    },
                    'paint': {
                        'raster-opacity': layerConfig.defaultOpacity,
                        'raster-fade-duration': layerConfig.fadeInDuration
                    }
                }, 'puebla-border');

                this.currentLayer = layerId;
                this.currentSource = layerId;

                resolve();
            };

            img.onerror = () => {
                reject(new Error(`Error loading image: ${imageUrl}`));
            };

            img.src = imageUrl;
        });
    }

    /**
     * Actualiza una capa existente con una nueva imagen
     * @param {string} layerId - ID de la capa a actualizar
     * @param {string} newImageUrl - URL de la nueva imagen
     */
    updateImageLayer(layerId, newImageUrl) {
        if (this.map.getSource(layerId)) {
            this.map.getSource(layerId).updateImage({
                url: newImageUrl,
                coordinates: layerConfig.bounds[window.tipoMapa || 'meteorologia']
            });
        } else {
            this.addImageLayer(layerId, newImageUrl, window.tipoMapa);
        }
    }

    /**
     * Inicia la animación de frames
     * @param {string[]} imageUrls - Array de URLs de imágenes para animar
     * @param {number} speed - Velocidad de la animación en milisegundos
     */
    startAnimation(imageUrls, speed = 1000) {
        if (this.isAnimating) {
            this.stopAnimation();
        }

        this.frames = imageUrls;
        this.currentFrame = 0;
        this.animationSpeed = speed;
        this.isAnimating = true;

        const animate = () => {
            if (!this.isAnimating) return;

            const url = this.frames[this.currentFrame];
            this.updateImageLayer('animated-layer', url);

            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            setTimeout(animate, this.animationSpeed);
        };

        animate();
    }

    /**
     * Detiene la animación actual
     */
    stopAnimation() {
        this.isAnimating = false;
        this.frames = [];
        this.currentFrame = 0;
    }

    /**
     * Actualiza la opacidad de la capa actual
     * @param {number} opacity - Valor de opacidad entre 0 y 1
     */
    setLayerOpacity(opacity) {
        if (this.currentLayer) {
            this.map.setPaintProperty(
                this.currentLayer,
                'raster-opacity',
                Math.max(0, Math.min(1, opacity))
            );
        }
    }
}

// Exportar la clase
window.MapLayerManager = MapLayerManager;