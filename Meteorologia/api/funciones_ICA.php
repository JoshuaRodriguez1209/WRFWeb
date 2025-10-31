<?php
//Funciones para calcular el Indice de Calidad del Aire de la ultima hora
function indice_ICA_O3($arrayDatos) {
	if ($arrayDatos[0] == "Mtto") {
		$indice = "Mtto";
	} elseif ($arrayDatos[0] == "F.O.") {
		$indice = "F.O.";
	} elseif (is_numeric($arrayDatos[0])) {
		$valor = round($arrayDatos[0],3);
		if ($valor <= 0.065) {
			$indice = round((714.29*($valor-0))+0,0);
		} elseif ($valor >= 0.066 && $valor <= 0.090) {
			$indice = round((2041.7*($valor-0.066))+51,0);
		} elseif ($valor >= 0.091 && $valor <= 0.154) {
			$indice = round((844.82*($valor-0.091))+101,0);
		} elseif ($valor >= 0.155 && $valor <= 0.204) {
			$indice = round((1000*($valor-0.155))+151,0);
		} elseif ($valor >= 0.205 && $valor <= 0.404) {
			$indice = round((497.49*($valor-0.205))+201,0);
		} elseif ($valor >= 0.405 && $valor <= 0.504) {
			$indice = round((1000.00*($valor-0.405))+301,0);
		} elseif ($valor >= 0.505 && $valor <= 0.604) {
			$indice = round((1000.00*($valor-0.505))+401,0);
		}
	} else {
		$indice = "D.I.";
	}

	return $indice;
}
function indice_ICA_NO2($arrayDatos) {
	if ($arrayDatos[0] == "Mtto") {
		$indice = "Mtto";
	} elseif ($arrayDatos[0] == "F.O.") {
		$indice = "F.O.";
	} elseif (is_numeric($arrayDatos[0])) {
		$valor = round($arrayDatos[0],3);
		if ($valor <= 0.043) {
			$indice = round((476.1905*($valor-0))+0,0);
		} elseif ($valor >= 0.044 && $valor <= 0.106) {
			$indice = round((471.1538*($valor-0.022))+51,0);
		} elseif ($valor >= 0.107 && $valor <= 0.430) {
			$indice = round((223.7443*($valor-0.107))+101,0);
		} elseif ($valor >= 0.431 && $valor <= 0.649) {
			$indice = round((224.7706*($valor-0.431))+151,0);
		} elseif ($valor >= 0.650 && $valor <= 1.249) {
			$indice = round((165.2755*($valor-0.650))+201,0);
		} elseif ($valor >= 1.250 && $valor <= 1.649) {
			$indice = round((248.1203*($valor-1.250))+301,0);
		} elseif ($valor >= 1.650 && $valor <= 2.049) {
			$indice = round((248.1203*($valor-1.650))+401,0);
		}
	} else {
		$indice = "D.I.";
	}

	return $indice;
}
function indice_ICA_CO($arrayDatos) {
	if ($arrayDatos[0]=="Mtto" && $arrayDatos[1]=="Mtto" && $arrayDatos[2]=="Mtto") {
		$indice = "Mtto";
	} elseif ($arrayDatos[0]=="F.O." && $arrayDatos[1]=="F.O." && $arrayDatos[2]=="F.O.") {
		$indice = "F.O.";
	} elseif (is_numeric($arrayDatos[0]) || is_numeric($arrayDatos[1]) || is_numeric($arrayDatos[2])) {
		$temp = 0;
		$contador = 0;
		for ($i=0; $i < 8; $i++) {
			if (is_numeric($arrayDatos[$i])) {
				$temp = $temp + $arrayDatos[$i];
				$contador = $contador + 1;
			}
		}
		if ($contador > 5) {
			$valor = round($temp/$contador,2);
			if ($valor <= 5.50) {
				$indice = round((9.0909*($valor-0))+0,0);
			} elseif ($valor >= 5.6 && $valor <= 9.0) {
				$indice = round((9.741*($valor-5.6))+51,0);
			} elseif ($valor >= 9.1 && $valor <= 13.0) {
				$indice = round((25.7895*($valor-9.1))+101,0);
			} elseif ($valor >= 13.1 && $valor <= 15.4) {
				$indice = round((21.3043*($valor-13.1))+151,0);
			} elseif ($valor >= 15.5 && $valor <= 30.4) {
				$indice = round((6.6443*($valor-15.5))+201,2);
			} elseif ($valor >= 30.5 && $valor <= 40.4) {
				$indice = round((10.0000*($valor-30.5))+301,2);
			} elseif ($valor >= 40.5 && $valor <= 50.4) {
				$indice = round((10.0000*($valor-40.5))+401,2);
			}
		} else {
			$indice = "D.I.";
		}
	} else {
		$indice = "D.I.";
	}

	return $indice;
}
function indice_ICA_SO2($arrayDatos) {
	if ($arrayDatos[0]=="Mtto" && $arrayDatos[1]=="Mtto" && $arrayDatos[2]=="Mtto" && $arrayDatos[3]=="Mtto" && $arrayDatos[4]=="Mtto" && $arrayDatos[5]=="Mtto") {
		$indice = "Mtto";
	} elseif ($arrayDatos[0]=="F.O." && $arrayDatos[1]=="F.O." && $arrayDatos[2]=="F.O." && $arrayDatos[3]=="F.O." && $arrayDatos[4]=="F.O." && $arrayDatos[5]=="F.O.") {
		$indice = "F.O.";
	} elseif (is_numeric($arrayDatos[0]) || is_numeric($arrayDatos[1]) || is_numeric($arrayDatos[2]) || is_numeric($arrayDatos[3]) || is_numeric($arrayDatos[4]) || is_numeric($arrayDatos[5])) {
		$temp = 0;
		$contador = 0;
		for ($i=0; $i < 24; $i++) {
			if (is_numeric($arrayDatos[$i])) {
				$temp = $temp + $arrayDatos[$i];
				$contador = $contador + 1;
			}
		}
		if ($contador > 17) {
			$valor = round(($temp/$contador),3);
			if ($valor <= 0.025) {
				$indice = round((2000*($valor-0))+0,0);
			} elseif ($valor >= 0.026 && $valor <= 0.040) {
				$indice = round((583.3333*($valor-0.026))+51,0);
			} elseif ($valor >= 0.041 && $valor <= 0.207) {
				$indice = round((510.4167*($valor-0.041))+101,0);
			} elseif ($valor >= 0.208 && $valor <= 0.304) {
				$indice = round((510.4167*($valor-0.208))+151,0);
			} elseif ($valor >= 0.305 && $valor <= 0.604) {
				$indice = round((331.1037*($valor-0.305))+201,2);
			} elseif ($valor >= 0.605 && $valor <= 0.605) {
				$indice = round((497.4874*($valor-0.605))+301,2);
			} elseif ($valor >= 0.805 && $valor <= 1.004) {
				$indice = round((497.4874*($valor-0.805))+401,2);
			}
		} else {
			$indice = "D.I.";
		}
	} else {
		$indice = "D.I.";
	}

	return $indice;
}
function indice_ICA_PM10($arrayDatos) {
	if ($arrayDatos[0]=="Mtto" && $arrayDatos[1]=="Mtto" && $arrayDatos[2]=="Mtto") {
		$indice = "Mtto";
	} elseif ($arrayDatos[0]=="F.O." && $arrayDatos[1]=="F.O." && $arrayDatos[2]=="F.O.") {
		$indice = "F.O.";
	} elseif (is_numeric($arrayDatos[0]) || is_numeric($arrayDatos[1]) || is_numeric($arrayDatos[2]) || is_numeric($arrayDatos[3]) || is_numeric($arrayDatos[4]) || is_numeric($arrayDatos[5])) {
		$temp = 0;
		$contador = 0;
		for ($i=0; $i < 24; $i++) {
			if (is_numeric($arrayDatos[$i])) {
				$temp = $temp + $arrayDatos[$i];
				$contador = $contador + 1;
			}
		}
		if ($contador > 17) {
			$valor = round(($temp/$contador),0);
			if ($valor <= 36) {
				$indice = round((1.25*($valor-0))+0,0);
			} elseif ($valor >= 37 && $valor <= 70) {
				$indice = round((1.4412*($valor-37))+51,0);
			} elseif ($valor >= 71 && $valor <= 214) {
				$indice = round((0.3551*($valor-71))+101,0);
			} elseif ($valor >= 215 && $valor <= 354) {
				$indice = round((0.3525*($valor-215))+151,0);
			} elseif ($valor >= 355 && $valor <= 424) {
				$indice = round((1.4348*($valor-355))+201,0);
			} elseif ($valor >= 425 && $valor <= 504) {
				$indice = round((1.2532*($valor-425))+301,0);
			} elseif ($valor >= 505 && $valor <= 604) {
				$indice = round((1.0000*($valor-505))+401,0);
			}
		} else {
			$indice = "D.I.";
		}
	} else {
		$indice = "D.I.";
	}

	return $indice;
}
function indice_ICA_PM25($arrayDatos) {
	if ($arrayDatos[0]=="Mtto" && $arrayDatos[1]=="Mtto" && $arrayDatos[2]=="Mtto") {
		$indice = "Mtto";
	} elseif ($arrayDatos[0]=="F.O." && $arrayDatos[1]=="F.O." && $arrayDatos[2]=="F.O.") {
		$indice = "F.O.";
	} elseif (is_numeric($arrayDatos[0]) || is_numeric($arrayDatos[1]) || is_numeric($arrayDatos[2]) || is_numeric($arrayDatos[3]) || is_numeric($arrayDatos[4]) || is_numeric($arrayDatos[5])) {
		$temp = 0;
		$contador = 0;
		for ($i=0; $i < 24; $i++) {
			if (is_numeric($arrayDatos[$i])) {
				$temp = $temp + $arrayDatos[$i];
				$contador = $contador + 1;
			}
		}
		if ($contador > 17) {
			$valor = round(($temp/$contador),0);
			if ($valor <= 10) {
				$indice = round((4.1667*($valor-0))+0,0);
			} elseif ($valor >= 10.1 && $valor <= 41) {
				$indice = round((1.4894*($valor-10.1))+51,0);
			} elseif ($valor >= 41.1 && $valor <= 97.4) {
				$indice = round((0.9369*($valor-41.1))+101,0);
			} elseif ($valor >= 97.5 && $valor <= 150.4) {
				$indice = round((0.9263*($valor-97.5))+151,0);
			} elseif ($valor >= 150.5 && $valor <= 250.4) {
				$indice = round((0.9910*($valor-150.5))+201,0);
			} elseif ($valor >= 250.5 && $valor <= 350.4) {
				$indice = round((0.9910*($valor-250.5))+301,0);
			} elseif ($valor >= 350.5 && $valor <= 500.4) {
				$indice = round((0.6604*($valor-350.5))+401,0);
			}
		} else {
			$indice = "D.I.";
		}
	} else {
		$indice = "D.I.";
	}

	return $indice;
}
//Funciones para clacular el Indice de Calidad del Aire de las ultimas 48 horas | Gráficos de corportammiento;
function comportamiento_ICA_O3($arrayDatos) {
	for ($i=0; $i<49; $i++) {
		if ($arrayDatos[$i] == "Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($arrayDatos[$i] == "F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($arrayDatos[$i])) {
			$valor = round($arrayDatos[$i],3);
			if ($valor <= 0.065) {
				$indice[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.066 && $valor <= 0.090) {
				$indice[$i] = round((2041.7*($valor-0.066))+51,0);
			} elseif ($valor >= 0.091 && $valor <= 0.154) {
				$indice[$i] = round((844.82*($valor-0.091))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$indice[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$indice[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$indice[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$indice[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$indice[$i] = "D.I.";
		}
	}
	return $indice;
}
function comportamiento_ICA_NO2($arrayDatos) {
	for ($i=0; $i<49; $i++) {
		if ($arrayDatos[$i] == "Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($arrayDatos[$i]=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($arrayDatos[$i])) {
			$valor = round($arrayDatos[$i],3);
			if ($valor <= 0.043) {
				$indice[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.044 && $valor <= 0.106) {
				$indice[$i] = round((471.1538*($valor-0.022))+51,0);
			} elseif ($valor >= 0.107 && $valor <= 0.430) {
				$indice[$i] = round((223.7443*($valor-0.107))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$indice[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$indice[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$indice[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$indice[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$indice[$i] = "D.I.";
		}
	}
	return $indice;
}
function comportamiento_ICA_CO($arrayDatos) {
	$numValores = 8;
	for ($i=0; $i<49; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$indice[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.6 && $valor <= 9.0) {
					$indice[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 9.1 && $valor <= 13.0) {
					$indice[$i] = round((25.7895*($valor-9.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$indice[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$indice[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$indice[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$indice[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	return $indice;
}
function comportamiento_ICA_SO2($arrayDatos) {
	$numValores = 24;
	for ($i=0; $i<49; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$indice[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.040) {
					$indice[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.041 && $valor <= 0.207) {
					$indice[$i] = round((510.4167*($valor-0.041))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$indice[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$indice[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$indice[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$indice[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	return $indice;
}
function comportamiento_ICA_PM10($arrayDatos) {
	$numValores = 24;
	for ($i=0; $i<49; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 36) {
					$indice[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 37 && $valor <= 70) {
					$indice[$i] = round((1.4412*($valor-37))+51,0);
				} elseif ($valor >= 71 && $valor <= 214) {
					$indice[$i] = round((0.3551*($valor-71))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$indice[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$indice[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$indice[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$indice[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	return $indice;
}
function comportamiento_ICA_PM25($arrayDatos) {
	$numValores = 24;
	for ($i=0; $i<49; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				/*if ($valor <= 12) {
					$indice[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 12.1 && $valor <= 45) {
					$indice[$i] = round((1.4894*($valor-12.1))+51,0);
				} elseif ($valor >= 45.1 && $valor <= 97.4) {
					$indice[$i] = round((0.9369*($valor-45.1))+101,0);*/
				if ($valor <= 10) {
					$indice[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 10.1 && $valor <= 41) {
					$indice[$i] = round((1.4894*($valor-10.1))+51,0);
				} elseif ($valor >= 41.1 && $valor <= 97.4) {
					$indice[$i] = round((0.9369*($valor-41.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$indice[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$indice[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$indice[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$indice[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	return $indice;
}
//Funciones para calcular el Indice de Calidad del Aire de las ultimas 24 horas | Historíco por día;
function historial_dia_ICA1_O3($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	for ($i=0; $i<24; $i++) {
		if ($arrayDatos[$i] == "Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($arrayDatos[$i] == "F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($arrayDatos[$i])) {
			$valor = round($arrayDatos[$i],3);
			if ($valor <= 0.070) {
				$indice[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.071 && $valor <= 0.095) {
				$indice[$i] = round((2041.7*($valor-0.071))+51,0);
			} elseif ($valor >= 0.096 && $valor <= 0.154) {
				$indice[$i] = round((844.82*($valor-0.096))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$indice[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$indice[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$indice[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$indice[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$indice[$i] = "D.I.";
		}
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {	
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA1_NO2($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	for ($i=0; $i<24; $i++) {
		if ($arrayDatos[$i] == "Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($arrayDatos[$i] == "F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($arrayDatos[$i])) {
			$valor = round($arrayDatos[$i],3);
			if ($valor <= 0.105) {
				$indice[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.106 && $valor <= 0.210) {
				$indice[$i] = round((471.1538*($valor-0.106))+51,0);
			} elseif ($valor >= 0.211 && $valor <= 0.430) {
				$indice[$i] = round((223.7443*($valor-0.211))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$indice[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$indice[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$indice[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$indice[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$indice[$i] = "D.I.";
		}
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA1_CO($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 8;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$indice[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.60 && $valor <= 11.0) {
					$indice[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 11.1 && $valor <= 13.0) {
					$indice[$i] = round((25.7895*($valor-11.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$indice[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$indice[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$indice[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$indice[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24 && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA1_SO2($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 24;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$indice[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.110) {
					$indice[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.111 && $valor <= 0.207) {
					$indice[$i] = round((510.4167*($valor-0.111))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$indice[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$indice[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$indice[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$indice[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24 && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA1_PM10($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 24;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 40) {
					$indice[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 41 && $valor <= 75) {
					$indice[$i] = round((1.4412*($valor-41))+51,0);
				} elseif ($valor >= 76 && $valor <= 214) {
					$indice[$i] = round((0.3551*($valor-76))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$indice[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$indice[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$indice[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$indice[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {	
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA1_PM25($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 24;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 12) {
					$indice[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 12.1 && $valor <= 45) {
					$indice[$i] = round((1.4894*($valor-12.1))+51,0);
				} elseif ($valor >= 45.1 && $valor <= 97.4) {
					$indice[$i] = round((0.9369*($valor-45.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$indice[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$indice[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$indice[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$indice[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {	
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
//Funciones para calcular el Indice de Calidad del Aire de las ultimas 24 horas | Historíco por día - Ajuste de intervalos;
function historial_dia_ICA2_O3($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	for ($i=0; $i<24; $i++) {
		if ($arrayDatos[$i] == "Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($arrayDatos[$i] == "F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($arrayDatos[$i])) {
			$valor = round($arrayDatos[$i],3);
			if ($valor <= 0.065) {
				$indice[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.066 && $valor <= 0.090) {
				$indice[$i] = round((2041.7*($valor-0.066))+51,0);
			} elseif ($valor >= 0.091 && $valor <= 0.154) {
				$indice[$i] = round((844.82*($valor-0.091))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$indice[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$indice[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$indice[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$indice[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$indice[$i] = "D.I.";
		}
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA2_NO2($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	for ($i=0; $i<24; $i++) {
		if ($arrayDatos[$i] == "Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($arrayDatos[$i] == "F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($arrayDatos[$i])) {
			$valor = round($arrayDatos[$i],3);
			if ($valor <= 0.043) {
				$indice[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.044 && $valor <= 0.106) {
				$indice[$i] = round((471.1538*($valor-0.022))+51,0);
			} elseif ($valor >= 0.107 && $valor <= 0.430) {
				$indice[$i] = round((223.7443*($valor-0.107))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$indice[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$indice[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$indice[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$indice[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$indice[$i] = "D.I.";
		}
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {	
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA2_CO($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 8;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$indice[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.6 && $valor <= 9.0) {
					$indice[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 9.1 && $valor <= 13.0) {
					$indice[$i] = round((25.7895*($valor-9.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$indice[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$indice[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$indice[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$indice[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24 && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA2_SO2($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 24;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$indice[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.040) {
					$indice[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.041 && $valor <= 0.207) {
					$indice[$i] = round((510.4167*($valor-0.041))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$indice[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$indice[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$indice[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$indice[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24 && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA2_PM10($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 24;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 36) {
					$indice[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 37 && $valor <= 70) {
					$indice[$i] = round((1.4412*($valor-37))+51,0);
				} elseif ($valor >= 71 && $valor <= 214) {
					$indice[$i] = round((0.3551*($valor-71))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$indice[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$indice[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$indice[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$indice[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
function historial_dia_ICA2_PM25($arrayDatos,$arrayFecha) {
	include("get_datetime.php");
	$horaActual24 = $date->format("H"); $diaA = date("d"); $mesA = date("m"); $anioA = date("Y"); $minA = date("i");
	$numValores = 24;
	for ($i=0; $i<24; $i++) {
		$ar1 = $arrayDatos[$i];
		$ar2 = $arrayDatos[$i+1];
		$ar3 = $arrayDatos[$i+2];
		$ar4 = $arrayDatos[$i+3];
		$ar5 = $arrayDatos[$i+4];
		$ar6 = $arrayDatos[$i+5];
		if ($ar1=="Mtto" && $ar2=="Mtto" && $ar3=="Mtto" && $ar4=="Mtto" && $ar5=="Mtto" && $ar6=="Mtto") {
			$indice[$i] = "Mtto";
		} elseif ($ar1=="F.O." && $ar2=="F.O." && $ar3=="F.O." && $ar4=="F.O." && $ar5=="F.O." && $ar6=="F.O.") {
			$indice[$i] = "F.O.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arrayDatos[$j])) {
					$temp = $temp + $arrayDatos[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 10) {
					$indice[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 10.1 && $valor <= 41) {
					$indice[$i] = round((1.4894*($valor-10.1))+51,0);
				} elseif ($valor >= 41.1 && $valor <= 97.4) {
					$indice[$i] = round((0.9369*($valor-41.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$indice[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$indice[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$indice[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$indice[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$indice[$i] = "D.I.";
			}
		} else {
			$indice[$i] = "D.I.";
		}
		$numValores = $numValores + 1;
		unset($arrayDatos[$i]);
	}
	$indice = array_reverse($indice);
	for ($i=0; $i<count($indice); $i++) {
		if ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i>$horaActual24) {
			$indice[$i] = "Sin dato";
		} elseif ($arrayFecha[2]==$anioA && $arrayFecha[1]==$mesA && $arrayFecha[0]==$diaA && $i==$horaActual24 && $minA<7) {
			$indice[$i] = "Sin dato";
		}
	}

	return $indice;
}
//Funciones adicionales ICA
function get_rgb_ICA($contaminante) { //Obtiene calidadaire|rgb
	$temp=false; $c_f_r=""; $c_f_g=""; $c_f_b="";  $c_t_r=""; $c_t_g=""; $c_t_b="";
	if ($temp == false) {
		if (is_numeric($contaminante) && $contaminante>=301 && $contaminante<=500) {
			$c_f_r=153; $c_f_g=0; $c_f_b=51;
			$c_t_r=255; $c_t_g=255; $c_t_b=255;
			$temp=true;
		}
	}
	if ($temp == false) {
		if (is_numeric($contaminante) && $contaminante>=201 && $contaminante<=300) {
			$c_f_r=143; $c_f_g=63; $c_f_b=151;
			$c_t_r=255; $c_t_g=255; $c_t_b=255;
			$temp=true;
		}
	}
    if ($temp == false) {
        if (is_numeric($contaminante) && $contaminante>=151 && $contaminante<=200) {
            $c_f_r=255; $c_f_g=0; $c_f_b=0;
			$c_t_r=255; $c_t_g=255; $c_t_b=255;
			$temp=true;
        }
    }
    if ($temp == false) {
        if (is_numeric($contaminante) && $contaminante>=101 && $contaminante<=150) {
            $c_f_r=255; $c_f_g=126; $c_f_b=0;
			$c_t_r=0; $c_t_g=0; $c_t_b=0;
			$temp=true;
        }
    }
    if ($temp == false) {
        if (is_numeric($contaminante) && $contaminante>=51 && $contaminante<=100) {
            $c_f_r=255; $c_f_g=255; $c_f_b=0;
			$c_t_r=0; $c_t_g=0; $c_t_b=0;
			$temp=true;
        }
    }
    if ($temp == false) {
        if (is_numeric($contaminante) && $contaminante>=0 && $contaminante<=50) {
            $c_f_r=0; $c_f_g=228; $c_f_b=0;
			$c_t_r=0; $c_t_g=0; $c_t_b=0;
			$temp=true;
        }
    }
    if ($temp == false) {
        if (!is_numeric($contaminante)) {
            $c_f_r=255; $c_f_g=255; $c_f_b=255;
			$c_t_r=0; $c_t_g=0; $c_t_b=0;
			$temp=true;
        }
    }
    $result = [$c_f_r,$c_f_g,$c_f_b,$c_t_r,$c_t_g,$c_t_b];
    return  $result;
}
function caire_rgb_to_ICA($O3,$NO2,$CO,$SO2,$PM10,$PM25) {
    $calidadaire=""; $c_f_r=""; $c_f_g=""; $c_f_b="";
	if (empty($calidadaire)) {
		if ($O3>=301&&$O3<=500 || $NO2>=300&&$NO2<=500 || $CO>=300&&$CO<=500 || $SO2>=300&&$SO2<=500 || $PM10>=300&&$PM10<=500 || $PM25>=300&&$PM25<=500) {
			$calidadaire = "PELIGROSA";
			$c_f_r=153; $c_f_g=0; $c_f_b=51;
		}
	}
	if (empty($calidadaire)) {
		if ($O3>=201&&$O3<=300 || $NO2>=201&&$NO2<=300 || $CO>=201&&$CO<=300 || $SO2>=201&&$SO2<=300 || $PM10>=201&&$PM10<=300 || $PM25>=201&&$PM25<=300) {
			$calidadaire = "EXTREMADAMENTE MALA";
			$c_f_r=143; $c_f_g=63; $c_f_b=151;
		}
	}
    if (empty($calidadaire)) {
        if ($O3>=151&&$O3<=200 || $NO2>=151&&$NO2<=200 || $CO>=151&&$CO<=200 || $SO2>=151&&$SO2<=200 || $PM10>=151&&$PM10<=200 || $PM25>=151&&$PM25<=200) {
            $calidadaire = "MUY MALA";
            $c_f_r=255; $c_f_g=0; $c_f_b=0;
        }
    }
    if (empty($calidadaire)) {
        if ($O3>=101&&$O3<=150 || $NO2>=101&&$NO2<=150 || $CO>=101&&$CO<=150 || $SO2>=101&&$SO2<=150 || $PM10>=101&&$PM10<=150 || $PM25>=101&&$PM25<=150) {
            $calidadaire = "MALA";
            $c_f_r=255; $c_f_g=126; $c_f_b=0;
        }
    }
    if (empty($calidadaire)) {
        if ($O3>=51&&$O3<=100 || $NO2>=51&&$NO2<=100 || $CO>=51&&$CO<=100 || $SO2>=51&&$SO2<=100 || $PM10>=51&&$PM10<=100 || $PM25>=51&&$PM25<=100) {
            $calidadaire = "REGULAR";
            $c_f_r=255; $c_f_g=255; $c_f_b=0;
        }
    }
    if (empty($calidadaire)) {
        if ($O3>=0&&$O3<=50 || $NO2>=0&&$NO2<=50 || $CO>=0&&$CO<=50 || $SO2>=0&&$SO2<=50 || $PM10>=0&&$PM10<=50 || $PM25>=0&&$PM25<=50) {
            $calidadaire = "BUENA";
            $c_f_r=0; $c_f_g=228; $c_f_b=0;
        }
    }
    if (empty($calidadaire)) {
        if (!is_numeric($O3) && !is_numeric($NO2) && !is_numeric($CO) && !is_numeric($SO2) && !is_numeric($PM10) && !is_numeric($PM25)) {
            $calidadaire = "F.O.";
            $c_f_r=255; $c_f_g=255; $c_f_b=255;
        }
    }
    $result = [$calidadaire,$c_f_r,$c_f_g,$c_f_b];
    return  $result;
}
function zonaAfectada_to_recomendaciones($calidadsta,$calidadbin,$calidadnin,$calidadUTP,$calidadvel) {
	$zona = "";

	if (empty($zona)) { //TODO D.I.
		if ($calidadsta=="D.I." && $calidadbin=="D.I." && $calidadnin=="D.I." && $calidadUTP=="D.I." && $calidadvel=="D.I.") {
			$zona = "D.I.";
		}
	}
	if (empty($zona)) { //TODO PELIGROSA
		if ($calidadsta=="PELIGROSA" && $calidadbin=="PELIGROSA" && $calidadnin=="PELIGROSA" && $calidadUTP=="PELIGROSA" && $calidadvel=="PELIGROSA") {
			$zona = "Se recomienda para la <b>ZONA METROPOLITANA DEL VALLE DE PUEBLA</b>";
		}
	}
	if (empty($zona)) { //TODO EXTREMADAMENTE MALA
		if ($calidadsta=="EXTREMADAMENTE MALA" && $calidadbin=="EXTREMADAMENTE MALA" && $calidadnin=="EXTREMADAMENTE MALA" && $calidadUTP=="EXTREMADAMENTE MALA" && $calidadvel=="EXTREMADAMENTE MALA") {
			$zona = "Se recomiento para la <b>ZONA METROPOLITANA DEL VALLE DE PUEBLA</b>";
		}
	}
	if (empty($zona)) { //TODO MUY MALA
		if ($calidadsta=="MUY MALA" && $calidadbin=="MUY MALA" && $calidadnin=="MUY MALA" && $calidadUTP=="MUY MALA" && $calidadvel=="MUY MALA") {
			$zona = "Se recomienda para la <b>ZONA METROPOLITANA DEL VALLE DE PUEBLA</b>";
		}
	}
	if (empty($zona)) { //TODO MALA
		if ($calidadsta=="MALA" && $calidadbin=="MALA" && $calidadnin=="MALA" && $calidadUTP=="MALA" && $calidadvel=="MALA") {
			$zona = "Se recomienda para la <b>ZONA METROPOLITANA DEL VALLE DE PUEBLA</b>";
		}
	}
	if (empty($zona)) { //TODO REGULAR
		if ($calidadsta=="REGULAR" && $calidadbin=="REGULAR" && $calidadnin=="REGULAR" && $calidadUTP=="REGULAR" && $calidadvel=="REGULAR") {
			$zona = "Se recomienda para la <b>ZONA METROPOLITANA DEL VALLE DE PUEBLA</b>";
		}
	}
	if (empty($zona)) { //TODO BUENA
		if ($calidadsta=="BUENA" && $calidadbin=="BUENA" && $calidadnin=="BUENA" && $calidadUTP=="BUENA" && $calidadvel=="BUENA") {
			$zona = "Se recomienda para la <b>ZONA METROPOLITANA DEL VALLE DE PUEBLA</b>";
		}
	}
	if (empty($zona)) { //N PELIGROSA
		if ($calidadsta=="PELIGROSA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>AGUA SANTA</b>"; }
			else { $zona = $zona."<b>, AGUA SANTA</b>"; }
		}
		if ($calidadbin=="PELIGROSA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>BINE</b>"; }
			else { $zona = $zona."<b>, BINE</b>"; }
		}
		if ($calidadnin=="PELIGROSA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>NINFAS</b>"; }
			else { $zona = $zona."<b>, NINFAS</b>"; }
		}
		if ($calidadUTP=="PELIGROSA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>UTP</b>"; }
			else { $zona = $zona."<b>, UTP</b>"; }
		}
		if ($calidadvel=="PELIGROSA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>VELÓDROMO</b>"; }
			else { $zona = $zona."<b>, VELÓDROMO</b>"; }
		}
	}
	if (empty($zona)) { //N EXTREMADAMENTE MALA
		if ($calidadsta=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>AGUA SANTA</b>"; }
			else { $zona = $zona."<b>, AGUA SANTA</b>"; }
		}
		if ($calidadbin=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>BINE</b>"; }
			else { $zona = $zona."<b>, BINE</b>"; }
		}
		if ($calidadnin=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>NINFAS</b>"; }
			else { $zona = $zona."<b>, NINFAS</b>"; }
		}
		if ($calidadUTP=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>UTP</b>"; }
			else { $zona = $zona."<b>, UTP</b>"; }
		}
		if ($calidadvel=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>VELÓDROMO</b>"; }
			else { $zona = $zona."<b>, VELÓDROMO</b>"; }
		}
	}
	if (empty($zona)) { //N MUY MALA
		if ($calidadsta=="MUY MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>AGUA SANTA</b>"; }
			else { $zona = $zona."<b>, AGUA SANTA</b>"; }
		}
		if ($calidadbin=="MUY MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>BINE</b>"; }
			else { $zona = $zona."<b>, BINE</b>"; }
		}
		if ($calidadnin=="MUY MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>NINFAS</b>"; }
			else { $zona = $zona."<b>, NINFAS</b>"; }
		}
		if ($calidadUTP=="MUY MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>UTP</b>"; }
			else { $zona = $zona."<b>, UTP</b>"; }
		}
		if ($calidadvel=="MUY MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>VELÓDROMO</b>"; }
			else { $zona = $zona."<b>, VELÓDROMO</b>"; }
		}
	}
	if (empty($zona)) { //N MALA
		if ($calidadsta=="MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>AGUA SANTA</b>"; }
			else { $zona = $zona."<b>, AGUA SANTA</b>"; }
		}
		if ($calidadbin=="MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>BINE</b>"; }
			else { $zona = $zona."<b>, BINE</b>"; }
		}
		if ($calidadnin=="MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>NINFAS</b>"; }
			else { $zona = $zona."<b>, NINFAS</b>"; }
		}
		if ($calidadUTP=="MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>UTP</b>"; }
			else { $zona = $zona."<b>, UTP</b>"; }
		}
		if ($calidadvel=="MALA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>VELÓDROMO</b>"; }
			else { $zona = $zona."<b>, VELÓDROMO</b>"; }
		}
	}
	if (empty($zona)) { //N REGULAR
		if ($calidadsta=="REGULAR") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>AGUA SANTA</b>"; }
			else { $zona = $zona."<b>, AGUA SANTA</b>"; }
		}
		if ($calidadbin=="REGULAR") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>BINE</b>"; }
			else { $zona = $zona."<b>, BINE</b>"; }
		}
		if ($calidadnin=="REGULAR") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>NINFAS</b>"; }
			else { $zona = $zona."<b>, NINFAS</b>"; }
		}
		if ($calidadUTP=="REGULAR") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>UTP</b>"; }
			else { $zona = $zona."<b>, UTP</b>"; }
		}
		if ($calidadvel=="REGULAR") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>VELÓDROMO</b>"; }
			else { $zona = $zona."<b>, VELÓDROMO</b>"; }
		}
	}
	if (empty($zona)) { //N BUENA
		if ($calidadsta=="BUENA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>AGUA SANTA</b>"; }
			else { $zona = $zona."<b>, AGUA SANTA</b>"; }
		}
		if ($calidadbin=="BUENA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>BINE</b>"; }
			else { $zona = $zona."<b>, BINE</b>"; }
		}
		if ($calidadnin=="BUENA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>NINFAS</b>"; }
			else { $zona = $zona."<b>, NINFAS</b>"; }
		}
		if ($calidadUTP=="BUENA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>UTP</b>"; }
			else { $zona = $zona."<b>, UTP</b>"; }
		}
		if ($calidadvel=="BUENA") {
			if ($zona == "") { $zona = "Se recomienda para la zona de <b>VELÓDROMO</b>"; }
			else { $zona = $zona."<b>, VELÓDROMO</b>"; }
		}
	}

	echo $zona;
}
function zonaAfectada_to_reporte3($calidadaire_sta,$calidadaire_bin,$calidadaire_nin,$calidadaire_utp,$calidadaire_vel) {
	$zonaMarron="";
	if (empty($zonaMarron)) { //N PELIGROSA
		if ($calidadaire_sta=="PELIDROSA") {
			if ($zonaMarron == "") { $zonaMarron = "AGUA SANTA (zona sur)"; }
			else { $zonaMarron = $zonaMarron.", AGUA SANTA (zona sur)"; }
		}
		if ($calidadaire_bin=="PELIDROSA" && $calidadaire_nin=="PELIDROSA") {
			if ($zonaMarron == "") { $zonaMarron = "Zona Centro (Estación BINE y NINFAS)"; }
			else { $zonaMarron = $zonaMarron.", Zona Centro (Estación BINE y NINFAS)"; }
		} else if ($calidadaire_bin=="PELIDROSA") {
			if ($zonaMarron == "") { $zonaMarron = "Zona Centro (Estación BINE)"; }
			else { $zonaMarron = $zonaMarron.", Zona Centro (Estación BINE)"; }
		} else if ($calidadaire_nin=="PELIDROSA") {
			if ($zonaMarron == "") { $zonaMarron = "Zona Centro (Estación NINFAS)"; }
			else { $zonaMarron = $zonaMarron.", Zona Centro (Estación NINFAS)"; }
		}
		if ($calidadaire_utp=="PELIDROSA") {
			if ($zonaMarron == "") { $zonaMarron = "Zona Nororiente (Estación UTP)"; }
			else { $zonaMarron = $zonaMarron.", Zona Nororiente (Estación UTP)"; }
		}
		if ($calidadaire_vel=="PELIDROSA") {
			if ($zonaMarron == "") { $zonaMarron = "Zona Norponiente (Estación VELÓDROMO)"; }
			else { $zonaMarron = $zonaMarron.", Zona Norponiente (Estación VELÓDROMO)"; }
		}
		if (!empty($zonaMarron)) {
			$zonaMarron = "La(s) zona(s) que presenta(n) los mayores índices de contaminación atmosférica (bandera marrón) es ".$zonaMarron.".";
		}
	}
	$zonaMorada="";
	if (empty($zonaMorada)) { //N EXTREMADAMENTE MALA
		if ($calidadaire_sta=="EXTREMADAMENTE MALA") {
			if ($zonaMorada == "") { $zonaMorada = "AGUA SANTA (zona sur)"; }
			else { $zonaMorada = $zonaMorada.", AGUA SANTA (zona sur)"; }
		}
		if ($calidadaire_bin=="EXTREMADAMENTE MALA" && $calidadaire_nin=="EXTREMADAMENTE MALA") {
			if ($zonaMorada == "") { $zonaMorada = "Zona Centro (Estación BINE y NINFAS)"; }
			else { $zonaMorada = $zonaMorada.", Zona Centro (Estación BINE y NINFAS)"; }
		} else if ($calidadaire_bin=="EXTREMADAMENTE MALA") {
			if ($zonaMorada == "") { $zonaMorada = "Zona Centro (Estación BINE)"; }
			else { $zonaMorada = $zonaMorada.", Zona Centro (Estación BINE)"; }
		} else if ($calidadaire_nin=="EXTREMADAMENTE MALA") {
			if ($zonaMorada == "") { $zonaMorada = "Zona Centro (Estación NINFAS)"; }
			else { $zonaMorada = $zonaMorada.", Zona Centro (Estación NINFAS)"; }
		}
		if ($calidadaire_utp=="MEXTREMADAMENTEUY MALA") {
			if ($zonaMorada == "") { $zonaMorada = "Zona Nororiente (Estación UTP)"; }
			else { $zonaMorada = $zonaMorada.", Zona Nororiente (Estación UTP)"; }
		}
		if ($calidadaire_vel=="EXTREMADAMENTE MALA") {
			if ($zonaMorada == "") { $zonaMorada = "Zona Norponiente (Estación VELÓDROMO)"; }
			else { $zonaMorada = $zonaMorada.", Zona Norponiente (Estación VELÓDROMO)"; }
		}
		if (!empty($zonaMorada)) {
			if (empty($zonaMarron)) {
				$zonaMorada = "La(s) zona(s) que presenta(n) los mayores índices de contaminación atmosférica es ".$zonaMorada.".";
			} else {
				$zonaMorada = "La(s) zona(s) que presenta(n) concentraciones extremadamente malas de contaminación atmosférica (bandera morada) es ".$zonaMorada.".";
			}
		}
	}
	$zonaRoja="";
	if (empty($zonaRoja)) { //N MUY MALA
		if ($calidadaire_sta=="MUY MALA") {
			if ($zonaRoja == "") { $zonaRoja = "AGUA SANTA (zona sur)"; }
			else { $zonaRoja = $zonaRoja.", AGUA SANTA (zona sur)"; }
		}
		if ($calidadaire_bin=="MUY MALA" && $calidadaire_nin=="MUY MALA") {
			if ($zonaRoja == "") { $zonaRoja = "Zona Centro (Estación BINE y NINFAS)"; }
			else { $zonaRoja = $zonaRoja.", Zona Centro (Estación BINE y NINFAS)"; }
		} elseif ($calidadaire_bin=="MUY MALA") {
			if ($zonaRoja == "") { $zonaRoja = "Zona Centro (Estación BINE)"; }
			else { $zonaRoja = $zonaRoja.", Zona Centro (Estación BINE)"; }
		} else if ($calidadaire_nin=="MUY MALA") {
			if ($zonaRoja == "") { $zonaRoja = "Zona Centro (Estación NINFAS)"; }
			else { $zonaRoja = $zonaRoja.", Zona Centro (Estación NINFAS)"; }
		}
		if ($calidadaire_utp=="MUY MALA") {
			if ($zonaRoja == "") { $zonaRoja = "Zona Nororiente (Estación UTP)"; }
			else { $zonaRoja = $zonaRoja.", Zona Nororiente (Estación UTP)"; }
		}
		if ($calidadaire_vel=="MUY MALA") {
			if ($zonaRoja == "") { $zonaRoja = "Zona Norponiente (Estación VELÓDROMO)"; }
			else { $zonaRoja = $zonaRoja.", Zona Norponiente (Estación VELÓDROMO)"; }
		}
		if (!empty($zonaRoja)) {
			if (empty($zonaMorada)) {
				$zonaRoja = "La(s) zona(s) que presenta(n) los mayores índices de contaminación atmosférica es ".$zonaRoja.".";
			} else {
				$zonaRoja = "La(s) zona(s) que presenta(n) concentraciones muy malas de contaminación atmosférica (bandera roja) es ".$zonaRoja.".";
			}
		}
	}
	$zonaNaranja="";
	if (empty($zonaNaranja)) { //N MALA
		if ($calidadaire_sta=="MALA") {
			if ($zonaNaranja == "") { $zonaNaranja = "AGUA SANTA (zona sur)"; }
			else { $zonaNaranja = $zonaNaranja.", Zona Sur (Estación AGUA SANTA)"; }
		}
		if ($calidadaire_bin=="MALA" && $calidadaire_nin=="MALA") {
			if ($zonaNaranja == "") { $zonaNaranja = "Zona Centro (Estación BINE y NINFAS)"; }
			else { $zonaNaranja = $zonaNaranja.", Zona Centro (Estación BINE y NINFAS)"; }
		} else if ($calidadaire_bin=="MALA") {
			if ($zonaNaranja == "") { $zonaNaranja = "Zona Centro (Estación BINE)"; }
			else { $zonaNaranja = $zonaNaranja.", Zona Centro (Estación BINE)"; }
		} else if ($calidadaire_nin=="MALA") {
			if ($zonaNaranja == "") { $zonaNaranja = "Zona Centro (Estación NINFAS)"; }
			else { $zonaNaranja = $zonaNaranja.", Zona Centro (Estación NINFAS)"; }
		}
		if ($calidadaire_utp=="MALA") {
			if ($zonaNaranja == "") { $zonaNaranja = "Zona Nororiente (Estación UTP)"; }
			else { $zonaNaranja = $zonaNaranja.", Zona Nororiente (Estación UTP)"; }
		}
		if ($calidadaire_vel=="MALA") {
			if ($zonaNaranja == "") { $zonaNaranja = "Zona Norponiente (Estación VELÓDROMO)"; }
			else { $zonaNaranja = $zonaNaranja.", Zona Norponiente (Estación VELÓDROMO)"; }
		}
		if (!empty($zonaNaranja)) {
			if (empty($zonaRoja)) {
				$zonaNaranja = "La(s) zona(s) que presenta(n) los mayores índices de contaminación atmosférica es ".$zonaNaranja.".";
			} else {
				$zonaNaranja = "La(s) zona(s) que presenta(n) concentraciones malas de contaminación atmosférica (bandera naranja) es ".$zonaNaranja.".";
			}
		}
	}
	$zonaAmarilla="";
	if (empty($zonaAmarilla)) { //N REGULAR
		if ($calidadaire_sta=="REGULAR") {
			if ($zonaAmarilla == "") { $zonaAmarilla = "Zona Sur (Estación AGUA SANTA)"; }
			else { $zonaAmarilla = $zonaAmarilla.", Zona Sur (Estación AGUA SANTA)"; }
		}
		if ($calidadaire_bin=="REGULAR" && $calidadaire_nin=="REGULAR") {
			if ($zonaAmarilla == "") { $zonaAmarilla = "Zona Centro (Estación BINE y NINFAS)"; }
			else { $zonaAmarilla = $zonaAmarilla.", Zona Centro (Estación BINE y NINFAS)"; }
		} else if ($calidadaire_bin=="REGULAR") {
			if ($zonaAmarilla == "") { $zonaAmarilla = "Zona Centro (Estación BINE)"; }
			else { $zonaAmarilla = $zonaAmarilla.", Zona Centro (Estación BINE)"; }
		} else if ($calidadaire_nin=="REGULAR") {
			if ($zonaAmarilla == "") { $zonaAmarilla = "Zona Centro (Estación NINFAS)"; }
			else { $zonaAmarilla = $zonaAmarilla.", Zona Centro (Estación NINFAS)"; }
		}
		if ($calidadaire_utp=="REGULAR") {
			if ($zonaAmarilla == "") { $zonaAmarilla = "Zona Nororiente (Estación UTP)"; }
			else { $zonaAmarilla = $zonaAmarilla.", Zona Nororiente (Estación UTP)"; }
		}
		if ($calidadaire_vel=="REGULAR") {
			if ($zonaAmarilla == "") { $zonaAmarilla = "Zona Norponiente (Estación VELÓDROMO)"; }
			else { $zonaAmarilla = $zonaAmarilla.", Zona Norponiente (Estación VELÓDROMO)"; }
		}
		if (!empty($zonaAmarilla)) {
			if (empty($zonaNaranja)) {
				$zonaAmarilla = "La(s) zona(s) que presenta(n) los mayores índices de contaminación atmosférica es ".$zonaAmarilla.".";
			} else {
				$zonaAmarilla = "La(s) zona(s) que presenta(n) concentraciones regulares de contaminación atmosférica (bandera amarilla) es ".$zonaAmarilla.".";
			}
		}
	}
	$zonaVerde="";
	if (empty($zonaVerde)) { //N BUENA
		if ($calidadaire_sta=="BUENA") {
			if ($zonaVerde == "") { $zonaVerde = "Zona Sur (Estación AGUA SANTA)"; }
			else { $zonaVerde = $zonaVerde.", Zona Sur (Estación AGUA SANTA)"; }
		}
		if ($calidadaire_bin=="BUENA" && $calidadaire_nin=="BUENA") {
			if ($zonaVerde == "") { $zonaVerde = "Zona Centro (Estación BINE y NINFAS)"; }
			else { $zonaVerde = $zonaVerde.", Zona Centro (Estación BINE y NINFAS)"; }
		} else if ($calidadaire_bin=="BUENA") {
			if ($zonaVerde == "") { $zonaVerde = "Zona Centro (Estación BINE)"; }
			else { $zonaVerde = $zonaVerde.", Zona Centro (Estación BINE)"; }
		} else if ($calidadaire_nin=="BUENA") {
			if ($zonaVerde == "") { $zonaVerde = "Zona Centro (Estación NINFAS)"; }
			else { $zonaVerde = $zonaVerde.", Zona Centro (Estación NINFAS)"; }
		}
		if ($calidadaire_utp=="BUENA") {
			if ($zonaVerde == "") { $zonaVerde = "Zona Nororiente (Estación UTP)"; }
			else { $zonaVerde = $zonaVerde.", Zona Nororiente (Estación UTP)"; }
		}
		if ($calidadaire_vel=="BUENA") {
			if ($zonaVerde == "") { $zonaVerde = "Zona Norponiente (Estación VELÓDROMO)"; }
			else { $zonaVerde = $zonaVerde.", Zona Norponiente (Estación VELÓDROMO)"; }
		}
		if (!empty($zonaVerde)) {
			if (empty($zonaAmarilla)) {
				$zonaVerde = "La(s) zona(s) que presenta(n) los mayores índices de contaminación atmosférica es ".$zonaVerde.".";
			} else {
				$zonaVerde = "La(s) zona(s) que presenta(n) concentraciones bajas de contaminación atmosférica (bandera verde) es ".$zonaVerde.".";
			}
		}
	}
	$zonas = "";
	if (empty($zonas)) {
		$zonas = $zonaMarron;
	} else {
		if (!empty($zonaMarron)) {
			$zonas = $zonas."<br><br>".$zonaMarron;
		}
	}
	if (empty($zonas)) {
		$zonas = $zonaMorada;
	} else {
		if (!empty($zonaMorada)) {
			$zonas = $zonas."<br><br>".$zonaMorada;
		}
	}
	if (empty($zonas)) {
		$zonas = $zonaRoja;
	} else {
		if (!empty($zonaRoja)) {
			$zonas = $zonas."<br>><br>".$zonaRoja;
		}
	}
	if (empty($zonas)) {
		$zonas = $zonaNaranja;
	} else {
		if (!empty($zonaNaranja)) {
			$zonas = $zonas."<br><br>".$zonaNaranja;
		}
	}
	if (empty($zonas)) {
		$zonas = $zonaAmarilla;
	} else {
		if (!empty($zonaAmarilla)) {
			$zonas = $zonas."<br><br>".$zonaAmarilla;
		}
	}
	if (empty($zonas)) {
		$zonas = $zonaVerde;
	} else {
		if (!empty($zonaVerde)) {
			$zonas = $zonas."<br><br>".$zonaVerde;
		}
	}
	return $zonas;
}
function recomendacionMunicipio($arr1,$arr2,$arr3,$arr4,$arr5,$arr6) {
	if (!is_numeric($arr1) && !is_numeric($arr2) && !is_numeric($arr3) && !is_numeric($arr4) && !is_numeric($arr5) && !is_numeric($arr6)) {
		$riesgoNivel = "Riesgo a la salud: D.I.";
		$riesgoDescripcion = "D.I.";
		$recomendacion = "D.I.";
	} elseif (is_numeric($arr1)&&$arr1>=301&&$arr1<=500 || is_numeric($arr2)&&$arr2>=301&&$arr2<=500 || is_numeric($arr3)&&$arr3>=301&&$arr3=500 || is_numeric($arr4)&&$arr4>=301&&$arr4<=500 || is_numeric($arr5)&&$arr5>=301&&$arr5<=500 || is_numeric($arr6)&&$arr6>=301&&$arr6<=500) {
		$riesgoNivel = "Riesgo a la salud: PELIGROSO.";
		$riesgoDescripcion = "Toda la población experimenta efectos graves en la salud.";
		$recomendacion = "Suspensión de actividades al aire libre.";
	} elseif (is_numeric($arr1)&&$arr1>=201&&$arr1<=300 || is_numeric($arr2)&&$arr2>=201&&$arr2<=300 || is_numeric($arr3)&&$arr3>=201&&$arr3<=300 || is_numeric($arr4)&&$arr4>=201&&$arr4<=300 || is_numeric($arr5)&&$arr5>=201&&$arr5<=300 || is_numeric($arr6)&&$arr6>=201&&$arr6<=300) {
		$riesgoNivel = "Riesgo a la salud: EXTREMANDAMENTE MALA.";
		$riesgoDescripcion = "Toda la población tiene probabilidades de experimentar efectos graves en la salud.";
		$recomendacion = "Toda la población debe evitar la exposición al aire libre.";
	} elseif (is_numeric($arr1)&&$arr1>=151&&$arr1<=200 || is_numeric($arr2)&&$arr2>=151&&$arr2<=200 || is_numeric($arr3)&&$arr3>=151&&$arr3<=200 || is_numeric($arr4)&&$arr4>=151&&$arr4<=200 || is_numeric($arr5)&&$arr5>=151&&$arr5<=200 || is_numeric($arr6)&&$arr6>=151&&$arr6<=200) {
		$riesgoNivel = "Riesgo a la salud: MUY ALTO.";
		$riesgoDescripcion = "Toda la población puede presentar efectos en la salud; quienes pertenecen a los grupos susceptibles experimentan efectos graves";
		$recomendacion = "Los niños, adultos mayores, personas que realizan actividad física intensa o con enfermedades respiratorias y cardiovasculares, deben evitar la exposición al aire libre y el resto de la población deben limitar la exposición al aire libre.";
	} elseif (is_numeric($arr1)&&$arr1>=101&&$arr1<=150 || is_numeric($arr2)&&$arr2>=101&&$arr2<=150 || is_numeric($arr3)&&$arr3>=101&&$arr3<=150 || is_numeric($arr4)&&$arr4>=101&&$arr4<=150 || is_numeric($arr5)&&$arr5>=101&&$arr5<=150 || is_numeric($arr6)&&$arr6>=101&&$arr6<=150) {
		$riesgoNivel = "Riesgo a la salud: ALTO.";
		$riesgoDescripcion = "Los grupos susceptibles presentan efectos en la salud.";
		$recomendacion = "Los niños, adultos mayores, personas que realizan actividad física intensa o con enfermedades respiratorias y cardiovasculares, deben evitar la exposición al aire libre y el resto de la población deben limitar la exposición al aire libre.";
	} elseif (is_numeric($arr1)&&$arr1>=51&&$arr1<=100 || is_numeric($arr2)&&$arr2>=51&&$arr2<=100 || is_numeric($arr3)&&$arr3>=51&&$arr3<=100 || is_numeric($arr4)&&$arr4>=51&&$arr4<=100 || is_numeric($arr5)&&$arr5>=51&&$arr5<=100 || is_numeric($arr6)&&$arr6>=51&&$arr6<=100) {
		$riesgoNivel = "Riesgo a la salud: MODERADO.";
		$riesgoDescripcion = "Los grupos susceptibles pueden presentar síntomas en la salud.";
		$recomendacion = "Las personas que son extremadamente susceptibles a la contaminación deben considerar limitar la exposición al aire libre.";
	} elseif (is_numeric($arr1)&&$arr1>=0&&$arr1<=50 || is_numeric($arr2)&&$arr2>=0&&$arr2<=50 || is_numeric($arr3)&&$arr3>=0&&$arr3<=50 || is_numeric($arr4)&&$arr4>=0&&$arr4<=50 || is_numeric($arr5)&&$arr5>=0&&$arr5<=50 || is_numeric($arr6)&&$arr6>=0&&$arr6<=50) {
		$riesgoNivel = "Riesgo a la salud: BAJO.";
		$riesgoDescripcion = "Existe poco o ningún riesgo para la salud.";
		$recomendacion = "Se puede realizar cualquier actividad al aire libre.";
	}
	$result = [$riesgoNivel,$riesgoDescripcion,$recomendacion];

	return $result;
}
function parametroMasAlto_to_ICA_siglas($O3,$NO2,$CO,$SO2,$PM10,$PM25) {
	$contaminante="";
	if (!is_numeric($O3) && !is_numeric($NO2) && !is_numeric($CO) && !is_numeric($SO2) && !is_numeric($PM10) && !is_numeric($PM25)) {
		$contaminante = "F.O.";
	}
	//Contaminantes morrones
	if (empty($contaminante)) {
		if ($O3>=301 && $O3<=500) {
			if (empty($contaminante)) {
				$contaminante = "O<sub>3</sub>";
			} else {
				$contaminante = $contaminante.", O<sub>3</sub>";
			}
		}
		if ($NO2>=301 && $NO2<=500) {
			if (empty($contaminante)) {
				$contaminante = "NO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", NO<sub>2</sub>";
			}
		}
		if ($CO>=301 && $CO<=500) {
			if (empty($contaminante)) {
				$contaminante = "CO";
			} else {
				$contaminante = $contaminante.", CO";
			}
		}
		if ($SO2>=301 && $SO2<=500) {
			if (empty($contaminante)) {
				$contaminante = "SO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", SO<sub>2</sub>";
			}
		}
		if ($PM10>=301 && $PM10<=500) {
			if (empty($contaminante)) {
				$contaminante = "PM-10";
			} else {
				$contaminante = $contaminante.", PM-10";
			}
		}
		if ($PM25>=301 && $PM25<=500) {
			if (empty($contaminante)) {
				$contaminante = "PM-2.5";
			} else {
				$contaminante = $contaminante.", PM-2.5";
			}
		}
	}
	//Contaminantes morados
	if (empty($contaminante)) {
		if ($O3>=201 && $O3<=300) {
			if (empty($contaminante)) {
				$contaminante = "O<sub>3</sub>";
			} else {
				$contaminante = $contaminante.", O<sub>3</sub>";
			}
		}
		if ($NO2>=201 && $NO2<=300) {
			if (empty($contaminante)) {
				$contaminante = "NO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", NO<sub>2</sub>";
			}
		}
		if ($CO>=201 && $CO<=300) {
			if (empty($contaminante)) {
				$contaminante = "CO";
			} else {
				$contaminante = $contaminante.", CO";
			}
		}
		if ($SO2>=201 && $SO2<=300) {
			if (empty($contaminante)) {
				$contaminante = "SO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", SO<sub>2</sub>";
			}
		}
		if ($PM10>=201 && $PM10<=300) {
			if (empty($contaminante)) {
				$contaminante = "PM-10";
			} else {
				$contaminante = $contaminante.", PM-10";
			}
		}
		if ($PM25>=201 && $PM25<=300) {
			if (empty($contaminante)) {
				$contaminante = "PM-2.5";
			} else {
				$contaminante = $contaminante.", PM-2.5";
			}
		}
	}
	//Contaminantes rojos
	if (empty($contaminante)) {
		if ($O3>=151 && $O3<=200) {
			if (empty($contaminante)) {
				$contaminante = "O<sub>3</sub>";
			} else {
				$contaminante = $contaminante.", O<sub>3</sub>";
			}
		}
		if ($NO2>=151 && $NO2<=200) {
			if (empty($contaminante)) {
				$contaminante = "NO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", NO<sub>2</sub>";
			}
		}
		if ($CO>=151 && $CO<=200) {
			if (empty($contaminante)) {
				$contaminante = "CO";
			} else {
				$contaminante = $contaminante.", CO";
			}
		}
		if ($SO2>=151 && $SO2<=200) {
			if (empty($contaminante)) {
				$contaminante = "SO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", SO<sub>2</sub>";
			}
		}
		if ($PM10>=151 && $PM10<=200) {
			if (empty($contaminante)) {
				$contaminante = "PM-10";
			} else {
				$contaminante = $contaminante.", PM-10";
			}
		}
		if ($PM25>=151 && $PM25<=200) {
			if (empty($contaminante)) {
				$contaminante = "PM-2.5";
			} else {
				$contaminante = $contaminante.", PM-2.5";
			}
		}
	}
	//Contaminantes naranjas
	if (empty($contaminante)) {
		if ($O3>=101 && $O3<=150) {
			if (empty($contaminante)) {
				$contaminante = "O<sub>3</sub>";
			} else {
				$contaminante = $contaminante.", O<sub>3</sub>";
			}
		}
		if ($NO2>=101 && $NO2<=150) {
			if (empty($contaminante)) {
				$contaminante = "NO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", NO<sub>2</sub>";
			}
		}
		if ($CO>=101 && $CO<=150) {
			if (empty($contaminante)) {
				$contaminante = "CO";
			} else {
				$contaminante = $contaminante.", CO";
			}
		}
		if ($SO2>=101 && $SO2<=150) {
			if (empty($contaminante)) {
				$contaminante = "SO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", SO<sub>2</sub>";
			}
		}
		if ($PM10>=101 && $PM10<=150) {
			if (empty($contaminante)) {
				$contaminante = "PM-10";
			} else {
				$contaminante = $contaminante.", PM-10";
			}
		}
		if ($PM25>=101 && $PM25<=150) {
			if (empty($contaminante)) {
				$contaminante = "PM-2.5";
			} else {
				$contaminante = $contaminante.", PM-2.5";
			}
		}
	}
	//Contaminantes amarillos
	if (empty($contaminante)) {
		if ($O3>=51 && $O3<=100) {
			if (empty($contaminante)) {
				$contaminante = "O<sub>3</sub>";
			} else {
				$contaminante = $contaminante.", O<sub>3</sub>";
			}
		}
		if ($NO2>=51 && $NO2<=100) {
			if (empty($contaminante)) {
				$contaminante = "NO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", NO<sub>2</sub>";
			}
		}
		if ($CO>=51 && $CO<=100) {
			if (empty($contaminante)) {
				$contaminante = "CO";
			} else {
				$contaminante = $contaminante.", CO";
			}
		}
		if ($SO2>=51 && $SO2<=100) {
			if (empty($contaminante)) {
				$contaminante = "SO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", SO<sub>2</sub>)";
			}
		}
		if ($PM10>=51 && $PM10<=100) {
			if (empty($contaminante)) {
				$contaminante = "PM-10";
			} else {
				$contaminante = $contaminante.", PM-10";
			}
		}
		if ($PM25>=51 && $PM25<=100) {
			if (empty($contaminante)) {
				$contaminante = "PM-2.5";
			} else {
				$contaminante = $contaminante.", PM-2.5";
			}
		}
	}
	//Contaminantes verdes
	if (empty($contaminante)) {
		if ($O3>=0 && $O3<=50) {
			if (empty($contaminante)) {
				$contaminante = "O<sub>3</sub>";
			} else {
				$contaminante = $contaminante.", O<sub>3</sub>";
			}
		}
		if ($NO2>=0 && $NO2<=50) {
			if (empty($contaminante)) {
				$contaminante = "NO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", NO<sub>2</sub>";
			}
		}
		if ($CO>=0 && $CO<=50) {
			if (empty($contaminante)) {
				$contaminante = "CO";
			} else {
				$contaminante = $contaminante.", CO";
			}
		}
		if ($SO2>=0 && $SO2<=50) {
			if (empty($contaminante)) {
				$contaminante = "SO<sub>2</sub>";
			} else {
				$contaminante = $contaminante.", SO<sub>2</sub>";
			}
		}
		if ($PM10>=0 && $PM10<=50) {
			if (empty($contaminante)) {
				$contaminante = "PM-10";
			} else {
				$contaminante = $contaminante.", PM-10";
			}
		}
		if ($PM25>=0 && $PM25<=50) {
			if (empty($contaminante)) {
				$contaminante = "PM-2.5";
			} else {
				$contaminante = $contaminante.", PM-2.5";
			}
		}
	}
	return $contaminante;
}
function parametroMasAlto_to_ICA($O3,$NO2,$CO,$SO2,$PM10,$PM25) {
	$contaminante="";
	//Contaminantes morrones
	if (empty($contaminante)) {
		if ($O3>=301 && $O3<=500) {
			if (empty($contaminante)) {
				$contaminante = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminante = $contaminante.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=301 && $NO2<=500) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=301 && $CO<=500) {
			if (empty($contaminante)) {
				$contaminante = "Monóxido de Carbono (CO)";
			} else {
				$contaminante = $contaminante.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=301 && $SO2<=500) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=301 && $PM10<=500) {
			if (empty($contaminante)) {
				$contaminante = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=301 && $PM25<=500) {
			if ($PM10>=301 && $PM10<=500) {
				$contaminante = $contaminante." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminante)) {
				$contaminante = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	}
	//Contaminantes morados
	if (empty($contaminante)) {
		if ($O3>=201 && $O3<=300) {
			if (empty($contaminante)) {
				$contaminante = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminante = $contaminante.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=201 && $NO2<=300) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=201 && $CO<=300) {
			if (empty($contaminante)) {
				$contaminante = "Monóxido de Carbono (CO)";
			} else {
				$contaminante = $contaminante.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=201 && $SO2<=300) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=201 && $PM10<=300) {
			if (empty($contaminante)) {
				$contaminante = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=201 && $PM25<=300) {
			if ($PM10>=201 && $PM10<=300) {
				$contaminante = $contaminante." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminante)) {
				$contaminante = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	}
	//Contaminantes rojos
	if (empty($contaminante)) {
		if ($O3>=151 && $O3<=200) {
			if (empty($contaminante)) {
				$contaminante = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminante = $contaminante.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=151 && $NO2<=200) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=151 && $CO<=200) {
			if (empty($contaminante)) {
				$contaminante = "Monóxido de Carbono (CO)";
			} else {
				$contaminante = $contaminante.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=151 && $SO2<=200) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=151 && $PM10<=200) {
			if (empty($contaminante)) {
				$contaminante = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=151 && $PM25<=200) {
			if ($PM10>=151 && $PM10<=200) {
				$contaminante = $contaminante." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminante)) {
				$contaminante = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	}
	//Contaminantes naranjas
	if (empty($contaminante)) {
		if ($O3>=101 && $O3<=150) {
			if (empty($contaminante)) {
				$contaminante = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminante = $contaminante.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=101 && $NO2<=150) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=101 && $CO<=150) {
			if (empty($contaminante)) {
				$contaminante = "Monóxido de Carbono (CO)";
			} else {
				$contaminante = $contaminante.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=101 && $SO2<=150) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=101 && $PM10<=150) {
			if (empty($contaminante)) {
				$contaminante = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=101 && $PM25<=150) {
			if ($PM10>=101 && $PM10<=150) {
				$contaminante = $contaminante." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminante)) {
				$contaminante = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	}
	//Contaminantes amarillos
	if (empty($contaminante)) {
		if ($O3>=51 && $O3<=100) {
			if (empty($contaminante)) {
				$contaminante = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminante = $contaminante.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=51 && $NO2<=100) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=51 && $CO<=100) {
			if (empty($contaminante)) {
				$contaminante = "Monóxido de Carbono (CO)";
			} else {
				$contaminante = $contaminante.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=51 && $SO2<=100) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=51 && $PM10<=100) {
			if (empty($contaminante)) {
				$contaminante = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=51 && $PM25<=100) {
			if ($PM10>=51 && $PM10<=100) {
				$contaminante = $contaminante." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminante)) {
				$contaminante = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	}
	//Contaminantes verdes
	if (empty($contaminante)) {
		if ($O3>=0 && $O3<=50) {
			if (empty($contaminante)) {
				$contaminante = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminante = $contaminante.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=0 && $NO2<=50) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=0 && $CO<=50) {
			if (empty($contaminante)) {
				$contaminante = "Monóxido de Carbono (CO)";
			} else {
				$contaminante = $contaminante.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=0 && $SO2<=50) {
			if (empty($contaminante)) {
				$contaminante = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminante = $contaminante.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=0 && $PM10<=50) {
			if (empty($contaminante)) {
				$contaminante = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=0 && $PM25<=50) {
			if ($PM10>=0 && $PM10<=50) {
				$contaminante = $contaminante." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminante)) {
				$contaminante = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminante = $contaminante.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	}
}
function parametroMasAltoNOM($O3,$NO2,$CO,$SO2,$PM10,$PM25) { //R horas acum
	$temp=0;
	//Contaminantes marrones
		$contaminantesMarrones="";
		if ($O3>=301 && $O3<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones ="O3 (NOM-020-SSA1-2021)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", O3 (NOM-020-SSA1-2021)";
			}
		}
		if ($NO2>=301 && $NO2<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "NO2 (NOM-023-SSA1-2021)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", NO2 (NOM-023-SSA1-2021)";
			}
		}
		if ($CO>=301 && $CO<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "CO (NOM-021-SSA1-2021)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", CO (NOM-021-SSA1-2021)";
			}
		}
		if ($SO2>=301 && $SO2<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "SO2 (NOM-022-SSA1-2019)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", SO2 (NOM-022-SSA1-2019)";
			}
		}
		if ($PM10>=301 && $PM10<=500 && $PM25>=301 && $PM25<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			}
		}
		if ($PM10>=301 && $PM10<=500 && $temp==0) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "PM-10 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", PM-10 (NOM-025-SSA1-2021)";
			}
		}
		if ($PM25>=301 && $PM25<=500 && $temp==0) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "PM-2.5 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", PM-2.5 (NOM-025-SSA1-2021)";
			}
		}
	//Contaminantes morados
		$contaminantesMorados="";
		if ($O3>=201 && $O3<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "O3 (NOM-020-SSA1-2021)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", O3 (NOM-020-SSA1-2021)";
			}
		}
		if ($NO2>=201 && $NO2<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "NO2 (NOM-023-SSA1-2021)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", NO2 (NOM-023-SSA1-2021)";
			}
		}
		if ($CO>=201 && $CO<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "CO (NOM-021-SSA1-2021)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", CO (NOM-021-SSA1-2021)";
			}
		}
		if ($SO2>=201 && $SO2<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "SO2 (NOM-022-SSA1-2019)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", SO2 (NOM-022-SSA1-2019)";
			}
		}
		if ($PM10>=201 && $PM10<=300 && $PM25>=201 && $PM25<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			} else {
				$contaminantesMorados = $contaminantesMorados.", PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			}
		}
		if ($PM10>=201 && $PM10<=300 && $temp==0) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "PM-10 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", PM-10 (NOM-025-SSA1-2021)";
			}
		}
		if ($PM25>=201 && $PM25<=300 && $temp==0) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "PM-2.5 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", PM-2.5 (NOM-025-SSA1-2021)";
			}
		}
	//Contaminantes rojos
		$contaminantesRojos="";
		if ($O3>=151 && $O3<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "O3 (NOM-020-SSA1-2021)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", O3 (NOM-020-SSA1-2021)";
			}
		}
		if ($NO2>=151 && $NO2<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "NO2 (NOM-023-SSA1-2021)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", NO2 (NOM-023-SSA1-2021)";
			}
		}
		if ($CO>=151 && $CO<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "CO (NOM-021-SSA1-2021)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", CO (NOM-021-SSA1-2021)";
			}
		}
		if ($SO2>=151 && $SO2<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "SO2 (NOM-022-SSA1-2019)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", SO2 (NOM-022-SSA1-2019)";
			}
		}
		if ($PM10>=151 && $PM10<=200 && $PM25>=151 && $PM25<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			} else {
				$contaminantesRojos = $contaminantesRojos.", PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			}
		}
		if ($PM10>=151 && $PM10<=200 && $temp==0) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "PM-10 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", PM-10 (NOM-025-SSA1-2021)";
			}
		}
		if ($PM25>=151 && $PM25<=200 && $temp==0) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "PM-2.5 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", PM-2.5 (NOM-025-SSA1-2021)";
			}
		}
	//Contaminantes naranjas
		$contaminantesNaranjas="";
		if ($O3>=101 && $O3<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "O3 (NOM-020-SSA1-2021)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", O3 (NOM-020-SSA1-2021)";
			}
		}
		if ($NO2>=101 && $NO2<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "NO2 (NOM-023-SSA1-2021)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", NO2 (NOM-023-SSA1-2021)";
			}
		}
		if ($CO>=101 && $CO<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "monóxido de carbono (CO)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", monóxido de carbono (CO)";
			}
		}
		if ($SO2>=101 && $SO2<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "SO2 (NOM-022-SSA1-2019)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", SO2 (NOM-022-SSA1-2019)";
			}
		}
		if ($PM10>=101 && $PM10<=150 && $PM25>=101 && $PM25<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			}
		}
		if ($PM10>=101 && $PM10<=150 && $temp==0) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "PM-10 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", PM-10 (NOM-025-SSA1-2021)";
			}
		}
		if ($PM25>=101 && $PM25<=150 && $temp==0) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "PM-2.5 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", PM-2.5 (NOM-025-SSA1-2021)";
			}
		}
	//Contaminantes amarillos
		$contaminantesAmarillos="";
		if ($O3>=51 && $O3<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "O3 (NOM-020-SSA1-2021)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", O3 (NOM-020-SSA1-2021)";
			}
		}
		if ($NO2>=51 && $NO2<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "NO2 (NOM-023-SSA1-2021)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", NO2 (NOM-023-SSA1-2021)";
			}
		}
		if ($CO>=51 && $CO<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "CO (NOM-021-SSA1-2021)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", CO (NOM-021-SSA1-2021)";
			}
		}
		if ($SO2>=51 && $SO2<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "SO2 (NOM-022-SSA1-2019)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", SO2 (NOM-022-SSA1-2019)";
			}
		}
		if ($PM10>=51 && $PM10<=100 && $PM25>=51 && $PM25<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			}
		}
		if ($PM10>=51 && $PM10<=100 && $temp==0) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "PM-10 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", PM-10 (NOM-025-SSA1-2021)";
			}
		}
		if ($PM25>=51 && $PM25<=100 && $temp==0) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "PM-2.5 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", PM-2.5 (NOM-025-SSA1-2021)";
			}
		}
	//Contaminantes verdes
		$contaminantesVerdes="";
		if ($O3>=0 && $O3<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "O3 (NOM-020-SSA1-2021)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", O3 (NOM-020-SSA1-2021)";
			}
		}
		if ($NO2>=0 && $NO2<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "NO2 (NOM-023-SSA1-2021)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", NO2 (NOM-023-SSA1-2021)";
			}
		}
		if ($CO>=0 && $CO<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "CO (NOM-021-SSA1-2021)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", CO (NOM-021-SSA1-2021)";
			}
		}
		if ($SO2>=0 && $SO2<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "SO2 (NOM-022-SSA1-2019)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", SO2 (NOM-022-SSA1-2019)";
			}
		}
		if ($PM10>=0 && $PM10<=50 && $PM25>=0 && $PM25<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", PM-10 y PM-2.5 (NOM-025-SSA1-2021)";
				$temp = 1;
			}
		}
		if ($PM10>=0 && $PM10<=50 && $temp==0) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "PM-10 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", PM-10 (NOM-025-SSA1-2021)";
			}
		}
		if ($PM25>=0 && $PM25<=50 && $temp==0) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "PM-2.5 (NOM-025-SSA1-2021)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", PM-2.5 (NOM-025-SSA1-2021)";
			}
		}
	//Contaminantes ordenados
		$contaminantesColores = "";
		if (empty($contaminantesColores)) {
			$contaminantesColores = $contaminantesMarrones;
		}
		if (empty($contaminantesColores)) {
			$contaminantesColores = $contaminantesMorados;
		}
		if (empty($contaminantesColores)) {
			$contaminantesColores = $contaminantesRojos;
		}
		if (empty($contaminantesColores)) {
			$contaminantesColores = $contaminantesNaranjas;
		}
		if (empty($contaminantesColores)) {
			$contaminantesColores = $contaminantesAmarillos;
		}
		if (empty($contaminantesColores)) {
			$contaminantesColores = $contaminantesVerdes;
		}

	return $contaminantesColores;
}
function zonaAfectada($calidadSANTA,$calidadBINE,$calidadNINFAS,$calidadUTP,$calidadVELODROMO) { //R horas acum
	$zona = "";

	if (empty($zona)) { //TODO D.I.
		if ($calidadSANTA=="D.I." && $calidadBINE=="D.I." && $calidadNINFAS=="D.I." && $calidadUTP=="D.I." && $calidadVELODROMO=="D.I.") {
			$zona = "D.I.";
		}
	}
	if (empty($zona)) { //TODO PELIGROSA
		if ($calidadSANTA=="PELIGROSA" && $calidadBINE=="PELIGROSA" && $calidadNINFAS=="PELIGROSA" && $calidadUTP=="PELIGROSA" && $calidadVELODROMO=="PELIGROSA") {
			$zona = "AGUA SANTA, BINE, NINFAS, UTP Y VELÓDROMO";
		}
	}
	if (empty($zona)) { //TODO EXTREMADAMENTE MALA
		if ($calidadSANTA=="EXTREMADAMENTE MALA" && $calidadBINE=="EXTREMADAMENTE MALA" && $calidadNINFAS=="EXTREMADAMENTE MALA" && $calidadUTP=="EXTREMADAMENTE MALA" && $calidadVELODROMO=="EXTREMADAMENTE MALA") {
			$zona = "AGUA SANTA, BINE, NINFAS, UTP Y VELÓDROMO";
		}
	}
	if (empty($zona)) { //TODO MUY MALA
		if ($calidadSANTA=="MUY MALA" && $calidadBINE=="MUY MALA" && $calidadNINFAS=="MUY MALA" && $calidadUTP=="MUY MALA" && $calidadVELODROMO=="MUY MALA") {
			$zona = "AGUA SANTA, BINE, NINFAS, UTP Y VELÓDROMO";
		}
	}
	if (empty($zona)) { //TODO MALA
		if ($calidadSANTA=="MALA" && $calidadBINE=="MALA" && $calidadNINFAS=="MALA" && $calidadUTP=="MALA" && $calidadVELODROMO=="MALA") {
			$zona = "AGUA SANTA, BINE, NINFAS, UTP Y VELÓDROMO";
		}
	}
	if (empty($zona)) { //TODO REGULAR
		if ($calidadSANTA=="REGULAR" && $calidadBINE=="REGULAR" && $calidadNINFAS=="REGULAR" && $calidadUTP=="REGULAR" && $calidadVELODROMO=="REGULAR") {
			$zona = "AGUA SANTA, BINE, NINFAS, UTP Y VELÓDROMO";
		}
	}
	if (empty($zona)) { //TODO BUENA
		if ($calidadSANTA=="BUENA" && $calidadBINE=="BUENA" && $calidadNINFAS=="BUENA" && $calidadUTP=="BUENA" && $calidadVELODROMO=="BUENA") {
			$zona = "AGUA SANTA, BINE, NINFAS, UTP Y VELÓDROMO";
		}
	}
	if (empty($zona)) { //N PELIGROSA
		if ($calidadSANTA=="PELIGROSA") {
			if ($zona == "") { $zona = "AGUA SANTA"; }
			else { $zona = $zona.", AGUA SANTA"; }
		}
		if ($calidadBINE=="PELIGROSA") {
			if ($zona == "") { $zona = "BINE"; }
			else { $zona = $zona.", BINE"; }
		}
		if ($calidadNINFAS=="PELIGROSA") {
			if ($zona == "") { $zona = "NINFAS"; }
			else { $zona = $zona.", NINFAS"; }
		}
		if ($calidadUTP=="PELIGROSA") {
			if ($zona == "") { $zona = "UTP"; }
			else { $zona = $zona.", UTP"; }
		}
		if ($calidadVELODROMO=="PELIGROSA") {
			if ($zona == "") { $zona = "VELÓDROMO"; }
			else { $zona = $zona.", VELÓDROMO"; }
		}
	}
	if (empty($zona)) { //N EXTREMADAMENTE MALA
		if ($calidadSANTA=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "AGUA SANTA"; }
			else { $zona = $zona.", AGUA SANTA"; }
		}
		if ($calidadBINE=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "BINE"; }
			else { $zona = $zona.", BINE"; }
		}
		if ($calidadNINFAS=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "NINFAS"; }
			else { $zona = $zona.", NINFAS"; }
		}
		if ($calidadUTP=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "UTP"; }
			else { $zona = $zona.", UTP"; }
		}
		if ($calidadVELODROMO=="EXTREMADAMENTE MALA") {
			if ($zona == "") { $zona = "VELÓDROMO"; }
			else { $zona = $zona.", VELÓDROMO"; }
		}
	}
	if (empty($zona)) { //N MUY MALA
		if ($calidadSANTA=="MUY MALA") {
			if ($zona == "") { $zona = "AGUA SANTA"; }
			else { $zona = $zona.", AGUA SANTA"; }
		}
		if ($calidadBINE=="MUY MALA") {
			if ($zona == "") { $zona = "BINE"; }
			else { $zona = $zona.", BINE"; }
		}
		if ($calidadNINFAS=="MUY MALA") {
			if ($zona == "") { $zona = "NINFAS"; }
			else { $zona = $zona.", NINFAS"; }
		}
		if ($calidadUTP=="MUY MALA") {
			if ($zona == "") { $zona = "UTP"; }
			else { $zona = $zona.", UTP"; }
		}
		if ($calidadVELODROMO=="MUY MALA") {
			if ($zona == "") { $zona = "VELÓDROMO"; }
			else { $zona = $zona.", VELÓDROMO"; }
		}
	}
	if (empty($zona)) { //N MALA
		if ($calidadSANTA=="MALA") {
			if ($zona == "") { $zona = "AGUA SANTA"; }
			else { $zona = $zona.", AGUA SANTA"; }
		}
		if ($calidadBINE=="MALA") {
			if ($zona == "") { $zona = "BINE"; }
			else { $zona = $zona.", BINE"; }
		}
		if ($calidadNINFAS=="MALA") {
			if ($zona == "") { $zona = "NINFAS"; }
			else { $zona = $zona.", NINFAS"; }
		}
		if ($calidadUTP=="MALA") {
			if ($zona == "") { $zona = "UTP"; }
			else { $zona = $zona.", UTP"; }
		}
		if ($calidadVELODROMO=="MALA") {
			if ($zona == "") { $zona = "VELÓDROMO"; }
			else { $zona = $zona.", VELÓDROMO"; }
		}
	}
	if (empty($zona)) { //N REGULAR
		if ($calidadSANTA=="REGULAR") {
			if ($zona == "") { $zona = "AGUA SANTA"; }
			else { $zona = $zona.", AGUA SANTA"; }
		}
		if ($calidadBINE=="REGULAR") {
			if ($zona == "") { $zona = "BINE"; }
			else { $zona = $zona.", BINE"; }
		}
		if ($calidadNINFAS=="REGULAR") {
			if ($zona == "") { $zona = "NINFAS"; }
			else { $zona = $zona.", NINFAS"; }
		}
		if ($calidadUTP=="REGULAR") {
			if ($zona == "") { $zona = "UTP"; }
			else { $zona = $zona.", UTP"; }
		}
		if ($calidadVELODROMO=="REGULAR") {
			if ($zona == "") { $zona = "VELÓDROMO"; }
			else { $zona = $zona.", VELÓDROMO"; }
		}
	}
	if (empty($zona)) { //N BUENA
		if ($calidadSANTA=="BUENA") {
			if ($zona == "") { $zona = "AGUA SANTA"; }
			else { $zona = $zona.", AGUA SANTA"; }
		}
		if ($calidadBINE=="BUENA") {
			if ($zona == "") { $zona = "BINE"; }
			else { $zona = $zona.", BINE"; }
		}
		if ($calidadNINFAS=="BUENA") {
			if ($zona == "") { $zona = "NINFAS"; }
			else { $zona = $zona.", NINFAS"; }
		}
		if ($calidadUTP=="BUENA") {
			if ($zona == "") { $zona = "UTP"; }
			else { $zona = $zona.", UTP"; }
		}
		if ($calidadVELODROMO=="BUENA") {
			if ($zona == "") { $zona = "VELÓDROMO"; }
			else { $zona = $zona.", VELÓDROMO"; }
		}
	}

	return $zona;
}
//Funciones para información de reporte detallado
function maximoDiarioO3ICA($arr1,$arr2,$arr3,$arr4,$arr5) {
	include("get_datetime.php");
	$hour24 = $date->format("H");
	$horas = 24-(24-$hour24);
	for ($i=0; $i<$horas; $i++) {
		if ($arr1[$i] == "Mtto.") {
			$result1[$i] = "Mtto.";
		} elseif (is_numeric($arr1[$i])) {
			$valor = round($arr1[$i],3);
			if ($valor <= 0.065) {
				$result1[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.066 && $valor <= 0.090) {
				$result1[$i] = round((2041.7*($valor-0.066))+51,0);
			} elseif ($valor >= 0.091 && $valor <= 0.154) {
				$result1[$i] = round((844.82*($valor-0.091))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$result1[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$result1[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$result1[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$result1[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$result1[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr2[$i] == "Mtto.") {
			$result2[$i] = "Mtto.";
		} elseif (is_numeric($arr2[$i])) {
			$valor = round($arr2[$i],3);
			if ($valor <= 0.065) {
				$result2[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.066 && $valor <= 0.090) {
				$result2[$i] = round((2041.7*($valor-0.066))+51,0);
			} elseif ($valor >= 0.091 && $valor <= 0.154) {
				$result2[$i] = round((844.82*($valor-0.091))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$result2[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$result2[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$result2[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$result2[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$result2[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr3[$i] == "Mtto.") {
			$result3[$i] = "Mtto.";
		} elseif (is_numeric($arr3[$i])) {
			$valor = round($arr3[$i],3);
			if ($valor <= 0.065) {
				$result3[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.066 && $valor <= 0.090) {
				$result3[$i] = round((2041.7*($valor-0.066))+51,0);
			} elseif ($valor >= 0.091 && $valor <= 0.154) {
				$result3[$i] = round((844.82*($valor-0.091))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$result3[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$result3[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$result3[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$result3[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$result3[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr4[$i] == "Mtto.") {
			$result4[$i] = "Mtto.";
		} elseif (is_numeric($arr4[$i])) {
			$valor = round($arr4[$i],3);
			if ($valor <= 0.065) {
				$result4[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.066 && $valor <= 0.090) {
				$result4[$i] = round((2041.7*($valor-0.066))+51,0);
			} elseif ($valor >= 0.091 && $valor <= 0.154) {
				$result4[$i] = round((844.82*($valor-0.091))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$result4[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$result4[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$result4[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$result4[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$result4[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr5[$i] == "Mtto.") {
			$result5[$i] = "Mtto.";
		} elseif (is_numeric($arr5[$i])) {
			$valor = round($arr5[$i],3);
			if ($valor <= 0.065) {
				$result5[$i] = round((714.29*($valor-0))+0,0);
			} elseif ($valor >= 0.066 && $valor <= 0.090) {
				$result5[$i] = round((2041.7*($valor-0.066))+51,0);
			} elseif ($valor >= 0.091 && $valor <= 0.154) {
				$result5[$i] = round((844.82*($valor-0.091))+101,0);
			} elseif ($valor>=0.155 && $valor<=0.204) {
				$result5[$i] = round((1000*($valor-0.155))+151,0);
			} elseif ($valor>=0.205 && $valor<=0.404) {
				$result5[$i] = round((497.49*($valor-0.205))+201,0);
			} elseif ($valor>=0.405 && $valor<=0.504) {
				$result5[$i] = round((1000.00*($valor-0.405))+301,0);
			} elseif ($valor>=0.505 && $valor<=0.604) {
				$result5[$i] = round((1000.00*($valor-0.505))+401,0);
			}
		} else {
			$result5[$i] = "F.O.";
		}
	}
	$solonumeros1 = [];
	for ($i=0; $i < count($result1); $i++) {
		$dato1 = $result1[$i];
		if (is_numeric($dato1)) { $solonumeros1[$i] = $dato1; }
	}
	$solonumeros2 = [];
	for ($i=0; $i < count($result2); $i++) {
		$dato2 = $result2[$i];
		if (is_numeric($dato2)) { $solonumeros2[$i] = $dato2; }
	}
	$solonumeros3 = [];
	for ($i=0; $i < count($result3); $i++) {
		$dato3 = $result3[$i];
		if (is_numeric($dato3)) { $solonumeros3[$i] = $dato3; }
	}
	$solonumeros4 = [];
	for ($i=0; $i < count($result4); $i++) {
		$dato4 = $result4[$i];
		if (is_numeric($dato4)) { $solonumeros4[$i] = $dato4; }
	}
	$solonumeros5 = [];
	for ($i=0; $i < count($result5); $i++) {
		$dato5 = $result5[$i];
		if (is_numeric($dato5)) { $solonumeros5[$i] = $dato5; }
	}

	if (empty($solonumeros1)) { $solonumeros1[0] = "F.O."; }
	if (empty($solonumeros2)) { $solonumeros2[0] = "F.O."; }
	if (empty($solonumeros3)) { $solonumeros3[0] = "F.O."; }
	if (empty($solonumeros4)) { $solonumeros4[0] = "F.O."; }
	if (empty($solonumeros5)) { $solonumeros5[0] = "F.O."; }

	sort($solonumeros1, SORT_NUMERIC);
	sort($solonumeros2, SORT_NUMERIC);
	sort($solonumeros3, SORT_NUMERIC);
	sort($solonumeros4, SORT_NUMERIC);
	sort($solonumeros5, SORT_NUMERIC);

	$indicesMayores = array(end($solonumeros1),end($solonumeros2),end($solonumeros3),end($solonumeros4),end($solonumeros5));
	sort($indicesMayores, SORT_NUMERIC);
	return end($indicesMayores);
}
function maximoDiarioNO2ICA($arr1,$arr2,$arr3,$arr4,$arr5) {
	include("get_datetime.php");
	$hour24 = $date->format("H");
	$horas = 24-(24-$hour24);
	for ($i=0; $i<$horas; $i++) {
		if ($arr1[$i] == "Mtto.") {
			$result1[$i] = "Mtto.";
		} elseif (is_numeric($arr1[$i])) {
			$valor = round($arr1[$i],3);
			if ($valor <= 0.043) {
				$result1[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.044 && $valor <= 0.106) {
				$result1[$i] = round((471.1538*($valor-0.022))+51,0);
			} elseif ($valor >= 0.107 && $valor <= 0.430) {
				$result1[$i] = round((223.7443*($valor-0.107))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$result1[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$result1[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$result1[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$result1[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$result1[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr2[$i] == "Mtto.") {
			$result2[$i] = "Mtto.";
		} elseif (is_numeric($arr2[$i])) {
			$valor = round($arr2[$i],3);
			if ($valor <= 0.043) {
				$result2[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.044 && $valor <= 0.106) {
				$result2[$i] = round((471.1538*($valor-0.022))+51,0);
			} elseif ($valor >= 0.107 && $valor <= 0.430) {
				$result2[$i] = round((223.7443*($valor-0.107))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$result2[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$result2[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$result2[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$result2[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$result2[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr3[$i] == "Mtto.") {
			$result3[$i] = "Mtto.";
		} elseif (is_numeric($arr3[$i])) {
			$valor = round($arr3[$i],3);
			if ($valor <= 0.043) {
				$result3[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.044 && $valor <= 0.106) {
				$result3[$i] = round((471.1538*($valor-0.022))+51,0);
			} elseif ($valor >= 0.107 && $valor <= 0.430) {
				$result3[$i] = round((223.7443*($valor-0.107))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$result3[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$result3[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$result3[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$result3[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$result3[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr4[$i] == "Mtto.") {
			$result4[$i] = "Mtto.";
		} elseif (is_numeric($arr4[$i])) {
			$valor = round($arr4[$i],3);
			if ($valor <= 0.043) {
				$result4[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.044 && $valor <= 0.106) {
				$result4[$i] = round((471.1538*($valor-0.022))+51,0);
			} elseif ($valor >= 0.107 && $valor <= 0.430) {
				$result4[$i] = round((223.7443*($valor-0.107))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$result4[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$result4[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$result4[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$result4[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$result4[$i] = "F.O.";
		}
	}
	for ($i=0; $i<$horas; $i++) {
		if ($arr5[$i] == "Mtto.") {
			$result5[$i] = "Mtto.";
		} elseif (is_numeric($arr5[$i])) {
			$valor = round($arr5[$i],3);
			if ($valor <= 0.043) {
				$result5[$i] = round((476.1905*($valor-0))+0,0);
			} elseif ($valor >= 0.044 && $valor <= 0.106) {
				$result5[$i] = round((471.1538*($valor-0.022))+51,0);
			} elseif ($valor >= 0.107 && $valor <= 0.430) {
				$result5[$i] = round((223.7443*($valor-0.107))+101,0);
			} elseif ($valor>=0.431 && $valor<=0.649) {
				$result5[$i] = round((224.7706*($valor-0.431))+151,0);
			} elseif ($valor >= 0.650 && $valor <= 1.249) {
				$result5[$i] = round((165.2755*($valor-0.650))+201,0);
			} elseif ($valor >= 1.250 && $valor <= 1.649) {
				$result5[$i] = round((248.1203*($valor-1.250))+301,0);
			} elseif ($valor >= 1.650 && $valor <= 2.049) {
				$result5[$i] = round((248.1203*($valor-1.650))+401,0);
			}
		} else {
			$result5[$i] = "F.O.";
		}
	}
	$solonumeros1 = [];
	for ($i=0; $i < count($result1); $i++) {
		$dato1 = $result1[$i];
		if (is_numeric($dato1)) { $solonumeros1[$i] = $dato1; }
	}
	$solonumeros2 = [];
	for ($i=0; $i < count($result2); $i++) {
		$dato2 = $result2[$i];
		if (is_numeric($dato2)) { $solonumeros2[$i] = $dato2; }
	}
	$solonumeros3 = [];
	for ($i=0; $i < count($result3); $i++) {
		$dato3 = $result3[$i];
		if (is_numeric($dato3)) { $solonumeros3[$i] = $dato3; }
	}
	$solonumeros4 = [];
	for ($i=0; $i < count($result4); $i++) {
		$dato4 = $result4[$i];
		if (is_numeric($dato4)) { $solonumeros4[$i] = $dato4; }
	}
	$solonumeros5 = [];
	for ($i=0; $i < count($result5); $i++) {
		$dato5 = $result5[$i];
		if (is_numeric($dato5)) { $solonumeros5[$i] = $dato5; }
	}

	if (empty($solonumeros1)) { $solonumeros1[0] = "F.O."; }
	if (empty($solonumeros2)) { $solonumeros2[0] = "F.O."; }
	if (empty($solonumeros3)) { $solonumeros3[0] = "F.O."; }
	if (empty($solonumeros4)) { $solonumeros4[0] = "F.O."; }
	if (empty($solonumeros5)) { $solonumeros5[0] = "F.O."; }

	sort($solonumeros1, SORT_NUMERIC);
	sort($solonumeros2, SORT_NUMERIC);
	sort($solonumeros3, SORT_NUMERIC);
	sort($solonumeros4, SORT_NUMERIC);
	sort($solonumeros5, SORT_NUMERIC);

	$indicesMayores = array(end($solonumeros1),end($solonumeros2),end($solonumeros3),end($solonumeros4),end($solonumeros5));
	sort($indicesMayores, SORT_NUMERIC);
	return end($indicesMayores);
}
function maximoDiarioCOICA($arr1,$arr2,$arr3,$arr4,$arr5) {
	include("get_datetime.php");
	$hour24 = $date->format("H");
	$horas = 24-(24-$hour24);
	$numValores = 8;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr1[$i];
		$ar2 = $arr1[$i+1];
		$ar3 = $arr1[$i+2];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result1[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp") {
			$result1[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr1[$j])) {
					$temp = $temp + $arr1[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$result1[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.6 && $valor <= 9.0) {
					$result1[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 9.1 && $valor <= 13.0) {
					$result1[$i] = round((25.7895*($valor-9.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$result1[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$result1[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$result1[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$result1[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$result1[$i] = "D.I.";
			}
		} else {
			$result1[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr1[$i]);
	}
	$numValores = 8;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr2[$i];
		$ar2 = $arr2[$i+1];
		$ar3 = $arr2[$i+2];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result2[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp") {
			$result2[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr2[$j])) {
					$temp = $temp + $arr2[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$result2[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.6 && $valor <= 9.0) {
					$result2[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 9.1 && $valor <= 13.0) {
					$result2[$i] = round((25.7895*($valor-9.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$result2[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$result2[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$result2[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$result2[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$result2[$i] = "D.I.";
			}
		} else {
			$result2[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr2[$i]);
	}
	$numValores = 8;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr3[$i];
		$ar2 = $arr3[$i+1];
		$ar3 = $arr3[$i+2];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result3[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp") {
			$result3[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr3[$j])) {
					$temp = $temp + $arr3[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$result3[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.6 && $valor <= 9.0) {
					$result3[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 9.1 && $valor <= 13.0) {
					$result3[$i] = round((25.7895*($valor-9.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$result3[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$result3[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$result3[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$result3[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$result3[$i] = "D.I.";
			}
		} else {
			$result3[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr3[$i]);
	}
	$numValores = 8;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr4[$i];
		$ar2 = $arr4[$i+1];
		$ar3 = $arr4[$i+2];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result4[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp") {
			$result4[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr4[$j])) {
					$temp = $temp + $arr4[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$result4[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.6 && $valor <= 9.0) {
					$result4[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 9.1 && $valor <= 13.0) {
					$result4[$i] = round((25.7895*($valor-9.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$result4[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$result4[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$result4[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$result4[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$result4[$i] = "D.I.";
			}
		} else {
			$result4[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr4[$i]);
	}
	$numValores = 8;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr5[$i];
		$ar2 = $arr5[$i+1];
		$ar3 = $arr5[$i+2];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result5[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp") {
			$result5[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr5[$j])) {
					$temp = $temp + $arr5[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round($temp/$contador,2);
				if ($valor <= 5.50) {
					$result5[$i] = round((9.0909*($valor-0))+0,0);
				} elseif ($valor >= 5.6 && $valor <= 9.0) {
					$result5[$i] = round((9.741*($valor-5.6))+51,0);
				} elseif ($valor >= 9.1 && $valor <= 13.0) {
					$result5[$i] = round((25.7895*($valor-9.1))+101,0);
				} elseif ($valor >= 13.1 && $valor <= 15.4) {
					$result5[$i] = round((21.3043*($valor-13.1))+151,0);
				} elseif ($valor >= 15.5 && $valor <= 30.4) {
					$result5[$i] = round((6.6443*($valor-15.5))+201,2);
				} elseif ($valor >= 30.5 && $valor <= 40.4) {
					$result5[$i] = round((10.0000*($valor-30.5))+301,2);
				} elseif ($valor >= 40.5 && $valor <= 50.4) {
					$result5[$i] = round((10.0000*($valor-40.5))+401,2);
				}
			} else {
				$result5[$i] = "D.I.";
			}
		} else {
			$result5[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr5[$i]);
	}

	$solonumeros1 = [];
	for ($i=0; $i < count($result1); $i++) {
		$dato1 = $result1[$i];
		if (is_numeric($dato1)) { $solonumeros1[$i] = $dato1; }
	}
	$solonumeros2 = [];
	for ($i=0; $i < count($result2); $i++) {
		$dato2 = $result2[$i];
		if (is_numeric($dato2)) { $solonumeros2[$i] = $dato2; }
	}
	$solonumeros3 = [];
	for ($i=0; $i < count($result3); $i++) {
		$dato3 = $result3[$i];
		if (is_numeric($dato3)) { $solonumeros3[$i] = $dato3; }
	}
	$solonumeros4 = [];
	for ($i=0; $i < count($result4); $i++) {
		$dato4 = $result4[$i];
		if (is_numeric($dato4)) { $solonumeros4[$i] = $dato4; }
	}
	$solonumeros5 = [];
	for ($i=0; $i < count($result5); $i++) {
		$dato5 = $result5[$i];
		if (is_numeric($dato5)) { $solonumeros5[$i] = $dato5; }
	}

	if (empty($solonumeros1)) { $solonumeros1[0] = "F.O."; }
	if (empty($solonumeros2)) { $solonumeros2[0] = "F.O."; }
	if (empty($solonumeros3)) { $solonumeros3[0] = "F.O."; }
	if (empty($solonumeros4)) { $solonumeros4[0] = "F.O."; }
	if (empty($solonumeros5)) { $solonumeros5[0] = "F.O."; }

	sort($solonumeros1, SORT_NUMERIC);
	sort($solonumeros2, SORT_NUMERIC);
	sort($solonumeros3, SORT_NUMERIC);
	sort($solonumeros4, SORT_NUMERIC);
	sort($solonumeros5, SORT_NUMERIC);

	$indicesMayores = array(end($solonumeros1),end($solonumeros2),end($solonumeros3),end($solonumeros4),end($solonumeros5));
	sort($indicesMayores, SORT_NUMERIC);
	return end($indicesMayores);
}
function maximoDiarioSO2ICA($arr1,$arr2,$arr3,$arr4,$arr5) {
	include("get_datetime.php");
	$hour24 = $date->format("H");
	$horas = 24-(24-$hour24);
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr1[$i];
		$ar2 = $arr1[$i+1];
		$ar3 = $arr1[$i+2];
		$ar4 = $arr1[$i+3];
		$ar5 = $arr1[$i+4];
		$ar6 = $arr1[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result1[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result1[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr1[$j])) {
					$temp = $temp + $arr1[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$result1[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.040) {
					$result1[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.041 && $valor <= 0.207) {
					$result1[$i] = round((510.4167*($valor-0.041))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$result1[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$result1[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$result1[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$result1[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$result1[$i] = "D.I.";
			}
		} else {
			$result1[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr1[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr2[$i];
		$ar2 = $arr2[$i+1];
		$ar3 = $arr2[$i+2];
		$ar4 = $arr2[$i+3];
		$ar5 = $arr2[$i+4];
		$ar6 = $arr2[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result2[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result2[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr2[$j])) {
					$temp = $temp + $arr2[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$result2[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.040) {
					$result2[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.041 && $valor <= 0.207) {
					$result2[$i] = round((510.4167*($valor-0.041))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$result2[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$result2[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$result2[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$result2[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$result2[$i] = "D.I.";
			}
		} else {
			$result2[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr2[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr3[$i];
		$ar2 = $arr3[$i+1];
		$ar3 = $arr3[$i+2];
		$ar4 = $arr3[$i+3];
		$ar5 = $arr3[$i+4];
		$ar6 = $arr3[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result3[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result3[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr3[$j])) {
					$temp = $temp + $arr3[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$result3[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.040) {
					$result3[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.041 && $valor <= 0.207) {
					$result3[$i] = round((510.4167*($valor-0.041))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$result3[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$result3[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$result3[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$result3[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$result3[$i] = "D.I.";
			}
		} else {
			$result3[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr3[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr4[$i];
		$ar2 = $arr4[$i+1];
		$ar3 = $arr4[$i+2];
		$ar4 = $arr4[$i+3];
		$ar5 = $arr4[$i+4];
		$ar6 = $arr4[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result4[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result4[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr4[$j])) {
					$temp = $temp + $arr4[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$result4[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.040) {
					$result4[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.041 && $valor <= 0.207) {
					$result4[$i] = round((510.4167*($valor-0.041))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$result4[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$result4[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$result4[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$result4[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$result4[$i] = "D.I.";
			}
		} else {
			$result4[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr4[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr5[$i];
		$ar2 = $arr5[$i+1];
		$ar3 = $arr5[$i+2];
		$ar4 = $arr5[$i+3];
		$ar5 = $arr5[$i+4];
		$ar6 = $arr5[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result5[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result5[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr5[$j])) {
					$temp = $temp + $arr5[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),3);
				if ($valor <= 0.025) {
					$result5[$i] = round((2000*($valor-0))+0,0);
				} elseif ($valor >= 0.026 && $valor <= 0.040) {
					$result5[$i] = round((583.3333*($valor-0.026))+51,0);
				} elseif ($valor >= 0.041 && $valor <= 0.207) {
					$result5[$i] = round((510.4167*($valor-0.041))+101,0);
				} elseif ($valor >= 0.208 && $valor <= 0.304) {
					$result5[$i] = round((510.4167*($valor-0.208))+151,0);
				} elseif ($valor >= 0.305 && $valor <= 0.604) {
					$result5[$i] = round((331.1037*($valor-0.305))+201,2);
				} elseif ($valor >= 0.605 && $valor <= 0.605) {
					$result5[$i] = round((497.4874*($valor-0.605))+301,2);
				} elseif ($valor >= 0.805 && $valor <= 1.004) {
					$result5[$i] = round((497.4874*($valor-0.805))+401,2);
				}
			} else {
				$result5[$i] = "D.I.";
			}
		} else {
			$result5[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr5[$i]);
	}

	$solonumeros1 = [];
	for ($i=0; $i < count($result1); $i++) {
		$dato1 = $result1[$i];
		if (is_numeric($dato1)) { $solonumeros1[$i] = $dato1; }
	}
	$solonumeros2 = [];
	for ($i=0; $i < count($result2); $i++) {
		$dato2 = $result2[$i];
		if (is_numeric($dato2)) { $solonumeros2[$i] = $dato2; }
	}
	$solonumeros3 = [];
	for ($i=0; $i < count($result3); $i++) {
		$dato3 = $result3[$i];
		if (is_numeric($dato3)) { $solonumeros3[$i] = $dato3; }
	}
	$solonumeros4 = [];
	for ($i=0; $i < count($result4); $i++) {
		$dato4 = $result4[$i];
		if (is_numeric($dato4)) { $solonumeros4[$i] = $dato4; }
	}
	$solonumeros5 = [];
	for ($i=0; $i < count($result5); $i++) {
		$dato5 = $result5[$i];
		if (is_numeric($dato5)) { $solonumeros5[$i] = $dato5; }
	}

	if (empty($solonumeros1)) { $solonumeros1[0] = "F.O."; }
	if (empty($solonumeros2)) { $solonumeros2[0] = "F.O."; }
	if (empty($solonumeros3)) { $solonumeros3[0] = "F.O."; }
	if (empty($solonumeros4)) { $solonumeros4[0] = "F.O."; }
	if (empty($solonumeros5)) { $solonumeros5[0] = "F.O."; }

	sort($solonumeros1, SORT_NUMERIC);
	sort($solonumeros2, SORT_NUMERIC);
	sort($solonumeros3, SORT_NUMERIC);
	sort($solonumeros4, SORT_NUMERIC);
	sort($solonumeros5, SORT_NUMERIC);

	$indicesMayores = array(end($solonumeros1),end($solonumeros2),end($solonumeros3),end($solonumeros4),end($solonumeros5));
	sort($indicesMayores, SORT_NUMERIC);
	return end($indicesMayores);
}
function maximoDiarioPM10ICA($arr1,$arr2,$arr3,$arr4,$arr5) {
	include("get_datetime.php");
	$hour24 = $date->format("H");
	$horas = 24-(24-$hour24);
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr1[$i];
		$ar2 = $arr1[$i+1];
		$ar3 = $arr1[$i+2];
		$ar4 = $arr1[$i+3];
		$ar5 = $arr1[$i+4];
		$ar6 = $arr1[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result1[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result1[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr1[$j])) {
					$temp = $temp + $arr1[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 36) {
					$result1[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 37 && $valor <= 70) {
					$result1[$i] = round((1.4412*($valor-37))+51,0);
				} elseif ($valor >= 71 && $valor <= 214) {
					$result1[$i] = round((0.3551*($valor-71))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$result1[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$result1[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$result1[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$result1[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$result1[$i] = "D.I.";
			}
		} else {
			$result1[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr1[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr2[$i];
		$ar2 = $arr2[$i+1];
		$ar3 = $arr2[$i+2];
		$ar4 = $arr2[$i+3];
		$ar5 = $arr2[$i+4];
		$ar6 = $arr2[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result2[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result2[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr2[$j])) {
					$temp = $temp + $arr2[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 36) {
					$result2[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 37 && $valor <= 70) {
					$result2[$i] = round((1.4412*($valor-37))+51,0);
				} elseif ($valor >= 71 && $valor <= 214) {
					$result2[$i] = round((0.3551*($valor-71))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$result2[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$result2[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$result2[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$result2[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$result2[$i] = "D.I.";
			}
		} else {
			$result2[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr2[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr3[$i];
		$ar2 = $arr3[$i+1];
		$ar3 = $arr3[$i+2];
		$ar4 = $arr3[$i+3];
		$ar5 = $arr3[$i+4];
		$ar6 = $arr3[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result3[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result3[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr3[$j])) {
					$temp = $temp + $arr3[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 36) {
					$result3[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 37 && $valor <= 70) {
					$result3[$i] = round((1.4412*($valor-37))+51,0);
				} elseif ($valor >= 71 && $valor <= 214) {
					$result3[$i] = round((0.3551*($valor-71))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$result3[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$result3[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$result3[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$result3[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$result3[$i] = "D.I.";
			}
		} else {
			$result3[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr3[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr4[$i];
		$ar2 = $arr4[$i+1];
		$ar3 = $arr4[$i+2];
		$ar4 = $arr4[$i+3];
		$ar5 = $arr4[$i+4];
		$ar6 = $arr4[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result4[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result4[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr4[$j])) {
					$temp = $temp + $arr4[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 36) {
					$result4[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 37 && $valor <= 70) {
					$result4[$i] = round((1.4412*($valor-37))+51,0);
				} elseif ($valor >= 71 && $valor <= 214) {
					$result4[$i] = round((0.3551*($valor-71))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$result4[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$result4[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$result4[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$result4[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$result4[$i] = "D.I.";
			}
		} else {
			$result4[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr4[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr5[$i];
		$ar2 = $arr5[$i+1];
		$ar3 = $arr5[$i+2];
		$ar4 = $arr5[$i+3];
		$ar5 = $arr5[$i+4];
		$ar6 = $arr5[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result5[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result5[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr5[$j])) {
					$temp = $temp + $arr5[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 36) {
					$result5[$i] = round((1.25*($valor-0))+0,0);
				} elseif ($valor >= 37 && $valor <= 70) {
					$result5[$i] = round((1.4412*($valor-37))+51,0);
				} elseif ($valor >= 71 && $valor <= 214) {
					$result5[$i] = round((0.3551*($valor-71))+101,0);
				} elseif ($valor >= 215 && $valor <= 354) {
					$result5[$i] = round((0.3525*($valor-215))+151,0);
				} elseif ($valor >= 355 && $valor <= 424) {
					$result5[$i] = round((1.4348*($valor-355))+201,0);
				} elseif ($valor >= 425 && $valor <= 504) {
					$result5[$i] = round((1.2532*($valor-425))+301,0);
				} elseif ($valor >= 505 && $valor <= 604) {
					$result5[$i] = round((1.0000*($valor-505))+401,0);
				}
			} else {
				$result5[$i] = "D.I.";
			}
		} else {
			$result5[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr5[$i]);
	}

	$solonumeros1 = [];
	for ($i=0; $i < count($result1); $i++) {
		$dato1 = $result1[$i];
		if (is_numeric($dato1)) { $solonumeros1[$i] = $dato1; }
	}
	$solonumeros2 = [];
	for ($i=0; $i < count($result2); $i++) {
		$dato2 = $result2[$i];
		if (is_numeric($dato2)) { $solonumeros2[$i] = $dato2; }
	}
	$solonumeros3 = [];
	for ($i=0; $i < count($result3); $i++) {
		$dato3 = $result3[$i];
		if (is_numeric($dato3)) { $solonumeros3[$i] = $dato3; }
	}
	$solonumeros4 = [];
	for ($i=0; $i < count($result4); $i++) {
		$dato4 = $result4[$i];
		if (is_numeric($dato4)) { $solonumeros4[$i] = $dato4; }
	}
	$solonumeros5 = [];
	for ($i=0; $i < count($result5); $i++) {
		$dato5 = $result5[$i];
		if (is_numeric($dato5)) { $solonumeros5[$i] = $dato5; }
	}

	if (empty($solonumeros1)) { $solonumeros1[0] = "F.O."; }
	if (empty($solonumeros2)) { $solonumeros2[0] = "F.O."; }
	if (empty($solonumeros3)) { $solonumeros3[0] = "F.O."; }
	if (empty($solonumeros4)) { $solonumeros4[0] = "F.O."; }
	if (empty($solonumeros5)) { $solonumeros5[0] = "F.O."; }

	sort($solonumeros1, SORT_NUMERIC);
	sort($solonumeros2, SORT_NUMERIC);
	sort($solonumeros3, SORT_NUMERIC);
	sort($solonumeros4, SORT_NUMERIC);
	sort($solonumeros5, SORT_NUMERIC);

	$indicesMayores = array(end($solonumeros1),end($solonumeros2),end($solonumeros3),end($solonumeros4),end($solonumeros5));
	sort($indicesMayores, SORT_NUMERIC);
	return end($indicesMayores);
}
function maximoDiarioPM25ICA($arr1,$arr2,$arr3,$arr4,$arr5) {
	include("get_datetime.php");
	$hour24 = $date->format("H");
	$horas = 24-(24-$hour24);
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr1[$i];
		$ar2 = $arr1[$i+1];
		$ar3 = $arr1[$i+2];
		$ar4 = $arr1[$i+3];
		$ar5 = $arr1[$i+4];
		$ar6 = $arr1[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result1[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result1[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr1[$j])) {
					$temp = $temp + $arr1[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 10) {
					$result1[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 10.1 && $valor <= 41) {
					$result1[$i] = round((1.4894*($valor-10.1))+51,0);
				} elseif ($valor >= 41.1 && $valor <= 97.4) {
					$result1[$i] = round((0.9369*($valor-41.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$result1[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$result1[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$result1[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$result1[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$result1[$i] = "D.I.";
			}
		} else {
			$result1[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr1[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr2[$i];
		$ar2 = $arr2[$i+1];
		$ar3 = $arr2[$i+2];
		$ar4 = $arr2[$i+3];
		$ar5 = $arr2[$i+4];
		$ar6 = $arr2[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result2[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result2[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr2[$j])) {
					$temp = $temp + $arr2[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 10) {
					$result2[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 10.1 && $valor <= 41) {
					$result2[$i] = round((1.4894*($valor-10.1))+51,0);
				} elseif ($valor >= 41.1 && $valor <= 97.4) {
					$result2[$i] = round((0.9369*($valor-41.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$result2[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$result2[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$result2[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$result2[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$result2[$i] = "D.I.";
			}
		} else {
			$result2[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr2[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr3[$i];
		$ar2 = $arr3[$i+1];
		$ar3 = $arr3[$i+2];
		$ar4 = $arr3[$i+3];
		$ar5 = $arr3[$i+4];
		$ar6 = $arr3[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result3[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result3[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr3[$j])) {
					$temp = $temp + $arr3[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 10) {
					$result3[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 10.1 && $valor <= 41) {
					$result3[$i] = round((1.4894*($valor-10.1))+51,0);
				} elseif ($valor >= 41.1 && $valor <= 97.4) {
					$result3[$i] = round((0.9369*($valor-41.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$result3[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$result3[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$result3[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$result3[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$result3[$i] = "D.I.";
			}
		} else {
			$result3[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr3[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr4[$i];
		$ar2 = $arr4[$i+1];
		$ar3 = $arr4[$i+2];
		$ar4 = $arr4[$i+3];
		$ar5 = $arr4[$i+4];
		$ar6 = $arr4[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result4[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result4[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr4[$j])) {
					$temp = $temp + $arr4[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 5) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 10) {
					$result4[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 10.1 && $valor <= 41) {
					$result4[$i] = round((1.4894*($valor-10.1))+51,0);
				} elseif ($valor >= 41.1 && $valor <= 97.4) {
					$result4[$i] = round((0.9369*($valor-41.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$result4[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$result4[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$result4[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$result4[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$result4[$i] = "D.I.";
			}
		} else {
			$result4[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr4[$i]);
	}
	$numValores = 24;
	$valor = 0;
	for ($i=0; $i<$horas; $i++) {
		$ar1 = $arr5[$i];
		$ar2 = $arr5[$i+1];
		$ar3 = $arr5[$i+2];
		$ar4 = $arr5[$i+3];
		$ar5 = $arr5[$i+4];
		$ar6 = $arr5[$i+5];
		if ($ar1=="Mtto." && $ar2=="Mtto." && $ar3=="Mtto.") {
			$result5[$i] = "Mtto.";
		} elseif ($ar1=="Samp" && $ar2=="Samp" && $ar3=="Samp" && $ar4=="Samp" && $ar5=="Samp" && $ar6=="Samp") {
			$result5[$i] = "D.I.";
		} elseif (is_numeric($ar1) || is_numeric($ar2) || is_numeric($ar3) || is_numeric($ar4) || is_numeric($ar5) || is_numeric($ar6)) {
			$temp = 0;
			$contador = 0;
			for ($j=$i; $j<$numValores; $j++) {
				if (is_numeric($arr5[$j])) {
					$temp = $temp + $arr5[$j];
					$contador = $contador + 1;
				}
			}
			if ($contador > 17) {
				$valor = round(($temp/$contador),0);
				if ($valor <= 10) {
					$result5[$i] = round((4.1667*($valor-0))+0,0);
				} elseif ($valor >= 10.1 && $valor <= 41) {
					$result5[$i] = round((1.4894*($valor-10.1))+51,0);
				} elseif ($valor >= 41.1 && $valor <= 97.4) {
					$result5[$i] = round((0.9369*($valor-41.1))+101,0);
				} elseif ($valor >= 97.5 && $valor <= 150.4) {
					$result5[$i] = round((0.9263*($valor-97.5))+151,0);
				} elseif ($valor >= 150.5 && $valor <= 250.4) {
					$result5[$i] = round((0.9910*($valor-150.5))+201,0);
				} elseif ($valor >= 250.5 && $valor <= 350.4) {
					$result5[$i] = round((0.9910*($valor-250.5))+301,0);
				} elseif ($valor >= 350.5 && $valor <= 500.4) {
					$result5[$i] = round((0.6604*($valor-350.5))+401,0);
				}
			} else {
				$result5[$i] = "D.I.";
			}
		} else {
			$result5[$i] = "F.O.";
		}
		$numValores = $numValores + 1;
		unset($arr5[$i]);
	}

	$solonumeros1 = [];
	for ($i=0; $i < count($result1); $i++) {
		$dato1 = $result1[$i];
		if (is_numeric($dato1)) { $solonumeros1[$i] = $dato1; }
	}
	$solonumeros2 = [];
	for ($i=0; $i < count($result2); $i++) {
		$dato2 = $result2[$i];
		if (is_numeric($dato2)) { $solonumeros2[$i] = $dato2; }
	}
	$solonumeros3 = [];
	for ($i=0; $i < count($result3); $i++) {
		$dato3 = $result3[$i];
		if (is_numeric($dato3)) { $solonumeros3[$i] = $dato3; }
	}
	$solonumeros4 = [];
	for ($i=0; $i < count($result4); $i++) {
		$dato4 = $result4[$i];
		if (is_numeric($dato4)) { $solonumeros4[$i] = $dato4; }
	}
	$solonumeros5 = [];
	for ($i=0; $i < count($result5); $i++) {
		$dato5 = $result5[$i];
		if (is_numeric($dato5)) { $solonumeros5[$i] = $dato5; }
	}

	if (empty($solonumeros1)) { $solonumeros1[0] = "F.O."; }
	if (empty($solonumeros2)) { $solonumeros2[0] = "F.O."; }
	if (empty($solonumeros3)) { $solonumeros3[0] = "F.O."; }
	if (empty($solonumeros4)) { $solonumeros4[0] = "F.O."; }
	if (empty($solonumeros5)) { $solonumeros5[0] = "F.O."; }

	sort($solonumeros1, SORT_NUMERIC);
	sort($solonumeros2, SORT_NUMERIC);
	sort($solonumeros3, SORT_NUMERIC);
	sort($solonumeros4, SORT_NUMERIC);
	sort($solonumeros5, SORT_NUMERIC);

	$indicesMayores = array(end($solonumeros1),end($solonumeros2),end($solonumeros3),end($solonumeros4),end($solonumeros5));
	sort($indicesMayores, SORT_NUMERIC);
	
	return end($indicesMayores);
}
//Funciones para información de reporte 3 exporta en word y pdf
function reportePromedioParticulas($arr) {
	$cont=0; $suma=0;
	$maximo = maximoActualHorario5($arr);
	if ($maximo>=301 && $maximo<=500) {
		for ($i=0; $i<count($arr); $i++) {
			if (is_numeric($arr[$i]) && $arr[$i]>=301 && $arr[$i]<=500) {
				$suma = $suma + $arr[$i];
				$cont++;
			}
		}
	}
	if ($maximo>=201 && $maximo<=300) {
		for ($i=0; $i<count($arr); $i++) {
			if (is_numeric($arr[$i]) && $arr[$i]>=201 && $arr[$i]<=300) {
				$suma = $suma + $arr[$i];
				$cont++;
			}
		}
	}
	if ($maximo>=151 && $maximo<=200) {
		for ($i=0; $i<count($arr); $i++) {
			if (is_numeric($arr[$i]) && $arr[$i]>=151 && $arr[$i]<=200) {
				$suma = $suma + $arr[$i];
				$cont++;
			}
		}
	}
	if ($maximo>=101 && $maximo<=150) {
		for ($i=0; $i<count($arr); $i++) {
			if (is_numeric($arr[$i]) && $arr[$i]>=101 && $arr[$i]<=150) {
				$suma = $suma + $arr[$i];
				$cont++;
			}
		}
	}
	if ($maximo>=51 && $maximo<=100) {
		for ($i=0; $i<count($arr); $i++) {
			if (is_numeric($arr[$i]) && $arr[$i]>=51 && $arr[$i]<=100) {
				$suma = $suma + $arr[$i];
				$cont++;
			}
		}
	}
	if ($maximo>=0 && $maximo<=50) {
		for ($i=0; $i<count($arr); $i++) {
			if (is_numeric($arr[$i]) && $arr[$i]>=0 && $arr[$i]<=50) {
				$suma = $suma + $arr[$i];
				$cont++;
			}
		}
	}
	if ($suma > 0) {
		$promedio = round($suma/$cont,0);
	} else {
		$promedio = "D.I.";
	}

	return $promedio;
}
function coloresEspecifico($O3,$NO2,$CO,$SO2,$PM10,$PM25,$nombreMunicipio){
	//Contaminantes marrones
		$contaminantesMarrones="";
		if ($O3>=301 && $O3<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones ="Ozono (O<sub>3</sub>)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=301 && $NO2<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=301 && $CO<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "Monóxido de Carbono (CO)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=301 && $SO2<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=301 && $PM10<=500) {
			if (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=301 && $PM25<=500) {
			if ($PM10>=301 && $PM10<=500) {
				$contaminantesMarrones = $contaminantesMarrones." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminantesMarrones)) {
				$contaminantesMarrones = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminantesMarrones = $contaminantesMarrones.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	//Contaminantes morados
		$contaminantesMorados="";
		if ($O3>=201 && $O3<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=201 && $NO2<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=201 && $CO<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "Monóxido de Carbono (CO)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=201 && $SO2<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=201 && $PM10<=300) {
			if (empty($contaminantesMorados)) {
				$contaminantesMorados = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=201 && $PM25<=300) {
			if ($PM10>=201 && $PM10<=300) {
				$contaminantesMorados = $contaminantesMorados." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminantesMorados)) {
				$contaminantesMorados = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminantesMorados = $contaminantesMorados.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	//Contaminantes rojos
		$contaminantesRojos="";
		if ($O3>=151 && $O3<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=151 && $NO2<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=151 && $CO<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "Monóxido de Carbono (CO)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=151 && $SO2<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=151 && $PM10<=200) {
			if (empty($contaminantesRojos)) {
				$contaminantesRojos = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=151 && $PM25<=200) {
			if ($PM10>=151 && $PM10<=200) {
				$contaminantesRojos = $contaminantesRojos." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminantesRojos)) {
				$contaminantesRojos = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminantesRojos = $contaminantesRojos.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	//Contaminantes naranjas
		$contaminantesNaranjas="";
		if ($O3>=101 && $O3<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=101 && $NO2<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=101 && $CO<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "Monóxido de Carbono (CO)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=101 && $SO2<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=101 && $PM10<=150) {
			if (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=101 && $PM25<=150) {
			if ($PM10>=101 && $PM10<=150) {
				$contaminantesNaranjas = $contaminantesNaranjas." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminantesNaranjas)) {
				$contaminantesNaranjas = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminantesNaranjas = $contaminantesNaranjas.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	//Contaminantes amarillos
		$contaminantesAmarillos="";
		if ($O3>=51 && $O3<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=51 && $NO2<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=51 && $CO<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "Monóxido de Carbono (CO)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=51 && $SO2<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=51 && $PM10<=100) {
			if (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=51 && $PM25<=100) {
			if ($PM10>=51 && $PM10<=100) {
				$contaminantesAmarillos = $contaminantesAmarillos." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminantesAmarillos)) {
				$contaminantesAmarillos = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminantesAmarillos = $contaminantesAmarillos.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	//Contaminantes verdes
		$contaminantesVerdes="";
		if ($O3>=0 && $O3<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "Ozono (O<sub>3</sub>)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", Ozono (O<sub>3</sub>)";
			}
		}
		if ($NO2>=0 && $NO2<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "Dióxido de Nitrógeno (NO<sub>2</sub>)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", Dióxido de Nitrógeno (NO<sub>2</sub>)";
			}
		}
		if ($CO>=0 && $CO<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "Monóxido de Carbono (CO)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", Monóxido de Carbono (CO)";
			}
		}
		if ($SO2>=0 && $SO2<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "Dióxido de Azufre (SO<sub>2</sub>)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", Dióxido de Azufre (SO<sub>2</sub>)";
			}
		}
		if ($PM10>=0 && $PM10<=50) {
			if (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "Partículas menores a 10 micras (PM-10)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", Partículas menores a 10 micras (PM-10)";
			}
		}
		if ($PM25>=0 && $PM25<=50) {
			if ($PM10>=0 && $PM10<=50) {
				$contaminantesVerdes = $contaminantesVerdes." y 2.5 micras (PM-2.5)";
			} elseif (empty($contaminantesVerdes)) {
				$contaminantesVerdes = "Partículas menores a 2.5 micras (PM-2.5)";
			} else {
				$contaminantesVerdes = $contaminantesVerdes.", Partículas menores a 2.5 micras (PM-2.5)";
			}
		}
	//Contaminantes ordenados
		$contaminantesColores = "";
		if (!empty($contaminantesVerdes)) {
			if (empty($contaminantesColores)) {
				$contaminantesColores = $contaminantesVerdes;
			} else {
				$contaminantesColores = $contaminantesColores."; ".$contaminantesVerdes;
			}
			$contaminantesColores = $contaminantesColores." presenta condiciones favorables";
		}
		if (!empty($contaminantesAmarillos)) {
			if (empty($contaminantesColores)) {
				$contaminantesColores = $contaminantesAmarillos;
			} else {
				$contaminantesColores = $contaminantesColores."; ".$contaminantesAmarillos;
			}
			$contaminantesColores = $contaminantesColores." presenta condiciones regulares";
		}
		if (!empty($contaminantesNaranjas)) {
			if (empty($contaminantesColores)) {
				$contaminantesColores = $contaminantesNaranjas;
			} else {
				$contaminantesColores = $contaminantesColores."; ".$contaminantesNaranjas;
			}
			$contaminantesColores = $contaminantesColores." presenta condiciones malas";
		}
		if (!empty($contaminantesRojos)) {
			if (empty($contaminantesColores)) {
				$contaminantesColores = $contaminantesRojos;
			} else {
				$contaminantesColores = $contaminantesColores."; ".$contaminantesRojos;
			}
			$contaminantesColores = $contaminantesColores." presenta condiciones muy malas";
		}
		if (!empty($contaminantesMorados)) {
			if (empty($contaminantesColores)) {
				$contaminantesColores = $contaminantesMorados;
			} else {
				$contaminantesColores = $contaminantesColores."; ".$contaminantesMorados;
			}
			$contaminantesColores = $contaminantesColores." presenta condiciones extremadamente malas";
		}
		if (!empty($contaminantesMarrones)) {
			if (empty($contaminantesColores)) {
				$contaminantesColores = $contaminantesMarrones;
			} else {
				$contaminantesColores = $contaminantesColores."; ".$contaminantesMarrones;
			}
			$contaminantesColores = $contaminantesColores." presenta condiciones peligrosas";
		}
		if (empty($contaminantesColores)) {
			$contaminantesColores = " presenta datos insuficientes para presentar un diagnóstico";
		}
		$contaminantesColores = "Para el municipio de ".$nombreMunicipio.": ".$contaminantesColores.".";

	return $contaminantesColores;
}
function recomendacionEspecifico($calidad,$nombreMunicipio) {
	$zona="";

	if (empty($zona)) { //TODO D.I.
		if ($calidad == "D.I.") {
			$zona = "Presenta datos insuficientes para presentar las recomendaciones.";
		}
	}
	if (empty($zona)) { //PELIGROSA
		if ($calidad == "PELIGROSA") {
			$zona = "Suspender las actividades al aire libre.";
		}
	}
	if (empty($zona)) { //EXTREMADAMENTE MALA
		if ($calidad == "EXTREMADAMENTE MALA") {
			$zona = "Toda la población debe evitar la exposición al aire libre.";
		}
	}
	if (empty($zona)) { //MUY MALA
		if ($calidad == "MUY MALA") {
			$zona = "Se recomienda que los niños, adultos mayores, personas que realizan actividad física intensa o con enfermedades respiratorias y cardiovasculares, deben evitar la exposición al aire libre y el resto de la población deben limitar la exposición al aire libre.";
		}
	}
	if (empty($zona)) { //MALA
		if ($calidad == "MALA") {
			$zona = "Los niños, adultos mayores, personas que realizan actividad física intensa o con enfermedades respiratorias y cardiovasculares, deben evitar la exposición al aire libre y el resto de la población deben limitar la exposición al aire libre."; 
		}
	}
	if (empty($zona)) { //REGULAR
		if ($calidad == "REGULAR") {
			$zona = "Las personas que son extremadamente susceptibles a la contaminación deben considerar limitar la exposición al aire libre.";
		}
	}
	if (empty($zona)) { //BUENA
		if ($calidad == "BUENA") {
			$zona = "Se puede realizar cualquier actividad al aire libre.";
		}
	}

	return $zona;
}
function calidaddelaire_flags($calidad,$nombreMunicipio) {
	$zona="";

	if (empty($zona)) { //TODO D.I.
		if ($calidad == "D.I.") {
			$zona = $nombreMunicipio.": D.I.";
		}
	}
	if (empty($zona)) { //PELIGROSA
		if ($calidad == "PELIGROSA") {
			$zona = $nombreMunicipio.": PELIGROSA (bandera marrón)";
		}
	}
	if (empty($zona)) { //EXTREMADAMENTE MALA
		if ($calidad == "EXTREMADAMENTE MALA") {
			$zona = $nombreMunicipio.": EXTREMADAMENTE MALA (bandera morada)";
		}
	}
	if (empty($zona)) { //MUY MALA
		if ($calidad == "MUY MALA") {
			$zona = $nombreMunicipio.": MUY MALA (bandera roja)";
		}
	}
	if (empty($zona)) { //MALA
		if ($calidad == "MALA") {
			$zona = $nombreMunicipio.": MALA (bandera naranja)"; 
		}
	}
	if (empty($zona)) { //REGULAR
		if ($calidad == "REGULAR") {
			$zona = $nombreMunicipio.": REGULAR (bandera amarilla)";
		}
	}
	if (empty($zona)) { //BUENA
		if ($calidad == "BUENA") {
			$zona = $nombreMunicipio.": BUENA (bandera verde)";
		}
	}

	return $zona;
}
function get_calidaddelaire_flags($calidad) {
	$flag="";

	if (empty($flag)) { //TODO D.I.
		if ($calidad == "D.I.") {
			$flag = "D.I.";
		}
	}
	if (empty($flag)) { //PELIGROSA
		if ($calidad == "PELIGROSA") {
			$flag ="PELIGROSA (bandera marrón)";
		}
	}
	if (empty($flag)) { //EXTREMADAMENTE MALA
		if ($calidad == "EXTREMADAMENTE MALA") {
			$flag = "EXTREMADAMENTE MALA (bandera morada)";
		}
	}
	if (empty($flag)) { //MUY MALA
		if ($calidad == "MUY MALA") {
			$flag = "MUY MALA (bandera roja)";
		}
	}
	if (empty($flag)) { //MALA
		if ($calidad == "MALA") {
			$flag = "MALA (bandera naranja)"; 
		}
	}
	if (empty($flag)) { //REGULAR
		if ($calidad == "REGULAR") {
			$flag = "REGULAR (bandera amarilla)";
		}
	}
	if (empty($flag)) { //BUENA
		if ($calidad == "BUENA") {
			$flag = "BUENA (bandera verde)";
		}
	}

	return $flag;
}
?>