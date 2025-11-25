// Reenviar clicks de las versiones móviles (IDs nuevos) a los botones laterales reales
$(document).on('click', '#btn_atmos_mobile', function(e){ e.preventDefault(); $('#btn_atmos').trigger('click'); });
$(document).on('click', '#btn_aire_mobile', function(e){ e.preventDefault(); $('#btn_aire').trigger('click'); });
$(document).on('click', '#btn_hist_mobile', function(e){ 
  e.preventDefault(); 
  // Para móviles, primero inicializar el mapa para cargar datos
  $('#btn_atmos').trigger('click');
  // Después de un tiempo corto, mostrar el historial
  setTimeout(function() {
    $('#btn_hist').trigger('click');
  }, 1); // 800ms para asegurar que los datos se carguen
});
"use strict"

//------------------------------------------------------------------------------------------
$("#select_run").change(function(){	
//	cancel_animate();
	
	procesa_var();
});

// Los parámetros ahora son botones, manejados en app.js
// $("#select_dat").change(function(){	
//	cancel_animate();
//	procesa_dat();
// });

// Ahora las variables son un select dropdown
$("#select_var").change(function(){
//	cancel_animate();
	selectedVariable = $(this).val();
	procesa_var();
});

//------------------------------------------------------------------------------------------
$("#btn_play_animation").click(function(){
	$('#btn_play_animation').attr('disabled', 'disabled');
	$('#btn_stop_animation').removeAttr('disabled');			
	$('#btn_download').attr('disabled', 'disabled');

	$('#select_run').attr('disabled', 'disabled');
	$('#select_dat').attr('disabled', 'disabled');
	$('#select_var').attr('disabled', 'disabled');
	$('#btnAnt').attr('disabled', 'disabled');
	$('#selectHora').attr('disabled', 'disabled');
	$('#btnSig').attr('disabled', 'disabled');
	
	m_animate = true;
	animate_frames();
});

//-- Inicio Modificacion--> 
//Se agrego la siguiente funcion para el control de velocidad
$("#speedSlider").change(function(){	
	m_rango = 1650 - $("#speedSlider").val();
});
//-- Fin Modificacion-->  

$("#btn_stop_animation").click(function(){
	$('#btn_play_animation').removeAttr('disabled');
	$('#btn_stop_animation').attr('disabled', 'disabled');		
	$('#btn_download').removeAttr('disabled');

	$('#select_run').removeAttr('disabled');
	$('#select_dat').removeAttr('disabled');
	$('#select_var').removeAttr('disabled');
	$('#btnAnt').removeAttr('disabled');
	$('#selectHora').removeAttr('disabled');
	$('#btnSig').removeAttr('disabled');
	
	cancel_animate();

	update_var();
	m_animate = false;	
});

//------------------------------------------------------------------------------------------
$("#menu_kml").change(function(){
	var str_msg = $('<div></div>');

	str_msg.append('<li class="span-my" id="herr_redes" style="display:block;">');
	str_msg.append('<span>');
	str_msg.append('<input type="file" accept=".kml" onchange="readURL(this);" />');
	str_msg.append('</span>');
	str_msg.append('</li>');	
	
	BootstrapDialog.show({
 		message: str_msg,
		closable: false,
		buttons: [{
				label: 'Cerrar',
				action: function(dialogRef){
						dialogRef.close();
				}
		}]		
 	});
});

//------------------------------------------------------------------------------------------
$("#selectHora").change(function(){	
	update_var();
});

$("#btnSig").click(function(){
	var count = document.getElementById("selectHora").length;
	var idx = document.getElementById('selectHora').selectedIndex;

	if(idx + 1 >= count){
		return;
	}

	document.getElementById('selectHora').selectedIndex  = idx + 1;
	$('#selectHora').change();
});

$("#btnAnt").click(function(){
	var idx = document.getElementById('selectHora').selectedIndex;

	if(idx - 1 < 0){
		return;
	}
	
	document.getElementById('selectHora').selectedIndex  = idx - 1;
	$('#selectHora').change();
});

//------------------------------------------------------------------------------------------
var m_full_scream = false;

$("#btn_full").click(function(){
	var element = document.body;

	if(!m_full_scream){
		if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
		m_full_scream = true;
	}
	else{
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		m_full_scream = false;
	}
});

//------------------------------------------------------------------------------------------
$("#btn_download").click(function(){
	m_map.once('postcompose', function(event) {
		domtoimage.toPng(document.getElementById('map'))
			.then(function (dataUrl) {
				var aLink = document.createElement('a');
				var evt = document.createEvent("MouseEvents");
				evt.initEvent("click", false, false);
				
				aLink.download = 'image.png';
				aLink.href =  dataUrl;
				aLink.dispatchEvent(evt);
	
			})
			.catch(function (error) {
					console.error('oops, something went wrong!', error);
			});		
	});

	m_map.renderSync();	
});

//------------------------------------------------------------------------------------------
$("#btn_glo").click(function(){
		BootstrapDialog.show({
			cssClass: 'modal-dialog',	
			title: "Glosario",
			closable: true,
			message: $('<div></div>').load(m_glosario)
		});	
});

$("#btn_datos").click(function(){	
	make_transaction(mUrl_api + 'api.php?tipo_solicitud=cabeceras', 'fecha', show_datos, showDialog_Error);
});

$("#btn_recarga").click(function(){
	// Limpiar filtro por color
	filter_color = null;
	// Limpiar filtro de rango numérico
	filter_range_active = false;
	filter_range_min = null;
	filter_range_max = null;
	// Remover capa filtrada
	if (window.filtered_layer) {
		try { m_map.removeLayer(window.filtered_layer); } catch(e) {}
		window.filtered_layer = null;
	}
	// Mostrar capa original inmediatamente
	if (m_dlayer && m_dlayer.layer) {
		try { 
			// Verificar si la capa está en el mapa
			const layers = m_map.getLayers();
			const layersArray = layers.getArray();
			const isInMap = layersArray.includes(m_dlayer.layer);
			
			if (!isInMap) {
				// Si no está en el mapa, agregarla
				layers.insertAt(1, m_dlayer.layer);
			}
			// Asegurarse de que sea visible
			m_dlayer.layer.setVisible(true);
		} catch(e) {
			console.error('Error al restaurar capa:', e);
		}
	}
	
	// Resetear dual inputs a valores originales
	const wrap =
		document.querySelector('#legend .legend-dual-slider-wrapper') ||
		document.querySelector('#gradient-container .legend-dual-slider-wrapper');

	if (wrap) {
		const rLow  = wrap.querySelector('.dual-range.low');
		const rHigh = wrap.querySelector('.dual-range.high');
		const inpMin = wrap.querySelector('.dual-min');
		const inpMax = wrap.querySelector('.dual-max');

		// Resetear sliders a posición inicial
		if (rLow)  rLow.value  = 0;
		if (rHigh) rHigh.value = 1000;
		
		// Establecer valores originales en los inputs
		if (typeof window.gradientMin === 'number' && typeof window.gradientMax === 'number') {
			if (inpMin) inpMin.value = window.gradientMin.toFixed(1);
			if (inpMax) inpMax.value = window.gradientMax.toFixed(1);
		}
	}
	
	// Ocultar info de filtro
	hideInfo();
	// Limpiar indicador visual si existe
	const filterIndicator = document.getElementById('filter-indicator');
	if (filterIndicator) {
		filterIndicator.classList.remove('active');
	}
})

// Nuevo: botón Aplicar Cambios (placeholder para lógica futura)
$("#btn_aplicar").click(function(){
  console.log('Aplicar Cambios: ejecutar lógica de actualización manual aquí');
  // Ejemplo: forzar recarga de la variable actual
  try {
    if (typeof update_var === 'function') {
      update_var();
    }
  } catch(e){
    console.warn('Error al aplicar cambios:', e);
  }
});

// Función para mostrar y ocultar el menú
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('active');
}

// Cerrar el menú si el usuario hace clic fuera de él
window.onclick = function(event) {
  const menu = document.getElementById("nav-links");
  const hamburger = document.getElementsByClassName("hamburger-menu")[0];

  // Verifica si el clic fue fuera del menú o del botón hamburguesa
  if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
    menu.classList.remove('active'); // Cierra el menú
  }
}

// Weather Controls Panel Toggle
$("#toggle-controls-btn").click(function (e) {
  e.stopPropagation();
  $("#weather-controls").addClass("is-open");
});

$("#close-controls-btn").click(function (e) {
  e.stopPropagation();
  if (window.matchMedia("(max-width: 768px)").matches) {
  $("#weather-controls").removeClass("is-open");
  }
});

// Close panel when clicking outside (solo en móvil)
$(document).click(function (e) {
  // Solo cerrar al hacer clic fuera en pantallas móviles (menor a 768px)
  if (window.matchMedia("(max-width: 768px)").matches) {
    const panel = $("#weather-controls");
    const toggleBtn = $("#toggle-controls-btn");
    if (
      !panel.is(e.target) && panel.has(e.target).length === 0 &&
      !toggleBtn.is(e.target) && toggleBtn.has(e.target).length === 0
    ) {
      panel.removeClass("is-open");
    }
  }
});
$(document).on("click", "#btn_atmos", function () {
  $("#app").show();
  $("#map").show();
  $("#hist").hide();
  $("#historial-dashboard").hide();
  $("#banner, #botones1").hide();
  
  // Mostrar side-menu-right y filter-info cuando se vuelve al mapa
  $(".side-menu-right").show();
  $("#filter-info").show();
  
  // Activar modo mapa
  document.body.classList.add('map-active');
  
  $("#panel-header-text").text("Pronóstico de Clima del Estado de Puebla");
  const t = $("#panel-header-text").text();
  $("#controls-header-title").text(t);
  m_glosario = "gatmos.html";
  
  // Limpiar estado del historial
  resetHistorialState();

  // Actualizar estado activo de los botones del menú
  try {
    document.querySelectorAll('.menu-btn').forEach(b => {
      b.classList.remove('active');
      // Limpiar estilos inline
      b.style.background = '';
      b.style.backgroundColor = '';
      b.style.color = '';
      b.style.border = '';
      b.style.boxShadow = '';
    });
    const atmosBtn = document.getElementById('btn_atmos');
    if (atmosBtn) atmosBtn.classList.add('active');
  } catch (error) {
    console.error('Error actualizando estado del menú:', error);
  }
  
  m_map.updateSize();
  set_atmos();
  
  // Abrir automáticamente el panel de control con delay para asegurar que el DOM esté listo
  setTimeout(function() {
    $("#weather-controls").addClass("is-open");
  }, 200);
});

$(document).on("click", "#btn_aire", function () {
  $("#app").show();
  $("#map").show();
  $("#hist").hide();
  $("#historial-dashboard").hide();
  $("#banner, #botones1").hide();
  
  // Mostrar side-menu-right y filter-info cuando se vuelve al mapa
  $(".side-menu-right").show();
  $("#filter-info").show();
  
  // Activar modo mapa
  document.body.classList.add('map-active');

  $("#panel-header-text").text("Pronóstico de Calidad del Aire del Estado de Puebla");
  const t = $("#panel-header-text").text();
  $("#controls-header-title").text(t);
  m_glosario = "gchem.html";
  
  // Limpiar estado del historial
  resetHistorialState();

  // Actualizar estado activo de los botones del menú
  try {
    document.querySelectorAll('.menu-btn').forEach(b => {
      b.classList.remove('active');
      // Limpiar estilos inline
      b.style.background = '';
      b.style.backgroundColor = '';
      b.style.color = '';
      b.style.border = '';
      b.style.boxShadow = '';
    });
    const aireBtn = document.getElementById('btn_aire');
    if (aireBtn) aireBtn.classList.add('active');
  } catch (error) {
    console.error('Error actualizando estado del menú:', error);
  }
  
  m_map.updateSize();
  set_chem();
  
  // Abrir automáticamente el panel de control con delay para asegurar que el DOM esté listo
  setTimeout(function() {
    $("#weather-controls").addClass("is-open");
  }, 200);
});

// Función para manejar la vista de historial
$(document).on("click", "#btn_hist", function () {
  $("#app").show();
  $("#map").hide();
  $("#banner, #botones1").hide();
  $("#hist").show();
  $("#historial-dashboard").show();
  
  // Ocultar side-menu-right y filter-info cuando se muestra el historial
  $(".side-menu-right").hide();
  $("#filter-info").hide();
  
  // Cerrar weather-controls en móvil cuando se abre el historial

  
  $("#weather-controls").removeClass("is-open");
  
  // Desactivar el modo mapa para que el historial tenga espacio completo
  document.body.classList.remove('map-active');
  
  $("#panel-header-text").text("Historial de Datos");
  const t = $("#panel-header-text").text();
  $("#controls-header-title").text(t);
  // Salir del modo mapa para liberar el layout y permitir ancho completo
  // Actualizar estado activo de los botones del menú
  try {
    document.querySelectorAll('.menu-btn').forEach(b => {
      b.classList.remove('active');
      // Limpiar estilos inline
      b.style.background = '';
      b.style.backgroundColor = '';
      b.style.color = '';
      b.style.border = '';
      b.style.boxShadow = '';
    });
    const histBtn = document.getElementById('btn_hist');
    if (histBtn) histBtn.classList.add('active');
  } catch (error) {
    console.error('Error actualizando estado del menú:', error);
  }
  // Marcar como vacío al iniciar (no hay municipio seleccionado todavía)
  const dash = document.getElementById('historial-dashboard');
  if (dash) dash.classList.add('historial-empty');
  
  // Cargar cabeceras en el selector
  loadHistoricalCabeceras();
  
  // Initialize variable toggles for initial type - seleccionar todas al inicio
  createVariableToggles($("#hist-tipo-select").val(), true);
});

// Función para cargar las cabeceras
async function loadHistoricalCabeceras() {
  try {
    const features = m_vectorSource.getFeatures();
    const select = document.getElementById('hist-cabecera-select');
    select.innerHTML = '<option value="">Seleccione un municipio</option>';
    
    // Filtrar solo las cabeceras y ordenar por nombre
    const cabeceras = features
      .filter(feature => feature.get('local') === 'cabecera')
      .sort((a, b) => a.get('nombre').localeCompare(b.get('nombre')));

    cabeceras.forEach(feature => {
      const option = document.createElement('option');
      option.value = feature.get('clave');
      option.textContent = feature.get('nombre');
      select.appendChild(option);
    });

    // Eventos para actualizar datos - remover listeners previos para evitar duplicados
    $('#hist-cabecera-select, #hist-tipo-select').off('change', updateHistoricalView).on('change', updateHistoricalView);
  } catch (error) {
    console.error('Error cargando cabeceras:', error);
    m_notification.show('Error cargando datos históricos', 3000);
  }
}

// Variables para tracking de cambios
let updateHistoricalViewTimeout = null;
let lastCabeceraId = null;
let lastTipo = null;

// Sincronizar título del header de controles al iniciar
$(function(){
  const initText = $("#panel-header-text").text();
  if (initText) {
    $("#controls-header-title").text(initText);
  }
});

// Función para actualizar la vista histórica
function updateHistoricalView() {
  // Limpiar timeout anterior para evitar múltiples llamadas
  if (updateHistoricalViewTimeout) {
    clearTimeout(updateHistoricalViewTimeout);
  }
  
  // Usar timeout para throttling
  updateHistoricalViewTimeout = setTimeout(() => {
    const cabeceraId = $('#hist-cabecera-select').val();
    const tipo = $('#hist-tipo-select').val();
    
    if (!cabeceraId) {
      // Limpiar tabla si no hay municipio seleccionado
      const tbody = document.getElementById('histStatsTable');
      if (tbody) tbody.innerHTML = '';
      lastCabeceraId = null;
      lastTipo = tipo;
      // Marcar historial vacío (sin gráficas)
      const dash = document.getElementById('historial-dashboard');
      if (dash) dash.classList.add('historial-empty');
      return;
    }
    
    // Detectar qué cambió
    const municipioChanged = lastCabeceraId !== cabeceraId;
    const tipoChanged = lastTipo !== tipo;
    
    // Actualizar tracking
    lastCabeceraId = cabeceraId;
    lastTipo = tipo;
    
    // Si cambió el tipo, recrear toggles con todas las variables seleccionadas
    // Si solo cambió el municipio, mantener variables seleccionadas actuales
    if (tipoChanged && typeof createVariableToggles === 'function') {
      createVariableToggles(tipo, true); // Seleccionar todas al cambiar tipo
    } else if (municipioChanged && typeof createVariableToggles === 'function') {
      createVariableToggles(tipo, false); // Mantener selección al cambiar municipio
    }

    // ARREGLO: Usar el nuevo sistema de runs
    if (!window.selectedRunData) {
      console.error('No hay datos de run seleccionados disponibles');
      $('#hist-content').html(`
        <div class="alert alert-warning">
          <h4>No hay datos disponibles</h4>
          <p>Por favor, selecciona una fecha de pronóstico primero.</p>
        </div>
      `);
      return;
    }
    
    // Usar los datos de la run seleccionada del nuevo sistema
    const runData = window.selectedRunData;
    const runDate = runData.year.toString() + 
                    String(runData.month).padStart(2, '0') + 
                    String(runData.day).padStart(2, '0');
    const runHour = String(runData.hour).padStart(2, '0');
    const runDir = runData.name; // Nombre completo como "2025103000"
    
    // Construct the correct file path for cabeceras
    const basePath = 'runs';
    const fileName = `wrf_${tipo === 'meteo' ? 'meteo' : 'chem'}_${cabeceraId}_${runDate}_${runHour}z.json`;
    // Usar la carpeta 'cabeceras' como fuente canónica de datos por municipio
    const path = `${basePath}/${runDir}/cabeceras/${tipo === 'meteo' ? 'meteo' : 'chem'}/${fileName}`;

    console.log('🔍 Loading historical data from:', path);
    console.log('📊 Using run data:', runData);
  
  const contentDiv = $('#hist-content');
  contentDiv.empty();
  
  // Add loading indicator
  contentDiv.html(`
    <div class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
      <p class="mt-2">Cargando datos para ${fileName}...</p>
    </div>
  `);
  
  // Try to load the data
  fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      contentDiv.empty();
      createHistoricalView(path, contentDiv, tipo);
      // Después de crear vistas, quitar clase de vacío si se generaron charts
      requestAnimationFrame(() => {
        const chartsHost = document.getElementById('chartsHost');
        const dash = document.getElementById('historial-dashboard');
        if (dash) {
          if (chartsHost && chartsHost.children.length > 0) {
            dash.classList.remove('historial-empty');
          } else {
            dash.classList.add('historial-empty');
          }
          evaluateHistorialScroll();
        }
      });
    })
    .catch(error => {
      contentDiv.html(`
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error cargando datos</h4>
          <p>${error.message}</p>
          <hr>
          <p class="mb-0">Archivo: ${path}</p>
        </div>
      `);
      console.error('Error:', error);
      const dash = document.getElementById('historial-dashboard');
      if (dash) dash.classList.add('historial-empty');
      evaluateHistorialScroll();
    });
  }, 300); // 300ms de throttling
}




// Función para resetear el estado del historial
function resetHistorialState() {
  try {
    // Limpiar municipio seleccionado
    const cabeceraSelect = document.getElementById('hist-cabecera-select');
    if (cabeceraSelect) {
      cabeceraSelect.value = '';
    }
    
    // Limpiar input del combobox también
    const comboboxInput = document.querySelector('#hist-combobox input.form-control');
    if (comboboxInput) {
      comboboxInput.value = '';
    }
    
    // Resetear select de tipo a variables meteorológicas
    const tipoSelect = document.getElementById('hist-tipo-select');
    if (tipoSelect) {
      tipoSelect.value = 'meteo';
    }
    
    // Limpiar datos actuales
    if (typeof currentHistData !== 'undefined') {
      currentHistData = null;
    }
    
    // Limpiar variables seleccionadas
    if (typeof selectedVariables !== 'undefined') {
      selectedVariables.clear();
    }
    
    // Limpiar contenido del historial
    const histContent = document.getElementById('hist-content');
    if (histContent) {
      histContent.innerHTML = '';
    }
    
    // Limpiar container de gráficas
    const chartsHost = document.getElementById('chartsHost');
    if (chartsHost) {
      chartsHost.innerHTML = '';
    }
    
    // Limpiar tabla de estadísticas
    const statsTable = document.getElementById('histStatsTable');
    if (statsTable) {
      statsTable.innerHTML = '';
    }
    
    // Ocultar lista de combobox
    const comboboxList = document.getElementById('hist-combobox-list');
    if (comboboxList) {
      comboboxList.style.display = 'none';
    }
    
    // Limpiar gráficas si existen
    if (typeof destroyHistCharts === 'function') {
      destroyHistCharts();
    }
    
    // Recrear toggles para el tipo por defecto
    if (typeof createVariableToggles === 'function') {
      createVariableToggles('meteo', true);
    }
    
    // Resetear variables de tracking
    lastCabeceraId = null;
    lastTipo = 'meteo';

    // Marcar historial vacío (no hay aún contenido)
    const dash = document.getElementById('historial-dashboard');
    if (dash) dash.classList.add('historial-empty');
    evaluateHistorialScroll();
    
  } catch (error) {
    console.error('Error reseteando estado del historial:', error);
  }
}

// Evalúa si el contenido del historial requiere scroll y ajusta clases
function evaluateHistorialScroll() {
  const dash = document.getElementById('historial-dashboard');
  if (!dash) return;
  
  // Limpiar clases previas de control
  dash.classList.remove('no-scroll','force-scroll');
  
  // Usar un timeout mayor para asegurar que las gráficas se hayan renderizado completamente
  setTimeout(() => {
    const chartsHost = document.getElementById('chartsHost');
    const statsContainer = document.querySelector('.stats-container');
    
    // Verificar si hay contenido que requiera scroll
    const hasCharts = chartsHost && chartsHost.children.length > 0;
    const hasStats = statsContainer && statsContainer.offsetHeight > 0;
    
    if (hasCharts || hasStats) {
      dash.classList.add('force-scroll');
      // Asegurar que el contenedor tenga el scroll habilitado
      dash.style.overflowY = 'auto';
    } else {
      dash.classList.add('no-scroll');
    }
    
    // Verificar específicamente si el contenido excede el contenedor
    const needsScroll = dash.scrollHeight > dash.clientHeight + 5; // tolerancia mayor
    if (needsScroll) {
      dash.style.overflowY = 'auto';
    }
  }, 500); // Aumentar el tiempo para permitir renderizado completo
}

// Re-evaluar al cambiar tamaño de la ventana
window.addEventListener('resize', () => {
  evaluateHistorialScroll();
});

// Función para verificar y corregir el estado visual del menú
function updateMenuVisualState() {
  try {
    // Verificar si algún botón tiene la clase active
    const activeButtons = document.querySelectorAll('.menu-btn.active');
    
    if (activeButtons.length === 0) {
      // Si no hay botón activo, activar meteorología por defecto
      const atmosBtn = document.getElementById('btn_atmos');
      if (atmosBtn) {
        atmosBtn.classList.add('active');
        console.log('Activando botón meteorología por defecto');
      }
    }
    
    console.log('Estado actual del menú:', {
      atmos: document.getElementById('btn_atmos')?.classList.contains('active'),
      aire: document.getElementById('btn_aire')?.classList.contains('active'),
      hist: document.getElementById('btn_hist')?.classList.contains('active')
    });
  } catch (error) {
    console.error('Error verificando estado del menú:', error);
  }
}

// Ejecutar cuando el DOM esté listo
$(document).ready(function() {
  // Pequeño delay para asegurar que todos los elementos estén cargados
  setTimeout(updateMenuVisualState, 100);
});

$(document).ready(function() {
  $('#read-more-btn').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('show-more');
    if ($('body').hasClass('show-more')) {
      $(this).text('Ver menos...');
    } else {
      $(this).text('Ver más...');
    }
  });
});

// Inicializar tooltips flotantes globalmente (clon-based) para evitar clipping por el mapa
(function attachFloatingTooltipsGlobal(){
  function getTooltipTextFromButton(btn){
    const attr = btn.getAttribute('data-tooltip') || btn.getAttribute('title') || btn.getAttribute('aria-label') || btn.dataset.name;
    if(attr && attr.trim()) return attr.trim();
    // Fallback to visible label inside the button (avoid icon-only markup)
    const inner = btn.querySelector('.menu-tooltip')?.innerText || btn.innerText || '';
    return inner.trim();
  }

  function createFloatingTip(btn){
    // Try to reuse an existing .menu-tooltip if available
    const tip = btn.querySelector('.menu-tooltip');

    // If a clone already exists and is inside the root, return it
    if(tip && tip._clone && document.getElementById('floating-tooltips-root') && document.getElementById('floating-tooltips-root').contains(tip._clone)) return tip._clone;

    // Ensure a root container exists
    let root = document.getElementById('floating-tooltips-root');
    if(!root){
      root = document.createElement('div');
      root.id = 'floating-tooltips-root';
      document.body.appendChild(root);
    }

    // Create clone element
    const clone = document.createElement('div');
    clone.className = 'floating-tooltip-clone';
    // Ensure tooltip is positioned above everything and doesn't block pointer events
    clone.style.position = 'absolute';
    clone.style.zIndex = '2147483647';
    clone.style.pointerEvents = 'none';
    clone.style.display = 'block';
    // Minimal styling fallback so tooltip is readable when no CSS exists
    clone.style.background = clone.style.background || 'rgba(0,0,0,0.85)';
    clone.style.color = clone.style.color || '#fff';
    clone.style.padding = clone.style.padding || '6px 10px';
    clone.style.borderRadius = clone.style.borderRadius || '4px';
    clone.style.whiteSpace = 'nowrap';
    clone.style.boxShadow = clone.style.boxShadow || '0 2px 8px rgba(0,0,0,0.2)';

    // Content: prefer existing .menu-tooltip HTML, otherwise use derived text
    if(tip && tip.innerHTML && tip.innerHTML.trim()){
      clone.innerHTML = tip.innerHTML;
    } else {
      const text = getTooltipTextFromButton(btn) || '';
      clone.textContent = text;
    }

    // Attach references for later removal
    if(tip) tip._clone = clone;
    else btn._generatedTooltipClone = clone;

    root.appendChild(clone);
    return clone;
  }

  function showFloating(evt){
    const btn = evt.currentTarget;
    // Ensure we have some text to show
    const txt = getTooltipTextFromButton(btn);
    if(!txt) return;
    const clone = createFloatingTip(btn);
    if(!clone) return;

    // Put the clone offscreen & hidden for measurement
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    clone.style.visibility = 'hidden';
    clone.classList.add('show');

    // Force a reflow to ensure offsetWidth/Height are available
    const rectBtn = btn.getBoundingClientRect();
    const w = clone.offsetWidth || clone.getBoundingClientRect().width;
    const h = clone.offsetHeight || clone.getBoundingClientRect().height;

    // Use smaller gaps so the tooltip sits closer to the button
    const GAP = 6;       // horizontal distance in px
    const VERT_GAP = 4;  // vertical min distance in px

    // Compute preferred position to the right of the button, fallback to left
    const docLeft = rectBtn.right + GAP + window.pageXOffset;
    const altLeft = rectBtn.left - w - GAP + window.pageXOffset;
    let left = docLeft;
    if (docLeft + w + GAP - window.pageXOffset > window.innerWidth) left = altLeft;
    left = Math.max(GAP + window.pageXOffset, Math.min((document.documentElement.scrollWidth - w - GAP), left));

    // Center vertically relative to the button
    let top = rectBtn.top + (rectBtn.height - h) / 2 + window.pageYOffset;
    top = Math.max(VERT_GAP + window.pageYOffset, Math.min(document.documentElement.scrollHeight - h - VERT_GAP, top));

    clone.style.left = left + 'px';
    clone.style.top = top + 'px';
    clone.style.visibility = 'visible';
  }

  function hideFloating(evt){
    const btn = evt.currentTarget;
    const tip = btn.querySelector ? btn.querySelector('.menu-tooltip') : null;
    const clone = (tip && tip._clone) ? tip._clone : btn._generatedTooltipClone;
    if(!clone) return;
    clone.classList.remove('show');
    // remove after short delay to allow CSS hide transition if any
    setTimeout(()=>{ try { if(clone.parentNode) clone.parentNode.removeChild(clone); } catch(e){}; if(tip) tip._clone = null; delete btn._generatedTooltipClone; }, 160);
  }

  function init(){
    const buttons = document.querySelectorAll('.side-menu .menu-btn, .side-menu .play-btn, .side-menu .back-btn');
    buttons.forEach(b => {
      if(b._tooltipInit) return; b._tooltipInit = true;
      b.addEventListener('mouseenter', showFloating);
      b.addEventListener('focus', showFloating);
      b.addEventListener('mouseleave', hideFloating);
      b.addEventListener('blur', hideFloating);
      b.addEventListener('touchstart', function(e){ showFloating({ currentTarget: b }); });
      b.addEventListener('touchend', function(e){ hideFloating({ currentTarget: b }); });
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  const obs = new MutationObserver(() => init());
  obs.observe(document.body, { childList: true, subtree: true });
})();