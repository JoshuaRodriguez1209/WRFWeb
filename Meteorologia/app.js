"use strict";

// Interceptor global para optimizar canvas 2D con willReadFrequently
(function() {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
    if (contextType === '2d') {
      // Asegurar que willReadFrequently esté en true para contextos 2D
      const attrs = contextAttributes || {};
      if (!attrs.hasOwnProperty('willReadFrequently')) {
        attrs.willReadFrequently = true;
      }
      return originalGetContext.call(this, contextType, attrs);
    }
    return originalGetContext.call(this, contextType, contextAttributes);
  };
})();

//------------------------------------------------------------------------------------------
function create_layer_kml_base(titulo, tipo, str_file_kml, opacidad, bvisible) {
  const layer = new ol.layer.Vector({
    opacity: opacidad,
    title: titulo,
    type: tipo,
    visible: bvisible,
    source: new ol.source.Vector({
      url: str_file_kml,
      // Si tu KML trae estilos y quieres ignorarlos, descomenta la línea de abajo:
      // format: new ol.format.KML({ extractStyles: false }),
      format: new ol.format.KML(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 255, 255, 1)', // contorno blanco
        width: 2                           // grosor del contorno
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0)'    // sin relleno (transparente)
      })
    })
  });
  return layer;
}


//------------------------------------------------------------------------------------------
function set_layer(map, str_file_image, tipo, data_layer) {
  if (data_layer.layer != null && tipo == "add") {
    map.removeLayer(data_layer.layer);
  }

  data_layer.layer = new ol.layer.Image({
    opacity: 1,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    source: new ol.source.ImageStatic({
      url: str_file_image,
      crossOrigin: "anonymous",
      imageExtent: data_layer.imageExtent,
    }),
  });

  clipLayer(data_layer.layer); // Aplicar recorte

  data_layer.setParam(str_file_image);
  if (tipo == "add") {
    // Insertar las capas de datos debajo de las capas overlay (municipios, estaciones)
    const layers = map.getLayers();
    const layersArray = layers.getArray();
    
    // Encontrar la posición correcta: después del tile base pero antes de overlays
    let insertPosition = 1; // Por defecto después del tile base
    
    // Buscar capas overlay desde abajo hacia arriba
    for (let i = layersArray.length - 1; i >= 0; i--) {
      const layer = layersArray[i];
      const layerType = layer.get('type');
      
      // Si encontramos una capa que NO es overlay ni mask, insertar después de ella
      if (layerType !== 'overlay' && layerType !== 'mask' && layerType !== 'base') {
        insertPosition = i + 1;
        break;
      }
      // Si es una capa base, insertar después de ella
      else if (layerType === 'base') {
        insertPosition = i + 1;
        break;
      }
    }
    
    layers.insertAt(insertPosition, data_layer.layer);
    
    // Asegurar que las capas overlay sigan arriba
    setTimeout(() => {
      ensureMaskOnTop();
    }, 10);
  }
}

//---------------------------------------------------------------------------

// geometry: ol/geom/Polygon o MultiPolygon en EPSG:3857
function applyMaskToLayer(layer, geometry) {
  function drawPolygonPath(ctx, geom, transform) {
    // Soporta Polygon o MultiPolygon
    const polys = geom.getType() === 'Polygon' ? [geom.getCoordinates()] : geom.getCoordinates();
    ctx.beginPath();
    for (const rings of polys) {
      for (const ring of rings) {
        for (let i = 0; i < ring.length; i++) {
          const c = ring[i];
          const x = c[0] * transform[0] + c[1] * transform[2] + transform[4];
          const y = c[0] * transform[1] + c[1] * transform[3] + transform[5];
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
    }
  }

  const pre = (e) => {
    // Solo Canvas renderer
    if (!e.context || !e.frameState) return;
    const ctx = e.context;
    const t = e.frameState.coordinateToPixelTransform;
    ctx.save();
    drawPolygonPath(ctx, geometry, t);
    ctx.clip(); // <-- recorta TODO lo que pinte esta capa
  };

  const post = (e) => {
    if (!e.context) return;
    e.context.restore();
  };

  // Evita duplicar listeners si ya estaban puestos
  layer.un('prerender', pre);
  layer.un('postrender', post);
  layer.on('prerender', pre);
  layer.on('postrender', post);

  // Que actualice mientras interactúas (suaviza el “parpadeo”)
  // Configuración de renderizado optimizada (las propiedades se configuran en la creación de la capa)
  if (layer.getSource() && typeof layer.getSource().setRenderReprojectionEdges === 'function') {
    // opcional: puede ayudar cuando hay reproyección
    layer.getSource().setRenderReprojectionEdges(true);
  }
}


//-------------------------------------------------------------------------------
var m_lyr_tile = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    attributions: '&copy; <a href="https://carto.com/">Carto</a>',
    maxZoom: 19,
  }),
  type: "base",
  title: "Mapa",
});
//-------------------------------------------------------------------------------
var m_layer_municipios = create_layer_kml_base(
  "Municipios",
  "overlay",
  "./kml/puebla.kml",
  0.7,
  true
);

function create_layer_kml_base(titulo, tipo, str_file_kml, opacidad, bvisible) {
  const layer = new ol.layer.Vector({
    opacity: opacidad,
    title: titulo,
    type: tipo,
    visible: bvisible,
    zIndex: 1000, // Asegurar que esté siempre arriba
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    source: new ol.source.Vector({
      url: str_file_kml,
      format: new ol.format.KML({ extractStyles: false }) // <- importante
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255,255,255,1)', // contorno blanco
        width: 2
      }),
      fill: new ol.style.Fill({ color: 'rgba(0, 0, 0, 0.4)' }) // relleno muy transparente
    })
  });
  return layer;
}

//------------------------------------------------------------------------------------------
var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(4),
  projection: "EPSG:4326",
  target: document.getElementById("mouse_position"),
  undefinedHTML: "&nbsp;",
});

//-------------------------------------------------------------------------------
var m_notification = new ol.control.Notification({
  hideOnClick: true,
  closeBox: true,
});

var notification = document.createElement("div");
notification.className = "ol-control ol-unselectable notificacion";
notification.innerHTML =
  '<button title="Desarrollo"><i class="glyphicon glyphicon glyphicon-cog"></i></button>';

notification.addEventListener("click", function () {
  m_notification.show(
    "SECRETARÍA DE MEDIO AMBIENTE, DESARROLLO SUSTENTABLE Y ORDENAMIENTO TERRITORIAL",
    5000
  );
});

var m_control = new ol.control.Control({ element: notification });

//-------------------------------------------------------------------------------
var m_view = new ol.View({
  projection: "EPSG:4326",
  center: [-97.7711, 19.0105],
  zoom: 9,
  minZoom: 9,
  maxZoom: 18,
  constrainResolution: true,
  constrainOnlyCenter: false,
  extent: [-99.08, 17.81, -96.7, 20.87],
  zoomControl: false,
});

//-------------------------------------------------------------------------------

var scaleLineControl = new ol.control.ScaleLine({
  units: "metric",
  bar: true,          // activar barra graduada
  steps: 4,           // número de segmentos visibles
  text: true,         // mostrar texto con unidad en cada actualización
  minWidth: 200,      // un poco más ancha para legibilidad
  className: "ol-scale-line",
  target: null,
});
// Guardar pasos en una propiedad estable para uso externo (evita depender de internals de OL)
scaleLineControl._customSteps = 4;

//-------------------------------------------------------------------------------

// Variable para almacenar la geometría de recorte de Puebla
let pueblaClippingGeometry = null;
let maskLayer = null;

var m_map = new ol.Map({
  renderBuffer: 2000, // Aumentar el búfer para un renderizado más suave
  controls: ol.control.defaults({ zoom: false }).extend([
    mousePositionControl,
    m_notification,
    m_control,
    scaleLineControl,
    new ol.control.LayerSwitcher({
      tipLabel: "Capas",
    }),
  ]),
  target: "map",
  layers: [m_lyr_tile, m_layer_municipios],
  view: m_view,
});
// Construir barra segmentada manual si la implementación bar:true de OL sólo deja el texto
function ensureCustomScaleBar() {
  const container = document.querySelector('.ol-scale-line-inner');
  if (!container) return;
  // Si OL ya generó un canvas con la barra, no hacemos nada
  const existingCanvas = container.querySelector('canvas');
  if (existingCanvas) return;
  let body = container.querySelector('.ol-scale-line-body');
  if (!body) {
    body = document.createElement('div');
    body.className = 'ol-scale-line-body';
    container.prepend(body); // barra arriba, texto abajo
  }
  // Número de pasos definido en el control
  const steps = scaleLineControl._customSteps || 4;
  // Asegurar cantidad de segmentos
  const needed = steps;
  const current = body.querySelectorAll('.ol-scale-line-segment').length;
  if (current !== needed) {
    body.innerHTML = '';
    for (let i = 0; i < needed; i++) {
      const seg = document.createElement('div');
      seg.className = 'ol-scale-line-segment' + (i % 2 === 1 ? ' alt' : '');
      body.appendChild(seg);
    }
  }
  // Añadir contenedor de ticks (arriba) si no existe
  let ticksLayer = container.querySelector('.ol-scale-line-ticks');
  if (!ticksLayer) {
    ticksLayer = document.createElement('div');
    ticksLayer.className = 'ol-scale-line-ticks';
    container.insertBefore(ticksLayer, body); // arriba de la barra
  }
  ticksLayer.innerHTML = '';

  // Calcular distancia real cubierta por la barra
  const view = m_map.getView();
  const resolution = view.getResolution(); // grados/pixel (EPSG:4326)
  const center = view.getCenter();
  const lat = center ? center[1] : 0;
  const latRad = lat * Math.PI / 180;
  const earthRadius = 6378137; // WGS84
  const metersPerDegree = (Math.PI / 180) * earthRadius * Math.cos(latRad);
  const widthPx = body.getBoundingClientRect().width;
  // Longitud en metros representada por la barra
  const lengthMeters = widthPx * resolution * metersPerDegree;
  let lengthKm = lengthMeters / 1000;
  if (!isFinite(lengthKm) || lengthKm <= 0) return;

  // Función para obtener un número "bonito" similar a OL (1,2,5 * 10^n)
  function niceNumber(x) {
    const exp = Math.floor(Math.log10(x));
    const f = x / Math.pow(10, exp);
    let nf;
    if (f < 1.5) nf = 1;
    else if (f < 3) nf = 2;
    else if (f < 7) nf = 5;
    else nf = 10;
    return nf * Math.pow(10, exp);
  }
  const niceTotal = niceNumber(lengthKm);
  const intervalKm = niceTotal / (steps - 1);

  for (let i = 0; i < steps; i++) {
    // Se generaban ticks para cada segmento; ahora sólo mostraremos 3 (0, mitad, final)
  }
  // Limpiar cualquier resto (ya está vacío arriba) y construir solo 3 ticks
  ticksLayer.innerHTML = '';
  const q1 = niceTotal / 4;
  const niceMid = niceTotal / 2;
  const q3 = (niceTotal * 3) / 4;
  const tickDefs = [
    { pct: 0,   val: 0 },
    { pct: 25,  val: q1 },
    { pct: 50,  val: niceMid },
    { pct: 75,  val: q3 },
    { pct: 100, val: niceTotal }
  ];
  // Formateador adaptativo: 3 decimales si la escala total es grande (>=100 km), si no 2.
  function formatKm(v, isLast) {
    // Si el total de la escala es menor a 1 km (zoom muy cercano) mostramos 3 decimales para más precisión.
    // En caso contrario 2 decimales.
    const decimals = niceTotal < 1 ? 3 : 2;
    let str = v.toFixed(decimals);
    // Quitar .00 o ceros finales innecesarios
    str = str.replace(/\.0+$/, '');               // 10.00 -> 10
    str = str.replace(/\.(\d*[1-9])0+$/, '.$1'); // 2.50 -> 2.5, 3.230 -> 3.23
    if (isLast) str += ' km';
    return str;
  }
  tickDefs.forEach((t, idx) => {
    const tick = document.createElement('div');
    tick.className = 'scale-tick';
    tick.style.left = t.pct + '%';
    const lbl = document.createElement('div');
    lbl.className = 'scale-tick-label';
    lbl.textContent = formatKm(t.val, idx === tickDefs.length - 1);
    tick.appendChild(lbl);
    ticksLayer.appendChild(tick);
  });
  // Ocultar texto original de OL si existe para evitar superposición
  container.querySelectorAll('span').forEach(sp => sp.style.display = 'none');
}

// Hook en eventos de mapa para asegurar que la barra exista tras cada render
m_map.on('postrender', () => ensureCustomScaleBar());
setTimeout(ensureCustomScaleBar, 500);
setTimeout(ensureCustomScaleBar, 1200);
// Ajuste dinámico del ancho visible de la escala (máx 1/3 viewport)
function constrainScaleLine() {
  const el = document.querySelector('.ol-scale-line');
  if (!el) return;
  const inner = el.querySelector('.ol-scale-line-inner');
  if (!inner) return;
  // Reset transform para medir tamaño real
  inner.style.transform = 'none';
  const maxPx = window.innerWidth / 3;
  const actual = inner.getBoundingClientRect().width;
  if (actual > maxPx) {
    const ratio = maxPx / actual;
    inner.style.transformOrigin = 'right center';
    inner.style.transform = `scale(${ratio})`;
  }
}

window.addEventListener('resize', constrainScaleLine);
// Llamar después de un pequeño delay para asegurar render de OL
setTimeout(constrainScaleLine, 800);
m_map.on('moveend', () => setTimeout(constrainScaleLine, 50));

// Variable para almacenar la geometría de recorte de Puebla
let pueblaClippingGeometry = null;

// Función para aplicar el recorte a una capa
const clipLayer = (layer) => {
  if (!pueblaClippingGeometry || !layer) return;

  const preRenderHandler = (e) => {
    if (!e.context) return;
    const vectorContext = ol.render.getVectorContext(e);
    e.context.globalCompositeOperation = 'destination-in';
    vectorContext.drawFeature(
      new ol.Feature(pueblaClippingGeometry),
      new ol.style.Style({
        fill: new ol.style.Fill({ color: 'black' }),
      })
    );
    e.context.globalCompositeOperation = 'source-over';
  };

  // Remover listeners previos para evitar duplicados
  layer.un('postrender', preRenderHandler);
  layer.on('postrender', preRenderHandler);
};

// Función para crear la máscara con configuraciones optimizadas
const createMaskLayer = (pueblaCoords) => {
  pueblaClippingGeometry = new ol.geom.Polygon(pueblaCoords);
  
  // Crear geometría de máscara más eficiente
  const extent = [-180, -90, 180, 90];
  const outerPolygon = ol.geom.Polygon.fromExtent(extent);
  const pueblaLinearRing = pueblaClippingGeometry.getLinearRing(0);
  outerPolygon.appendLinearRing(pueblaLinearRing);

  const maskFeature = new ol.Feature({
    geometry: outerPolygon,
  });

  maskLayer = new ol.layer.Vector({
    renderBuffer: 500, // Buffer más grande para evitar fallos en movimientos rápidos
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    source: new ol.source.Vector({
      features: [maskFeature],
    }),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 0, 1)',
      }),
    }),
    title: 'Mascara Puebla',
    type: 'mask',
    zIndex: 999 // Asegurar que siempre esté arriba
  });
  
  return maskLayer;
};

// Cargar la geometría de Puebla una sola vez con manejo mejorado
fetch('./puebla_state_boundary.json')
  .then(response => response.json())
  .then(pueblaCoords => {
    const mask = createMaskLayer(pueblaCoords);
    
    // Insertar la máscara en el índice correcto
    m_map.getLayers().insertAt(1, mask);
    
    // Forzar renderizado inmediato y continuo
    m_map.render();
    
    // Asegurar que la máscara se re-renderice en cada frame durante animaciones
    m_map.on('movestart', () => {
      if (maskLayer) {
        maskLayer.setVisible(true);
        m_map.render();
      }
    });
    
    m_map.on('moveend', () => {
      if (maskLayer) {
        m_map.render();
      }
    });
    
    // Re-renderizar durante zoom
    m_view.on('change:resolution', () => {
      if (maskLayer) {
        setTimeout(() => {
          m_map.render();
        }, 10);
      }
    });
  })
  .catch(error => console.error('Error loading Puebla boundary:', error));


var m_dlayer = new CDataLayer(m_map);

// Agregar manejadores adicionales para asegurar que la máscara siempre funcione
m_map.on('precompose', function(event) {
  // Asegurar que la máscara esté en la posición correcta antes de cada renderizado
  ensureMaskOnTop();
});

m_map.on('rendercomplete', function(event) {
  // Verificar después de cada renderizado completo
  if (maskLayer && !maskLayer.getVisible()) {
    maskLayer.setVisible(true);
  }
});

// Manejador para interacciones del usuario (arrastrar, zoom, etc.)
m_map.getView().on('change', function(event) {
  if (maskLayer) {
    // Forzar re-renderizado de la máscara durante cambios de vista
    maskLayer.getSource().changed();
  }
  
  // Asegurar orden de capas durante interacciones
  setTimeout(() => {
    ensureMaskOnTop();
  }, 5);
});

//-------------------------------------------------------------------------------

const isMobile = window.innerWidth < 768;

//-------------------------------------------------------------------------------
m_map.on("postcompose", function (event) {
  var canvas = event.context.canvas;
  var ctx = canvas.getContext("2d", { willReadFrequently: true });

  ctx.font = "12pt Arial";
  ctx.fillStyle = "black";

  var x_p = canvas.width / 2 - 360;
  var y_p = canvas.height - m_dlayer.img_escala.clientHeight - 100;

  //ctx.drawImage(m_img_icon, 50, 10);								//Icono del instituto
  //ctx.fillText(m_dlayer.fecha_img, 300, y_p + 80); //Fecha de la imagen
  //ctx.fillText("VALIDEZ:" + m_dlayer.fecha_loc, 300, y_p + 100);
  const permanentDateElement = document.querySelector(
    "#filter-info .permanent-date"
  );
  if (permanentDateElement) {
    permanentDateElement.textContent = m_dlayer.fecha_loc;
  }
  //ctx.drawImage(m_dlayer.img_escala, x_p, y_p); //cambiar la escala segun la variable
});
//-------------------------------------------------------------------------------

$(function () {
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=listado_runs",
    "fecha=" + "20240131",
    list_runs,
    showDialog_Error
  );
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=cabeceras",
    "fecha=" + "20240131",
    list_cabeceras,
    showDialog_Error
  );
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=estaciones",
    "fecha=" + "20240131",
    list_estaciones,
    showDialog_Error
  );

  pollForNewRuns();
  setInterval(pollForNewRuns, 43200000);
});
//-------------------------------------------------------------------------------
function pollForNewRuns() {
  // Guardamos estado actual de opciones
  const oldHtml = $("#select_run").html();

  // Volvemos a pedir el listado
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=listado_runs",
    "fecha=" + "20240131",
    function (datos) {
      list_runs(datos);
      const newHtml = $("#select_run").html();
    },
    showDialog_Error
  );
}
//-------------------------------------------------------------------------------
var showDialog_Error = function () {
  var textAndPic = $("<div></div>");

  textAndPic.append('<h1 style="text-align: center;" >Informacion.</h1>');
  textAndPic.append("<p>&nbsp;</p>");
  textAndPic.append("<p>Ha ocurrido un error");
  textAndPic.append("<p>&nbsp;</p>");

  BootstrapDialog.show({
    title: "Informacion",
    closable: true,
    message: textAndPic,
  });
};

//-------------------------------------------------------------------------------
var make_transaction = function (
  murl,
  mdata,
  function_on_success,
  function_on_error
) {
  $.ajax({
    url: murl,
    type: "POST",
    data: mdata,
    success: function (datos) {
      if (datos.search("error") >= 0) {
        function_on_error();
        return;
      }

      function_on_success(datos);
    },
  });
};

//-------------------------------------------------------------------------------
var make_animation = function (datos) {
  var list_files = datos.split("|");

  m_frames = [];
  for (var i = 0; i < list_files.length; i++) {
    var str_file = list_files[i];

    if (str_file != "") {
      str_file = str_file.substring(1); //Recorrer el string para quitar el ../

      var frame_kms = new CDataLayer(m_map, "create", str_file);
      m_frames.push(frame_kms);
    }
  }
  check_loaded();
};

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
var m_dir_runs = "";

var list_runs = function (datos) {
  var dir_runs = "";
  var list_files = datos.split("|");

  for (var i = list_files.length - 1; i >= 0; i--) {
    var str_file = list_files[i];

    if (str_file != "") {
      var pos = str_file.lastIndexOf("/");
      var str_name = str_file.substring(pos + 1);

      var Y = str_name.substring(0, 4);
      var M = str_name.substring(4, 6);
      var D = str_name.substring(6, 8);
      var H = str_name.substring(8, 10);
      var Etiq = D + "-" + M + "-" + Y + " " + H + "Z";

      dir_runs += "<option  value='" + str_file + "'>" + Etiq + "</option>";
    }
  }

  $("#select_run").html(dir_runs);
};

//-------------------------------------------------------------------------------
var selectedParameter = null;
var selectedVariable = null;

// Crear botones de parámetros principales
var createParameterButtons = function(parameterData) {
  var container = document.getElementById('parameter-buttons');
  container.innerHTML = '';
  selectedParameter = null;
  
  parameterData.forEach(function(param, index) {
    var button = document.createElement('button');
    button.className = 'layer-btn';
    button.setAttribute('data-parameter', param.value);
    button.innerHTML = '<i class="' + param.icon + '"></i> ' + param.label;
    
    button.addEventListener('click', function() {
      // Remover active de todos los botones
      document.querySelectorAll('#parameter-buttons .layer-btn').forEach(function(btn) {
        btn.classList.remove('active');
      });
      
      // Activar el botón clickeado
      this.classList.add('active');
      selectedParameter = param.value;
      procesa_dat();
    });
    
    container.appendChild(button);
    
    // Activar el primer botón por defecto
    if (index === 0) {
      button.classList.add('active');
      selectedParameter = param.value;
    }
  });
  
  // Procesar la primera opción automáticamente
  if (parameterData.length > 0) {
    procesa_dat();
  }
};

// Actualizar select de variables según parámetro seleccionado
var procesa_dat = function () {
  var variableData = [];
  switch (selectedParameter) {
    case "temp":
      variableData = [
        {value: "temmax", label: "Temperatura máxima"},
        {value: "temmin", label: "Temperatura mínima"},
        {value: "temp/700", label: "Temperatura 700mb"},
        {value: "temp/600", label: "Temperatura 600mb"},
        {value: "temp/500", label: "Temperatura 500mb"},
        {value: "temp/400", label: "Temperatura 400mb"},
        {value: "temp/300", label: "Temperatura 300mb"},
        {value: "temp/200", label: "Temperatura 200mb"}
      ];
      break;
    case "CO":
      variableData = [
        {value: "CO/sfc", label: "Monóxido de Carbono en superficie"}
      ];
      break;
    case "NO2":
      variableData = [
        {value: "NO2/sfc", label: "Dióxido de Nitrógeno en superficie"}
      ];
      break;
    case "O3":
      variableData = [
        {value: "O3/sfc", label: "Ozono en superficie"}
      ];
      break;
    case "SO2":
      variableData = [
        {value: "SO2/sfc", label: "Dióxido de Azufre en superficie"}
      ];
      break;
    case "PM25":
      variableData = [
        {value: "PM25/sfc", label: "PM 2.5 en superficie"}
      ];
      break;
    case "PM10":
      variableData = [
        {value: "PM10/sfc", label: "PM 10 en superficie"}
      ];
      break;
    case "hum":
      variableData = [
        {value: "hum/sfc", label: "Humedad en superficie"}
      ];
      break;
    case "prec":
      variableData = [
        {value: "precacum", label: "Precipitación acumulada"}
      ];
      break;
    case "rad":
      variableData = [
        {value: "radsw/sfc", label: "Radiación onda corta"},
        {value: "radlw/sfc", label: "Radiación onda larga"}
      ];
      break;
    case "wind":
      variableData = [
        {value: "wnd/sfc", label: "Viento superficie"},
        {value: "wnd/700", label: "Viento 700mb"},
        {value: "wnd/600", label: "Viento 600mb"},
        {value: "wnd/500", label: "Viento 500mb"},
        {value: "wnd/400", label: "Viento 400mb"},
        {value: "wnd/300", label: "Viento 300mb"},
        {value: "wnd/200", label: "Viento 200mb"}
      ];
      break;
    case "psfc":
      variableData = [
        {value: "psfc", label: "Presión barométrica"}
      ];
      break;
  }

  updateVariableSelect(variableData);
};

// Actualizar select de variables
var updateVariableSelect = function(variableData) {
  var select = document.getElementById('select_var');
  var selectContainer = document.getElementById('variables-container');
  
  // Si solo hay una variable, ocultar el select y usar directamente
  if (variableData.length <= 1) {
    // Aun cuando lo ocultemos, creamos la opción para que otras funciones puedan leer su label
    select.innerHTML = '';
    if (variableData.length === 1) {
      const single = variableData[0];
      const option = document.createElement('option');
      option.value = single.value;
      option.textContent = single.label;
      select.appendChild(option);
      select.selectedIndex = 0;
      selectedVariable = single.value;
      window.currentVariableLabel = single.label; // almacenar etiqueta actual
    } else {
      selectedVariable = null;
      window.currentVariableLabel = null;
    }
    selectContainer.style.display = 'none';
  } else {
    // Múltiples variables: mostrar select
    selectContainer.style.display = 'block';
    select.innerHTML = '';
    
    variableData.forEach(function(variable, index) {
      var option = document.createElement('option');
      option.value = variable.value;
      option.textContent = variable.label;
      select.appendChild(option);
      
      // Seleccionar la primera opción por defecto
      if (index === 0) {
        selectedVariable = variable.value;
        window.currentVariableLabel = variable.label;
      }
    });
  }
  
  // Procesar la primera variable automáticamente
  if (variableData.length > 0) {
    setTimeout(procesa_var, 100);
  }
};

var set_atmos = function () {
  var parameterData = [
    {value: "temp", label: "Temperatura", icon: "fa-solid fa-temperature-half"},
    {value: "hum", label: "Humedad", icon: "fa-solid fa-droplet"},
    {value: "prec", label: "Precipitación", icon: "fa-solid fa-cloud-rain"},
    {value: "rad", label: "Radiación", icon: "fa-solid fa-sun"},
    {value: "wind", label: "Viento", icon: "fa-solid fa-wind"},
    {value: "psfc", label: "Presión", icon: "fa-solid fa-gauge"}
  ];
  
  createParameterButtons(parameterData);
};

var set_chem = function () {
  var parameterData = [
    {value: "CO", label: "CO", icon: "fa-solid fa-smog"},
    {value: "NO2", label: "NO₂", icon: "fa-solid fa-smog"},
    {value: "O3", label: "O₃", icon: "fa-solid fa-smog"},
    {value: "SO2", label: "SO₂", icon: "fa-solid fa-smog"},
    {value: "PM25", label: "PM2.5", icon: "fa-solid fa-circle-dot"},
    {value: "PM10", label: "PM10", icon: "fa-solid fa-circle"}
  ];
  
  createParameterButtons(parameterData);
};

//-------------------------------------------------------------------------------
var list_var = async function (datos) {
  var dir_var = "";
  var list_files = datos.split("|");

  //	for (var i = list_files.length - 1; i >= 0; i--){					//Reversa
  for (var i = 0; i < list_files.length; i++) {
    var str_file = list_files[i];
    if(!str_file) continue;
    str_file = str_file.substring(1); // quitar ../ inicial
    if (str_file === "") continue;

    var pos = str_file.lastIndexOf("/");
    var fileName = str_file.substring(pos + 1); // ejemplo: something_wind_012.png o temp_24.png
    var dotPos = fileName.lastIndexOf(".");
    if (dotPos < 0) continue;
    var baseName = fileName.substring(0, dotPos); // sin extensión

    // Extraer los últimos dígitos (horas) ignorando prefijos
    var match = baseName.match(/(\d{1,3})$/); // captura 1-3 dígitos al final
    var hourStr = match ? match[1] : baseName; // fallback si no encuentra

    // Convertir a número y normalizar a 2 dígitos (00, 06, 12, etc.)
    var hourNum = parseInt(hourStr, 10);
    if (!isNaN(hourNum)) {
      // Si viene 3 dígitos (por ejemplo 120) lo reducimos a horas reales o dejamos 2 digitos?
      // Asumiendo que el problema reportado es que aparece 120 en vez de 12 o 24.
      // regla: si tiene 3 dígitos y termina en 0, dividir entre 10 (120 ->12, 060->6)
      if (hourStr.length === 3 && hourStr.endsWith('0')) {
        hourNum = hourNum / 10;
      }
      hourStr = hourNum.toString().padStart(2, '0');
    }

    dir_var += "<option value='" + str_file + "'>" + hourStr + "</option>";
  }
  $("#selectHora").html(dir_var);

  await make_animation(datos);
  update_var();
};

//-------------------------------------------------------------------------------
var m_lienzo = null;
var m_barra = null;

//-------------------------------------------------------------------------------
async function update_var() {
  m_lienzo = null;
  m_barra = null;

  var str_file = $("#selectHora").val();

  set_layer(m_map, str_file, "add", m_dlayer);
  var img = new Image();
  img.onload = function () {
    m_lienzo = new CLienzo(img);
    if (filter_color) {
      const filteredLayer = applyFilterToImage(m_lienzo.img);
      put_FilteredImage(filteredLayer);
    }
  };
  img.src = str_file;
  if (m_dlayer.img_escala.complete) {
    switch (m_dlayer.tipo_barra) {
      case TEMP:
        //loadGradientDataFromCSV("./color_scale.csv","TEMP");
        //m_barra = new CBarra(m_dlayer.img_escala, -12, 50, 2, 22);
        break;
      case WIND:
        //loadGradientDataFromCSV("./color_scale.csv", "WIND");
        //m_barra = new CBarra(m_dlayer.img_escala, 0, 160, 10, 22);
        break;
    }
  } else {
    showDialog_Error();
  }
}

//-------------------------------------------------------------------------------
var procesa_var = function () {
  if (!selectedVariable) {
    console.log('No hay variable seleccionada');
    return;
  }
  // Asegurar etiqueta actual (leyenda gradiente) antes de cargar
  const selectVar = document.getElementById('select_var');
  if (selectVar && selectVar.selectedIndex >= 0) {
    window.currentVariableLabel = selectVar.options[selectVar.selectedIndex].text;
  }
  
  var str_run = $("#select_run").val();
  var str_var = selectedVariable;
  m_dir_runs = str_run.substring(1);
  var str_dat = "variable=" + str_run + "/" + str_var + "/";
  m_map;
  console.log(str_dat);
  if (window.filtered_layer) m_map.removeLayer(window.filtered_layer);
  filter_color = null;
  hideInfo();
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=listado_var",
    str_dat,
    list_var,
    showDialog_Error
  );
};

//-------------------------------------------------------------------------------
$(function () {
  var isAnimating = false;
  var $btn = $("#btn_toggle_animation");
  var $icon = $("#playIcon");

  // Inicialmente deshabilitado hasta que check_loaded termine
  $btn.prop("disabled", true);

  // Cuando la animación esté lista, habilitamos el botón
  function enableAnimationButton() {
    $btn.prop("disabled", false);
  }

  // Llama a esta función al final de check_loaded
  function onAnimationLoaded() {
    console.log("Animacion cargada");
    enableAnimationButton();
  }
  function check_loaded() {
    var continue_check = false;
    requestAnimationFrame(function check(time) {
      continue_check = m_frames.some((f) => f.layer == null);
      if (continue_check) {
        requestAnimationFrame(check);
        document.body.style.cursor = "wait";
      } else {
        document.body.style.cursor = "default";
        onAnimationLoaded();
      }
    });
  }

  // Toggle de reproducción/detención
  $btn.click(function () {
    if (!isAnimating) {
      // Iniciar animación
      animate_frames();
      $icon.removeClass("fa-play").addClass("fa-stop");
      $btn.attr("title", "Detener");
      isAnimating = true;
    } else {
      // Detener animación
      cancel_animate();
      $icon.removeClass("fa-stop").addClass("fa-play");
      $btn.attr("title", "Reproducir");
      isAnimating = false;
    }
  });

  window.check_loaded = check_loaded;
});

//-------------------------------------------------------------------------------
var m_rango = 250;
var m_animate = false;
var m_id_animation = 0;

// Función para asegurar que la máscara esté siempre arriba
function ensureMaskOnTop() {
  if (!maskLayer) return;
  
  const layers = m_map.getLayers();
  const layersArray = layers.getArray();
  
  // Función para reorganizar capas en el orden correcto
  const reorganizeLayers = () => {
    // Encontrar las capas importantes
    const maskIndex = layersArray.indexOf(maskLayer);
    const municipiosIndex = layersArray.indexOf(m_layer_municipios);
    const vectorIndex = layersArray.indexOf(m_vectorLayer);
    
    // Remover las capas que necesitamos reordenar
    const layersToReorder = [];
    
    if (vectorIndex !== -1) {
      layersToReorder.push({ layer: m_vectorLayer, index: vectorIndex });
    }
    if (municipiosIndex !== -1) {
      layersToReorder.push({ layer: m_layer_municipios, index: municipiosIndex });
    }
    if (maskIndex !== -1) {
      layersToReorder.push({ layer: maskLayer, index: maskIndex });
    }
    
    // Ordenar por índice descendente para remover correctamente
    layersToReorder.sort((a, b) => b.index - a.index);
    
    // Remover las capas
    layersToReorder.forEach(item => {
      layers.removeAt(item.index);
    });
    
    // Agregar en el orden correcto: municipios, vectores, máscara
    if (municipiosIndex !== -1) {
      layers.push(m_layer_municipios);
    }
    if (vectorIndex !== -1) {
      layers.push(m_vectorLayer);
    }
    if (maskIndex !== -1) {
      layers.push(maskLayer);
    }
  };
  
  // Verificar si necesitamos reorganizar
  const municipiosIndex = layersArray.indexOf(m_layer_municipios);
  const vectorIndex = layersArray.indexOf(m_vectorLayer);
  const maskIndex = layersArray.indexOf(maskLayer);
  
  // Si alguna capa overlay no está en la posición correcta, reorganizar
  const needsReorganization = 
    (municipiosIndex !== -1 && municipiosIndex < layersArray.length - 3) ||
    (vectorIndex !== -1 && vectorIndex < layersArray.length - 2) ||
    (maskIndex !== -1 && maskIndex < layersArray.length - 1);
  
  if (needsReorganization) {
    reorganizeLayers();
    
    // Forzar actualización
    setTimeout(() => {
      m_map.render();
    }, 1);
  }
}

// Interceptar cualquier adición de capas para mantener la máscara arriba
const originalInsertAt = ol.Collection.prototype.insertAt;
m_map.getLayers().insertAt = function(index, layer) {
  // Llamar al método original
  const result = originalInsertAt.call(this, index, layer);
  
  // Después de agregar cualquier capa, asegurar que la máscara esté arriba
  setTimeout(() => {
    ensureMaskOnTop();
  }, 1);
  
  return result;
};

async function animate_frames() {
  var pos_frame = 0;
  var time_to_draw = performance.now();

  m_id_animation = await requestAnimationFrame(function animate(time) {
    var dif_time = time - time_to_draw;

    if (dif_time > m_rango) {
      if (pos_frame < m_frames.length) {
        var m_dlayer_act = m_frames[pos_frame];
        
        // Función auxiliar para insertar capa correctamente (debajo de overlays)
        const insertLayerCorrectly = (layer) => {
          const layers = m_map.getLayers();
          const layersArray = layers.getArray();
          
          // Encontrar la posición correcta: después del tile base pero antes de overlays
          let insertPosition = 1;
          
          for (let i = layersArray.length - 1; i >= 0; i--) {
            const existingLayer = layersArray[i];
            const layerType = existingLayer.get('type');
            
            if (layerType !== 'overlay' && layerType !== 'mask' && layerType !== 'base') {
              insertPosition = i + 1;
              break;
            } else if (layerType === 'base') {
              insertPosition = i + 1;
              break;
            }
          }
          
          layers.insertAt(insertPosition, layer);
        };
        
        if (filter_color && m_dlayer_act.img && m_dlayer_act.img.complete) {
          const filteredLayer = applyFilterToImage(m_dlayer_act.img);
          if (filteredLayer) {
            if (window.filtered_layer) m_map.removeLayer(window.filtered_layer);
            insertLayerCorrectly(filteredLayer);
            const permanentDateElement = document.querySelector(
              "#filter-info .permanent-date"
            );
            if (permanentDateElement) {
              permanentDateElement.textContent = m_dlayer_act.fecha_loc;
            }
            window.filtered_layer = filteredLayer;
            m_dlayer = m_dlayer_act;
          } else {
            insertLayerCorrectly(m_dlayer_act.layer);
          }
        } else {
          m_map.removeLayer(m_dlayer.layer);
          insertLayerCorrectly(m_dlayer_act.layer);
          m_dlayer = m_dlayer_act;
        }
        
        // Asegurar que la máscara esté siempre arriba
        ensureMaskOnTop();
        
        pos_frame = pos_frame + 1;
      } else {
        pos_frame = 0;
      }
      time_to_draw = time;
    }

    m_id_animation = requestAnimationFrame(animate);
  });
}

//-------------------------------------------------------------------------------
function cancel_animate() {
  cancelAnimationFrame(m_id_animation);
}

//------------------------------------------------------------------------
var m_show = false;
var m_zoom = m_view.getZoom();

var create_style = function (tipo) {
  // Determinar el color basado en el tipo de punto
  let circleColor = '#c19862'; // Color dorado por defecto
  let strokeColor = '#ffffff'; // Contorno blanco
  let strokeWidth = 2;
  let opacity = 0.8;
  
  // Si es una estación (meteogramas)
  if (tipo === 'estacion') {
    circleColor = '#5a1b30'; // Color rojo oscuro para estaciones
    strokeColor = '#c19862'; // Contorno dorado
    strokeWidth = 3;
    opacity = 0.9;
  }
  // Si es una cabecera
  else if (tipo === 'cabecera') {
    circleColor = '#c19862'; // Color dorado para cabeceras
    strokeColor = '#ffffff'; // Contorno blanco
    strokeWidth = 2;
    opacity = 0.8;
  }
  
  const scale = get_scale();
  const radius = Math.max(8, 10 * scale); // Radio mínimo de 6px, escalable
  
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: radius,
      fill: new ol.style.Fill({
        color: circleColor,
      }),
      stroke: new ol.style.Stroke({
        color: strokeColor,
        width: strokeWidth,
      }),
      opacity: opacity,
    }),
    text: new ol.style.Text({
      offsetX: 0,
      offsetY: radius + 20, // Posicionar debajo del círculo con margen
      textAlign: "center",
      font: "16px Poppins,sans-serif",
      fill: new ol.style.Fill({ color: "#fff" }),
      stroke: new ol.style.Stroke({
        color: "#333",
        width: 2,
      }),
      text: "",
    }),
  });
};

//------------------------------------------------------------------------
var m_vectorSource = new ol.source.Vector({});

//------------------------------------------------------------------------
var m_vectorLayer = new ol.layer.Vector({
  title: "Meteogramas",
  type: "overlay",
  visible: "true",
  zIndex: 1001, // Más alto que municipios para estar encima
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  source: m_vectorSource,
});

m_map.addLayer(m_vectorLayer);

//------------------------------------------------------------------------
var m_element = document.createElement("div");

var m_popup = new ol.Overlay({
  element: m_element,
  stopEvent: true,
});

m_map.addOverlay(m_popup);

//------------------------------------------------------------------------
//------------------------------------------------------------------------
var m_feature = undefined;

m_map.on("click", function (evt) {
  if (m_animate) {
    return;
  }

  if (m_lienzo != null && m_barra != null && m_dlayer.tipo_barra == TEMP) {
    var px = m_lienzo.get_pixel(evt.coordinate);
    var val = m_barra.busca(px);

    $("#px_val").html(val + m_dlayer.unidades);
  }

  if (m_show || m_feature != undefined) {
    $(m_element).popover("destroy");
  }

  m_show = false;
  m_feature = get_Feature(evt);

  if (m_feature != undefined) {
    // Verificar si el botón de calidad del aire está activo
    const aireBtn = document.getElementById('btn_aire');
    const isAireActive = aireBtn && aireBtn.classList.contains('active');
    
    if (isAireActive) {
      show_chem(true);
    } else {
      show_meteo(true);
    }
  }
});

//------------------------------------------------------------------------
m_map.on("pointermove", function (evt) {
  if (m_animate || m_feature != undefined) {
    return;
  }

  if (evt.dragging) {
    $("#px_val").html("---" + m_dlayer.unidades);
    $(m_element).popover("destroy");
    return;
  }

  if (m_zoom >= 11) {
    $(m_element).popover("destroy");
    return;
  }

  var feature = get_Feature(evt);

  if (feature) {
    if (m_show) {
      return;
    }

    m_popup.setOffset([0, -10]);
    m_popup.setPosition(feature.getGeometry().getCoordinates());

    $(m_element).popover({
      placement: "top",
      animation: false,
      html: true,
      content: feature.get("nombre"),
    });

    m_show = true;
    $(m_element).popover("show");
  } else {
    m_show = false;
    $(m_element).popover("destroy");
  }
});

//------------------------------------------------------------------------
var list_estaciones = function (datos) {
  add_features(datos, "estacion", "/meteogramas/", "estacion");
};

//------------------------------------------------------------------------
var list_cabeceras = function (datos) {
  add_features(datos, "cabecera", "/cabeceras/", "cabecera");
};

//------------------------------------------------------------------------
var add_features = function (datos, local, dir, tipo) {
  var format = new ol.format.GeoJSON();
  var features = format.readFeatures(datos);

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];
    feature.set("local", local);
    feature.set("dir", dir);
    feature.setStyle(create_style(tipo));
    set_text(feature);

    var coord = feature.getGeometry().getCoordinates();
    feature.setGeometry(new ol.geom.Point(coord)),
      m_vectorSource.addFeature(feature);
  }
};

//------------------------------------------------------------------------
//------------------------------------------------------------------------
m_view.on("propertychange", function (e) {
  if (e.key == "resolution") {
    //Cuando cambia el zoom
    var zoom = m_view.getZoom();

    if (m_zoom == zoom || zoom % 1 != 0) {
      return;
    }

    m_zoom = zoom;
    var scale = get_scale();
    var features = m_vectorSource.getFeatures(); //Obtener el arreglo de iconos

    for (var i = 0; i < features.length; i++) {
      var feature = features[i];
      
      // Determinar el tipo de punto por sus propiedades
      var local = feature.get("local");
      
      // Recrear el estilo con el nuevo radio
      feature.setStyle(create_style(local));
      set_text(feature);
    }
  }
});

//------------------------------------------------------------------------
function get_scale() {
  var val = m_zoom - 7;
  return val / (12 - 7);
}

//------------------------------------------------------------------------
function set_text(feature) {
  if (m_zoom < ZOOMREF) {
    feature.getStyle().getText().setText("");
  } else {
    feature.getStyle().getText().setText(feature.get("nombre"));
  }
}

//------------------------------------------------------------------------
function get_Feature(evt) {
  return m_map.forEachFeatureAtPixel(
    evt.pixel,
    function (feature) {
      return feature;
    },
    {
      layerFilter: function (layer) {
        return layer === m_vectorLayer;
      },
    }
  );
}

function show_meteo(show_dialog) {
  show_feature("meteo", "meteo/wrf_meteo_", show_dialog);
}

function show_chem(show_dialog) {
  show_feature("chem", "chem/wrf_chem_", show_dialog);
}

var m_str_cvs = "";
var m_str_file_csv = "datos.csv";

//-------------------------------------------------------------------------------
function show_feature(tipo, dir_dat, show_dialog) {
  var dir = m_feature.get("dir") + dir_dat;
  var clave = m_feature.get("clave");
  var name = m_feature.get("nombre");

  var fech = m_dir_runs.substring(7, 15);
  var hor = m_dir_runs.substring(15, 17);

  var tipo_ext;

  if (tipo == "meteo") {
    tipo_ext = "meteorologicos";
  } else {
    tipo_ext = "contaminantes";
  }

  var dir_json = m_dir_runs + dir + clave + "_" + fech + "_" + hor + "z.json";

  m_str_file_csv = name + "_" + fech + "_" + hor + "_" + tipo_ext + ".csv";

  var contenDialog = $("<div></div>");

  if (tipo == "meteo") {
    set_chart_meteo(dir_json, contenDialog, show_dialog);
  } else {
    set_chart_chem(dir_json, contenDialog, show_dialog);
  }

  m_feature = undefined;
  $(m_element).popover("destroy");

  if (show_dialog) {
    BootstrapDialog.show({
      cssClass: "modal-dialog",
      title: `<span style="font-size: 1.7em; font-weight: bold;">${name}</span>`,
      closable: true,
      message: contenDialog,
    });
  }
}

//-------------------------------------------------------------------------------

function avg(arr) {
  const n = arr.length;
  if (n === 0) return "-";
  const sum = arr.reduce((a, b) => a + b, 0);
  return (sum / n).toFixed(1);
}

//-------------------------------------------------------------------------------
function set_chart_meteo(str_file, contenDialog, show_dialog) {
  m_str_cvs =
    "Fecha, Temperatura (°C), Humedad (%), Precipitación (mm), Radiación (w/m2), Viento (km/h), Presión (hPa) \r\n";
  $.ajax({
    url: str_file,
    dataType: "text",
    success: function (data) {
      var djson = JSON.parse(data);

      set_csv_atmos(djson, str_file);

      if (show_dialog) {
const resumenHTML = `
  <div class="summary-block">
    <div class="summary-header">
      <h4>Resumen de Promedios</h4>
      <button onclick="downloadFileCSV()" class="download-btn">
        <i class="glyphicon glyphicon-download"></i>
        Descargar (.CSV)
      </button>
    </div>

    <div class="summary-grid" id="pollutantSummary">
      <div class="summary-card">
        <div class="summary-icon bg-red">🌡️</div>
        <div class="summary-body">
          <div class="summary-name">Temperatura</div>
          <div class="summary-value">${avg(djson["t2m"])} °C</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon bg-blue">💧</div>
        <div class="summary-body">
          <div class="summary-name">Humedad</div>
          <div class="summary-value">${avg(djson["rh"])} %</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon bg-green">🌧️</div>
        <div class="summary-body">
          <div class="summary-name">Precipitación</div>
          <div class="summary-value">${avg(djson["pre"])} mm</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon bg-orange">☀️</div>
        <div class="summary-body">
          <div class="summary-name">Radiación</div>
          <div class="summary-value">${avg(djson["sw"])} w/m²</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon bg-gray">🌬️</div>
        <div class="summary-body">
          <div class="summary-name">Viento</div>
          <div class="summary-value">${avg(djson["wnd"])} km/h</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon bg-slate">📉</div>
        <div class="summary-body">
          <div class="summary-name">Presión</div>
          <div class="summary-value">${avg(djson["psl"])} hPa</div>
        </div>
      </div>
    </div>
  </div>
`;

        contenDialog.append(resumenHTML);
        set_canva(
          contenDialog,
          djson["t2m"],
          "line",
          str_file,
          "Temperatura",
          "°C",
          "rgb(255, 0, 0)"
        );
        set_canva(
          contenDialog,
          djson["rh"],
          "line",
          str_file,
          "Humedad ",
          "%",
          "rgb(0, 0, 255)"
        );
        set_canva(
          contenDialog,
          djson["pre"],
          "bar",
          str_file,
          "Precipitación",
          "mm",
          "rgb(0, 128, 0)"
        );
        set_canva(
          contenDialog,
          djson["sw"],
          "line",
          str_file,
          "Radiación",
          "w/m2",
          "rgb(255, 255, 0)"
        );
        /*set_canva(contenDialog, djson['dir'], 'bar', str_file, 'Direccion del Viento', '0-360 grados', 'rgb(243, 156, 18)');*/
        set_canva(
          contenDialog,
          djson["wnd"],
          "line",
          str_file,
          "Viento",
          "km/h",
          "rgb(128, 0, 0)"
        );
        set_canva(
          contenDialog,
          djson["psl"],
          "line",
          str_file,
          "Presión ",
          "hPa",
          "rgb(0, 128, 128)"
        );
      } else {
        downloadFileCSV();
      }
    },
  });
}

function set_chart_chem(str_file, contenDialog, show_dialog) {
  m_str_cvs =
    "Fecha, Monóxido de Carbono (ppm), Dióxido de Nitrógeno (ppb), Ozono (ppb), Dióxido de Azufre (ppb), Partículas PM 10 (µg/m³), Partículas PM 2.5 (µg/m³)\r\n";
  $.ajax({
    url: str_file,
    dataType: "text",
    success: function (data) {
      var djson = JSON.parse(data);

      set_csv_chem(djson, str_file);

      if (show_dialog) {
      const resumenHTML = `
        <div class="summary-block">
          <div class="summary-header">
            <h4>Resumen de Promedios</h4>
            <button onclick="downloadFileCSV()" class="download-btn">
              <i class="glyphicon glyphicon-download"></i>
              Descargar (.CSV)
            </button>
          </div>
          <div class="table-wrapper">
            <table class="styled-table stats-table">
              <thead>
                <tr>
                  <th>Contaminante</th>
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>🟤 Monóxido de Carbono (ppm)</td><td>${avg(djson["CO"])}</td></tr>
                <tr><td>🟣 Dióxido de Nitrógeno (ppb)</td><td>${avg(djson["NO2"])}</td></tr>
                <tr><td>🟢 Ozono (ppb)</td><td>${avg(djson["O3"])}</td></tr>
                <tr><td>🔵 Dióxido de Azufre (ppb)</td><td>${avg(djson["SO2"])}</td></tr>
                <tr><td>⚫ PM 10 (µg/m³)</td><td>${avg(djson["PM10"])}</td></tr>
                <tr><td>⚫ PM 2.5 (µg/m³)</td><td>${avg(djson["PM25"])}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
        contenDialog.append(resumenHTML);
        set_canva(
          contenDialog,
          djson["CO"],
          "line",
          str_file,
          "Monóxido de Carbono",
          "ppm",
          "rgb(120, 40, 31)"
        );
        set_canva(
          contenDialog,
          djson["NO2"],
          "line",
          str_file,
          "Dióxido de Nitrógeno",
          "ppb",
          "rgb(74, 35, 90)"
        );
        set_canva(
          contenDialog,
          djson["O3"],
          "line",
          str_file,
          "Ozono",
          "ppb",
          "rgb(14, 98, 81)"
        );
        set_canva(
          contenDialog,
          djson["SO2"],
          "line",
          str_file,
          "Dióxido de Azufre",
          "ppb",
          "rgb(21, 67, 96)"
        );
        set_canva(
          contenDialog,
          djson["PM10"],
          "line",
          str_file,
          "Partículas PM 10",
          "µg/m³",
          "rgb(125, 102, 8)"
        );
        set_canva(
          contenDialog,
          djson["PM25"],
          "line",
          str_file,
          "Partículas PM 2.5",
          "µg/m³",
          "rgb(77, 86, 86)"
        );
      } else {
        downloadFileCSV();
      }
    },
  });
}

//-------------------------------------------------------------------------------
function set_csv_atmos(djson, str_file) {
  var hs = 0;
  var dats = Object.values(djson);

  for (var i = 0; i < dats[0].length; i++) {
    m_str_cvs += setLabel(str_file, (hs += 3));
    m_str_cvs += "," + round10(dats[0][i]);
    m_str_cvs += "," + round10(dats[6][i]);
    m_str_cvs += "," + round10(dats[4][i]);
    m_str_cvs += "," + round10(dats[5][i]);
    m_str_cvs += "," + round10(dats[1][i]);
    m_str_cvs += "," + round10(dats[3][i]) + "\r\n";
    //m_str_cvs += ',' + round10(dats[2][i]);
  }
}

function set_csv_chem(djson, str_file) {
  var hs = 0;
  var dats = Object.values(djson);

  for (var i = 0; i < dats[0].length; i++) {
    m_str_cvs += setLabel(str_file, (hs += 3));
    m_str_cvs += "," + round10(dats[0][i]);
    m_str_cvs += "," + round10(dats[1][i]);
    m_str_cvs += "," + round10(dats[3][i]);
    m_str_cvs += "," + round10(dats[2][i]);
    m_str_cvs += "," + round10(dats[4][i]);
    m_str_cvs += "," + round10(dats[5][i]) + "\r\n";
  }
}

function downloadFileCSV() {
  var downloadLink = document.createElement("a");
  // Añadir BOM para UTF-8
  var bom = "\uFEFF";
  var csvContent = bom + m_str_cvs;

  var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);

  downloadLink.href = url;
  downloadLink.download = m_str_file_csv;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Function to update the historical chart based on selected variables
function updateHistoricalChart() {
  if (!currentHistData) return;
  
  const tipoSeleccionado = $("#hist-tipo-select").val();
  
  // Actualizar gráfica principal
  if (tipoSeleccionado === 'meteo') {
    createMeteoHistoricalChart(currentHistData);
  } else {
    createChemHistoricalChart(currentHistData);
  }
  
  // Actualizar gráficas individuales
  renderIndividualChartsFromSelectedVariables(tipoSeleccionado);
  
  // Update stats table
  updateStatsTable(tipoSeleccionado);
}

// Function to update the stats table
function updateStatsTable(tipo) {
  if (!currentHistData) return;
  
  const tbody = document.getElementById('histStatsTable');
  if (!tbody) return;
  
  // Limpiar tabla completamente antes de recrearla
  tbody.innerHTML = '';
  
  const variables = tipo === 'meteo' ? meteorologicalVariables : airQualityVariables;
  
  // Validar que las variables seleccionadas existan en el tipo actual
  const validSelectedVariables = new Set();
  selectedVariables.forEach(key => {
    if (variables[key] && currentHistData[key]) {
      validSelectedVariables.add(key);
    }
  });
  
  // Actualizar selectedVariables con solo las válidas
  selectedVariables.clear();
  validSelectedVariables.forEach(key => selectedVariables.add(key));
  
  // Crear un DocumentFragment para mejor rendimiento
  const fragment = document.createDocumentFragment();
  
  // Solo mostrar variables válidas y seleccionadas - usar Array para evitar duplicados
  const processedVariables = Array.from(validSelectedVariables);
  
  processedVariables.forEach(key => {
    if (currentHistData[key] && variables[key]) {
      const values = currentHistData[key];
      const stats = calculateStats(values);
      const { label, unit, icon } = variables[key];
      
      const row = document.createElement('tr');
      row.setAttribute('data-variable', key); // Para debugging y control
      row.innerHTML = `
        <td><i class="${icon}" style="margin-right: 8px"></i>${label}</td>
        <td>${stats.avg.toFixed(2)}</td>
        <td>${stats.max.toFixed(2)}</td>
        <td>${stats.min.toFixed(2)}</td>
        <td>${unit}</td>
      `;
      fragment.appendChild(row);
    }
  });
  
  // Agregar todas las filas de una vez
  tbody.appendChild(fragment);
}

// Event handler for tipo-select changes
$("#hist-tipo-select").on('change', function() {
  const tipo = $(this).val();
  
  // Limpiar estado anterior
  destroyHistCharts();
  
  // Limpiar tabla de estadísticas
  const tbody = document.getElementById('histStatsTable');
  if (tbody) tbody.innerHTML = '';
  
  // Crear nuevos toggles para el tipo seleccionado - SELECCIONAR TODAS las variables al cambiar modo
  createVariableToggles(tipo, true);
  
  // Si hay datos, regenerar gráficas y tabla con TODAS las variables
  if (currentHistData) {
    updateHistoricalChart();
    updateStatsTable(tipo);
  }
});

//-------------------------------------------------------------------------------
function set_canva(contenDialog, dataset, tipo, str_file, title, unid, color) {
  // Buscar o crear el contenedor de gráficas
  let chartsContainer = contenDialog.find('.charts-grid');
  if (chartsContainer.length === 0) {
    chartsContainer = $('<div class="charts-grid"></div>');
    contenDialog.append(chartsContainer);
  }

  const card = $('<div class="chart-card"></div>');
  const canva = document.createElement('canvas');
  card.append(canva);

  const labs = [];
  const dats = [];
  let hs = 0;
  for (const dat in dataset) {
    labs.push(setLabel(str_file, (hs += 3)));
    dats.push(round10(dataset[dat]));
  }

  grafico(canva, tipo, labs, dats, title, unid, color);
  chartsContainer.append(card); // Añadir al contenedor de gráficas, no al dialog principal
}

//-------------------------------------------------------------------------------
function grafico(canva, tipo, labels, dats, title, unid, color) {
  const dataset = {
    label: `${title} (${unid})`,
    axis: 'x',
    data: dats,
    fill: false,
    borderColor: color,
    backgroundColor: color + '33',
    borderWidth: 2,
    tension: 0.35,
    pointRadius: 2,
    pointHoverRadius: 5
  };

  const data = { labels, datasets: [dataset] };

  new Chart(canva.getContext('2d', { willReadFrequently: true }), {
    type: tipo,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: true, labels: { usePointStyle: true, font: { family: 'Poppins', size: 12 } } },
        title: { display: true, text: title, font: { size: 15, weight: 'bold', family: 'Poppins' } },
        tooltip: {
          mode: 'index', intersect: false,
            backgroundColor: 'rgba(255,255,255,0.96)',
            titleColor: '#222', bodyColor: '#333',
            borderColor: '#e0e0e0', borderWidth: 1, padding: 10,
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${(ctx.parsed.y).toFixed(2)}` }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: { font: { family: 'Poppins' } },
          title: { display: true, text: unid, font: { family: 'Poppins', weight: '600' } },
          grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false }
        },
        x: {
          ticks: { autoSkip: true, maxRotation: 0, font: { family: 'Poppins' } },
          grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false }
        }
      },
      interaction: { mode: 'index', intersect: false }
    }
  });
}

function round10(x) {
  var str_num = Number.parseFloat(x).toFixed(1);

  return Number.parseFloat(str_num);
}

function setLabel(str_file, hs) {
  var pos = str_file.lastIndexOf("/");
  var str_name = str_file.substring(pos + 1);

  var pos_pt = str_name.lastIndexOf(".");
  var fecha_img = str_name.substring(0, pos_pt); //Fecha de la imagen
  var ls = fecha_img.split("_");

  var p = 3;
  var str =
    ls[p].substring(0, 4) +
    "/" +
    ls[p].substring(4, 6) +
    "/" +
    ls[p].substring(6);
  var f = new Date(str + " UTC");

  f.setHours(f.getHours() + parseInt(ls[p + 1].substring(0, 2)));
  f.setHours(f.getHours() + hs);
  var fecha_loc =
    pad(f.getDate(), 2) +
    "/" +
    pad(f.getMonth() + 1, 2) +
    "/" +
    f.getFullYear() +
    " " +
    pad(f.getHours(), 2) +
    "hs";

  return fecha_loc;
}

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

var m_glosario = "gatmos.html";
//-------------------------------------------------------------------------------
$("#meteo").click(function () {
  $("#cali").hide();
  $("#app").show();
  $("#botones1").hide();
  $("#banner").hide();
  m_glosario = "gatmos.html";
  m_map.updateSize();
  set_atmos();

  const h1 = document.getElementById("panel-header-text");
  // Cambia el contenido del h1
  h1.textContent = "Pronóstico Meteorológico del Estado de Puebla";
});

$("#cali").click(function () {
  $("#meteo").hide();
  $("#app").show();
  $("#botones1").hide();
  $("#banner").hide();
  m_glosario = "gchem.html";
  m_map.updateSize();
  set_chem();

  const h1 = document.getElementById("panel-header-text");
  // Cambia el contenido del h1
  h1.textContent = "Calidad del Aire del Estado de Puebla";
  // Activar botón lateral de calidad del aire y sincronizar título del header
  try {
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    const aireBtn = document.getElementById('btn_aire');
    if (aireBtn) aireBtn.classList.add('active');
    const headerTitle = document.getElementById('controls-header-title');
    if (headerTitle) headerTitle.textContent = h1.textContent;
  } catch (e) { console.warn('No se pudo actualizar estado activo para btn_aire:', e); }
});

var m_cabecaras;
function show_datos(datos) {
  var format = new ol.format.GeoJSON();
  var features = format.readFeatures(datos);

  features.sort(function (a, b) {
    return a.get("clave") > b.get("clave")
      ? 1
      : b.get("clave") > a.get("clave")
      ? -1
      : 0;
  });

  var texthtml = $("<div>");
  //texthtml.append('<table width="100%">');

  //texthtml.append('<tbody>');
  texthtml.append("<div>");
  texthtml.append(
    '<div style="display: inline-block; width: 20%; vertical-align: top; background-color: #f2f2f2; padding: 4px; box-sizing: border-box; text-align: center;" >Clave</div>'
  );
  texthtml.append(
    '<div style="display: inline-block; width: 60%; vertical-align: top; background-color: #f2f2f2; padding: 4px; box-sizing: border-box; text-align: center;" >Municipio</div>'
  );
  texthtml.append(
    '<div style="display: inline-block; width: 20%;  vertical-align: top; background-color: #f2f2f2; padding: 4px; box-sizing: border-box; text-align: center;" >Opciones</div>'
  );
  texthtml.append("</div>");

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];

    //texthtml.append('<tr>');
    texthtml.append(
      '<div <div style="display: inline-block; width: 20%; vertical-align: top; background-color: #f9f9f9; padding: 1px; box-sizing: border-box; border: 1px solid #fff;" >' +
        feature.get("clave") +
        "</div>"
    );
    texthtml.append(
      '<div style="display: inline-block; width: 60%; vertical-align: top; background-color: #f9f9f9; padding: 1px; box-sizing: border-box; border: 1px solid #fff;" >' +
        feature.get("nombre") +
        "</div>"
    );

    var str_link =
      '<a href="#" onclick="downladCSV(\'' +
      feature.get("clave") +
      "');\">" +
      '<i class="glyphicon glyphicon-file"></i>' +
      "</a>";
    texthtml.append(
      '<div style="display: inline-block; width: 20%; vertical-align: top; background-color: #f9f9f9; padding: 1px; box-sizing: border-box; border: 1px solid #fff; text-align: center;" >' +
        str_link +
        "</div>"
    );
    //texthtml.append('</tr>');
  }

  //texthtml.append('</tbody>');
  //texthtml.append('</table>');
  texthtml.append("</div>");

  BootstrapDialog.show({
    title: "Datos",
    closable: true,
    message: texthtml,
  });
}

function downladCSV(clave) {
  var features = m_vectorSource.getFeatures();

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];

    if (feature.get("clave") == clave && feature.get("local") == "cabecera") {
      m_feature = feature;
      if ($("#select_dat").val() == "quim") {
        show_chem(false);
      } else {
        show_meteo(false);
      }
    }
  }
}
let filter_color = null;
const canvas = document.getElementById("dynamic-gradient-canvas");
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Coordenadas del clic relativas al canvas, ajustadas por el escalado
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const pixel = ctx.getImageData(x, y, 1, 1).data;

  if (!pixel || pixel.length < 3) {
    console.error("❌ No se pudo obtener el color");
    return;
  }

  filter_color = [pixel[0], pixel[1], pixel[2]];
  const value = getClosestValueFromRGB(pixel[0], pixel[1], pixel[2]);
  // Calcular rango ±2 (ajustable) y formatear a 2 decimales
  let low = value - 2;
  let high = value + 2;
  if (typeof low === 'number' && isFinite(low)) low = parseFloat(low.toFixed(2));
  if (typeof high === 'number' && isFinite(high)) high = parseFloat(high.toFixed(2));
  showInfo(`${low} - ${high}`);
  const filteredLayer = applyFilterToImage(m_lienzo.img);
  put_FilteredImage(filteredLayer);
});

function colorDist(c1, c2) {
  if (!c1 || !c2 || c1.length < 3 || c2.length < 3) return NaN;
  const dist = Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
  );
  return dist / (Math.sqrt(3) * 255);
}

function applyFilterToImage(img) {
  if (!img || !img.complete || !filter_color) return;

  const canvas = document.getElementById("filter-canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const maxDist = 180 * Math.sqrt(3);
  const tolerancePercent = 0.08;
  const tolerance = maxDist * tolerancePercent;

  let min = 9999,
    max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const d = deltaE([r, g, b], filter_color);
    min = Math.min(min, d);
    max = Math.max(max, d);

    if (d <= tolerance) {
    } else {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const extent = m_dlayer.imageExtent;
  const filteredLayer = new ol.layer.Image({
    opacity: 0.7,
    source: new ol.source.ImageStatic({
      url: canvas.toDataURL(),
      imageExtent: extent,
    }),
  });
  clipLayer(filteredLayer); // Aplicar recorte a la capa con filtro
  return filteredLayer;
}

function put_FilteredImage(filteredLayer) {
  if (window.filtered_layer) m_map.removeLayer(window.filtered_layer);
  if (m_dlayer.layer) m_dlayer.layer.setVisible(false);

  //m_map.addLayer(filteredLayer);
  m_map.getLayers().insertAt(1, filteredLayer);
  window.filtered_layer = filteredLayer;
}

function rgbToLab(r, g, b) {
  function f(t) {
    return t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;
  }

  r /= 255;
  g /= 255;
  b /= 255;

  // sRGB to XYZ
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
function deltaE(c1, c2) {
  const lab1 = rgbToLab(...c1);
  const lab2 = rgbToLab(...c2);
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
      Math.pow(lab1[1] - lab2[1], 2) +
      Math.pow(lab1[2] - lab2[2], 2)
  );
}

function getClosestValueFromRGB(r, g, b) {
  if (!window.gradientLookup) return null;
  console.log(window.gradientLookup);
  // Convertimos hex a RGB para comparar
  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  let minDist = Infinity;
  let closest = null;

  for (const { hex, value } of window.gradientLookup) {
    const { r: hr, g: hg, b: hb } = hexToRgb(hex);
    const dist = Math.sqrt((r - hr) ** 2 + (g - hg) ** 2 + (b - hb) ** 2);

    if (dist < minDist) {
      minDist = dist;
      closest = value;
    }
  }

  return closest;
}

function showInfo(value) {
  hideInfo();
  const info = document.getElementById("filter-info");
  
  // Obtener unidades del título de la leyenda o usar valor por defecto
  const legendTitle = document.getElementById("legend-title");
  let units = "";
  if (legendTitle) {
    const titleText = legendTitle.textContent;
    // Extraer unidades comunes del título
    if (titleText.includes("Temperatura")) units = "°C";
    else if (titleText.includes("Humedad")) units = "%";
    else if (titleText.includes("Precipitación")) units = "mm";
    else if (titleText.includes("Viento")) units = "km/h";
    else if (titleText.includes("Presión")) units = "hPa";
  }
  
  const existingRange = info.querySelector(".dynamic-range");
  const rangeElement = document.createElement("div");
  rangeElement.className = "dynamic-range";
  // Limitar a 2 decimales si es numérico
  let displayVal = value;
  const clean = (num) => {
    if (typeof num !== 'number' || !isFinite(num)) return num;
    return parseFloat(num.toFixed(2))
      .toString()
      .replace(/\.0+$/, '')
      .replace(/\.(\d*[1-9])0+$/, '.$1');
  };
  if (typeof value === 'number' && isFinite(value)) {
    displayVal = clean(value);
  } else if (typeof value === 'string' && value.includes(' - ')) {
    const parts = value.split(' - ').map(p => p.trim());
    if (parts.length === 2) {
      const a = parseFloat(parts[0]);
      const b = parseFloat(parts[1]);
      if (isFinite(a) && isFinite(b)) {
        displayVal = `${clean(a)} - ${clean(b)}`;
      }
    }
  }
  rangeElement.innerHTML = `<strong>Rango aproximado: ${displayVal} ${units || ""}</strong>`;
  info.appendChild(rangeElement);
}

function hideInfo() {
  const info = document.getElementById("filter-info");
  const rangeElement = info.querySelector(".dynamic-range");
  if (rangeElement) {
    rangeElement.remove();
  }
}

function hideInfo() {
  const info = document.getElementById("filter-info");
  const rangeElement = info.querySelector(".dynamic-range");
  if (rangeElement) {
    rangeElement.remove();
  }
}

// Función para crear vista histórica
async function createHistoricalView(jsonPath, container, tipo) {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const firstKey = Object.keys(data).find(k => Array.isArray(data[k]));
    const len = firstKey ? data[firstKey].length : 0;
    currentHistLabels = len ? buildTimeLabelsFromPath(jsonPath, len) : null;
    // Crear contenedor para gráficas y tabla
    const wrapper = document.createElement('div');
    wrapper.className = 'historical-wrapper';
    wrapper.innerHTML = `
      <div class="row">
        <div class="col-md-12 mb-4">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">${tipo === 'meteo' ? 'Variables Meteorológicas' : 'Calidad del Aire'}</h4>
            </div>
            <div class="card-body">
              <div id="chartsHost" class="charts-grid"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Resumen Estadístico</h4>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="styled-table stats-table">
                  <thead>
                    <tr>
                      <th>Variable</th>
                      <th>Promedio</th>
                      <th>Máximo</th>
                      <th>Mínimo</th>
                      <th>Unidad</th>
                    </tr>
                  </thead>
                  <tbody id="histStatsTable"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.append(wrapper);

    // Actualizar datos globales
    currentHistData = data;
    
    // Crear gráficas usando el sistema de toggles y variables seleccionadas
    if (tipo === 'meteo') {
      createMeteoHistoricalChart(data);
    } else {
      createChemHistoricalChart(data);
    }
    
    // Renderizar gráficas individuales para las variables seleccionadas
    renderIndividualChartsFromSelectedVariables(tipo);
    
    // Actualizar tabla de estadísticas
    updateStatsTable(tipo);

  } catch (error) {
    console.error('Error:', error);
    container.html(`
      <div class="alert alert-danger">
        <h4>Error cargando datos</h4>
        <p>${error.message}</p>
      </div>
    `);
  }
}

// Variable definitions
const meteorologicalVariables = {
  t2m: { label: 'Temperatura', color: '#FF6384', unit: '°C', icon: 'fa-solid fa-temperature-half' },
  rh: { label: 'Humedad', color: '#36A2EB', unit: '%', icon: 'fa-solid fa-droplet' },
  psl: { label: 'Presión', color: '#4BC0C0', unit: 'hPa', icon: 'fa-solid fa-gauge' },
  wnd: { label: 'Viento', color: '#9966FF', unit: 'km/h', icon: 'fa-solid fa-wind' },
  pre: { label: 'Precipitación', color: '#4BC0C0', unit: 'mm', icon: 'fa-solid fa-cloud-rain' },
  sw: { label: 'Radiación', color: '#FFCD56', unit: 'w/m²', icon: 'fa-solid fa-sun' }
};

const airQualityVariables = {
  CO: { label: 'Monóxido de Carbono', color: '#FF6384', unit: 'ppm', icon: 'fa-solid fa-industry' },
  NO2: { label: 'Dióxido de Nitrógeno', color: '#36A2EB', unit: 'ppb', icon: 'fa-solid fa-car' },
  O3: { label: 'Ozono', color: '#4BC0C0', unit: 'ppb', icon: 'fa-solid fa-smog' },
  SO2: { label: 'Dióxido de Azufre', color: '#9966FF', unit: 'ppb', icon: 'fa-solid fa-smog' },
  PM10: { label: 'PM10', color: '#FF9F40', unit: 'µg/m³', icon: 'fa-solid fa-circle' },
  PM25: { label: 'PM2.5', color: '#FFCD56', unit: 'µg/m³', icon: 'fa-solid fa-circle-dot' }
};

let currentHistChart = null;
let currentHistData = null;
let selectedVariables = new Set();

let currentHistCharts = []; // múltiples instancias Chart.js

function destroyHistCharts(){
  if (currentHistCharts && currentHistCharts.length){
    currentHistCharts.forEach(ch => { try { ch.destroy(); } catch(e){} });
  }
  currentHistCharts = [];
}

// Agrupa datasets para que el rango por gráfico sea ≤ threshold
function groupDatasetsByRange(datasets, threshold = 30){
  const groups = [];
  const fits = (grp, ds) => {
    const all = grp.concat([ds]).flatMap(d => d.data).filter(v => Number.isFinite(v));
    const min = Math.min(...all), max = Math.max(...all); // <-- FIX: ...all
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

function renderGroupedCharts(groups, labels, titlePrefix){
  const host = document.getElementById('chartsHost');
  if (!host) return;
  host.innerHTML = ''; // limpiar
  host.className = 'charts-grid'; // Aplicar clase para gráficas agrupadas
  destroyHistCharts();

  groups.forEach((grp, idx) => {
    const card = document.createElement('div');
    card.className = 'chart-card';
    const cv = document.createElement('canvas');
    card.appendChild(cv);
    host.appendChild(card);

    const allY = grp.flatMap(d => d.data).filter(v => Number.isFinite(v));
const gmin = Math.min(...allY), gmax = Math.max(...allY);
const range = Math.max(1e-9, gmax - gmin);
const pad = Math.max(range * 0.1, 0.05 * Math.abs(gmax || 1)); // 10% ó mínimo razonable

// paso “bonito” (1–2–5 * 10^n) para ~5–6 ticks
const niceStep = (() => {
  const target = range / 5;
  const pow10 = Math.pow(10, Math.floor(Math.log10(target)));
  const cand = [1, 2, 5].map(m => m * pow10);
  return cand.reduce((a,b)=> Math.abs(b-target) < Math.abs(a-target) ? b : a);
})();

const chart = new Chart(cv.getContext('2d', { willReadFrequently: true }), {
  type: 'line',
  data: { labels, datasets: grp },
  options: {
    responsive: true,
    animation: { duration: 650, easing: 'easeInOutQuart' },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { padding: 10, usePointStyle: true, font: { size: 12, family: "'Poppins', sans-serif" } }
      },
      title: {
        display: true,
        text: titlePrefix,
        font: { size: 15, weight: 'bold', family: "'Poppins', sans-serif" }
      },
      tooltip: {
        mode: 'index', intersect: false,
        backgroundColor: 'rgba(255,255,255,0.96)',
        titleColor: '#222', bodyColor: '#333',
        borderColor: '#e8e8e8', borderWidth: 1, padding: 10, boxPadding: 6,
        callbacks: { label: c => ` ${c.dataset.label}: ${(+c.parsed.y).toFixed(2)}` }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: gmin - pad,
        suggestedMax: gmax + pad,
        ticks: {
          stepSize: niceStep,
          maxTicksLimit: 6,
          padding: 6,
          callback: v => (Math.abs(v) >= 1000 ? v.toFixed(0) : v)
        },
        grid: { color:'rgba(0,0,0,0.06)', drawBorder:false }
      },
      x: {
        ticks: { autoSkip: true, maxRotation: 0, minRotation: 0, autoSkipPadding: 12 },
        grid: { color:'rgba(0,0,0,0.06)', drawBorder:false }
      }
    },
    elements: { point: { radius: 2, hoverRadius: 5 } },
    interaction: { intersect:false, mode:'index' }
  }
});

    currentHistCharts.push(chart);
  });
}

// Función para renderizar gráficas individuales basadas en variables seleccionadas
function renderIndividualChartsFromSelectedVariables(tipo) {
  if (!currentHistData || !currentHistLabels) return;
  
  const variables = tipo === 'meteo' ? meteorologicalVariables : airQualityVariables;
  const datasets = [];
  
  // Crear datasets solo para variables seleccionadas
  selectedVariables.forEach(key => {
    if (variables[key] && Array.isArray(currentHistData[key])) {
      const config = variables[key];
      datasets.push({
        label: `${config.label} (${config.unit})`,
        data: currentHistData[key],
        borderColor: config.color,
        backgroundColor: `${config.color}20`,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        variableKey: key,
        config: config
      });
    }
  });
  
  renderIndividualCharts(datasets, currentHistLabels, tipo);
}

// Función para crear gráficas individuales por variable (estilo MeteorologiaGit)
function renderIndividualCharts(datasets, labels, type) {
  const host = document.getElementById('chartsHost');
  if (!host) return;
  host.innerHTML = ''; // limpiar
  host.className = 'charts-grid individual'; // Aplicar clase para gráficas individuales
  destroyHistCharts();

  if (!datasets.length) {
    host.innerHTML = '<p style="text-align:center; color:#777; padding:20px;">No hay variables seleccionadas para mostrar.</p>';
    return;
  }

  // Crear una gráfica individual para cada variable
  datasets.forEach((dataset, idx) => {
    const card = document.createElement('div');
    card.className = 'chart-card individual-chart';
    
    // Crear canvas para la gráfica
    const cv = document.createElement('canvas');
    card.appendChild(cv);

    // Calcular rango y escalas para esta variable específica
    const values = dataset.data.filter(v => Number.isFinite(v));
    if (!values.length) return;

    const gmin = Math.min(...values);
    const gmax = Math.max(...values);
    const range = Math.max(1e-9, gmax - gmin);
    const pad = Math.max(range * 0.1, 0.05 * Math.abs(gmax || 1));

    // Paso "bonito" para los ticks
    const niceStep = (() => {
      const target = range / 5;
      const pow10 = Math.pow(10, Math.floor(Math.log10(target)));
      const cand = [1, 2, 5].map(m => m * pow10);
      return cand.reduce((a,b)=> Math.abs(b-target) < Math.abs(a-target) ? b : a);
    })();

    // Crear la gráfica individual
    const chart = new Chart(cv.getContext('2d', { willReadFrequently: true }), {
      type: 'line',
      data: { 
        labels, 
        datasets: [dataset] // Solo un dataset por gráfica
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 650, easing: 'easeInOutQuart' },
        plugins: {
          legend: { 
            display: true,
            position: 'top',
            labels: { 
              padding: 10, 
              usePointStyle: true, 
              font: { size: 12, family: "'Poppins', sans-serif" } 
            }
          },
          title: { 
            display: true, 
            text: dataset.label,
            font: { size: 15, weight: 'bold', family: "'Poppins', sans-serif" }
          },
          tooltip: {
            mode: 'index', 
            intersect: false,
            backgroundColor: 'rgba(255,255,255,0.96)',
            titleColor: '#222', 
            bodyColor: '#333',
            borderColor: '#e8e8e8', 
            borderWidth: 1, 
            padding: 10, 
            boxPadding: 6,
            callbacks: { 
              label: c => ` ${c.dataset.label}: ${(+c.parsed.y).toFixed(2)}` 
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: gmin - pad,
            suggestedMax: gmax + pad,
            title: {
              display: true,
              text: dataset.label.split('(')[1]?.replace(')', '') || 'Valor',
              color: '#666',
              font: { family: "'Poppins', sans-serif" }
            },
            ticks: {
              stepSize: niceStep,
              maxTicksLimit: 6,
              padding: 6,
              callback: v => (Math.abs(v) >= 1000 ? v.toFixed(0) : parseFloat(v.toFixed(2))),
              font: { family: "'Poppins', sans-serif" }
            },
            grid: { color:'rgba(0,0,0,0.06)', drawBorder:false }
          },
          x: {
            title: {
              display: true,
              text: 'Hora del día',
              color: '#666',
              font: { family: "'Poppins', sans-serif" }
            },
            ticks: { 
              autoSkip: true, 
              maxRotation: 0, 
              minRotation: 0, 
              autoSkipPadding: 12,
              font: { family: "'Poppins', sans-serif" }
            },
            grid: { color:'rgba(0,0,0,0.06)', drawBorder:false }
          }
        },
        elements: { point: { radius: 2, hoverRadius: 5 } },
        interaction: { intersect:false, mode:'index' }
      }
    });

    // Crear botón de descarga estilo MeteorologiaGit
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fa-solid fa-download"></i> Descargar Gráfica';
    btn.className = 'download-btn';
    btn.onclick = () => {
      const a = document.createElement('a');
      a.href = chart.toBase64Image();
      
      // Crear nombre de archivo basado en la variable
      const variableName = dataset.label.split(' ')[1] || 'variable'; // Extraer nombre de variable
      const timestamp = new Date().toISOString().slice(0,10); // YYYY-MM-DD
      a.download = `${slug(variableName)}_${timestamp}.png`;
      
      a.click();
    };
    card.appendChild(btn);
    host.appendChild(card);

    currentHistCharts.push(chart);
  });
}

// Función de utilidad para crear slugs (nombres de archivo seguros)
function slug(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Espacios a guiones
    .replace(/[^\w\-]+/g, '')       // Remover caracteres no alfanuméricos
    .replace(/\-\-+/g, '-')         // Múltiples guiones a uno
    .replace(/^-+/, '')             // Remover guiones al inicio
    .replace(/-+$/, '');            // Remover guiones al final
}


// Function to create variable toggles
function createVariableToggles(type, selectAllVariables = true) {
  const container = document.getElementById('variable-toggles');
  if (!container) return;
  
  // Guardar variables seleccionadas anteriores si no se debe seleccionar todo
  const previouslySelected = selectAllVariables ? new Set() : new Set(selectedVariables);
  
  // Limpiar contenedor
  container.innerHTML = '';
  
  // Si se debe seleccionar todo, limpiar variables seleccionadas
  if (selectAllVariables) {
    selectedVariables.clear();
  }
  
  // Limpiar gráficas anteriores solo si no hay datos aún
  if (!currentHistData || selectAllVariables) {
    destroyHistCharts();
    const chartsHost = document.getElementById('chartsHost');
    if (chartsHost) {
      chartsHost.innerHTML = '<p style="text-align:center; color:#777; padding:20px;">Seleccione un municipio para ver los datos.</p>';
    }
  }
  
  const variables = type === 'meteo' ? meteorologicalVariables : airQualityVariables;
  
  Object.entries(variables).forEach(([key, config]) => {
    const toggle = document.createElement('div');
    
    // Determinar si este toggle debería estar activo
    let isActive;
    if (selectAllVariables) {
      isActive = true; // Seleccionar todo
      selectedVariables.add(key);
    } else {
      // Mantener selección previa si la variable existe en el nuevo tipo
      isActive = previouslySelected.has(key);
      if (isActive) {
        selectedVariables.add(key);
      }
    }
    
    toggle.className = isActive ? 'variable-toggle active' : 'variable-toggle';
    toggle.dataset.variable = key;
    toggle.innerHTML = `
      <div class="icon"><i class="${config.icon}"></i></div>
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
      updateStatsTable(type);
    });
    
    container.appendChild(toggle);
  });
}

function createMeteoHistoricalChart(data) {
  currentHistData = data;

  // Construir datasets SOLO de variables seleccionadas
  const datasets = [];
  Object.entries(meteorologicalVariables).forEach(([key, cfg]) => {
    if (selectedVariables.has(key) && Array.isArray(data[key])) {
      datasets.push({
        label: `${cfg.label} (${cfg.unit})`,
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

const labels = (currentHistLabels && currentHistLabels.length === datasets[0].data.length)
  ? currentHistLabels
  : Array(datasets[0].data.length).fill('').map((_, i) => `Hora ${i*3}`);


  const groups = groupDatasetsByRange(datasets, 30);


  // Usar gráficas individuales en lugar de agrupadas
  renderIndividualCharts(datasets, labels, 'meteo');
}
let currentHistLabels = null;

// Construye etiquetas de tiempo a partir del path del JSON usando setLabel()
function buildTimeLabelsFromPath(jsonPath, length){
  const labels = [];
  let hs = 0;
  for (let i = 0; i < length; i++){
    hs += 3; // tus datos están cada 3 h
    labels.push(setLabel(jsonPath, hs)); // usa tu setLabel existente
  }
  return labels;
}

function createChemHistoricalChart(data) {
  currentHistData = data;

  const datasets = [];
  Object.entries(airQualityVariables).forEach(([key, cfg]) => {
    if (selectedVariables.has(key) && Array.isArray(data[key])) {
      datasets.push({
        label: `${cfg.label} (${cfg.unit})`,
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

  const labels = (currentHistLabels && currentHistLabels.length === datasets[0].data.length)
  ? currentHistLabels
  : Array(datasets[0].data.length).fill('').map((_, i) => `Hora ${i*3}`);


  const groups = groupDatasetsByRange(datasets, 30);

  // Usar gráficas individuales en lugar de agrupadas
  renderIndividualCharts(datasets, labels, 'chem');
}



function createMeteoHistoricalTable(data) {
  const tbody = document.getElementById('histStatsTable');
  const variables = {
    t2m: { label: 'Temperatura', unit: '°C' },
    rh: { label: 'Humedad', unit: '%' },
    psl: { label: 'Presión', unit: 'hPa' },
    wnd: { label: 'Viento', unit: 'km/h' },
    pre: { label: 'Precipitación', unit: 'mm' },
    sw: { label: 'Radiación', unit: 'w/m²' }
  };

  createStatsTable(tbody, data, variables);
}

function createChemHistoricalTable(data) {
  const tbody = document.getElementById('histStatsTable');
  const variables = {
    CO: { label: 'Monóxido de Carbono', unit: 'ppm' },
    NO2: { label: 'Dióxido de Nitrógeno', unit: 'ppb' },
    O3: { label: 'Ozono', unit: 'ppb' },
    SO2: { label: 'Dióxido de Azufre', unit: 'ppb' },
    PM10: { label: 'PM10', unit: 'µg/m³' },
    PM25: { label: 'PM2.5', unit: 'µg/m³' }
  };

  createStatsTable(tbody, data, variables);
}

function createStatsTable(tbody, data, variables) {
  tbody.innerHTML = '';
  
  Object.entries(variables).forEach(([key, config]) => {
    if (data[key]) {
      const values = data[key];
      const stats = calculateStats(values);
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${config.label}</strong></td>
        <td>${stats.avg.toFixed(2)}</td>
        <td>${stats.max.toFixed(2)}</td>
        <td>${stats.min.toFixed(2)}</td>
        <td>${config.unit}</td>
      `;
      tbody.appendChild(row);
    }
  });
}

function calculateStats(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  return { avg, max, min };
}

// === COMBOBOX for municipality selection in historial ===
(function makeHistComboboxRobusto(){
  const sel = document.getElementById('hist-cabecera-select');
  if (!sel) return;

  // ----- UI básica -----
  const wrap = document.getElementById('hist-combobox');
  if (!wrap) return;

  const input = wrap.querySelector('input.form-control');
  if (!input) return;

  // Lista como "portal" en <body>
  const list = document.getElementById('hist-combobox-list');
  if (!list) return;

  // Inserta UI y oculta el select original
  sel.style.display = 'none';

  // ----- Lógica -----
  const norm = s => (s||'').toString()
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .toLowerCase().replace(/\s+/g,' ').trim();

  let items = [];          // [{value,label}]
  let filtered = [];
  let open = false;
  let active = -1;

  function snapshotItems(){
    items = Array.from(sel.options)
      .filter(o => (o.value ?? '').toString().trim() !== '') // omite "Seleccione..."
      .map(o => ({ value:o.value, label:o.text }))
      .sort((a,b)=>a.label.localeCompare(b.label,'es',{sensitivity:'base'}));
    filtered = items.slice();
  }

  function positionList(){
    const r = input.getBoundingClientRect();
    list.style.left = r.left + 'px';
    list.style.top  = (r.bottom + 4) + 'px';
    list.style.minWidth = r.width + 'px';
    list.style.maxWidth = Math.max(r.width, 260) + 'px';
  }

  function render(){
    list.innerHTML = '';
    filtered.forEach((it, idx) => {
      const li = document.createElement('li');
      li.textContent = it.label;
      li.style.padding = '8px 10px';
      li.style.cursor = 'pointer';
      li.style.background = (idx===active) ? 'rgba(0,0,0,.06)' : '';
      li.addEventListener('mouseenter', () => { active=idx; render(); });
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        choose(idx);
      });
      list.appendChild(li);
    });
  }

  function openList(){
    if (!filtered.length) return;
    positionList();
    list.style.display = 'block';
    open = true;
  }

  function closeList(){
    list.style.display = 'none';
    open = false;
    active = -1;
  }

  function filterNow(q){
    const nq = norm(q);
    filtered = nq ? items.filter(m => norm(m.label).includes(nq)) : items.slice();
    const exact = filtered.findIndex(m => norm(m.label) === nq);
    active = exact >= 0 ? exact : -1;
    render();
    if (open && !filtered.length) closeList();
  }

  function choose(idx){
    if (idx < 0 || idx >= filtered.length) return;
    const it = filtered[idx];
    input.value = it.label;
    sel.value = it.value;
    sel.dispatchEvent(new Event('change', { bubbles:true }));
    closeList();
  }

  // ----- Eventos -----
  // Evita que clicks internos cierren el dropdown
  [wrap, input, list].forEach(el => {
    el.addEventListener('click', e => e.stopPropagation(), { capture:true });
    el.addEventListener('mousedown',  e => e.stopPropagation(), { capture: true });
  });

  // Abrir con focus/click y escribir
  input.addEventListener('focus', () => {
    filtered = items.slice();
    render();
    openList();
  });
  input.addEventListener('click', () => {
    if (!open) {
      filtered = items.slice();
      render();
      openList();
    }
  });
  input.addEventListener('input', () => {
    filterNow(input.value);
    filtered.length ? openList() : closeList();
  });

  // Navegación teclado
  input.addEventListener('keydown', (e) => {
    switch(e.key){
      case 'ArrowDown':
        e.preventDefault();
        if (!open){ openList(); break; }
        active = Math.min(filtered.length-1, active+1); render();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open){ openList(); break; }
        active = Math.max(0, active-1); render();
        break;
      case 'Enter':
        e.preventDefault();
        if (!open){
          const nq = norm(input.value);
          const exacts = items.filter(m=>norm(m.label)===nq);
          const cands  = exacts.length?exacts:items.filter(m=>norm(m.label).includes(nq));
          if (cands.length===1){ filtered=cands; choose(0); } else { openList(); }
        } else {
          if (active<0 && filtered.length===1) active=0;
          choose(active);
        }
        break;
      case 'Escape':
        if (open) { closeList(); } else { input.select(); }
        break;
      case 'Tab':
        closeList();
        break;
    }
  });

  // Clic fuera: cerrar
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && !list.contains(e.target)) closeList();
  });

  // Reposicionar en scroll/resize
  window.addEventListener('scroll', () => { if (open) positionList(); }, true);
  window.addEventListener('resize', () => { if (open) positionList(); });

  // Poblado inicial y asíncrono
  if (sel.options.length) snapshotItems();
  const mo = new MutationObserver(() => {
    snapshotItems();
    if (open) { render(); positionList(); }
  });
  mo.observe(sel, { childList: true });

  // Agregar event listener para conectar con la API real (menu.js)
  // Verificamos que la función updateHistoricalView esté disponible
  if (typeof updateHistoricalView === 'function') {
    // Remover listener previo para evitar duplicados
    sel.removeEventListener('change', updateHistoricalView);
    sel.addEventListener('change', updateHistoricalView);
  } else {
    // Si no está disponible, intentamos más tarde cuando se cargue menu.js
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof updateHistoricalView === 'function') {
        sel.removeEventListener('change', updateHistoricalView);
        sel.addEventListener('change', updateHistoricalView);
      }
    });
  }
})();

// Clear combobox function
window.clearHistCombobox = function () {
  const sel = document.getElementById('hist-cabecera-select');
  if (!sel) return;
  const wrap = document.getElementById('hist-combobox');
  const input = wrap ? wrap.querySelector('input.form-control') : null;

  if (input) input.value = '';
  sel.value = '';
  sel.dispatchEvent(new Event('change', { bubbles: true }));
  const list = document.getElementById('hist-combobox-list');
  if (list) list.style.display = 'none';
};

// Los botones se inicializan automáticamente desde set_atmos() o set_chem()

//-------------------------------------------------------------------------------

function loadMapCabeceras() {
  if (!municipalitiesData) return;
  const select = document.getElementById('map-search');
  if (!select) return;

  select.innerHTML = ''; // limpiar

  const cabeceras = municipalitiesData.features
    .sort((a, b) => a.properties.nombre.localeCompare(b.properties.nombre, 'es', {sensitivity:'base'}));

  cabeceras.forEach(feature => {
    const option = document.createElement('option');
    option.value = feature.properties.clave;
    option.textContent = feature.properties.nombre;
    select.appendChild(option);
  });
}

(function makeMapComboboxRobusto(){
  const sel = document.getElementById('map-search');
  if (!sel) return;

  // UI
  const wrap = document.createElement('div');
  wrap.id = 'map-combobox';
  wrap.style.position = 'relative';
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'stretch';
  wrap.style.gap = '.5rem';
  wrap.style.marginTop = '.25rem';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control';
  input.placeholder = 'Escribe para buscar municipio…';
  input.autocomplete = 'off';

  const list = document.createElement('ul');
  list.id = 'map-combobox-list';           // OJO: ID distinto al del historial
  list.setAttribute('role','listbox');
  Object.assign(list.style, {
    position:'fixed', maxHeight:'260px', overflowY:'auto',
    margin:'0', padding:'0', listStyle:'none', display:'none',
    background:'#fff', border:'1px solid rgba(0,0,0,.15)',
    borderRadius:'8px', boxShadow:'0 8px 24px rgba(0,0,0,.15)', zIndex:'50000'
  });
  document.body.appendChild(list);

  // Oculta select y monta wrapper
  sel.style.display = 'none';
  sel.parentNode.insertBefore(wrap, sel);
  wrap.appendChild(input);
  wrap.appendChild(sel);

  // Lógica
  const norm = s => (s||'').toString()
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .toLowerCase().replace(/\s+/g,' ').trim();

  let items = [], filtered = [], open = false, active = -1;

  function snapshotItems(){
    items = Array.from(sel.options)
      .filter(o => (o.value ?? '').toString().trim() !== '')
      .map(o => ({ value:o.value, label:o.text }))
      .sort((a,b)=>a.label.localeCompare(b.label,'es',{sensitivity:'base'}));
    filtered = items.slice();
  }

  function positionList(){
    const r = input.getBoundingClientRect();
    list.style.left = r.left + 'px';
    list.style.top  = (r.bottom + 4) + 'px';
    list.style.minWidth = r.width + 'px';
    list.style.maxWidth = Math.max(r.width, 260) + 'px';
  }

  function render(){
    list.innerHTML = '';
    filtered.forEach((it, idx) => {
      const li = document.createElement('li');
      li.textContent = it.label;
      li.style.padding = '8px 10px';
      li.style.cursor = 'pointer';
      li.style.background = (idx===active) ? 'rgba(0,0,0,.06)' : '';
      li.addEventListener('mouseenter', () => { active=idx; render(); });
      li.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); choose(idx); });
      list.appendChild(li);
    });
  }

  function openList(){ if (!filtered.length) return; positionList(); list.style.display='block'; open = true; }
  function closeList(){ list.style.display='none'; open = false; active = -1; }

  function filterNow(q){
    const nq = norm(q);
    filtered = nq ? items.filter(m => norm(m.label).includes(nq)) : items.slice();
    const exact = filtered.findIndex(m => norm(m.label) === nq);
    active = exact >= 0 ? exact : -1;
    render();
    if (open && !filtered.length) closeList();
  }

function choose(idx) {
  if (idx < 0 || idx >= filtered.length) return;
  const it = filtered[idx];
  input.value = it.label;
  sel.value = it.value;

  sel.dispatchEvent(new Event('change',{ bubbles:true}));

  // Centrar el mapa en el municipio seleccionado
  const municipio = mapSearchMunicipiosData.find(
    m => m.clave === it.value
  );
  
  if (municipio && m_map) {
    // Obtener las coordenadas directamente del municipio
    const coords = municipio.coordinates; // [lng, lat]
    console.log(coords);
    // Centrar el mapa en esas coordenadas usando OpenLayers
    const view = m_map.getView();
    view.animate({zoom: 12}, {center:[coords[0],coords[1]]}); // Zoom más cercano para ver el municipio
  }

  closeList();
}

  // Aislar clicks internos
  [wrap, input, list].forEach(el => {
    el.addEventListener('click', e => e.stopPropagation(), { capture:true });
    el.addEventListener('mousedown',  e => e.stopPropagation(), { capture: true });
    el.addEventListener('pointerdown',e => e.stopPropagation(), { capture: true });
  });

  // Abrir/filtrar/teclado
  input.addEventListener('focus', () => { filtered = items.slice(); render(); openList(); });
  input.addEventListener('click',  () => { if (!open){ filtered = items.slice(); render(); openList(); } });
  input.addEventListener('input',  () => { filterNow(input.value); filtered.length ? openList() : closeList(); });

  input.addEventListener('keydown', (e) => {
    switch(e.key){
      case 'ArrowDown': e.preventDefault(); if (!open){ openList(); break; } active = Math.min(filtered.length-1, active+1); render(); break;
      case 'ArrowUp':   e.preventDefault(); if (!open){ openList(); break; } active = Math.max(0, active-1); render(); break;
      case 'Enter':     e.preventDefault(); if (!open){ const nq=norm(input.value); const exacts=items.filter(m=>norm(m.label)===nq); const cands=exacts.length?exacts:items.filter(m=>norm(m.label).includes(nq)); if (cands.length===1){ filtered=cands; choose(0);} else { openList(); } } else { if (active<0 && filtered.length===1) active=0; choose(active);} break;
      case 'Escape':    if (open) { closeList(); } else { input.select(); } break;
      case 'Tab':       closeList(); break;
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && !list.contains(e.target)) closeList();
  });

  window.addEventListener('scroll', () => { if (open) positionList(); }, true);
  window.addEventListener('resize', () => { if (open) positionList(); });

  // Poblado inicial + observer (igual que historial, pero para el select del MAPA)
  if (sel.options.length) snapshotItems();
  const mo = new MutationObserver(() => { snapshotItems(); if (open) { render(); positionList(); } });
  mo.observe(sel, { childList: true });
})();

window.clearMapCombobox = function () {
  const sel   = document.getElementById('map-search');
  if (!sel) return;
  const wrap  = sel.parentElement;
  const input = wrap ? wrap.querySelector('input.form-control') : null;

  if (input) input.value = '';
  sel.value = '';
  sel.dispatchEvent(new Event('change', { bubbles: true }));
  const list = document.getElementById('map-combobox-list');
  if (list) list.style.display = 'none';
};

// Datos de municipios para map-search
let mapSearchMunicipiosData = [];

// Función para cargar municipios para map-search
async function loadMapSearchMunicipios() {
  try {
    const response = await fetch('./cabeceras.json');
    const data = await response.json();
    
    mapSearchMunicipiosData = data.features.map(feature => ({
      nombre: feature.properties.nombre,
      clave: feature.properties.clave,
      coordinates: feature.geometry.coordinates // [lng, lat]
    }));
    
    populateMapSearch();
    console.log(`Map-search: Cargados ${mapSearchMunicipiosData.length} municipios`);
  } catch (error) {
    console.error('Error cargando municipios para map-search:', error);
  }
}

// Función para centrar el mapa en un municipio
function centerMapOnMunicipioSearch(municipioClave) {
  const municipio = mapSearchMunicipiosData.find(m => m.clave === municipioClave);
  if (!municipio || !m_map) return;
  
  const [lng, lat] = municipio.coordinates;
  const view = m_map.getView();
  
  // Centrar el mapa en las coordenadas del municipio
  view.animate({
    center: ol.proj.fromLonLat([lng, lat]),
    zoom: 12, // Zoom más cercano para ver el municipio
    duration: 1000 // Animación de 1 segundo
  });
  
  console.log(`Mapa centrado en: ${municipio.nombre} [${lng}, ${lat}]`);
}

// Map Search Combobox - Basado en el sistema del historial
(function makeMapSearchCombobox(){
  const sel = document.getElementById('map-search');
  if (!sel) return;

  // ----- UI básica -----
  const wrap = document.getElementById('map-search-combobox');
  if (!wrap) return;

  const input = wrap.querySelector('input.form-control');
  if (!input) return;

  // Lista como "portal" en <body>
  const list = document.getElementById('map-search-combobox-list');
  if (!list) return;

  // Inserta UI y oculta el select original
  sel.style.display = 'none';

  // ----- Lógica -----
  const norm = s => (s||'').toString()
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .toLowerCase().replace(/\s+/g,' ').trim();

  let items = [];          // [{value,label}]
  let filtered = [];
  let open = false;
  let active = -1;

  function snapshotItems(){
    items = Array.from(sel.options)
      .filter(o => (o.value ?? '').toString().trim() !== '') // omite "Seleccione..."
      .map(o => ({ value:o.value, label:o.text }))
      .sort((a,b)=>a.label.localeCompare(b.label,'es',{sensitivity:'base'}));
    filtered = items.slice();
  }

  function positionList(){
    const r = input.getBoundingClientRect();
    list.style.left = r.left + 'px';
    list.style.top  = (r.bottom + 4) + 'px';
    list.style.minWidth = r.width + 'px';
    list.style.maxWidth = Math.max(r.width, 260) + 'px';
  }

  function render(){
    list.innerHTML = '';
    filtered.forEach((it, idx) => {
      const li = document.createElement('li');
      li.textContent = it.label;
      li.style.padding = '8px 10px';
      li.style.cursor = 'pointer';
      li.style.listStyle = 'none';
      li.style.backgroundColor = idx === active ? '#e9ecef' : 'white';
      li.style.borderBottom = '1px solid #eee';
      
      li.addEventListener('click', () => choose(idx));
      li.addEventListener('mouseenter', () => { active = idx; render(); });
      
      list.appendChild(li);
    });
  }

  function openList(){
    if (!items.length) snapshotItems();
    if (!items.length) return;
    
    list.style.display = 'block';
    list.style.position = 'fixed';
    list.style.zIndex = '9999';
    list.style.backgroundColor = 'white';
    list.style.border = '1px solid #ccc';
    list.style.borderRadius = '4px';
    list.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    list.style.maxHeight = '200px';
    list.style.overflowY = 'auto';
    list.style.margin = '0';
    list.style.padding = '0';
    
    positionList();
    render();
    open = true;
  }

  function closeList(){
    list.style.display = 'none';
    open = false;
    active = -1;
  }

  function filterNow(q){
    const nq = norm(q);
    filtered = nq ? items.filter(m => norm(m.label).includes(nq)) : items.slice();
    const exact = filtered.findIndex(m => norm(m.label) === nq);
    active = exact >= 0 ? exact : -1;
    render();
    if (open && !filtered.length) closeList();
  }

  function choose(idx){
    if (idx < 0 || idx >= filtered.length) return;
    const it = filtered[idx];
    input.value = it.label;
    sel.value = it.value;
    sel.dispatchEvent(new Event('change', { bubbles:true }));
    closeList();
    
    // Centrar el mapa en el municipio seleccionado
    if (it.value) {
      centerMapOnMunicipioSearch(it.value);
    }
  }

  // ----- Eventos -----
  // Evita que clicks internos cierren el dropdown
  [wrap, input, list].forEach(el => {
    el.addEventListener('click', e => e.stopPropagation(), { capture:true });
    el.addEventListener('mousedown',  e => e.stopPropagation(), { capture: true });
  });

  // Abrir con focus/click y escribir
  input.addEventListener('focus', openList);
  input.addEventListener('click', openList);
  input.addEventListener('input', e => {
    const val = e.target.value;
    if (!open) openList();
    filterNow(val);
  });

  // Navegación teclado
  input.addEventListener('keydown', (e) => {
    switch(e.key){
      case 'ArrowDown':
        e.preventDefault();
        if (!open){ openList(); break; }
        active = Math.min(filtered.length-1, active+1); render();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open){ openList(); break; }
        active = Math.max(0, active-1); render();
        break;
      case 'Enter':
        e.preventDefault();
        if (!open){
          const nq = norm(input.value);
          const exacts = items.filter(m=>norm(m.label)===nq);
          const cands  = exacts.length?exacts:items.filter(m=>norm(m.label).includes(nq));
          if (cands.length===1){ filtered=cands; choose(0); } else { openList(); }
        } else {
          if (active<0 && filtered.length===1) active=0;
          choose(active);
        }
        break;
      case 'Escape':
        if (open) { closeList(); } else { input.select(); }
        break;
      case 'Tab':
        closeList();
        break;
    }
  });

  // Clic fuera: cerrar
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && !list.contains(e.target)) closeList();
  });

  // Reposicionar en scroll/resize
  window.addEventListener('scroll', () => { if (open) positionList(); }, true);
  window.addEventListener('resize', () => { if (open) positionList(); });

  // Poblado inicial y asíncrono
  if (sel.options.length) snapshotItems();
  const mo = new MutationObserver(() => {
    snapshotItems();
    if (open) { render(); positionList(); }
  });
  mo.observe(sel, { childList: true });
})();

// Función para poblar el map-search con municipios
function populateMapSearch() {
  const select = document.getElementById('map-search');
  if (!select || !mapSearchMunicipiosData.length) return;
  
  select.innerHTML = '<option value="">Seleccione un municipio</option>';
  mapSearchMunicipiosData.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.clave;
    option.textContent = municipio.nombre;
    select.appendChild(option);
  });
}

// Clear map search combobox function
window.clearMapSearchCombobox = function () {
  const sel = document.getElementById('map-search');
  if (!sel) return;
  const wrap = document.getElementById('map-search-combobox');
  const input = wrap ? wrap.querySelector('input.form-control') : null;

  if (input) input.value = '';
  sel.value = '';
  const list = document.getElementById('map-search-combobox-list');
  if (list) list.style.display = 'none';
};

// Inicializar map-search cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadMapSearchMunicipios);
} else {
  loadMapSearchMunicipios();
}

// Nueva función para manejar la leyenda horizontal
function setupLegendClickFilter() {
    const legendGradient = document.getElementById('legend-gradient');
    const filterIndicator = document.getElementById('filter-indicator');
    
    if (!legendGradient) return;
    
    let isSelecting = false;
    let startX = 0;
    
    legendGradient.addEventListener('mousedown', (e) => {
        isSelecting = true;
        startX = e.offsetX;
        filterIndicator.style.left = startX + 'px';
        filterIndicator.style.width = '2px';
        filterIndicator.classList.add('active');
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
            // Aplicar filtro basado en el rango seleccionado
            applyLegendFilter(minPercent, maxPercent);
        } else {
            // Click simple - obtener valor puntual
            const percent = startX / gradientWidth;
            applyLegendFilter(percent - 0.05, percent + 0.05);
        }
    });
    
    // Doble click en la leyenda para limpiar filtro
    legendGradient.addEventListener('dblclick', (e) => {
        clearLegendFilter();
        e.preventDefault();
        e.stopPropagation();
    });
}

function applyLegendFilter(minPercent, maxPercent) {
    if (!window.gradientLookup || !window.gradientLookup.length) return;
    
    const totalSteps = window.gradientLookup.length;
    const minIndex = Math.floor(minPercent * totalSteps);
    const maxIndex = Math.ceil(maxPercent * totalSteps);
    
    if (minIndex >= 0 && maxIndex < totalSteps) {
        const minValue = window.gradientLookup[minIndex].value;
        const maxValue = window.gradientLookup[maxIndex].value;
        const avgValue = (minValue + maxValue) / 2;
        
        // Simular el color para el filtrado
        const colorEntry = window.gradientLookup[Math.floor((minIndex + maxIndex) / 2)];
        if (colorEntry && colorEntry.hex) {
            const hex = colorEntry.hex.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            filter_color = [r, g, b];
            const range = `${minValue.toFixed(1)} - ${maxValue.toFixed(1)}`;
            showInfo(range);
            const filteredLayer = applyFilterToImage(m_lienzo.img);
            put_FilteredImage(filteredLayer);
        }
    }
}

function clearLegendFilter() {
    const filterIndicator = document.getElementById('filter-indicator');
    if (filterIndicator) {
        filterIndicator.classList.remove('active');
    }
    filter_color = null;
    hideInfo();
    m_map.removeLayer(window.filtered_layer);
    if (m_dlayer.layer) m_dlayer.layer.setVisible(true);
}

// Función para actualizar la leyenda con nueva variable
function updateLegend(title, gradient, minValue, maxValue, unit) {
    const legend = document.getElementById('legend');
    const legendTitle = document.getElementById('legend-title');
    const legendGradient = document.getElementById('legend-gradient');
    const legendLabels = document.getElementById('legend-labels');
    
    if (!legend || !legendTitle || !legendGradient || !legendLabels) return;
    
    legend.style.display = 'block';
    legendTitle.textContent = title;
    legendGradient.style.background = gradient;
    
    // Crear etiquetas - CORREGIDAS: de mayor a menor (invertido)
    legendLabels.innerHTML = '';
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        // Invertir los valores: empezar por el máximo y bajar al mínimo
        const value = maxValue - (maxValue - minValue) * (i / steps);
        const span = document.createElement('span');
        span.textContent = `${value.toFixed(0)}${i === steps ? " " + unit : ''}`;
        legendLabels.appendChild(span);
    }
}

// Inicializar la leyenda cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setupLegendClickFilter();
});

function showInfo(value) {
  hideInfo();
  const info = document.getElementById("filter-info");
  
  // Obtener unidades del título de la leyenda o usar valor por defecto
  const legendTitle = document.getElementById("legend-title");
  let units = "";
  if (legendTitle) {
    const titleText = legendTitle.textContent;
    // Extraer unidades comunes del título
    if (titleText.includes("Temperatura")) units = "°C";
    else if (titleText.includes("Humedad")) units = "%";
    else if (titleText.includes("Precipitación")) units = "mm";
    else if (titleText.includes("Viento")) units = "km/h";
    else if (titleText.includes("Presión")) units = "hPa";
  }
  
  const existingRange = info.querySelector(".dynamic-range");
  const rangeElement = document.createElement("div");
  rangeElement.className = "dynamic-range";
  rangeElement.innerHTML = `<strong>Rango aproximado: ${value} ${units}</strong>`;
  info.appendChild(rangeElement);
}

function hideInfo() {
  const info = document.getElementById("filter-info");
  const rangeElement = info.querySelector(".dynamic-range");
  if (rangeElement) {
    rangeElement.remove();
  }
}