function toggleAccessibility() {
        const menu = document.getElementById('accessibilityMenu');
        menu.classList.toggle('active');
    }

    function toggleSearch() {
        const searchContainer = document.getElementById('searchContainer');
        searchContainer.classList.toggle('active');
    }

    function toggleFeature(feature) {
        // Remove conflicting features
        if (feature === 'large-text') {
            document.body.classList.remove('small-text');
        } else if (feature === 'small-text') {
            document.body.classList.remove('large-text');
        } else if (feature === 'large-spacing') {
            document.body.classList.remove('small-spacing');
        } else if (feature === 'small-spacing') {
            document.body.classList.remove('large-spacing');
        }

        document.body.classList.toggle(feature);
    }

    // Variables para texto a voz
    let textToSpeechActive = false;
    let speechSynthesis = window.speechSynthesis;

    function toggleTextToSpeech() {
        const btn = document.getElementById('textToSpeechBtn');
        const status = document.getElementById('ttsStatus');
        
        if (!speechSynthesis) {
            alert('Su navegador no soporta texto a voz');
            return;
        }

        textToSpeechActive = !textToSpeechActive;
        
        if (textToSpeechActive) {
            btn.classList.add('tts-active');
            status.textContent = 'Activo - Seleccione texto';
            addSelectionListener();
        } else {
            btn.classList.remove('tts-active');
            status.textContent = 'Inactivo';
            speechSynthesis.cancel();
            removeSelectionListener();
        }
    }

    function addSelectionListener() {
        document.addEventListener('mouseup', handleTextSelection);
        document.addEventListener('keyup', handleTextSelection);
    }

    function removeSelectionListener() {
        document.removeEventListener('mouseup', handleTextSelection);
        document.removeEventListener('keyup', handleTextSelection);
    }

    function handleTextSelection() {
        if (!textToSpeechActive) return;
        
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText.length > 1) {
            speakText(selectedText);
        }
    }

    function speakText(text) {
        // Detener cualquier lectura anterior
        speechSynthesis.cancel();
        
        // Crear nueva instancia de síntesis
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Actualizar estado
        const status = document.getElementById('ttsStatus');
        utterance.onstart = () => {
            if (status) status.textContent = 'Leyendo...';
        };
        
        utterance.onend = () => {
            if (status && textToSpeechActive) status.textContent = 'Activo - Seleccione texto';
        };
        
        utterance.onerror = () => {
            if (status) status.textContent = 'Error de síntesis';
        };
        
        speechSynthesis.speak(utterance);
    }

    // Variables para guía de lectura
    let readingGuideActive = false;
    let readingGuideElement = null;

    function toggleReadingGuide() {
        const btn = document.getElementById('readingGuideBtn');
        const status = document.getElementById('guideStatus');
        const guide = document.getElementById('readingGuide');
        
        readingGuideActive = !readingGuideActive;
        
        if (readingGuideActive) {
            btn.classList.add('guide-active');
            status.textContent = 'Activo';
            guide.style.display = 'block';
            readingGuideElement = guide;
            document.addEventListener('mousemove', updateReadingGuide);
        } else {
            btn.classList.remove('guide-active');
            status.textContent = 'Inactivo';
            guide.style.display = 'none';
            readingGuideElement = null;
            document.removeEventListener('mousemove', updateReadingGuide);
        }
    }

    function updateReadingGuide(event) {
        if (!readingGuideElement) return;
        
        readingGuideElement.style.top = event.clientY + 'px';
    }

    // Manejar cursor grande personalizado
    document.addEventListener('mousemove', function(event) {
        if (document.body.classList.contains('large-cursor')) {
            const cursor = document.body.querySelector('::after');
            // El cursor se maneja automáticamente con CSS fixed positioning
            document.body.style.setProperty('--cursor-x', event.clientX + 'px');
            document.body.style.setProperty('--cursor-y', event.clientY + 'px');
        }
    });

    // Variables para voz a texto
    let speechToTextActive = false;
    let recognition = null;
    let currentInput = null;

    function toggleSpeechToText() {
        const btn = document.getElementById('speechToTextBtn');
        const status = document.getElementById('sttStatus');
        
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Su navegador no soporta reconocimiento de voz');
            return;
        }

        speechToTextActive = !speechToTextActive;
        
        if (speechToTextActive) {
            btn.classList.add('stt-active');
            status.textContent = 'Activo - Haga clic en un campo';
            setupSpeechRecognition();
            addInputListeners();
        } else {
            btn.classList.remove('stt-active');
            status.textContent = 'Inactivo';
            removeInputListeners();
            if (recognition) {
                recognition.stop();
            }
        }
    }

    function setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = function() {
            const status = document.getElementById('sttStatus');
            if (status) status.textContent = 'Escuchando...';
        };
        
        recognition.onresult = function(event) {
            if (!currentInput) return;
            
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (finalTranscript) {
                // Limpiar texto final (remover puntos al final y espacios extra)
                let cleanText = finalTranscript.trim();
                if (cleanText.endsWith('.')) {
                    cleanText = cleanText.slice(0, -1);
                }
                
                // Agregar texto final al campo
                const currentValue = currentInput.value;
                const cursorPosition = currentInput.selectionStart;
                const newValue = currentValue.slice(0, cursorPosition) + cleanText + currentValue.slice(cursorPosition);
                currentInput.value = newValue;
                
                // Mover cursor al final del texto agregado
                const newPosition = cursorPosition + cleanText.length;
                currentInput.setSelectionRange(newPosition, newPosition);
                
                // Disparar evento input para frameworks que lo necesiten
                currentInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Error de reconocimiento de voz:', event.error);
            const status = document.getElementById('sttStatus');
            if (status) status.textContent = 'Error - Haga clic en un campo';
        };
        
        recognition.onend = function() {
            const status = document.getElementById('sttStatus');
            if (status && speechToTextActive) {
                status.textContent = 'Activo - Haga clic en un campo';
            }
        };
    }

    function addInputListeners() {
        // Agregar listeners a todos los inputs y textareas existentes
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
        });
        
        // Observer para inputs dinámicos
        const observer = new MutationObserver(function(mutations) {
            if (!speechToTextActive) return;
            
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newInputs = node.querySelectorAll('input[type="text"], input[type="search"], textarea');
                        newInputs.forEach(input => {
                            input.addEventListener('focus', handleInputFocus);
                            input.addEventListener('blur', handleInputBlur);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function removeInputListeners() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
        inputs.forEach(input => {
            input.removeEventListener('focus', handleInputFocus);
            input.removeEventListener('blur', handleInputBlur);
        });
    }

    function handleInputFocus(event) {
        if (!speechToTextActive) return;
        
        currentInput = event.target;
        currentInput.classList.add('voice-input-active');
        
        const status = document.getElementById('sttStatus');
        if (status) status.textContent = 'Campo activo - Hable ahora';
        
        if (recognition) {
            recognition.start();
        }
    }

    function handleInputBlur(event) {
        if (!speechToTextActive) return;
        
        if (currentInput) {
            currentInput.classList.remove('voice-input-active');
        }
        currentInput = null;
        
        const status = document.getElementById('sttStatus');
        if (status) status.textContent = 'Activo - Haga clic en un campo';
        
        if (recognition) {
            recognition.stop();
        }
    }

    // WRF Modal functions
    function openWRFModal() {
        const modal = document.getElementById('wrfModal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeWRFModal() {
        const modal = document.getElementById('wrfModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('wrfModal');
        if (event.target === modal) {
            closeWRFModal();
        }
    });

    // Attach event listener to WRF button
    document.addEventListener('DOMContentLoaded', function() {
        const wrfBtn = document.getElementById('btn_wrf_info');
        if (wrfBtn) {
            wrfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openWRFModal();
            });
        }
    });