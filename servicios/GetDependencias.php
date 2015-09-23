<?php
require_once('./conexion.php');
// $tipo=$_GET["tipo"];
$query_sql="select id,dependencia from administrativa.p_dependencias p order by 2";		



$query_sql="SELECT array_to_json(array_agg(json))
FROM ( ".$query_sql." 
) json";



//echo $query_sql;

$resultado = pg_query($cx, $query_sql) or die(pg_last_error());
$total_filas = pg_num_rows($resultado);

while ($fila_vertical = pg_fetch_assoc($resultado)) {
	$row_to_json = $fila_vertical['array_to_json'];							
	echo $row_to_json;
}	
// Liberando el conjunto de resultados
pg_free_result($resultado);

// Cerrando la conexión
pg_close($cx);
?>
