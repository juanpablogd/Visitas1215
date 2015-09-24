$(document).ready(function() {
  
	//TITULO DE MAPA
	$("#title").text(glo.titulo_map);
	//TITULO DE MAPA EN LA VENTANA
	$("#titulo_mapa").text(glo.titulo_map);
	
	if(window.location.href.search("this_map")>1){
		$("#Comparativos").hide();	
	}
	
	$("#Comparativos").click(function() {
		window.open('http://saga.cundinamarca.gov.co/apps/comparativeSalud/','_blank');
	});
  	
  	$("#InpClave").autocomplete({
	    source: function (request, response) {
	    	$.ajax({
          		  url: "./services/GetDiagnosticos.php",
          		  data:{
          		  	clave:request.term.toUpperCase()
          		  },
		          dataType: "jsonp",
		          jsonpCallback:'getDiagnostico',
		          success: function(data) {
		          	console.log("data");
		          	console.log(data);
		          	if(data){
		          		response($.map(data, function (el) {
		                return {
		                    label: el.f2,
		                    value: el.f2,
		                    codigo:el.f1,
		                    nombre:el.f2		                };
		            	}));
		          	}
		          }
	        });
	    },
	    minLength: 3,
	    select: function (event, ui) {
	    	$("#CodDiagnostico").empty().append(ui.item.codigo);
	        seleccion_diagnostico=ui.item.nombre;
	    },
	    open: function () {
	        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
	        $(this).addClass("list-group");
	    },
	    close: function () {
	        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
	    }
	}).autocomplete("instance")._renderItem = function (ul, item) {
	    ul.addClass("list-group");
	    ul.addClass("Ancho");
	    
	    return $( '<li class="list-group-item" style="max-width:200px;">' )
	        .append('<h6>' + item.label + '</h6>' +
	                '</li>').appendTo(ul);     
	};
	
	function filtrar(){
		refreshfeatures();
	}
	$("#MostrarBusquedas").hide(100);
  	$("#OcultarBusqueda").click(function(){
		$("#panelBusquedas").hide( 300, function() {
				$("#MostrarBusquedas").show(300);
		});
	});
	
	$('#PanelMostrarOcultar').on('click', function(e) {
/*	    e.preventDefault();
	    var $this = $(this);
	    var $collapse = $this.closest('.collapse-group').find('.collapse');
	    $collapse.collapse('toggle');*/
	   //
	   console.log($("#PanelSecretarias").is(":visible"));
	   
	   if ($("#PanelSecretarias").is(":visible") == true) {
	   		$("#BtnMostrarBusquedas").html('<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span> Mostrar Sec.');
	   }
       else { 
			$("#BtnMostrarBusquedas").html('<span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span> Ocultar Sec.');
       }
       $("#PanelSecretarias").collapse('toggle');
	});
	//inicializa el control mostrandolo
	$("#PanelSecretarias").collapse('toggle');
	
	$("#MostrarBusquedas").click(function(){
		$("#panelBusquedas").show( 300, function() {
				$("#MostrarBusquedas").hide(300);
		});
	});
	
	//cargar dependencias con su respectivo CODIGO
	
	$.getJSON( "./servicios/GetDependencias.php", function( options ) {
	 		options.push({"value":"000","label":"TODAS"});
			options=options.reverse();
			//console.log(options);
			$('#msSubGrupo2').multiselect('dataprovider', options); 
			$("#msSubGrupo").multiselect('enable');
		});
		
	$.getJSON( "./servicios/GetDependencias.php", function( data ) {
	  $("#Dependencias").empty().append('<option value="0" selected>TODOS</option>');
	  $.each( data, function( key, val ) {
	  	$("#Dependencias").append("<option value='" + val.id + "'>" + val.dependencia + "</option>");
	    //console.log( "<option value='" + val.id + "' selected>" + val.dependencia + "</option>" );
	  });
	  
	});
    
});

function getMultiSelect(id){
	var brands = $('#'+id+' option:selected');
    var selection = [];
    $(brands).each(function(index, brand){
    	selection.push((brand.value));
        selection.push((brand.label));
    });
    return selection;
}

function getparametros(){
	var escala="";
	var depen_nom="1";
	var depen_id="1";
	
	$( "#layers option:selected" ).each(function() {
   	  var str = $( this ).text();
/*      if(str=="Vereda"){
		escala='g_incendios_vereda';
		
      }else		*/ 
      if(str=="Provincia"){
		escala=	'g_visitas_provincia';
		
      }else if(str=="Municipio"){
		escala='g_visitas_municipio';
			
      }
      $("#TextEscalaMun").empty().append(str);
    });
    
  	$( "#Dependencias option:selected" ).each(function() {
   	  var str = $( this ).text();
   	  //console.log("Dependencia: " + str + " - Valor: "+$( this ).val() );
      if(str!="TODOS"){
			depen_nom="id_dependencia";
			depen_id=$( this ).val();
      }

      $("#TextEscalaMun").empty().append(str);
    });
  
    var fechaini=$('#datetimepicker_ini').data("DateTimePicker").getDate().format('YYYY-MM-DD');
  	var fechafin=$('#datetimepicker_fin').data("DateTimePicker").getDate().format('YYYY-MM-DD');
  	$("#TextFechaini").empty().append(fechaini);
  	$("#TextFechafin").empty().append(fechafin);
  	var parametros = {
	    fechaini:fechaini,
	    fechafin:fechafin,
	    escala:escala,
	    depen_nom:depen_nom,
	    depen_id:depen_id	
	};
	$('#chartContainer').hide();
	return parametros; 
}

function filtrar(){
	refreshfeatures("");
}


