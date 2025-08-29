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

const LEFT = -99.36803;
const TOP = 21.223442;
const RIGTH = -96.37683;
const BOTTOM = 17.579987;

var m_frames = [];

// Detect if running locally and adjust URL accordingly
var mUrl_api = (function() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Running on XAMPP
        const projectPath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
        return projectPath + 'api/';
    } else {
        // Running on production server
        return './api/';
    }
})();

console.log('API URL:', mUrl_api); // Debug output

// Create placeholder images if they don't exist
function createPlaceholderImages() {
    const images = [
        { name: 'm_img_icon', src: './images/smadsot.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_temp', src: './images/bar_t2m.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_co', src: './images/bar_CO.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_no2', src: './images/bar_NO2.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_o3', src: './images/bar_O3.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_so2', src: './images/bar_SO2.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_pm10', src: './images/bar_PM10.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_pm25', src: './images/bar_PM25.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_templev', src: './images/bar_tlev.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_hum', src: './images/bar_humrel.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_prec', src: './images/bar_pre.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_srad', src: './images/bar_sw.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_lrad', src: './images/bar_lw.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
        { name: 'm_img_wind', src: './images/bar_wnd.png', fallback: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' }
    ];
    
    images.forEach(img => {
        window[img.name] = document.createElement('img');
        window[img.name].onerror = function() {
            this.src = img.fallback;
        };
        window[img.name].setAttribute('src', img.src);
    });
}

// Initialize images
createPlaceholderImages();