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
    opacity: 0.6,
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
var m_lyr_tile = new ol.layer.Tile({
  source: new ol.source.OSM(),
  type: "base",
  title: "Mapa",
});

var m_layer_municipios = create_layer_kml_base(
  "Municipios",
  "",
  "./kml/puebla.kml",
  0.3,
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
  zoom: 8,
  minZoom: 8,
  maxZoom: 18,
  constrainResolution: true,
  constrainOnlyCenter: false,
  extent: [-98.5, 18.5, -97, 19.5],
});

//-------------------------------------------------------------------------------

var m_map = new ol.Map({
  controls: ol.control.defaults().extend([
    mousePositionControl,
    m_notification,
    m_control,
    new ol.control.LayerSwitcher({
      //Control de capas
      tipLabel: "Capas",
    }),
  ]),
  target: "map",
  layers: [m_lyr_tile, m_layer_municipios],
  view: m_view,
});

var m_dlayer = new CDataLayer(m_map);

//-------------------------------------------------------------------------------
m_map.on("postcompose", function (event) {
  var canvas = event.context.canvas;
  var ctx = canvas.getContext("2d");

  ctx.font = "12pt Arial";
  ctx.fillStyle = "black";

  var x_p = canvas.width / 2 - 360;
  var y_p = canvas.height - m_dlayer.img_escala.clientHeight - 100;

  //ctx.drawImage(m_img_icon, 50, 10);								//Icono del instituto
  ctx.fillText(m_dlayer.fecha_img, 30, y_p + 80); //Fecha de la imagen
  ctx.fillText("VALIDEZ:" + m_dlayer.fecha_loc, 30, y_p + 100);

  ctx.drawImage(m_dlayer.img_escala, x_p, y_p); //cambiar la escala segun la variable
});
//-------------------------------------------------------------------------------

$(function () {
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=listado_runs",
    "fecha=" + get_fecha_actual(),
    list_runs,
    showDialog_Error
  );
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=cabeceras",
    "fecha=" + get_fecha_actual(),
    list_cabeceras,
    showDialog_Error
  );
  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=estaciones",
    "fecha=" + get_fecha_actual(),
    list_estaciones,
    showDialog_Error
  );
});
//-------------------------------------------------------------------------------
function get_fecha_actual() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`; // Ejemplo: 20250617
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

var crea_mask = function () {
  const select = document.getElementById("select_run");
  const selectedOption = select.options[select.selectedIndex];

  const recortado = selectedOption.textContent.substring(0, 8);

  // Aquí aplicamos una máscara visual al texto de la opción seleccionada
  selectedOption.textContent = recortado.replace(
    /(\d{4})(\d{2})(\d{2})/,
    "$3-$2-$1"
  );
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
      val_dat = '<option value="psfc">Preción barométrica</option>';
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
var list_var = function (datos) {
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

  make_animation(datos);
  update_var();
};

//-------------------------------------------------------------------------------
var m_lienzo = null;
var m_barra = null;

//-------------------------------------------------------------------------------
var update_var = function () {
  m_lienzo = null;
  m_barra = null;

  var str_file = $("#selectHora").val();
  set_layer(m_map, str_file, "add", m_dlayer);

  var img = new Image();
  img.onload = function () {
    m_lienzo = new CLienzo(img);
  };
  img.src = str_file;

  if (m_dlayer.img_escala.complete) {
    switch (m_dlayer.tipo_barra) {
      case TEMP:
        m_barra = new CBarra(m_dlayer.img_escala, -12, 50, 2, 22);
        break;
      case WIND:
        m_barra = new CBarra(m_dlayer.img_escala, 0, 160, 10, 22);
        break;
    }
  } else {
    showDialog_Error();
  }
};

//-------------------------------------------------------------------------------
var procesa_var = function () {
  var str_run = $("#select_run").val();
  var str_var = $("#select_var").val();

  m_dir_runs = str_run.substring(1);
  var str_dat = "variable=" + str_run + "/" + str_var + "/";
  console.log(str_dat);

  make_transaction(
    mUrl_api + "api.php?tipo_solicitud=listado_var",
    str_dat,
    list_var,
    showDialog_Error
  );
};

//-------------------------------------------------------------------------------
function check_loaded() {
  var continue_check = false;

  requestAnimationFrame(function check(time) {
    continue_check = false;
    for (var i = 0; i < m_frames.length; i++) {
      if (m_frames[i].layer == null) {
        continue_check = true;
        break;
      }
    }

    if (continue_check) {
      requestAnimationFrame(check);
      document.body.style.cursor = "wait";
    } else {
      $("#btn_play_animation").removeAttr("disabled");
      $("#btn_stop_animation").attr("disabled", "disabled");
      document.body.style.cursor = "default";
      console.log("Animacion cargada");
    }
  });
}

//-------------------------------------------------------------------------------
var m_rango = 250;
var m_animate = false;
var m_id_animation = 0;

function animate_frames() {
  var pos_frame = 0;
  var time_to_draw = performance.now();

  m_id_animation = requestAnimationFrame(function animate(time) {
    var dif_time = time - time_to_draw;

    if (dif_time > m_rango) {
      if (pos_frame < m_frames.length) {
        var m_dlayer_act = m_frames[pos_frame];

        m_map.removeLayer(m_dlayer.layer);
        m_map.addLayer(m_dlayer_act.layer);

        pos_frame = pos_frame + 1;
        m_dlayer = m_dlayer_act;
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
  contenDialog.append(
    '<a href="#" onclick="downloadFileCSV();">' + "Descargar datos" + "</a>"
  );

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
      title: name,
      closable: true,
      message: contenDialog,
    });
  }
}

//-------------------------------------------------------------------------------
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

  $("#col_controles").show();
  $("#col_mapa").show();

  $("#botones1").hide();
  $("#botones2").show();

  $("#bt_atmos").show();
  $("#bt_chem").hide();

  m_glosario = "gatmos.html";
  set_atmos();

  const h1 = document.getElementById("title");
  // Cambia el contenido del h1
  h1.textContent = "Pronóstico meteorológico para el Estado de Puebla";
  const h2 = document.getElementById("variable");
  h2.textContent = "Parámetros:";
});

$("#cali").click(function () {
  $("#meteo").hide();

  $("#col_controles").show();
  $("#col_mapa").show();

  $("#botones1").hide();
  $("#botones2").show();

  $("#bt_atmos").hide();
  $("#bt_chem").show();

  m_glosario = "gchem.html";
  set_chem();

  const h1 = document.getElementById("title");
  // Cambia el contenido del h1
  h1.textContent = "Calidad del aire para el Estado de Puebla";

  const h2 = document.getElementById("variable");
  // h2.textContent = 'Contaminantes';
  h2.style.display = "none";

  const h3 = document.getElementById("select_dat");

  h3.style.display = "none";

  const h4 = document.getElementById("variable2");
  h4.textContent = "Contaminantes:";
});

$(document).ready(function () {
  $("#col_controles").hide();
  $("#col_mapa").hide();
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
  var features = m_vectorSource.getFeatures(); //Obtener el arreglo de iconos

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
