"use strict";

//------------------------------------------------------------------------------------------
//---------------------------CLienzo-------------------------------------------------------
function CLienzo(img){
	this.yMax = TOP;
	this.yMin = BOTTOM;
	this.xMax = RIGTH;
	this.xMin = LEFT;	
	
	this.img = img;
	
	this.canvas = document.createElement('canvas');
	this.canvas.width  = this.img.width;
	this.canvas.height = this.img.height;

	this.context = this.canvas.getContext('2d',{willReadFrequently: true});
	this.context.drawImage(this.img, 0, 0);
	
	this.setScale();
};
	
CLienzo.prototype.setScale = function(){	
	this.xI = 0;
	this.width = this.img.width;
	
	this.yI = 0;
	this.height = this.img.height;

	this.scaleX = (this.width - this.xI) / (this.xMax - this.xMin);
	this.scaleY = (this.height - this.yI) / (this.yMax - this.yMin);
};

CLienzo.prototype.xy = function(coord){
	var x = (coord[0] - this.xMin) * this.scaleX + this.xI;
	var y = this.height - (coord[1] - this.yMin) * this.scaleY;
	
	return {x: x, y: y};
};

CLienzo.prototype.lonlat = function(point){
	var x = this.xMin + (point[0] - this.xI) / this.scaleX;
	var y = this.yMin + (this.height - point[1]) / this.scaleY;
	
	return {lon: x.toFixed(3), lat: y.toFixed(3)};
};

CLienzo.prototype.get_pixel = function(coord){
	var pt = this.xy(coord);
	var px = this.context.getImageData(Math.trunc(pt.x), Math.trunc(pt.y), 1, 1).data;	
	
	return JSON.stringify(px);
};	