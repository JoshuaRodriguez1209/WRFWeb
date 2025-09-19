<?php
$path_run = '../runs/';

function checkPost(){
	if(!$_POST){																										//Si se mando informacion por medio de POST
		echo 'error';
		die();
	}
};

function read_File($str_file){
	$myfile = fopen($str_file, "r") or die();
	$conten = fread($myfile, filesize($str_file));
	fclose($myfile);
	
	return $conten;
};

function getFileKmz($path, $dir_kmz){
	$files  = glob($path.$dir_kmz);
	$cont = count($files);
	
	if($cont == 0){
		echo 'error';
		die();
	}
	echo $files[$cont - 1];
};

function getListRuns($path, $dir_run){
	$files  = glob($path.$dir_run, GLOB_ONLYDIR);
	$cont = count($files);
	
	if($cont == 0){
		echo 'error cero '. $path.$dir_run;
		die();
	}

	$files_run = "";
	for ($i = 0; $i < $cont; $i++){
		$files_run = $files_run.$files[$i].'|';
	}
	
	echo $files_run;
};

function getListVar($path, $dir_var){
	$files  = glob($path.$dir_var);
	$cont = count($files);
	
	if($cont == 0){
		echo 'error cero var'. $path.$dir_var;
		die();
	}

	$files_var = "";
	for ($i = 0; $i < $cont; $i++){
		$files_var = $files_var.$files[$i].'|';
	}
	
	echo $files_var;
};

function getListFileKmzAnimate($path, $dir_kmz){
	$files  = glob($path.$dir_kmz);
	$cont = count($files);
	
	if($cont == 0){
		echo 'error cont'.$path.$dir_kmz;
		die();
	}

	$pos_ini = $cont - 120;

	if($pos_ini < 0){
		$pos_ini = 0;
	}

	$files_kmz = "";
	for ($i = $pos_ini; $i < $cont; $i++){
		if(($i % 3) == 0){
			$files_kmz = $files_kmz.$files[$i].'|';
		}
	}
	
	echo $files_kmz;
};

function obtener_kmz($path){
	if(!isset($_POST['fecha'])){
		echo 'error';
		die();
	}
	
	getFileKmz($path, $_POST['fecha'].'/MEXI'.$_POST['radar'].'*.kmz');
}

function listado_runs($path){
	if(!isset($_POST['fecha'])){
		echo 'error';
		die();
	}
	
	getListRuns($path, '*');
}

function listado_var($path){

	getListVar($path, '*');
}

function listado_animate($path){
	if(!isset($_POST['fecha'])){
		echo 'error fecha';
		die();
	}
	
	getListFileKmzAnimate($path, $_POST['fecha'].'/MEXI'.$_POST['radar'].'*.kmz');
}

//------------------------------------------------------------------
checkPost();
switch($_GET['tipo_solicitud']) {
	case 'kmz_act':
		obtener_kmz($path_run);
		break;
	case 'listado_runs':
		listado_runs($path_run);
		break;
	case 'listado_var':
		listado_var($_POST['variable']);
		break;
	case 'listado_animate':
		listado_animate($path_run);
		break;
	case 'estaciones':
		readfile('../estaciones.json');
		break;
	case 'cabeceras':
		readfile('../cabeceras.json');
		break;
}

?>
