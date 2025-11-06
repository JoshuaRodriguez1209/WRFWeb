"use strict";

//------------------------------------------------------------------------------------------
//---------------------------CDataLayer-------------------------------------------------------
function CDataLayer(map, tipo = "add", str_file = null) {
  this.tipo = tipo;
  this.layer = null;

  this.fecha_img = "";

  this.tipo_barra = TEMP;
  this.unidades = "";
  this.img_escala = m_img_temp;
  this.fecha_loc = "";

  this.imageExtent = [LEFT, BOTTOM, RIGTH, TOP];

  if (str_file != null) {
    set_layer(map, str_file, this.tipo, this);
    this.img = new Image();
    this.img.crossOrigin = "anonymous";
    this.img.src = str_file;
  } else {
    this.layer = new ol.layer.Image({
      opacity: 0.6,
      source: new ol.source.ImageStatic({
        url: "./images/black.png",
        crossOrigin: "anonymous",
        imageExtent: this.imageExtent,
      }),
    });

    // Aplicar recorte también a la capa por defecto
    if (typeof clipLayer === 'function') {
      clipLayer(this.layer);
    }

    map.getLayers().insertAt(1, this.layer);
  }
}

CDataLayer.prototype.setParam = function (str_file) {
  // Guardar y validar antes de continuar
  if (typeof str_file !== 'string' || !str_file.length) {
    console.warn('setParam: str_file inválido, se omite procesamiento:', str_file);
    return;
  }
  this.setBar(str_file);

  var pos = str_file.lastIndexOf("/");
  var str_name = str_file.substring(pos + 1);

  var pos_pt = str_name.lastIndexOf(".");

  this.fecha_img = str_name.substring(0, pos_pt); //Fecha de la imagen

  var ls = this.fecha_img.split("_");

  var p = 2;
  if (ls.length == 6) {
    p = 3;
  }

  var str =
    ls[p].substring(0, 4) +
    "/" +
    ls[p].substring(4, 6) +
    "/" +
    ls[p].substring(6);
  var f = new Date(str + " UTC");

  f.setHours(f.getHours() + parseInt(ls[p + 1].substring(0, 2)));
  f.setHours(f.getHours() + parseInt(ls[p + 2]));
  var fecha_loc =
    this.pad(f.getDate(), 2) +
    "/" +
    this.pad(f.getMonth() + 1, 2) +
    "/" +
    f.getFullYear() +
    " " +
    this.pad(f.getHours(), 2) +
    "hs";
  this.fecha_loc = fecha_loc;
};

CDataLayer.prototype.pad = function (num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
};

CDataLayer.prototype.setBar = function (str_file) {
  if (typeof str_file !== 'string') {
    console.warn('setBar: str_file no es string:', str_file);
    return;
  }
  if (!str_file) {
    console.warn('setBar: str_file vacío');
    return;
  }
  // Obtener el texto de la variable seleccionada en el select
  const getActiveVariableText = () => {
    const selectVar = document.getElementById('select_var');
    const txt = (selectVar && selectVar.selectedIndex >= 0) ? selectVar.options[selectVar.selectedIndex].text : '';
    if (!txt || txt.trim().toLowerCase() === 'variable') {
      return window.currentVariableLabel || txt || 'Variable';
    }
    return txt;
  };
  if (str_file.indexOf("temmax") > 0 || str_file.indexOf("temmin") > 0) {
    this.tipo_barra = TEMP;
    this.unidades = " °C";
    this.img_escala = m_img_temp; //Cambiar la barra de escala
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "TEMP",
      this.unidades,
      getActiveVariableText()
    );
  } else if (str_file.indexOf("psfc") > 0) {
    this.tipo_barra = TEMP;
    this.unidades = " hPa";
    this.img_escala = m_img_templev;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "TEMP",
      this.unidades,
      getActiveVariableText()
    );
  } else if (str_file.indexOf("_temp_") > 0) {
    this.tipo_barra = TEMPLEV;
    this.unidades = " °C";
    this.img_escala = m_img_templev;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "TEMPLEV",
      this.unidades,
      getActiveVariableText()
    );
  } else if (str_file.indexOf("_CO_") > 0) {
    this.tipo_barra = CO;
    this.unidades = " PPB";
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "CO",
      this.unidades,
      getActiveVariableText()
    );
    this.img_escala = m_img_co;
  } else if (str_file.indexOf("_NO2_") > 0) {
    this.tipo_barra = NO2;
    this.unidades = " PPB";
    this.img_escala = m_img_no2;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "NO2",
      this.unidades,
      getActiveVariableText()
    )
  } else if (str_file.indexOf("_O3_") > 0) {
    this.tipo_barra = O3;
    this.unidades = " PPB";
    this.img_escala = m_img_o3;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "O3",
      this.unidades,
      getActiveVariableText()
    )
  } else if (str_file.indexOf("_SO2_") > 0) {
    this.tipo_barra = SO2;
    this.unidades = " PPB";
    this.img_escala = m_img_so2;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "SO2",
      this.unidades,
      getActiveVariableText()
    )
  } else if (str_file.indexOf("_PM10_") > 0) {
    this.tipo_barra = PM10;
    this.unidades = " PPB";
    this.img_escala = m_img_pm10;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "PM10",
      this.unidades,
      getActiveVariableText()
    )
  } else if (str_file.indexOf("_PM25_") > 0) {
    this.tipo_barra = PM25;
    this.unidades = " PPB";
    this.img_escala = m_img_pm25;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "PM25",
      this.unidades,
      getActiveVariableText()
    )
  } else if (str_file.indexOf("humrel") > 0) {
    this.tipo_barra = HUM;
    this.unidades = " %";
    this.img_escala = m_img_hum;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "HUM",
      this.unidades,
      getActiveVariableText()
    );
  } else if (str_file.indexOf("precacum") > 0) {
    this.tipo_barra = RAIN;
    this.unidades = " mm";
    this.img_escala = m_img_prec;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "RAIN",
      this.unidades,
      getActiveVariableText()
    );
  } else if (str_file.indexOf("_sw_") > 0) {
    this.tipo_barra = SRAD;
    this.unidades = " watts/m^2";
    this.img_escala = m_img_srad;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "SRAD",
      this.unidades,
      getActiveVariableText()
    );
  } else if (str_file.indexOf("_lw_") > 0) {
    this.tipo_barra = LRAD;
    this.unidades = " watts/m^2";
    this.img_escala = m_img_lrad;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "LRAD",
      this.unidades,
      getActiveVariableText()
    );
  } else if (str_file.indexOf("wind") > 0) {
    this.tipo_barra = WIND;
    this.unidades = " km/h";
    this.img_escala = m_img_wind;
    loadGradientDataFromCSV(
      "./color_scale.csv",
      "WIND",
      this.unidades,
      getActiveVariableText()
    );
  }
};

//------------------------------------------------------------------------------------------
//---------------------------CValor-------------------------------------------------------
function CValor(strval, val) {
  this.strval = strval;
  this.val = val;
}

//------------------------------------------------------------------------------------------
//---------------------------CBarra-------------------------------------------------------
function CBarra(img, xmin, xmax, interv) {
  /*
	this.vals = [];
	
	var canvas = document.createElement('canvas');
	canvas.width  = img.width;
	canvas.height = img.height;

	var context = canvas.getContext('2d');
	context.drawImage(img, 0, 0);

	var posval = xmin;
	var tam = Math.trunc(img.width / ((xmax - xmin) / interv)); 
	
	for (var i = posini; i < img.width; i+=tam){
		var strval = JSON.stringify(context.getImageData(i, 12, 1, 1).data); //12 es la midad de la barra
		var val = posval;
		
		posval += interv;
		this.vals.push(new CValor(strval, val));				
	}

*/
  this.vals = [];

  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(img, 0, 0);

  var posval = xmin;
  var tam = Math.trunc(img.width / (xmax - xmin));
  var tam2 = tam * interv;

  for (var i = tam2; i < img.width; i += tam2) {
    var strval = JSON.stringify(context.getImageData(i, 12, 1, 1).data); //12 es la midad de la barra
    var val = posval;

    posval += interv;
    this.vals.push(new CValor(strval, val));
  }
}

CBarra.prototype.busca = function (valor) {
  for (var i = 0; i < this.vals.length; i++) {
    if (this.vals[i].strval == valor) {
      return this.vals[i].val;
    }
  }

  console.log(valor);
  return "---";
};

async function loadGradientDataFromCSV(path, variable, units, title) {
  const response = await fetch(path);
  const text = await response.text();

  const rows = text.trim().split("\n").slice(1);
  const filtered = rows
    .map((row) => row.split(","))
    .filter(([hex, value, varName]) => varName.trim() === variable);
  const colors = filtered.map(([hex]) => hex.trim()).reverse();
  const values = filtered.map(([_, val]) => parseFloat(val.trim()));
  const values_re = filtered.map(([_, val]) => parseFloat(val.trim())).reverse();
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Exponer globalmente para filtros numéricos
  window.gradientMin = min;
  window.gradientMax = max;
  
  // Actualizar dual-inputs si existen
  if (typeof window.updateDualInputs === 'function') {
    window.updateDualInputs();
  }
  
  const stops = values.map((v) => ((v - min) / (max - min)) * 100);
  const canvas = document.getElementById("dynamic-gradient-canvas");
  const ctx = canvas.getContext("2d");

  window.gradientLookup = colors.map((hex, i) => ({
  hex,       
  value: values_re[i],
  }));

  // Ajustar el canvas si estamos en modo horizontal (clase gradient-bar-horizontal)
  if (canvas.classList.contains('gradient-bar-horizontal')) {
    // Aseguramos un ancho adecuado si aún no se ha definido dinámicamente
    if (canvas.width < 200) {
      canvas.width = 240; // ancho base
    }
    canvas.height = 22; // altura fija para barra horizontal
    // Gradiente horizontal de derecha a izquierda (x inicia en canvas.width -> 0)
    const grd = ctx.createLinearGradient(canvas.width, 0, 0, 0);
    for (let i = 0; i < colors.length; i++) {
      grd.addColorStop(stops[i] / 100, colors[i]);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Modo vertical (fallback)
    const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    for (let i = 0; i < colors.length; i++) {
      grd.addColorStop(stops[i] / 100, colors[i]);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Aplicar el mismo gradiente al dual-slider-container
  const sliderContainer = document.querySelector('.dual-slider-container');
  if (sliderContainer && canvas.classList.contains('gradient-bar-horizontal')) {
    // Crear CSS gradient string con los mismos colores y stops
    // Canvas usa gradiente de derecha a izquierda, así que invertimos en CSS: 270deg (right to left)
    const gradientStops = colors.map((color, i) => `${color} ${stops[i]}%`).join(', ');
    sliderContainer.style.background = `linear-gradient(270deg, ${gradientStops})`;
  }
  
  const varLabel = document.getElementById("gradient-variable-label") || document.getElementById("gradient-title") || document.getElementById("legend-title");
  const unitEl = document.getElementById("gradient-units");
  if (varLabel) {
    // Mantener estructura: Nombre (unidad) - usar fallback global si no viene título
    const safeTitle = title || window.currentVariableLabel || '';
    const safeUnit = (units && units.trim()) ? ` (${units.trim()})` : '';
    // Si es legend-title no soporta innerHTML con span anidado, usar textContent
    if (varLabel.id === 'legend-title') {
      varLabel.textContent = safeTitle + safeUnit;
    } else {
      varLabel.innerHTML = `${safeTitle}<span id="gradient-units" class="gradient-inline-unit">${safeUnit}</span>`;
    }
  } else if (unitEl) {
    unitEl.textContent = units || '';
  }

  const gradientValues = document.getElementById("gradient-values") || document.getElementById("legend-labels");
  if (gradientValues) {
    gradientValues.innerHTML = "";
  }

  // Para el modo horizontal mostramos los valores en orden izquierda (max) -> derecha (min) si el gradiente es derecha->izquierda
  const steps = 10;
  const range = max - min;
  const stepSize = range / steps;

  if (canvas.classList.contains('gradient-bar-horizontal')) {
    // Usar el contenedor embebido existente si está disponible
    const inlineValues = gradientValues; // ya tiene fallback arriba
    if (inlineValues) {
      inlineValues.innerHTML = '';
      // Queremos min a la izquierda y max a la derecha (orden ascendente)
      for (let i = 0; i <= steps; i++) {
        const value = min + i * stepSize;
        const span = document.createElement('span');
        span.textContent = value.toFixed(1);
        inlineValues.appendChild(span);
      }
    }
  } else {
    // Vertical (como antes, de arriba (max) a abajo (min))
    if (gradientValues) {
      for (let i = steps; i >= 0; i--) {
        const value = min + i * stepSize;
        const label = document.createElement("div");
        label.textContent = value.toFixed(1);
        gradientValues.appendChild(label);
      }
    }
  }
}