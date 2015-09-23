<?php
require_once('./conexion.php');
$fechaini=$_GET["fechaini"];
$fechafin=$_GET["fechafin"];
$depen_nom=$_GET["depen_nom"];
$depen_id=$_GET["depen_id"];

/*	    depen_nom:depen_nom,
	    depen_id:depen_id	*/	
if(strlen(trim($fechaini)) > 0 and strlen(trim($fechafin)) > 0){		
	$query_sql="
	select dep.dependencia,count(*) from administrativa.h_visitas vis
		inner join administrativa.p_dependencias dep
		on vis.id_dependencia = dep.id
	where fecha>='$fechaini' and fecha<='$fechafin' and $depen_nom = $depen_id
	group by dep.dependencia order by 2 desc
	";		
	
	
	
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
}
?>
