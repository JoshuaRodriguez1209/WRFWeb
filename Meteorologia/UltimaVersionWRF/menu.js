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

