"use strict";

//------------------------------------------------------------------------------------------
//---------------------------CDataLayer-------------------------------------------------------
function CDataLayer(map, tipo = 'add', str_file = null){
	this.tipo = tipo;
	this.layer = null;

	this.fecha_img = '';
	
	this.tipo_barra = TEMP;
	this.unidades = '';
	this.img_escala = m_img_temp;
	this.fecha_loc = '';
	
	this.imageExtent = [LEFT, BOTTOM, RIGTH, TOP];
	
	if(str_file != null){
		set_layer(map, str_file, this.tipo, this);
	}
	else{
		this.layer = new ol.layer.Image({
			opacity: 0.6,
			source: new ol.source.ImageStatic({
				url: './images/black.png',
				crossOrigin: 'anonymous',
				imageExtent: this.imageExtent
			})
		});

		map.getLayers().insertAt(1, this.layer);
	}
};

CDataLayer.prototype.setParam = function (str_file){
	this.setBar(str_file);
	
	var pos = str_file.lastIndexOf('/');
	var str_name = str_file.substring(pos + 1);
	
	var pos_pt = str_name.lastIndexOf('.');
	
	this.fecha_img = str_name.substring(0, pos_pt);				//Fecha de la imagen
	
	var ls = this.fecha_img.split("_");
	
	var p = 2; 
	if(ls.length == 6){
		p = 3;
	}
	
	var str = ls[p].substring(0, 4) + "/" + ls[p].substring(4, 6) + "/" + ls[p].substring(6);
	var f = new Date(str + " UTC");
	
	f.setHours(f.getHours() + parseInt(ls[p + 1].substring(0, 2)));
	f.setHours(f.getHours() + parseInt(ls[p + 2]));
	var fecha_loc = this.pad(f.getDate(), 2)+'/'+this.pad(f.getMonth()+1, 2)+'/'+f.getFullYear()+' '+this.pad(f.getHours(), 2)+'hs';
	this.fecha_loc = fecha_loc;
};

CDataLayer.prototype.pad = function(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
};

CDataLayer.prototype.setBar = function (str_file){
	this.tipo_barra = TEMP;
	this.unidades = ' °C';
	this.img_escala = m_img_temp;												//Cambiar la barra de escala
	
	if (str_file.indexOf("_temp_") > 0){
		this.tipo_barra = TEMPLEV;
		this.unidades = ' °C';
		this.img_escala = m_img_templev;
	}

	else if (str_file.indexOf("_CO_") > 0){
		this.tipo_barra = CO;
		this.unidades = ' PPB';
		this.img_escala = m_img_co;
	}
	else if (str_file.indexOf("_NO2_") > 0){
		this.tipo_barra = NO2;
		this.unidades = ' PPB';
		this.img_escala = m_img_no2;
	}
	else if (str_file.indexOf("_O3_") > 0){
		this.tipo_barra = O3;
		this.unidades = ' PPB';
		this.img_escala = m_img_o3;
	}
	else if (str_file.indexOf("_SO2_") > 0){
		this.tipo_barra = SO2;
		this.unidades = ' PPB';
		this.img_escala = m_img_so2;
	}
	else if (str_file.indexOf("_PM10_") > 0){
		this.tipo_barra = PM10;
		this.unidades = ' PPB';
		this.img_escala = m_img_pm10;
	}
	else if (str_file.indexOf("_PM25_") > 0){
		this.tipo_barra = PM25;
		this.unidades = ' PPB';
		this.img_escala = m_img_pm25;
	}

	else if (str_file.indexOf("humrel") > 0){
		this.tipo_barra = HUM;
		this.unidades = ' %';
		this.img_escala = m_img_hum;
	}
	else if (str_file.indexOf("precacum") > 0){
		this.tipo_barra = RAIN;
		this.unidades = ' mm';
		this.img_escala = m_img_prec;
	}
	else if (str_file.indexOf("_sw_") > 0){
		this.tipo_barra = SRAD;
		this.unidades = ' watts/m^2';
		this.img_escala = m_img_srad;
	}
	else if (str_file.indexOf("_lw_") > 0){
		this.tipo_barra = LRAD;
		this.unidades = ' watts/m^2';
		this.img_escala = m_img_lrad;
	}
	else if (str_file.indexOf("wind") > 0){
		this.tipo_barra = WIND;
		this.unidades = ' km/h';
		this.img_escala = m_img_wind;
	}	
};

//------------------------------------------------------------------------------------------
//---------------------------CValor-------------------------------------------------------
function CValor(strval, val){
	this.strval = strval;
	this.val = val;
};

//------------------------------------------------------------------------------------------
//---------------------------CBarra-------------------------------------------------------
function CBarra(img, xmin, xmax, interv){
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
	
	var canvas = document.createElement('canvas');
	canvas.width  = img.width;
	canvas.height = img.height;

	var context = canvas.getContext('2d');
	context.drawImage(img, 0, 0);

	var posval = xmin;
	var tam = Math.trunc(img.width / (xmax - xmin)); 
	var tam2 = tam * interv; 
	
	for (var i = tam2; i < img.width; i+=tam2){
		var strval = JSON.stringify(context.getImageData(i, 12, 1, 1).data); //12 es la midad de la barra
		var val = posval;
		
		posval += interv;
		this.vals.push(new CValor(strval, val));				
	}
};

CBarra.prototype.busca = function (valor){
	for(var i = 0; i < this.vals.length; i++){
		if(this.vals[i].strval == valor){
			return this.vals[i].val;
		}
	}

	console.log(valor);
	return '---';
};