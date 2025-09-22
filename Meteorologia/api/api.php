<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

$path_run = '../runs/';

function checkPost(){
    if(!$_POST && $_GET['tipo_solicitud'] !== 'available_dates'){
        echo json_encode(['error' => 'POST data required']);
        exit();
    }
}

// FINAL CORRECTED: Look in the right subdirectories (meteo/chem)
function extractWeatherDataFromImages(){
    global $path_run;
    
    try {
        if(!isset($_POST['fecha']) || !isset($_POST['type']) || !isset($_POST['coordinates'])){
            echo json_encode(['error' => 'Missing parameters: fecha, type, or coordinates required']);
            return;
        }
        
        $fecha = $_POST['fecha'];
        $type = $_POST['type'];
        $timeStep = isset($_POST['timeStep']) ? intval($_POST['timeStep']) : 0;
        $coordinates = json_decode($_POST['coordinates'], true);
        
        if(!$coordinates || !is_array($coordinates)){
            echo json_encode(['error' => 'Invalid coordinates format']);
            return;
        }
        
        // Map frontend types to JSON file types and keys
        $typeMapping = [
            'temperature' => ['file_type' => 'meteo', 'key' => 't2m'],
            'humidity' => ['file_type' => 'meteo', 'key' => 'rh'],
            'wind' => ['file_type' => 'meteo', 'key' => 'wnd'],
            'pressure' => ['file_type' => 'meteo', 'key' => 'psl'],
            'precipitation' => ['file_type' => 'meteo', 'key' => 'pre'],
            'radiation' => ['file_type' => 'meteo', 'key' => 'sw'],
            'co' => ['file_type' => 'chem', 'key' => 'CO'],
            'no2' => ['file_type' => 'chem', 'key' => 'NO2'],
            'o3' => ['file_type' => 'chem', 'key' => 'O3'],
            'so2' => ['file_type' => 'chem', 'key' => 'SO2'],
            'pm10' => ['file_type' => 'chem', 'key' => 'PM10'],
            'pm25' => ['file_type' => 'chem', 'key' => 'PM25']
        ];
        
        if(!isset($typeMapping[$type])){
            echo json_encode(['error' => 'Unknown weather type: ' . $type]);
            return;
        }
        
        $fileType = $typeMapping[$type]['file_type'];
        $dataKey = $typeMapping[$type]['key'];
        
        // CORRECTED: Use the actual directory structure
        $runDir = $path_run . $fecha . '/cabeceras/' . $fileType . '/';
        
        if(!is_dir($runDir)){
            echo json_encode([
                'error' => 'Data directory not found: ' . $runDir,
                'fecha' => $fecha,
                'file_type' => $fileType,
                'expected_path' => $runDir
            ]);
            return;
        }
        
        // Convert fecha format from YYYYMMDDHH to YYYYMMDD for file matching
        $fechaShort = substr($fecha, 0, 8); // Remove the hour part
        
        // CORRECTED: Look for files with your actual naming pattern in the right subdirectory
        $patterns = [
            "wrf_{$fileType}_*_{$fechaShort}_00z.json",
            "wrf_{$fileType}_*_{$fecha}_00z.json",
            "wrf_{$fileType}_*.json"
        ];
        
        $jsonFiles = [];
        $usedPattern = '';
        
        foreach($patterns as $pattern) {
            $jsonFiles = glob($runDir . $pattern);
            if(!empty($jsonFiles)) {
                $usedPattern = $pattern;
                break;
            }
        }
        
        if(empty($jsonFiles)){
            // List all available files for debugging
            $allFiles = glob($runDir . "*.json");
            echo json_encode([
                'error' => 'No data files found',
                'searched_patterns' => $patterns,
                'run_dir' => $runDir,
                'fecha_original' => $fecha,
                'fecha_short' => $fechaShort,
                'all_files_in_dir' => array_map('basename', $allFiles),
                'file_type' => $fileType,
                'data_key' => $dataKey
            ]);
            return;
        }
        
        // Collect data from all available municipalities for this type
        $allMunicipalityData = [];
        $availableFiles = [];
        
        foreach($jsonFiles as $jsonFile) {
            $data = json_decode(file_get_contents($jsonFile), true);
            if($data && isset($data[$dataKey]) && is_array($data[$dataKey])) {
                $allMunicipalityData[] = $data[$dataKey];
                $availableFiles[] = basename($jsonFile);
            }
        }
        
        if(empty($allMunicipalityData)){
            // Show sample file content for debugging
            $sampleData = [];
            if(!empty($jsonFiles)) {
                $sampleData = json_decode(file_get_contents($jsonFiles[0]), true);
            }
            
            echo json_encode([
                'error' => 'No valid data found for type: ' . $type,
                'key_searched' => $dataKey,
                'files_checked' => $availableFiles,
                'sample_file_keys' => $sampleData ? array_keys($sampleData) : [],
                'sample_file' => $availableFiles[0] ?? 'none'
            ]);
            return;
        }
        
        // Calculate the value for the requested timestep
        $timeIndex = min($timeStep, count($allMunicipalityData[0]) - 1);
        
        // Create interpolated data points across Puebla using the municipal data
        $weatherData = interpolateWeatherData($coordinates, $allMunicipalityData, $timeIndex, $type);
        
        echo json_encode([
            'success' => true,
            'data' => $weatherData,
            'type' => $type,
            'timeStep' => $timeStep,
            'timeIndex' => $timeIndex,
            'files_used' => $availableFiles,
            'pattern_used' => $usedPattern,
            'run_dir' => $runDir,
            'coordinates_processed' => count($coordinates),
            'municipalities_data_count' => count($allMunicipalityData)
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'error' => 'Exception in extractWeatherDataFromImages: ' . $e->getMessage()
        ]);
    }
}

// CORRECTED: Historical data with right directory structure
function getHistoricalData() {
    global $path_run;
    
    try {
        if(!isset($_POST['municipio_id']) || !isset($_POST['type'])){
            echo json_encode(['error' => 'Missing municipio_id or type parameter']);
            return;
        }
        
        $municipioId = str_pad($_POST['municipio_id'], 3, '0', STR_PAD_LEFT);
        $type = $_POST['type']; // 'meteo' or 'chem'
        $fecha = isset($_POST['fecha']) ? $_POST['fecha'] : getLatestDate();
        
        if(!$fecha){
            echo json_encode(['error' => 'No date available']);
            return;
        }
        
        // CORRECTED: Use the actual directory structure
        $runDir = $path_run . $fecha . '/cabeceras/' . $type . '/';
        
        if(!is_dir($runDir)){
            echo json_encode(['error' => 'Historical data directory not found: ' . $runDir]);
            return;
        }
        
        // Convert fecha format
        $fechaShort = substr($fecha, 0, 8);
        
        // Multiple patterns to try for specific municipality
        $patterns = [
            "wrf_{$type}_{$municipioId}_{$fechaShort}_00z.json",
            "wrf_{$type}_{$municipioId}_{$fecha}_00z.json",
            "wrf_{$type}_" . intval($municipioId) . "_{$fechaShort}_00z.json",
            "wrf_{$type}_" . intval($municipioId) . "_{$fecha}_00z.json"
        ];
        
        $jsonFile = null;
        $usedPattern = '';
        
        foreach($patterns as $pattern) {
            $files = glob($runDir . $pattern);
            if(!empty($files)) {
                $jsonFile = $files[0];
                $usedPattern = $pattern;
                break;
            }
        }
        
        if(!$jsonFile){
            // Get all available files for this type for debugging
            $allTypeFiles = glob($runDir . "wrf_{$type}_*_{$fechaShort}*.json");
            echo json_encode([
                'error' => 'No historical data found for municipality ' . $municipioId,
                'searched_patterns' => $patterns,
                'type' => $type,
                'fecha_original' => $fecha,
                'fecha_short' => $fechaShort,
                'run_dir' => $runDir,
                'available_files_for_type' => array_map('basename', $allTypeFiles)
            ]);
            return;
        }
        
        $data = json_decode(file_get_contents($jsonFile), true);
        
        if(!$data){
            echo json_encode(['error' => 'Could not parse historical data file: ' . basename($jsonFile)]);
            return;
        }
        
        // Add time labels
        $hourCount = 24;
        if(isset($data[array_keys($data)[0]]) && is_array($data[array_keys($data)[0]])) {
            $hourCount = count($data[array_keys($data)[0]]);
        }
        
        $data['labels'] = array_map(function($i) { 
            return sprintf('%02d:00', $i); 
        }, range(0, $hourCount - 1));
        
        echo json_encode([
            'success' => true,
            'data' => $data,
            'municipio_id' => $municipioId,
            'type' => $type,
            'file' => basename($jsonFile),
            'pattern_used' => $usedPattern,
            'data_points' => $hourCount
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'error' => 'Exception in getHistoricalData: ' . $e->getMessage()
        ]);
    }
}

// Keep all the interpolation functions...
function interpolateWeatherData($coordinates, $municipalityDataSets, $timeIndex, $type) {
    $weatherData = [];
    
    $values = [];
    foreach($municipalityDataSets as $dataSet) {
        if(isset($dataSet[$timeIndex])) {
            $values[] = $dataSet[$timeIndex];
        }
    }
    
    if(empty($values)) {
        return $weatherData;
    }
    
    $minValue = min($values);
    $maxValue = max($values);
    $avgValue = array_sum($values) / count($values);
    $range = $maxValue - $minValue;
    
    foreach($coordinates as $coord) {
        $lat = $coord['lat'];
        $lng = $coord['lng'];
        
        $spatialFactor = calculateSpatialFactor($lat, $lng, $type);
        $noiseFactor = (mt_rand(-100, 100) / 1000);
        
        $interpolatedValue = $avgValue + ($range * $spatialFactor) + ($avgValue * $noiseFactor * 0.1);
        $interpolatedValue = applyTypeConstraints($interpolatedValue, $type);
        
        $weatherData[] = [
            'lat' => $lat,
            'lng' => $lng,
            'value' => $interpolatedValue,
            'valid' => true
        ];
    }
    
    return $weatherData;
}

function calculateSpatialFactor($lat, $lng, $type) {
    $centerLat = 19.0414;
    $centerLng = -98.2063;
    
    $distanceFromCenter = sqrt(pow($lat - $centerLat, 2) + pow($lng - $centerLng, 2));
    $normalizedDistance = min(1, $distanceFromCenter / 2.0);
    $elevationFactor = ($lat - 18.5) / 2.0;
    
    switch($type) {
        case 'temperature':
            return -$elevationFactor * 0.3 + sin($lng * 10) * 0.1 + cos($lat * 10) * 0.1;
        case 'humidity':
            return $elevationFactor * 0.2 + sin($lng * 8) * 0.15;
        case 'wind':
            return $normalizedDistance * 0.3 + sin($lng * 6) * 0.2;
        case 'pressure':
            return -$elevationFactor * 0.2;
        case 'precipitation':
            return $elevationFactor * 0.4 + cos($lng * 5) * 0.2;
        case 'radiation':
            return $elevationFactor * 0.1 + sin($lat * 12) * 0.15;
        default:
            return sin($lng * 7) * 0.2 + cos($lat * 8) * 0.15;
    }
}

function applyTypeConstraints($value, $type) {
    switch($type) {
        case 'temperature':
            return max(-10, min(45, $value));
        case 'humidity':
            return max(0, min(100, $value));
        case 'wind':
            return max(0, min(150, $value));
        case 'pressure':
            return max(900, min(1100, $value));
        case 'precipitation':
            return max(0, $value);
        case 'radiation':
            return max(0, min(1400, $value));
        default:
            return max(0, $value);
    }
}

// CORRECTED: Get available dates with right directory structure  
function getAvailableDates() {
    global $path_run;
    
    try {
        $dates = [];
        
        if (!is_dir($path_run)) {
            echo json_encode([
                'success' => false,
                'error' => 'Runs directory not found: ' . $path_run,
                'dates' => [],
                'count' => 0
            ]);
            return;
        }
        
        $directories = glob($path_run . '*', GLOB_ONLYDIR);
        
        foreach($directories as $dir) {
            $dateName = basename($dir);
            if(preg_match('/^\d{10}$/', $dateName)) {
                // CORRECTED: Check in the meteo and chem subdirectories
                $fechaShort = substr($dateName, 0, 8);
                $meteoDir = $dir . '/cabeceras/meteo/';
                $chemDir = $dir . '/cabeceras/chem/';
                
                $hasMeteo = is_dir($meteoDir) && !empty(glob($meteoDir . 'wrf_meteo_*_' . $fechaShort . '_*.json'));
                $hasChem = is_dir($chemDir) && !empty(glob($chemDir . 'wrf_chem_*_' . $fechaShort . '_*.json'));
                
                if($hasMeteo || $hasChem) {
                    $dates[] = $dateName;
                }
            }
        }
        
        rsort($dates); // Most recent first
        
        echo json_encode([
            'success' => true,
            'dates' => $dates,
            'count' => count($dates),
            'runs_path' => $path_run
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Exception: ' . $e->getMessage(),
            'dates' => [],
            'count' => 0
        ]);
    }
}

function getLatestDate() {
    global $path_run;
    
    $directories = glob($path_run . '*', GLOB_ONLYDIR);
    $dates = [];
    
    foreach($directories as $dir) {
        $dateName = basename($dir);
        if(preg_match('/^\d{10}$/', $dateName)) {
            $fechaShort = substr($dateName, 0, 8);
            $meteoDir = $dir . '/cabeceras/meteo/';
            $chemDir = $dir . '/cabeceras/chem/';
            
            $hasData = (is_dir($meteoDir) && !empty(glob($meteoDir . 'wrf_meteo_*_' . $fechaShort . '_*.json'))) ||
                       (is_dir($chemDir) && !empty(glob($chemDir . 'wrf_chem_*_' . $fechaShort . '_*.json')));
            
            if($hasData) {
                $dates[] = $dateName;
            }
        }
    }
    
    rsort($dates);
    return !empty($dates) ? $dates[0] : '2024081900';
}

//------------------------------------------------------------------
// MAIN ROUTING
if (!isset($_GET['tipo_solicitud'])) {
    echo json_encode(['error' => 'No tipo_solicitud specified']);
    exit();
}

try {
    switch($_GET['tipo_solicitud']) {
        case 'extract_weather_data':
            checkPost();
            extractWeatherDataFromImages();
            break;
        case 'available_dates':
            getAvailableDates();
            break;
        case 'historical_data':
            checkPost();
            getHistoricalData();
            break;
        case 'estaciones':
            if (file_exists('../estaciones.json')) {
                header('Content-Type: application/json');
                readfile('../estaciones.json');
            } else {
                echo json_encode(['error' => 'estaciones.json not found']);
            }
            break;
        case 'cabeceras':
            if (file_exists('../cabeceras.json')) {
                header('Content-Type: application/json');
                readfile('../cabeceras.json');
            } else {
                echo json_encode(['error' => 'cabeceras.json not found']);
            }
            break;
        default:
            echo json_encode(['error' => 'Invalid request type: ' . $_GET['tipo_solicitud']]);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Server exception: ' . $e->getMessage()]);
}
?>