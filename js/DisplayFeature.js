var informacion=$('#info2');

informacion.tooltip({
		animation:false,trigger:'manual',html:true
});

var remove_features_over=function(feature){
	if (feature !== highlight2) {
	    if (highlight2) {
	      featureOverlay.getSource().clear();
	    }
	    if (feature) {
	      featureOverlay.getSource().addFeature(feature);
	    }
	    highlight2 = feature;
	  }
    
};
var displayFeatureValue=function(pixel)
	{
	informacion.css(
		{
		left:pixel[0]+'px',top:(pixel[1]+30)+'px'
	}
	);
	var feature=map.forEachFeatureAtPixel(pixel,function(feature,layer)
		{
		if(LayerProvLinea!=layer)
			{
			return feature
		}
	}
	);
	var layer=map.forEachFeatureAtPixel(pixel,function(feature,layer)
		{
		return layer
	}
	);
	if(feature)
		{
		if(layer==lvGob_Mun||layer==lvGob_Prov){
			//console.log(feature.get('nombre'));
			var nombre=feature.get('nombre');
			if(feature.get('nombre_mun')!==undefined){
				nombre=feature.get('nombre')+'<br>'+feature.get('nombre_mun');	
			}
			var field_show=nombre+'<br><b>'+
			glo.tit_tooltip+' '+feature.get(glo.varMapeo)+'</b>';
			

			if(numeral(feature.get('area_total'))!=0){
				field_show=field_show+'<br> <small>Area Total</small>: '+numeral(feature.get('area_total')).format('0,0')+' ha2';
			}
			informacion.attr('data-original-title',field_show);
		}
		informacion.tooltip('hide').tooltip('fixTitle').tooltip('show');
		remove_features_over(feature);
	}
	else
		{
	    featureOverlay.getSource().clear();
	    highlight2 = '';
		informacion.tooltip('hide');
	}
	if(pixel[0]!==undefined&&pixel[0]!=lastPixel[0])
		{
		lastPixel=pixel
	}
};

var displayFeatureInfo=function(pixel)
	{
	var chart=document.getElementById('chartContainer');
	var feature=map.forEachFeatureAtPixel(pixel,function(feature,layer)
		{
		if(LayerProvLinea!=layer)
			{
			return feature
		}
	}
	);
	validaSel=1;
	if(feature)
		{
		//NO MOSTRAR PIO
		chart.style.display='none';
/*		chart.style.display='block';
		PieChart(feature);
		var ident=$('#layers').val();
		if(ident!="Vereda")$("#btn_filtrar").show();
		$("#div_filtro").show();
		$("#filtro").show();
		$("#filtro").html(feature.get(nom_mostrar));*/
	}
	else
		{
		chart.style.display='none';
		
	    featureOverlay1.getSource().clear();
	    
	}
	if (feature !== highlight) {
	    if (highlight) {
	      featureOverlay1.getSource().clear();
	    }
	    if (feature) {
	      featureOverlay1.getSource().addFeature(feature);
	    }
	    highlight = feature;
	  }
	if(pixel[0]!==undefined)
		{
		lastPixel=pixel
	}
};

$(map.getViewport()).on('mousemove',function(evt){
	var pixel=map.getEventPixel(evt.originalEvent);
	displayFeatureValue(pixel)
});
map.on('singleclick',function(evt){
	var coordinate=evt.coordinate;
	overlay.setPosition(coordinate);
	displayFeatureInfo(evt.pixel)
});
