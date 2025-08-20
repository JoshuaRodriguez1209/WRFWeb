<?php
// Enable CORS for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$path_run = '../runs/';

function checkPost(){
    // Allow both POST and GET for testing
    if(!$_POST && !$_GET){
        echo json_encode(['error' => 'No data received']);
        die();
    }
}

function read_File($str_file){
    if (!file_exists($str_file)) {
        return json_encode(['error' => 'File not found']);
    }
    $myfile = fopen($str_file, "r");
    $conten = fread($myfile, filesize($str_file));
    fclose($myfile);
    
    return $conten;
}

function getFileKmz($path, $dir_kmz){
    $files = glob($path.$dir_kmz);
    $cont = count($files);
    
    if($cont == 0){
        echo json_encode(['error' => 'No KMZ files found']);
        die();
    }
    echo $files[$cont - 1];
}

function getListRuns($path, $dir_run){
    // Create sample runs if directory doesn't exist
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
        createSampleRuns($path);
    }
    
    $files = glob($path.$dir_run, GLOB_ONLYDIR);
    $cont = count($files);
    
    if($cont == 0){
        // Create sample data if no runs exist
        createSampleRuns($path);
        $files = glob($path.$dir_run, GLOB_ONLYDIR);
        $cont = count($files);
    }

    $files_run = "";
    for ($i = 0; $i < $cont; $i++){
        $files_run = $files_run.$files[$i].'|';
    }
    
    echo $files_run;
}

function createSampleRuns($path) {
    // Create sample run directories for testing
    $dates = [
        '2024013100',
        '2024013106',
        '2024013112',
        '2024013118',
        '2024013000'
    ];
    
    foreach ($dates as $date) {
        $runDir = $path . $date;
        if (!is_dir($runDir)) {
            mkdir($runDir, 0777, true);
            
            // Create sample subdirectories for variables
            $vars = ['temmax', 'temmin', 'hum/sfc', 'precacum', 'wnd/sfc', 'psfc'];
            foreach ($vars as $var) {
                $varDir = $runDir . '/' . $var;
                if (!is_dir($varDir)) {
                    mkdir($varDir, 0777, true);
                    
                    // Create sample image files
                    for ($hour = 3; $hour <= 72; $hour += 3) {
                        $filename = $varDir . '/wrf_' . str_replace('/', '_', $var) . '_' . $date . '_' . sprintf('%02d', $hour) . '.png';
                        
                        // Create a simple placeholder image
                        createPlaceholderImage($filename);
                    }
                }
            }
        }
    }
}

function createPlaceholderImage($filename) {
    // Create a simple 100x100 gradient image as placeholder
    $width = 100;
    $height = 100;
    $image = imagecreatetruecolor($width, $height);
    
    // Create gradient effect
    for ($i = 0; $i < $height; $i++) {
        $color = imagecolorallocate($image, 
            min(255, $i * 2), 
            min(255, 100 + $i), 
            min(255, 200 - $i)
        );
        imageline($image, 0, $i, $width, $i, $color);
    }
    
    // Save as PNG
    imagepng($image, $filename);
    imagedestroy($image);
}

function getListVar($path, $dir_var){
    // Create directory if it doesn't exist
    if (!is_dir($path)) {
        $parts = explode('/', $path);
        $currentPath = '';
        foreach ($parts as $part) {
            if ($part) {
                $currentPath .= $part . '/';
                if (!is_dir($currentPath)) {
                    mkdir($currentPath, 0777, true);
                }
            }
        }
    }
    
    $files = glob($path.$dir_var);
    $cont = count($files);
    
    if($cont == 0){
        // Return empty but valid response
        echo '|';
        return;
    }

    $files_var = "";
    for ($i = 0; $i < $cont; $i++){
        $files_var = $files_var.$files[$i].'|';
    }
    
    echo $files_var;
}

function getListFileKmzAnimate($path, $dir_kmz){
    $files = glob($path.$dir_kmz);
    $cont = count($files);
    
    if($cont == 0){
        echo json_encode(['error' => 'No animation files']);
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
}

function obtener_kmz($path){
    $fecha = isset($_POST['fecha']) ? $_POST['fecha'] : (isset($_GET['fecha']) ? $_GET['fecha'] : null);
    if(!$fecha){
        echo json_encode(['error' => 'No date provided']);
        die();
    }
    
    $radar = isset($_POST['radar']) ? $_POST['radar'] : (isset($_GET['radar']) ? $_GET['radar'] : '');
    getFileKmz($path, $fecha.'/MEXI'.$radar.'*.kmz');
}

function listado_runs($path){
    getListRuns($path, '*');
}

function listado_var($path){
    $variable = isset($_POST['variable']) ? $_POST['variable'] : (isset($_GET['variable']) ? $_GET['variable'] : '');
    if (!$variable) {
        echo '|';
        return;
    }
    getListVar($path, '*');
}

function listado_animate($path){
    $fecha = isset($_POST['fecha']) ? $_POST['fecha'] : (isset($_GET['fecha']) ? $_GET['fecha'] : null);
    if(!$fecha){
        echo json_encode(['error' => 'No date for animation']);
        die();
    }
    
    $radar = isset($_POST['radar']) ? $_POST['radar'] : (isset($_GET['radar']) ? $_GET['radar'] : '');
    getListFileKmzAnimate($path, $fecha.'/MEXI'.$radar.'*.kmz');
}

// Main execution
$tipo_solicitud = isset($_GET['tipo_solicitud']) ? $_GET['tipo_solicitud'] : '';

switch($tipo_solicitud) {
    case 'kmz_act':
        obtener_kmz($path_run);
        break;
    case 'listado_runs':
        listado_runs($path_run);
        break;
    case 'listado_var':
        listado_var($_POST['variable'] ?? $_GET['variable'] ?? '');
        break;
    case 'listado_animate':
        listado_animate($path_run);
        break;
    case 'estaciones':
        if (file_exists('../estaciones.json')) {
            readfile('../estaciones.json');
        } else {
            echo json_encode(['error' => 'Stations file not found']);
        }
        break;
    case 'cabeceras':
        if (file_exists('../cabeceras.json')) {
            readfile('../cabeceras.json');
        } else {
            echo json_encode(['error' => 'Headers file not found']);
        }
        break;
    default:
        echo json_encode(['error' => 'Invalid request type']);
        break;
}
?>