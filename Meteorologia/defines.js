"use strict"

const ZOOMREF = 11;

const TEMP = 10;
const TEMPLEV = 11;
const HUM = 12;
const RAIN = 13;
const SRAD = 14;
const LRAD = 15;
const WIND = 16;

const CO = 17;
const NO2 = 18;
const O3 = 19;
const SO2 = 20;
const PM10 = 21;
const PM25 = 22;

const LEFT = -99.36803;							//Extension del mapa
const TOP = 21.223442;
const RIGTH = -96.37683;
const BOTTOM = 17.579987;

var m_frames = [];
var mUrl_api =  './api/';

var m_img_icon = document.createElement('img');
m_img_icon.setAttribute('src', './images/smadsot.png');


var m_img_temp = document.createElement('img');
m_img_temp.setAttribute('src', './images/bar_t2m.png');


var m_img_co = document.createElement('img');
m_img_co.setAttribute('src', './images/bar_CO.png');

var m_img_no2 = document.createElement('img');
m_img_no2.setAttribute('src', './images/bar_NO2.png');

var m_img_o3 = document.createElement('img');
m_img_o3.setAttribute('src', './images/bar_O3.png');

var m_img_so2 = document.createElement('img');
m_img_so2.setAttribute('src', './images/bar_SO2.png');

var m_img_pm10 = document.createElement('img');
m_img_pm10.setAttribute('src', './images/bar_PM10.png');

var m_img_pm25 = document.createElement('img');
m_img_pm25.setAttribute('src', './images/bar_PM25.png');


var m_img_templev = document.createElement('img');
m_img_templev.setAttribute('src', './images/bar_tlev.png');

var m_img_hum = document.createElement('img');
m_img_hum.setAttribute('src', './images/bar_humrel.png');

var m_img_prec = document.createElement('img');
m_img_prec.setAttribute('src', './images/bar_pre.png');

var m_img_srad = document.createElement('img');
m_img_srad.setAttribute('src', './images/bar_sw.png');

var m_img_lrad = document.createElement('img');
m_img_lrad.setAttribute('src', './images/bar_lw.png');

var m_img_wind = document.createElement('img');
m_img_wind.setAttribute('src', './images/bar_wnd.png');
