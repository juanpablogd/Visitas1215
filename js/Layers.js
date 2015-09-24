

/**
 *Funciones de carga de layers  
*/
var peticionjsonp=function(esquema,layer,funcioncarga,viewparams){
    var url = glo.geoserver+esquema+'/ows?service=WFS&' +
    'version=1.0.0&request=GetFeature&typeName='+esquema+':'+layer+
    '&outputFormat=text/javascript&format_options=' +funcioncarga+
    '&srsname=EPSG:900913';
    waitingDialog.show();
    featureOverlay.getSource().clear();    
    featureOverlay1.getSource().clear();
    
    if(viewparams){url+=viewparams;} 
    $.ajax({
      url: url,
      dataType: 'jsonp'
    });    
};



var peticionjsonpCundi=function(viewparams){
    var url = './servicios/GetVisitasSecretarias.php?' +viewparams;
    
    console.log(url);
    $.getJSON( url, function( data ) {
      $('#DivListaDependencia').empty().append('<div id="ListaDependencia"><ul class="chat"></ul></div>');
      $.each( data, function( key, val ) {

        var html='<li class="left">' +
                       '<div class="clearfix " >' +
<<<<<<< HEAD
                         '<button type="button" class="btn btn-default text-left" style="width:310px"><span class="badge">'+val.count+'</span> '+val.dependencia+'</button>'+
=======
                         '<button type="button" class="btn btn-default" style="width:310px">'+val.dependencia+'   <span class="badge">'+val.count+'</span></button>'+
>>>>>>> origin/master
                        '</div>' +
                  '</li>';
        $("#ListaDependencia .chat").append(html);
      });
      $('#ListaDependencia').searchable({
          searchField: '#searchDependencia',
          selector: 'li',
          childSelector: '.clearfix',
          show: function (elem) {
              elem.slideDown(100);
          },
          hide: function (elem) {
              elem.slideUp(100);
          }
      });
    });   

    
};
var removerfeatures=function(_vectorsource){
    var nombre,i;
    var features=_vectorsource.getFeatures();
    if(features.length>0){
        for(i=0;i<features.length;i++){
            _vectorsource.removeFeature(features[i]);
        }
    }
    
};

var RecorrerGeoJson=function(response){
	var NewGeoJson=$.extend( {}, response);
	//console.log(NewGeoJson);
	var NewGeoJsonRemove=turf.remove(NewGeoJson,glo.varMapeo,0);
	var lgGJson=NewGeoJsonRemove.features.length;
	//console.log(NewGeoJsonRemove);
	console.log("Numero de Features"+ lgGJson);
	var TotalCasos=0;

	if(lgGJson==0){
		global_valores=[1,2,3,4,5,6,7];	
	}else{
		var array=[];
		var parametros=getparametros();
		var escala=parametros.escala;
		console.log(escala);
		var num_registros_mostrar = [];
		if(escala == "g_visitas_municipio"){
				num_registros_mostrar = [1,2,3,4,5,112,113,114,115,116];
		}else{	
				num_registros_mostrar = [1,2,3,4,12,13,14,15];
		}
		var arr_ruptura = [6];
		$( "#ListadoOrden" ).empty();
		$.each(NewGeoJsonRemove.features.reverse(), function (index, value) {
			array.push(value.properties[glo.varMapeo]);
			TotalCasos=TotalCasos+value.properties[glo.varMapeo];
			
			if(jQuery.inArray( (index+1), arr_ruptura ) > -1){
				$( "#ListadoOrden" ).append('<hr>...<hr>');
			}	
			//si esta en el numero de registros a mostrar lo adiciona al mapa
			if((index+1)<=5 || (index+1)> (lgGJson-5)){
				$( "#ListadoOrden" ).append('<span id="orden1" class="nom_mpio">'+(index+1)+'. '+value.properties['nombre']+ ' ('+value.properties[glo.varMapeo]+')</span><br>');	
			}
			//console.log("Indice recorrido: " + index);	//<span id="orden1"></span>1. Girardot (321)</h5>		

	    });
	    array=array.unique();
	    var breaks; 
		if(array.length>5){
			breaks = turf.jenks(NewGeoJsonRemove,glo.varMapeo, 6);
		}else{
			breaks = turf.jenks(NewGeoJsonRemove,glo.varMapeo, array.length);
		}
		breaks=breaks.unique();
		breaks.unshift(0);
		breaks[1]=1;
		
	  	global_valores=breaks;
	  	
	}
	AutoDisplayLeyend(global_valores);
	waitingDialog.hide();

	//$("#TextCuentaCasos").empty().append(numeral(TotalCasos).format('0,0'));
	$( "#TextCuentaEventos" ).html('Total '+ glo.tit_tooltip+' '+numeral(TotalCasos).format('0,0'));
	//<span id="TextCuentaCasos">0</span> INCENDIOS 
};
var loadFeatures = function(response) {
	  
	  RecorrerGeoJson(response);
	  var format = new ol.format.GeoJSON();
	  var features = format.readFeatures(response);
	  $( "#layers option:selected" ).each(function() {
	   	  var str = $( this ).text();
	      if(str=="Provincia"){
			lvGob_Mun.setVisible(false);
			lvGob_Prov.setVisible(true);
			removerfeatures(vsGob_Prov);			
		  	vsGob_Prov.addFeatures(features);
	      }else if(str=="Municipio"){
			lvGob_Mun.setVisible(true);
			lvGob_Prov.setVisible(false);
			removerfeatures(vsGob_Mun);
		  	vsGob_Mun.addFeatures(features);
		  }
	  });
}; 
var refreshfeatures=function(cobertura){
	
    var parametros=getparametros();
	var params="&viewparams=fechaini:"+parametros.fechaini+";fechafin:"+parametros.fechafin+
  ";depen_id:"+parametros.depen_id+";depen_nom:"+parametros.depen_nom;
  var paramsCundi="fechaini="+parametros.fechaini+"&fechafin="+parametros.fechafin
  +"&depen_nom="+parametros.depen_id+"&depen_id="+parametros.depen_nom;

  peticionjsonpCundi(paramsCundi);
	if(cobertura!=""){
		peticionjsonp(glo.esquema,cobertura,'callback:loadFeatures',params);	
	}else{
		peticionjsonp(glo.esquema,parametros.escala,'callback:loadFeatures',params);
	}
	
};

var getFuente=function(resolution){
	console.log(resolution);
	 if(resolution <= 160) {
		fuente = '14px Calibri,sans-serif';
	}else if(resolution > 160 && resolution <= 300){
		fuente = '11px Calibri,sans-serif';
	}else if(resolution > 300 && resolution <= 320){
		fuente = '9px Calibri,sans-serif';
	}else {
		fuente = '0px Calibri,sans-serif';
	}
	return fuente;

};

/***************************************************
 * * Limites wms desde glo.geoserver 
 ***************************************************/
//LIMITE PROVINCIA WMS+
var limiteDPTO=new ol.layer.Tile({
        source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
          url: glo.geoserver+'/gwc/service/wms',
          params: {'LAYERS': 'administrativa:g_colombia_dpto', 'TILED': true,'STYLES':'g_colombia_dpto_border','SRS':'EPSG%3A900913'},
          serverType: 'geoserver'
        }))
      });

//LIMITE PROVINCIA WMS
var LayerProvLinea =  new ol.layer.Tile({
        source: new ol.source.TileWMS( /** @type {olx.source.TileWMSOptions} */ ({
          url: glo.geoserver+'/wms',
          params: {'LAYERS': 'administrativa:g_provincia_simp', 'TILED': true, 'STYLES':'Sym_Provincia_96a4ca5d','SRS':'EPSG%3A900913'},
          serverType: 'geoserver'
        }))
        ,minResolution: 100
    	,maxResolution: 999
      });
LayerProvLinea.setVisible(true);
//LIMITE MUNICIPIO WMS
var LayerMuniLinea =  new ol.layer.Tile({
        source: new ol.source.TileWMS( /** @type {olx.source.TileWMSOptions} */ ({
          url: glo.geoserver+'/wms',
          params: {'LAYERS': 'administrativa:g_municipio_simp', 'TILED': true, 'STYLES':'Sym_Municipio_limite','SRS':'EPSG%3A900913'},
          serverType: 'geoserver'
        }))
        ,minResolution: 0
    	,maxResolution: 99
      });
LayerMuniLinea.setVisible(true);

/***************************************************************************************************
 *--------------------------------------------PROVINCIA--------------------------------------------
 ***************************************************************************************************/
var vsGob_Prov = new ol.source.Vector({
   loader: function(extent, resolution, projection) {
   	 refreshfeatures("g_visitas_provincia");
    },
   strategy: function() {
	return [ [-8772091.3, 261157.7, -7723375.2, 799885.8]];
   }
});


var lvGob_Prov = new ol.layer.Vector({
  source: vsGob_Prov,
  style: function(feature, resolution) {
	var texto = feature.get(nom_mostrar).trunc(12);
	var fuente = getFuente(resolution);
	var styleC = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: getColor(parseFloat(feature.get(glo.varMapeo)))
        }),
        stroke: new ol.style.Stroke({
          color: '#727220',
          width: 1
        }),
        text: new ol.style.Text({
          font: fuente,
          text: texto,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2.5
          })
        })
    })];
    return styleC;
 }
});
lvGob_Prov.setVisible(false);

/***************************************************************************************************
 *--------------------------------------------MUNICIPIO--------------------------------------------
 ***************************************************************************************************/

var vsGob_Mun = new ol.source.Vector({
   loader: function(extent, resolution, projection) {
   	 refreshfeatures("g_visitas_municipio");
    },
   strategy: function() {
	return [ [-8772091.3, 261157.7, -7723375.2, 799885.8]];
   }
});


var lvGob_Mun = new ol.layer.Vector({
  source: vsGob_Mun,
  style: function(feature, resolution) {
	var texto = feature.get(nom_mostrar).trunc(12);
	var fuente = getFuente(resolution);
	//console.log(feature);
	var styleC = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: getColor(parseFloat(feature.get(glo.varMapeo)))
        }),
        stroke: new ol.style.Stroke({
          color: '#727220',
          width: 1
        }),
        text: new ol.style.Text({
          font: fuente,
          text: texto,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2.5
          })
        })
    })];
    return styleC;
 }
});
lvGob_Mun.setVisible(true);
/***************************************************************************************************
 *--------------------------------------------VEREDA--------------------------------------------
 ***************************************************************************************************/
/*
var vsGob_Ver = new ol.source.Vector({
   loader: function(extent, resolution, projection) {
   	 refreshfeatures("g_incendios_vereda");
   },
   strategy: function() {
	return [ [-8772091.3, 261157.7, -7723375.2, 799885.8]];
   }
});


var lvGob_Ver = new ol.layer.Vector({
  source: vsGob_Ver,
  style: function(feature, resolution) {
  	
	var texto = feature.get(nom_mostrar).trunc(12);
	var fuente = getFuente(resolution);
	var styleC = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: getColor(parseFloat(feature.get(glo.varMapeo)))
        }),
        stroke: new ol.style.Stroke({
          color: '#727220',
          width: 0.3
        }),
        text: new ol.style.Text({
         /* font: fuente,
          text: texto,*/
          /*fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2.5
          })
        })
    })];
    return styleC;
 }
});
lvGob_Ver.setVisible(false); */

/***************************************************************************************************
 *--------------------------------------------CAPA BASE--------------------------------------------
 ***************************************************************************************************/

var openSeaMapLayer =    new ol.layer.Tile({
      source: new ol.source.OSM({
        attributions: [
          new ol.Attribution({
            html: 'Tiles &copy; <a href="http://www.opencyclemap.org/">' +
                'OpenCycleMap</a>'
          }),
          ol.source.OSM.ATTRIBUTION
        ],
        url: 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
 })
  });
