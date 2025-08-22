"use strict"

//------------------------------------------------------------------------------------------
$("#select_run").change(function(){	
//	cancel_animate();
	
	procesa_var();
});

$("#select_dat").change(function(){	
//	cancel_animate();
	
	procesa_dat();
});

$("#select_var").change(function(){
//	cancel_animate();
	
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
//Se agrego la siguiente funcion
$("#btn_rango").change(function(){	
	m_rango = 1650 - $("#btn_rango").val();
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
	m_map.removeLayer(window.filtered_layer)
	if (m_dlayer.layer) m_dlayer.layer.setVisible(true);
	filter_color = null;
	hideInfo();
})

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

$("#controls-toggle").click(function (e) {
  e.stopPropagation();
  $(".controls-panel").addClass("expanded").removeClass("collapsed");
  $(this).hide();
});

$(document).click(function (e) {
  const panel = $(".controls-panel");
  const toggle = $("#controls-toggle");
  if (
    !panel.is(e.target) && panel.has(e.target).length === 0 &&
    !toggle.is(e.target) && toggle.has(e.target).length === 0
  ) {
    panel.removeClass("expanded").addClass("collapsed");
    toggle.show();
  }
});
$(document).on("click", "#btn_atmos", function () {
  $("#app").show();
  $("#map").show();
  $("#banner, #botones1").hide();
  $("#panel-header-text").text("Pronóstico meteorológico para el Estado de Puebla");
  m_glosario = "gatmos.html";
  m_map.updateSize();
  set_atmos();
});

$(document).on("click", "#btn_aire", function () {
  $("#app").show();
  $("#map").show();
  $("#banner, #botones1").hide();
  $("#panel_header_text").text("Calidad del aire para el Estado de Puebla");
  m_glosario = "gchem.html";
  m_map.updateSize();
  set_chem();
});

// Función para manejar la vista de historial
$(document).on("click", "#btn_hist", function () {
  $("#app").show();
  $("#map").hide();
  $("#banner, #botones1").hide();
  $("#hist").show();
  $("#historial-dashboard").show();
  $("#panel-header-text").text("Historial de Datos");
  
  // Cargar cabeceras en el selector
  loadHistoricalCabeceras();
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

    // Eventos para actualizar datos
    $('#hist-cabecera-select, #hist-tipo-select').on('change', updateHistoricalView);
  } catch (error) {
    console.error('Error cargando cabeceras:', error);
    m_notification.show('Error cargando datos históricos', 3000);
  }
}

// Función para actualizar la vista histórica
function updateHistoricalView() {
  const cabeceraId = $('#hist-cabecera-select').val();
  const tipo = $('#hist-tipo-select').val();
  
  if (!cabeceraId) return;

  // Get the last run from select element
  const runs = document.getElementById('select_run');
  const lastRun = runs.options[runs.options.length - 1].value;
  
  // Parse the run directory name (e.g., "2024081900")
  const runDir = lastRun.split('/').pop(); // Get last part of path
  const runDate = runDir.substring(0, 8);   // "20240819"
  const runHour = runDir.substring(8, 10);  // "00"
  
  // Construct the correct file path
  const basePath = 'runs';
  const fileName = `wrf_${tipo === 'meteo' ? 'meteo' : 'chem'}_${cabeceraId}_${runDate}_${runHour}z.json`;
  const path = `${basePath}/${runDir}/cabeceras/${tipo === 'meteo' ? 'meteo' : 'chem'}/${fileName}`;

  console.log('Loading historical data from:', path);
  
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
    });
}

const sideMenu = document.getElementById("side-menu");

// Solo en escritorio
if (window.innerWidth > 768) {
  // Expandir al pasar el mouse
  sideMenu.addEventListener("mouseenter", () => {
    sideMenu.classList.add("expanded");
  });

  // Contraer al salir el mouse del menú
  sideMenu.addEventListener("mouseleave", () => {
    sideMenu.classList.remove("expanded");
  });

  // Clic en botones del menú => contraer
  ["btn_atmos", "btn_aire", "btn_hist"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => {
        sideMenu.classList.remove("expanded");
      });
    }
  });
}
