"use strict";

//------------------------------------------------------------------------------------------
function create_layer_kml_base(titulo, tipo, str_file_kml, opacidad, bvisible) {
  var layer = new ol.layer.Vector({
    opacity: opacidad,
    title: titulo,
    type: tipo,
    visible: bvisible,
    source: new ol.source.Vector({
      url: str_file_kml,
      format: new ol.format.KML(),
    }),
  });
  return layer;
  
}

//------------------------------------------------------------------------------------------
function set_layer(map, str_file_image, tipo, data_layer) {
  if (data_layer.layer != null && tipo == "add") {
    map.removeLayer(data_layer.layer);
  }

  data_layer.layer = new ol.layer.Image({
    opacity: 0.5,
    source: new ol.source.ImageStatic({
      url: str_file_image,
      crossOrigin: "anonymous",
      imageExtent: data_layer.imageExtent,
    }),
  });

  data_layer.setParam(str_file_image);
  if (tipo == "add") {
    map.getLayers().insertAt(1, data_layer.layer);
  }
}

//-------------------------------------------------------------------------------
var m_layer_municipios = create_layer_kml_base(
  "Municipios",
  "",
  "./kml/puebla.kml",
  0.7,
  true
);

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
  zoom: 8.3,
  minZoom: 8.3,
  maxZoom: 18,
  constrainResolution: true,
  constrainOnlyCenter: true,
  extent: [-99.08, 17.81, -96.7, 20.87],
  zoomControl: false,
});

//-------------------------------------------------------------------------------

var scaleLineControl = new ol.control.ScaleLine({
  units: "metric",
  bar: false,
  steps: 4,
  minWidth: 140,
  className: "ol-scale-line",
  target: null,
});

//-------------------------------------------------------------------------------

var m_map = new ol.Map({
  controls: ol.control.defaults({ zoom: false }).extend([
    mousePositionControl,
    m_notification,
    m_control,
    scaleLineControl,
    new ol.control.LayerSwitcher({
      //Control de capas
      tipLabel: "Capas",
    }),
  ]),
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=8f72fd4e8a3ddf9849c5e53cffde9394",
      }),
      title: "Temperatura",
    }),
    m_layer_municipios
  ],
  view: m_view,
});

var m_dlayer = new CDataLayer(m_map);
//-------------------------------------------------------------------------------

/*const isMobile = window.innerWidth < 768;
const graticule = new ol.Graticule({
  showLabels: true,
  wrapX: false,
  lonLabelPosition: isMobile ? 0.93 : 0.99,
  latLabelPosition: isMobile ? 0.79 : 0.93, // posición más dentro del canvas
  targetSize: 200,
  strokeStyle: new ol.style.Stroke({
    color: "rgba(100,100,100,0.7)",
    width: 2,
    lineDash: [2, 4],
  }),
  lonLabelStyle: new ol.style.Text({
    font: "bold 16px Arial, sans-serif",
    fill: new ol.style.Fill({ color: "#222" }),
    stroke: new ol.style.Stroke({ color: "#fff", width: 3 }),
    textBaseline: "top",
  }),
  latLabelStyle: new ol.style.Text({
    font: "bold 16px Arial, sans-serif",
    textAlign: "left", // alinea texto hacia dentro
    fill: new ol.style.Fill({ color: "#222" }),
    stroke: new ol.style.Stroke({ color: "#fff", width: 3 }),
  }),
});
graticule.setMap(m_map);*/

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
  const permanentDateElement = document.querySelector("#filter-info .permanent-date");
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
var procesa_dat = function () {
  var val_dat = "";
  switch ($("#select_dat").val()) {
    case "temp":
      val_dat = '<option value="temmax">Temperatura max</option>';
      val_dat += '<option value="temmin">Temperatura min</option>';
      val_dat += '<option value="temp/700">Temperatura a 700mb</option>';
      val_dat += '<option value="temp/600">Temperatura a 600mb</option>';
      val_dat += '<option value="temp/500">Temperatura a 500mb</option>';
      val_dat += '<option value="temp/400">Temperatura a 400mb</option>';
      val_dat += '<option value="temp/300">Temperatura a 300mb</option>';
      val_dat += '<option value="temp/200">Temperatura a 200mb</option>';
      break;
    case "quim":
      val_dat = '<option value="CO/sfc">Monóxido de Carbono</option>';
      val_dat += '<option value="NO2/sfc">Dióxido de Nitrógeno</option>';
      val_dat += '<option value="O3/sfc">Ozono</option>';
      val_dat += '<option value="SO2/sfc">Dióxido de Azufre</option>';
      val_dat += '<option value="PM10/sfc">Partículas PM 10</option>';
      val_dat += '<option value="PM25/sfc">Partículas PM 2.5</option>';
      break;
    case "hum":
      val_dat = '<option value="hum/sfc">Humedad en superficie</option>';
      break;
    case "prec":
      val_dat = '<option value="precacum">Precipitación acumulada</option>';
      break;
    case "rad":
      val_dat = '<option value="radsw/sfc">Radiación de onda corta</option>';
      val_dat += '<option value="radlw/sfc">Radiación de onda larga</option>';
      break;
    case "wind":
      val_dat = '<option value="wnd/sfc">Viento en superficie</option>';
      val_dat += '<option value="wnd/700">Viento a 700mb</option>';
      val_dat += '<option value="wnd/600">Viento a 600mb</option>';
      val_dat += '<option value="wnd/500">Viento a 500mb</option>';
      val_dat += '<option value="wnd/400">Viento a 400mb</option>';
      val_dat += '<option value="wnd/300">Viento a 300mb</option>';
      val_dat += '<option value="wnd/200">Viento a 200mb</option>';
      break;
    case "psfc":
      val_dat = '<option value="psfc">Presión barométrica</option>';
      break;
  }

  $("#select_var").html(val_dat);
  procesa_var();
};

var set_atmos = function () {
  var val_dat = '<option value="temp">Temperatura</option>';

  val_dat += '<option value="hum">Humedad</option>';
  val_dat += '<option value="prec">Precipitación</option>';
  val_dat += '<option value="rad">Radiación</option>';
  val_dat += '<option value="wind">Viento</option>';
  val_dat += '<option value="psfc">Presión</option>';

  $("#select_dat").html(val_dat);
  procesa_dat();
};

var set_chem = function () {
  var val_dat = (val_dat = '<option value="quim">Contaminantes</option>');

  $("#select_dat").html(val_dat);
  procesa_dat();
};

//-------------------------------------------------------------------------------
var list_var = async function (datos) {
  var dir_var = "";
  var list_files = datos.split("|");

  //	for (var i = list_files.length - 1; i >= 0; i--){					//Reversa
  for (var i = 0; i < list_files.length; i++) {
    var str_file = list_files[i];

    str_file = str_file.substring(1); //Recorrer el string para quitar el ../

    if (str_file != "") {
      var pos = str_file.lastIndexOf("/");
      var str_name = str_file.substring(pos + 1);

      var pos_pt = str_name.lastIndexOf(".");
      var resta = 2;

      var indice = str_name.indexOf("wind");
      if (indice > 0) resta = 3;

      str_name = str_name.substring(pos_pt - resta, pos_pt);

      dir_var += "<option  value='" + str_file + "'>" + str_name + "</option>";
    }
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
  var str_run = $("#select_run").val();
  var str_var = $("#select_var").val();
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
  var $icon = $btn.find("i");

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
      $icon.removeClass("glyphicon-play").addClass("glyphicon-stop");
      $btn.attr("title", "Detener");
      isAnimating = true;
    } else {
      // Detener animación
      cancel_animate();
      $icon.removeClass("glyphicon-stop").addClass("glyphicon-play");
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

async function animate_frames() {
  var pos_frame = 0;
  var time_to_draw = performance.now();

  m_id_animation = await requestAnimationFrame(function animate(time) {
    var dif_time = time - time_to_draw;

    if (dif_time > m_rango) {
      if (pos_frame < m_frames.length) {
        var m_dlayer_act = m_frames[pos_frame];
        if (filter_color && m_dlayer_act.img && m_dlayer_act.img.complete) {
          const filteredLayer = applyFilterToImage(m_dlayer_act.img);
          if (filteredLayer) {
            if (window.filtered_layer) m_map.removeLayer(window.filtered_layer);
            m_map.addLayer(filteredLayer);
            window.filtered_layer = filteredLayer;
          } else {
            m_map.addLayer(m_dlayer_act.layer);
          }
        } else {
          m_map.removeLayer(m_dlayer.layer);
          m_map.addLayer(m_dlayer_act.layer);
          m_dlayer = m_dlayer_act;
        }
        pos_frame = pos_frame + 1;
      } else {
        //				console.log('inicializado');
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

var create_style = function (str_file) {
  return new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      scale: get_scale(),
      src: str_file,
    }),
    text: new ol.style.Text({
      offsetX: 8,
      offsetY: 16,
      textAlign: "left",
      font: "14px Calibri,sans-serif",
      fill: new ol.style.Fill({ color: "#000" }),
      stroke: new ol.style.Stroke({
        color: "#fff",
        width: 1,
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
  type: "",
  visible: "true",
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
    if ($("#select_dat").val() == "quim") {
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
  add_features(datos, "estacion", "/meteogramas/", "./images/estacion.png");
};

//------------------------------------------------------------------------
var list_cabeceras = function (datos) {
  add_features(datos, "cabecera", "/cabeceras/", "./images/cabecera.png");
};

//------------------------------------------------------------------------
var add_features = function (datos, local, dir, urlIcon) {
  var format = new ol.format.GeoJSON();
  var features = format.readFeatures(datos);

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];
    feature.set("local", local);
    feature.set("dir", dir);
    feature.setStyle(create_style(urlIcon));
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

      feature.getStyle().getImage().setScale(scale);
      feature.getStyle().getText().setScale(scale);
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
  <div style="margin-bottom: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h4 style="font-size: 1.4em; font-weight: bold; margin: 0;">Resumen de Promedios</h4>
      <button onclick="downloadFileCSV()" style="
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        font-size: 1em;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <i class="glyphicon glyphicon-download"></i>
        Descargar (.CSV)
      </button>
    </div>
    <table style="
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95em;
      background-color: #fff;
      border: none;
    ">
      <thead style="background-color: #f5f5f5;">
        <tr>
          <th style="padding: 10px; text-align: left;">Variable</th>
          <th style="padding: 10px; text-align: left;">Promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #fcfcfc;">
          <td style="padding: 10px;">🌡️ Temperatura (°C)</td>
          <td style="padding: 10px;">${avg(djson["t2m"])}</td>
        </tr>
        <tr style="background-color: #f0f8ff;">
          <td style="padding: 10px;">💧 Humedad (%)</td>
          <td style="padding: 10px;">${avg(djson["rh"])}</td>
        </tr>
        <tr style="background-color: #fcfcfc;">
          <td style="padding: 10px;">🌧️ Precipitación (mm)</td>
          <td style="padding: 10px;">${avg(djson["pre"])}</td>
        </tr>
        <tr style="background-color: #f0f8ff;">
          <td style="padding: 10px;">☀️ Radiación (w/m²)</td>
          <td style="padding: 10px;">${avg(djson["sw"])}</td>
        </tr>
        <tr style="background-color: #fcfcfc;">
          <td style="padding: 10px;">🌬️ Viento (km/h)</td>
          <td style="padding: 10px;">${avg(djson["wnd"])}</td>
        </tr>
        <tr style="background-color: #f0f8ff;">
          <td style="padding: 10px;">📉 Presión (hPa)</td>
          <td style="padding: 10px;">${avg(djson["psl"])}</td>
        </tr>
      </tbody>
    </table>
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
        const resumenHTML = `<div style="margin-bottom: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h4 style="font-size: 1.4em; font-weight: bold; margin: 0;">Resumen de Promedios</h4>
      <button onclick="downloadFileCSV()" style="
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        font-size: 1em;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <i class="glyphicon glyphicon-download"></i>
        Descargar (.CSV)
      </button>
    </div>
    <table style="width: 100%; border-collapse: collapse; font-size: 0.95em; background-color: #fff; border: none;">
      <thead style="background-color: #f5f5f5;">
        <tr>
          <th style="padding: 10px; text-align: left;">Contaminante</th>
          <th style="padding: 10px; text-align: left;">Promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #fcfcfc;"><td style="padding: 10px;">🟤 Monóxido de Carbono (ppm)</td><td style="padding: 10px;">${avg(
          djson["CO"]
        )}</td></tr>
        <tr style="background-color: #f0f8ff;"><td style="padding: 10px;">🟣 Dióxido de Nitrógeno (ppb)</td><td style="padding: 10px;">${avg(
          djson["NO2"]
        )}</td></tr>
        <tr style="background-color: #fcfcfc;"><td style="padding: 10px;">🟢 Ozono (ppb)</td><td style="padding: 10px;">${avg(
          djson["O3"]
        )}</td></tr>
        <tr style="background-color: #f0f8ff;"><td style="padding: 10px;">🔵 Dióxido de Azufre (ppb)</td><td style="padding: 10px;">${avg(
          djson["SO2"]
        )}</td></tr>
        <tr style="background-color: #fcfcfc;"><td style="padding: 10px;">⚫ PM 10 (µg/m³)</td><td style="padding: 10px;">${avg(
          djson["PM10"]
        )}</td></tr>
        <tr style="background-color: #f0f8ff;"><td style="padding: 10px;">⚫ PM 2.5 (µg/m³)</td><td style="padding: 10px;">${avg(
          djson["PM25"]
        )}</td></tr>
      </tbody>
    </table>
  </div>`;
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

//-------------------------------------------------------------------------------
function set_canva(contenDialog, dataset, tipo, str_file, title, unid, color) {
  var canva = document.createElement("canvas");
  var conten = $("<div></div>").append(canva);

  var labs = [];
  var dats = [];
  var hs = 0;

  for (var dat in dataset) {
    labs.push(setLabel(str_file, (hs += 3)));
    dats.push(round10(dataset[dat]));
  }

  grafico(canva, tipo, labs, dats, title, unid, color);
  contenDialog.append(conten);
}

//-------------------------------------------------------------------------------
function grafico(canva, tipo, labels, dats, title, unid, color) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        axis: "x",
        data: dats,
        fill: false,
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };

  new Chart(canva, {
    type: tipo,
    data: data,
    options: {
      locale: "en-US",
      plugins: {
        title: {
          display: false,
          text: "",
        },
      },
      indexAxis: "x",
      scales: {
        y: {
          //					beginAtZero: true,
          display: true,
          title: {
            display: true,
            text: unid,
          },
        },
      },
    },
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
  h1.textContent = "Pronóstico meteorológico para el Estado de Puebla";
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
  h1.textContent = "Calidad del aire para el Estado de Puebla";
  const h3 = document.getElementById("select_dat");

  h3.style.display = "none";

  const h4 = document.getElementById("variable2");
  h4.textContent = "Contaminantes:";
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
  const range = `${value - 2} - ${value + 2}`
  showInfo(range);
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
  return filteredLayer;
}

function put_FilteredImage(filteredLayer) {
  if (window.filtered_layer) m_map.removeLayer(window.filtered_layer);
  if (m_dlayer.layer) m_dlayer.layer.setVisible(false);

  m_map.addLayer(filteredLayer);
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
  const units = document.getElementById("gradient-units").textContent;
  const existingRange = info.querySelector(".dynamic-range");
  const rangeElement = document.createElement("div");
  rangeElement.className = "dynamic-range";
  rangeElement.innerHTML = `<strong>Rango aproximado: ${value} ${
    units || ""
  }</strong>`;
  info.appendChild(rangeElement);
}

function hideInfo() {
  const info = document.getElementById("filter-info");
  const rangeElement = info.querySelector(".dynamic-range");
  if (rangeElement) {
    rangeElement.remove();
  }
}
