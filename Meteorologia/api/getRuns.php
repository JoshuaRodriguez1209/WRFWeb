<?php
header('Content-Type: application/json');

// Función para obtener las runs disponibles
function getRuns() {
    $runsDir = '../runs/';
    $runs = array();
    
    if (!is_dir($runsDir)) {
        http_response_code(500);
        echo json_encode(array('error' => 'Runs directory not found'));
        return;
    }
    
    // Escanear el directorio de runs
    $items = scandir($runsDir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        
        $fullPath = $runsDir . $item;
        if (is_dir($fullPath) && preg_match('/^\d{10}$/', $item)) {
            array_push($runs, $item);
        }
    }
    
    echo json_encode($runs);
}

// Ejecutar la función
getRuns();